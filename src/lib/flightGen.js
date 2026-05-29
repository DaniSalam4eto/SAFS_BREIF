// Flight plan generation logic. Computes route distance from chart coords, then
// derives time, fuel, weights and a SimBrief-style route string.

import { getAirport } from '../data/airports.js';
import { getSidsFor, resolveCoord } from '../data/sids.js';
import { pickBestStar } from '../data/stars.js';
import { WAYPOINTS } from '../data/waypoints.js';

// SAFS chart is GTA-scale: the full chart spans only a few dozen nm so an
// average flight lasts well under 5 minutes. 40 px/nm gives ~50 nm chart-wide.
const PX_PER_NM = 40;

export function distanceNm(a, b) {
  if (!a || !b) return 0;
  return Math.hypot(a.x - b.x, a.y - b.y) / PX_PER_NM;
}

export function buildAutoRoute(depIcao, arrIcao, arrRwy) {
  const dep = getAirport(depIcao);
  const arr = getAirport(arrIcao);
  if (!dep || !arr) return { waypoints: [], sid: undefined, star: undefined, totalNm: 0 };

  const sids = getSidsFor(depIcao);
  let chosenSid;
  if (sids.length) {
    let best = Infinity;
    for (const s of sids) {
      const last = resolveCoord(s.waypoints[s.waypoints.length - 1]);
      if (!last) continue;
      const d = Math.hypot(last.x - arr.x, last.y - arr.y);
      if (d < best) { best = d; chosenSid = s; }
    }
  }

  const wps = [];
  if (chosenSid) wps.push(...chosenSid.waypoints);

  // STAR feeds the arrival: choose the one whose entry fix best continues from
  // where the SID (or departure) leaves us, then route bridge → STAR → airport.
  const startCoord = wps.length ? resolveCoord(wps[wps.length - 1]) : { x: dep.x, y: dep.y };
  const chosenStar = pickBestStar(arrIcao, arrRwy, startCoord);
  const starWps = chosenStar ? chosenStar.waypoints : [];
  const starEntry = starWps.length ? resolveCoord(starWps[0]) : undefined;

  const bridgeTarget = starEntry || { x: arr.x, y: arr.y };
  const bridge = bridgeWaypoints(startCoord, bridgeTarget, [...wps, ...starWps]);
  wps.push(...bridge, ...starWps);

  let totalNm = 0;
  let prev = { x: dep.x, y: dep.y };
  for (const w of wps) {
    const c = resolveCoord(w);
    if (!c) continue;
    totalNm += distanceNm(prev, c);
    prev = c;
  }
  totalNm += distanceNm(prev, { x: arr.x, y: arr.y });

  return { waypoints: wps, sid: chosenSid, star: chosenStar, totalNm: Math.round(totalNm) };
}

// Pick a sequence of real SAFS waypoints between `from` and `to`, projected on
// the direct line and ordered by progress (t ∈ 0..1). Used when there is no
// SID / STAR  gives an actual polyline rather than a straight shot.
function bridgeWaypoints(from, to, existing) {
  const used = new Set(existing.map((w) => w.toUpperCase()));
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return [];
  const ux = dx / len;
  const uy = dy / len;

  // Build a list of waypoints projected on the line.
  const corridor = Object.entries(WAYPOINTS)
    .filter(([name]) => !used.has(name))
    .map(([name, coord]) => {
      const vx = coord.x - from.x;
      const vy = coord.y - from.y;
      const along = vx * ux + vy * uy;             // distance along the line
      const t = along / len;                       // 0..1
      const projX = from.x + (to.x - from.x) * t;
      const projY = from.y + (to.y - from.y) * t;
      const perp = Math.hypot(coord.x - projX, coord.y - projY);
      return { name, coord, t, perp };
    })
    // Stay inside the corridor: within ~20% of route length perpendicular,
    // and somewhere between the endpoints (with a small gap so we don't sit
    // on top of dep/arr).
    .filter((c) => c.t > 0.07 && c.t < 0.93)
    .filter((c) => c.perp < Math.max(180, len * 0.22))
    .sort((a, b) => a.t - b.t);

  if (corridor.length === 0) return [];

  // Number of waypoints scales with distance: ~1 every 220 px on the chart,
  // clamped to 2..5.
  const maxPicks = Math.max(2, Math.min(5, Math.round(len / 220)));
  const minSpacing = 0.8 / (maxPicks + 1);

  const picks = [];
  for (const c of corridor) {
    if (picks.length === 0 || c.t - picks[picks.length - 1].t >= minSpacing) {
      picks.push(c);
      if (picks.length >= maxPicks) break;
    }
  }
  // If the corridor was sparse and we have fewer than 2 picks, fall back to
  // simply taking the best-scoring entries by detour cost so we still produce
  // an actual polyline rather than a straight line.
  if (picks.length < 2) {
    const fallback = corridor
      .slice()
      .sort((a, b) => a.perp - b.perp)
      .slice(0, 3)
      .sort((a, b) => a.t - b.t);
    return fallback.map((c) => c.name);
  }
  return picks.map((c) => c.name);
}

