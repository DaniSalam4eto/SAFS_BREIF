// SID procedures keyed by departure ICAO. Ported from the ATC reference data.
import { getAirport } from './airports.js';
import { getWaypointCoord } from './waypoints.js';

export const SIDS = [
  { airport: 'KSSI', runway: '29', name: 'RATON3', waypoints: ['BEROK', 'MAREL', 'RATON'] },
  { airport: 'KSSI', runway: '11', name: 'ISLND1', waypoints: ['HIPIE', 'ISLND'] },
  { airport: 'KZAA', runway: '18', name: 'IGPOL7', waypoints: ['IGPOL', 'LENGU', 'HADLO'] },
  { airport: 'KZAA', runway: '36', name: 'ORESO2', waypoints: ['ORESO', 'EMRAG', 'CBILL'] },
  { airport: 'KLSX', runway: '12', name: 'OILLL1', waypoints: ['MNROE', 'OILLL'] },
  { airport: 'KLSX', runway: '30', name: 'VALEY1', waypoints: ['WADUP', 'OSHNN', 'DODGR', 'VALEY'] },
  { airport: 'KLSX', runway: '30', name: 'JJWAS1', waypoints: ['WADUP', 'OSHNN', 'JJAWS'] },
  { airport: 'KGJJ', runway: '26', name: 'CAIRN2R', waypoints: ['MURAN', 'DESTO', 'CAIRN'] },
  { airport: 'KGJJ', runway: '08', name: 'BEACH2F', waypoints: ['HADLO', 'BEACH'] },
  { airport: 'KGJJ', runway: '08', name: 'TASAR2F', waypoints: ['HADLO', 'STEYN'] },
  { airport: 'KEYW', runway: '09', name: 'BUFFT1', waypoints: ['WISUL', 'TASAR'] },
  { airport: 'KEYW', runway: '27', name: 'GRIDS4', waypoints: ['MOODI', 'MURAN'] },
  { airport: 'KMDW', runway: '22L', name: 'CICERO3', waypoints: ['BACEN', 'ISLND'] },
  { airport: 'KMDW', runway: '22R', name: 'CICERO4', waypoints: ['ACITO', 'COAST'] },
  { airport: 'KMDW', runway: '13L', name: 'MIDWY7', waypoints: ['GAGGA', 'WNNRS', 'BREEN'] },
  { airport: 'KMDW', runway: '31R', name: 'RAYNR7', waypoints: ['TCHDN', 'CBILL', 'SNEAK'] },
  { airport: 'KMDW', runway: '4L', name: 'PMPKN3', waypoints: ['BOCAH', 'IROCK', 'CBILL', 'SNEAK'] },
  { airport: 'KMDW', runway: '4R', name: 'BAGEL5', waypoints: ['AWSUM', 'IROCK', 'CBILL', 'SNEAK'] },
  { airport: 'KICJ', runway: '02', name: 'PAL5S', waypoints: ['ROSAS', 'KOLOR', 'AVATR'] },
  { airport: 'KICJ', runway: '07', name: 'TRP6W', waypoints: ['BADUK', 'SHELL'] },
  { airport: 'KICJ', runway: '20', name: 'KAPIL6A', waypoints: ['GIANO', 'KAPIL', 'DANDE'] },
  { airport: 'KICJ', runway: '25', name: 'GIANO1G', waypoints: ['LURON', 'DANDE'] },
];

export function resolveCoord(name) {
  const wp = getWaypointCoord(name);
  if (wp) return wp;
  const ap = getAirport(name);
  if (ap?.x != null && ap?.y != null) return { x: ap.x, y: ap.y };
  return undefined;
}

export function getSidsFor(airport, runway) {
  return SIDS.filter((s) => s.airport === airport && (runway ? s.runway === runway : true));
}

export function pickBestSid(departure, runway, arrival) {
  const candidates = getSidsFor(departure, runway);
  if (candidates.length === 0) return undefined;
  if (candidates.length === 1) return candidates[0];
  const arr = getAirport(arrival);
  if (!arr || arr.x == null) return candidates[0];
  let best, bestDist = Infinity;
  for (const sid of candidates) {
    const last = sid.waypoints[sid.waypoints.length - 1];
    const c = resolveCoord(last);
    if (!c) continue;
    const d = Math.hypot(c.x - arr.x, c.y - arr.y);
    if (d < bestDist) { bestDist = d; best = sid; }
  }
  return best ?? candidates[0];
}