export function computeFlightSummary({ aircraft, depIcao, arrIcao, altIcao, paxCount, cargoKg, cruiseFl, depRwy, arrRwy }) {
  const dep = getAirport(depIcao);
  const arr = getAirport(arrIcao);
  const altn = getAirport(altIcao);
  if (!aircraft || !dep || !arr) return null;

  const { waypoints, sid, star, totalNm } = buildAutoRoute(depIcao, arrIcao, arrRwy);

  // Alternate route  divert from the arrival field to the alternate, routed
  // through the alternate's best STAR (bridge → STAR → field), same as the
  // main leg but starting from the destination.
  let altWaypoints = [];
  let altStar;
  if (altn?.x != null && altn?.y != null && altn.icao !== arr.icao) {
    const fromCoord = { x: arr.x, y: arr.y };
    altStar = pickBestStar(altn.icao, undefined, fromCoord);
    const altStarWps = altStar ? altStar.waypoints : [];
    const altStarEntry = altStarWps.length ? resolveCoord(altStarWps[0]) : undefined;
    const altBridge = bridgeWaypoints(fromCoord, altStarEntry || { x: altn.x, y: altn.y }, [...waypoints, ...altStarWps]);
    altWaypoints = [...altBridge, ...altStarWps];
  }
  const cruiseTas = safsCruiseTas(aircraft);
  // Use the *real* cruise TAS for the time math so flights still last seconds,
  // even though the displayed TAS is GTA-scaled (100–120 kt).
  const realTas = aircraft.cruiseTas || 450;
  const cruiseFlNum = cruiseFl || pickCruiseFl(aircraft, totalNm);
  const airTimeHr = totalNm / realTas;
  // GTA-scale flights: tiny climb/descent overhead (~30 sec).
  const totalTimeHr = airTimeHr + 0.0083;
  const totalTimeSec = Math.round(totalTimeHr * 3600);
  const airTimeSec = Math.round(airTimeHr * 3600);
  const fuelBurnPerHr = aircraft.fuelBurn || 2500;
  const tripFuel = Math.max(1, Math.round(fuelBurnPerHr * totalTimeHr));
  const reserveFuel = Math.round(fuelBurnPerHr * 0.08);   // ~5 min reserve at GTA scale
  const contingencyFuel = Math.max(1, Math.round(tripFuel * 0.05));
  const alternateFuel = Math.round(fuelBurnPerHr * 0.05); // ~3 min alternate
  const blockFuel = tripFuel + reserveFuel + contingencyFuel + alternateFuel;

  const paxWeight = Math.round((paxCount || 0) * 84);
  const payload = paxWeight + (cargoKg || 0);
  const zfw = aircraft.oew + payload;
  const tow = zfw + blockFuel;
  const lw = tow - tripFuel;

  const effDepRwy = depRwy || sid?.runway || dep.runways?.[0] || '';
  const effArrRwy = arrRwy || star?.runway || arr.runways?.[0] || '';
  const effAltRwy = altStar?.runway || altn?.runways?.[0] || '';
  // Alternate leg as a route string: divert from the destination, no SID,
  // through the alternate's STAR. Mirrors the main route's formatting.
  const altRouteString = (altn && altn.icao !== arr.icao)
    ? buildRouteString(arr, altn, null, altStar, altWaypoints, cruiseFlNum, aircraft, effArrRwy, effAltRwy)
    : '';
  return {
    waypoints,
    sid,
    star,
    altStar,
    routeString: buildRouteString(dep, arr, sid, star, waypoints, cruiseFlNum, aircraft, effDepRwy, effArrRwy),
    altRouteString,
    altWaypoints,
    totalNm,
    totalKm: Math.round(totalNm * 1.852),
    totalTimeSec,
    airTimeSec,
    airTimeHr,
    totalTimeHr,
    cruiseFl: cruiseFlNum,
    cruiseTas,
    fuel: { trip: tripFuel, reserve: reserveFuel, contingency: contingencyFuel, alternate: alternateFuel, block: blockFuel },
    weights: { oew: aircraft.oew, paxWeight, cargo: cargoKg || 0, payload, zfw, tow, lw, mtow: aircraft.mtow, paxCount: paxCount || 0 },
  };
}

// SAFS cruise altitude: always between 2400 ft (FL24) and 3600 ft (FL36).
function pickCruiseFl(aircraft, totalNm) {
  if (aircraft.category === 'ga' || aircraft.category === 'helicopter') return 24;
  if (aircraft.category === 'fighter') return 36;
  if (totalNm < 15) return 24;
  if (totalNm < 30) return 30;
  return 36;
}

// SAFS-scale TAS: clamp aircraft cruise TAS to 100–120 kt range. We map a real
// 100…1200 kt cruise into the 100…120 kt band so faster aircraft still rank
// higher within that small window.
export function safsCruiseTas(aircraft) {
  const raw = aircraft?.cruiseTas || 450;
  const mapped = 100 + (Math.min(1200, Math.max(0, raw)) / 1200) * 20;
  return Math.round(Math.max(100, Math.min(120, mapped)));
}

function buildRouteString(dep, arr, sid, star, waypoints, cruiseFl, aircraft, depRwyOverride, arrRwyOverride) {
  const flStr = `F${String(cruiseFl).padStart(3, '0')}`;
  const speed = `N${String(safsCruiseTas(aircraft)).padStart(4, '0')}`;
  const sidPart = sid ? sid.name : 'DCT';
  const middle = (waypoints || []).join(' ') || 'DCT';
  const starPart = star ? star.name : '';
  const depRwy = depRwyOverride || dep.runways?.[0] || '';
  const arrRwy = arrRwyOverride || arr.runways?.[0] || '';
  return `${dep.icao}/${depRwy} ${speed}${flStr} ${sidPart} ${middle} ${starPart} ${arr.icao}/${arrRwy}`.replace(/\s+/g, ' ').trim();
}

// Helper: turn a cruise FL into a feet string ("2400 ft").
export function formatAltitudeFt(cruiseFl) {
  if (cruiseFl == null) return '';
  return `${(cruiseFl * 100).toLocaleString('en-US')} ft`;
}

export function formatHhmm(hours) {
  const total = Math.max(0, Math.round(hours * 60));
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// GTA-scale time display: MM:SS for anything under an hour, HH:MM:SS otherwise.
export function formatMmSs(seconds) {
  const total = Math.max(0, Math.round(seconds || 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export function fmtKg(n) {
  if (n == null) return '';
  return n.toLocaleString('en-US') + ' kg';
}

export function fmtNm(n) {
  if (n == null) return '';
  return n.toLocaleString('en-US') + ' nm';
}

export function fmtKm(n) {
  if (n == null) return '';
  return n.toLocaleString('en-US') + ' km';
}

export function generateCallsign(airlineCode = 'LAB') {
  const num = Math.floor(100 + Math.random() * 900);
  return `${airlineCode}${num}`;
}

export function randomSquawk() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 8).toString()).join('');
}
