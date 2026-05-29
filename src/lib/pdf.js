// SimBrief-style OFP PDF generator using jsPDF.
// GTA-scale: time displayed in MM:SS, distances in nm + km.
import { jsPDF } from 'jspdf';
import { fmtKg, formatMmSs } from './flightGen.js';

// Cache the brand logo as a data URL so jsPDF can embed it without a network
// round-trip on every export.
let _logoDataUrl;
async function getLogoDataUrl() {
  if (_logoDataUrl !== undefined) return _logoDataUrl;
  try {
    const res = await fetch('/safs_breif.png');
    const blob = await res.blob();
    _logoDataUrl = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  } catch {
    _logoDataUrl = null;
  }
  return _logoDataUrl;
}

export async function downloadFlightPdf(flight) {
  if (!flight) return;
  const logo = await getLogoDataUrl();
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const margin = 32;
  const innerW = W - 2 * margin;
  let y = margin + 4;
  const lineH = 11;

  doc.setFont('courier', 'normal');
  doc.setFontSize(9);

  // ---------- HEADER BAR ----------
  function headerBar(pageNum, pageTotal) {
    doc.setFillColor(26, 29, 36);
    doc.rect(margin - 4, y - 12, innerW + 8, 22, 'F');
    if (logo) {
      try { doc.addImage(logo, 'PNG', margin - 1, y - 11, 20, 20); } catch { /* ignore */ }
    }
    const titleX = logo ? margin + 22 : margin;
    doc.setTextColor(255, 255, 255);
    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    text(doc, `SAFS BRIEF  ${flight.callsign}`, titleX, y);
    text(doc, `${flight.dep} - ${flight.arr}`, margin + innerW * 0.45, y);
    text(doc, `Page ${pageNum} of ${pageTotal}`, margin + innerW - 70, y);
    y += 18;
    doc.setTextColor(0, 0, 0);
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
  }

  headerBar(1, 2);

  // ---------- OFP HEADING ----------
  y = divider(doc, y, W, margin);
  text(doc, `[ OFP ]`, margin, y); y += lineH;
  y = divider(doc, y, W, margin);
  y += 2;

  const dateShort = new Date(flight.createdAt).toUTCString().slice(5, 16).toUpperCase().replace(/ /g, '');
  const release = '1';
  const acft = flight.aircraft.icao;
  const cs = flight.callsign;
  const pilot = (flight.pilotName || 'PILOT').toUpperCase();
  const airline = (flight.airlineCode || 'SAFS').toUpperCase();
  const fn = flight.flightNumber || cs;
  const eteSec = flight.summary.totalTimeSec;
  const eteStr = formatMmSs(eteSec).replace(':', '');  // e.g. "0420" for 04:20

  // Two-column data block  left = labels/values, right = stats
  const colR = margin + innerW * 0.55;

  // Row 1
  text(doc, `${padR(cs, 10)} ${padR(dateShort, 10)} ${flight.dep}-${flight.arr}    ${padR(acft, 6)} RELEASE ${release}    ${dateShort}`, margin, y); y += lineH;
  text(doc, `OFP 1`, margin, y);
  text(doc, `WX PROG ${rand4()} ${rand4()}   OBS ${rand4()} ${rand4()}`, colR, y); y += lineH * 1.5;

  // Row 2
  text(doc, `ATC C/S    ${padR(cs, 12)}    ${flight.dep}/${flight.depRwy || flight.summary.sid?.runway || '--'}     ${flight.arr}/${flight.arrRwy || flight.summary.star?.runway || '--'}`, margin, y);
  text(doc, `CRZ SYS         CI 30`, colR, y); y += lineH;
  text(doc, `${dateShort}   ${padR(airline, 5)} ${padR(fn, 5)}`, margin, y);
  text(doc, `GND DIST    ${zeroPad(flight.summary.totalNm, 4)}`, colR, y); y += lineH;
  text(doc, `${padR(flight.aircraft.manufacturer.toUpperCase().slice(0, 10), 10)} ${padR(acft, 5)}`, margin, y);
  text(doc, `AIR DIST    ${zeroPad(flight.summary.totalNm, 4)}`, colR, y); y += lineH;
  text(doc, `CTOT:....`, margin, y);
  text(doc, `G/C DIST    ${zeroPad(flight.summary.totalNm, 4)}`, colR, y); y += lineH * 1.5;

  // Row 3  max / estimated weights + wind
  text(doc, `MAXIMUM     TOW ${zeroPad(flight.aircraft.mtow, 6)}  LAW ${zeroPad(Math.round(flight.aircraft.mtow * 0.85), 6)}  ZFW ${zeroPad(Math.round(flight.aircraft.mtow * 0.78), 6)}`, margin, y);
  text(doc, `AVG WIND    ${zeroPad(rand(0, 359), 3)}/${zeroPad(rand(0, 25), 2)}`, colR, y); y += lineH;
  text(doc, `ESTIMATED   TOW ${zeroPad(flight.summary.weights.tow, 6)}  LAW ${zeroPad(flight.summary.weights.lw, 6)}  ZFW ${zeroPad(flight.summary.weights.zfw, 6)}`, margin, y);
  text(doc, `AVG W/C     P006`, colR, y); y += lineH;
  text(doc, `AVG ISA     P006`, colR, y); y += lineH;
  text(doc, `AVG FF      ${zeroPad(flight.aircraft.fuelBurn, 4)} KG/HR`, colR, y); y += lineH;
  text(doc, `FUEL BIAS   M03.0`, colR, y); y += lineH;
  text(doc, `TKOF ALTN   .......`, colR, y); y += lineH * 1.5;

  // Alternate + steps
  text(doc, `ALTN ${flight.alternate || '----'}`, margin, y); y += lineH;
  text(doc, `FL STEPS  ${flight.dep}/${zeroPad(flight.summary.cruiseFl, 3)}0 / RETRA/${zeroPad(flight.summary.cruiseFl, 3)}0`, margin, y); y += lineH;
  text(doc, `DISP RMKS  NIL`, margin, y); y += lineH * 1.5;

  // ---------- PLANNED FUEL ----------
  y = divider(doc, y, W, margin);
  doc.setFont('courier', 'bold');
  text(doc, `          PLANNED FUEL`, margin, y); y += lineH;
  doc.setFont('courier', 'normal');
  y = divider(doc, y, W, margin);
  text(doc, `FUEL              ARPT     FUEL    TIME`, margin, y); y += lineH;
  y = divider(doc, y, W, margin);

  const tripTime = eteStr;
  const contTime = '0001';
  const altnTime = '0040';
  const finresTime = '0030';
  const taxiFuel = 230;
  const minTOF = flight.summary.fuel.trip + flight.summary.fuel.contingency + flight.summary.fuel.alternate + flight.summary.fuel.reserve;

  text(doc, `TRIP              ${padR(flight.arr.slice(-3), 4)}     ${zeroPad(flight.summary.fuel.trip, 4)}    ${tripTime}`, margin, y); y += lineH;
  text(doc, `CONT 15 MIN                ${zeroPad(flight.summary.fuel.contingency, 4)}    ${contTime}`, margin, y); y += lineH;
  text(doc, `ALTN              ${padR((flight.alternate || '---').slice(-3), 4)}     ${zeroPad(flight.summary.fuel.alternate, 4)}    ${altnTime}`, margin, y); y += lineH;
  text(doc, `FINRES                     ${zeroPad(flight.summary.fuel.reserve, 4)}    ${finresTime}`, margin, y); y += lineH;
  y = divider(doc, y, W, margin);
  text(doc, `MINIMUM T/OFF FUEL         ${zeroPad(minTOF, 4)}    ${tripTime}`, margin, y); y += lineH;
  y = divider(doc, y, W, margin);
  text(doc, `EXTRA                         0    0000`, margin, y); y += lineH;
  y = divider(doc, y, W, margin);
  text(doc, `T/OFF FUEL                 ${zeroPad(minTOF, 4)}    ${tripTime}`, margin, y); y += lineH;
  text(doc, `TAXI              ${padR(flight.dep.slice(-3), 4)}     ${zeroPad(taxiFuel, 4)}    0020`, margin, y); y += lineH;
  y = divider(doc, y, W, margin);
  text(doc, `BLOCK FUEL        ${padR(flight.dep.slice(-3), 4)}     ${zeroPad(flight.summary.fuel.block, 4)}`, margin, y); y += lineH;
  text(doc, `PIC EXTRA                  .....`, margin, y); y += lineH;
  text(doc, `TOTAL FUEL                 .....`, margin, y); y += lineH;
  text(doc, `REASON FOR PIC EXTRA ............`, margin, y); y += lineH;
  y = divider(doc, y, W, margin);

  // FMC info
  doc.setFont('courier', 'bold');
  text(doc, `FMC INFO:`, margin, y); y += lineH;
  doc.setFont('courier', 'normal');
  text(doc, `FINRES+ALTN          ${zeroPad(flight.summary.fuel.reserve + flight.summary.fuel.alternate, 4)}`, margin, y); y += lineH;
  text(doc, `TRIP+TAXI            ${zeroPad(flight.summary.fuel.trip + taxiFuel, 4)}`, margin, y); y += lineH * 1.5;

  text(doc, `NO TANKERING RECOMMENDED (P)`, margin, y); y += lineH;
  y = divider(doc, y, W, margin);

  // Self-briefing
  const briefing = [
    'I HEREWITH CONFIRM THAT I HAVE PERFORMED A THOROUGH SELF BRIEFING',
    'ABOUT THE DESTINATION AND ALTERNATE AIRPORTS OF THIS FLIGHT',
    'INCLUDING THE APPLICABLE INSTRUMENT APPROACH PROCEDURES, AIRPORT',
    'FACILITIES, NOTAMS AND ALL OTHER RELEVANT PARTICULAR INFORMATION.',
  ];
  briefing.forEach((b) => { text(doc, b, margin, y); y += lineH; });
  y += 8;
  text(doc, `DISPATCHER: SAFS BRIEF AUTO`, margin, y);
  text(doc, `PIC NAME: ${pilot}`, colR, y); y += lineH * 1.5;
  text(doc, `TEL: +1 555 SAFS`, margin, y);
  text(doc, `PIC SIGNATURE: ................`, colR, y); y += lineH;

  // ---------- PAGE 2 ----------
  doc.addPage();
  y = margin + 4;
  headerBar(2, 2);

  y = divider(doc, y, W, margin);
  doc.setFont('courier', 'bold');
  text(doc, `ROUTING`, margin, y); y += lineH;
  doc.setFont('courier', 'normal');
  y = divider(doc, y, W, margin);

  text(doc, `ROUTE ID: SAFS-${cs}`, margin, y); y += lineH * 1.5;
  for (const chunk of wrap(flight.summary.routeString, 78)) { text(doc, chunk, margin, y); y += lineH; }
  y += 10;

  if (flight.summary.altRouteString) {
    y = divider(doc, y, W, margin);
    doc.setFont('courier', 'bold');
    text(doc, `ALTERNATE ROUTE  (${flight.arr} - ${flight.alternate})`, margin, y); y += lineH;
    doc.setFont('courier', 'normal');
    y = divider(doc, y, W, margin);
    for (const chunk of wrap(flight.summary.altRouteString, 78)) { text(doc, chunk, margin, y); y += lineH; }
    y += 10;
  }

  // ----- Waypoint sequence -----
  y = divider(doc, y, W, margin);
  doc.setFont('courier', 'bold');
  text(doc, `WAYPOINT SEQUENCE`, margin, y); y += lineH;
  doc.setFont('courier', 'normal');
  y = divider(doc, y, W, margin);
  text(doc, `IDENT         TYPE      FL       ETA`, margin, y); y += lineH;
  y = divider(doc, y, W, margin);

  // Defensive computation: if totalTimeSec is missing (old persisted flight)
  // derive it from distance + TAS.
  const all = [flight.dep, ...(flight.summary.waypoints || []), flight.arr];
  const cruiseTas = flight.summary.cruiseTas || flight.aircraft?.cruiseTas || 450;
  const totalSec = Number.isFinite(flight.summary.totalTimeSec)
    ? flight.summary.totalTimeSec
    : Math.round((flight.summary.totalNm / cruiseTas) * 3600 + 30);
  const startMs = Number(new Date(flight.createdAt));
  const t0 = Number.isFinite(startMs) ? startMs : Date.now();
  // FL display: small numbers, no padding (FL24, FL32  not FL024 or FL240)
  const flStr = `FL${flight.summary.cruiseFl ?? 24}`;
  all.forEach((wp, idx) => {
    const t = t0 + (totalSec * (idx / Math.max(1, all.length - 1))) * 1000;
    const eta = new Date(t);
    const etaStr = Number.isFinite(eta.getTime())
      ? `${pad2(eta.getUTCHours())}:${pad2(eta.getUTCMinutes())}:${pad2(eta.getUTCSeconds())}`
      : '--:--:--';
    const type = idx === 0 ? 'DEP' : idx === all.length - 1 ? 'ARR' : 'WPT';
    const fl = (idx === 0 || idx === all.length - 1) ? '----' : flStr;
    text(doc, `${padR(wp, 12)}  ${padR(type, 6)}  ${padR(fl, 8)} ${etaStr}`, margin, y); y += lineH;
  });
  y += 8;

  // ----- Weights / load -----
  y = divider(doc, y, W, margin);
  doc.setFont('courier', 'bold');
  text(doc, `WEIGHTS / LOAD`, margin, y); y += lineH;
  doc.setFont('courier', 'normal');
  y = divider(doc, y, W, margin);
  text(doc, `OEW                  ${padL(fmtKg(flight.summary.weights.oew), 12)}`, margin, y); y += lineH;
  text(doc, `PAX (${zeroPad(flight.summary.weights.paxCount, 3)})            ${padL(fmtKg(flight.summary.weights.paxWeight), 12)}`, margin, y); y += lineH;
  text(doc, `CARGO                ${padL(fmtKg(flight.summary.weights.cargo), 12)}`, margin, y); y += lineH;
  text(doc, `PAYLOAD              ${padL(fmtKg(flight.summary.weights.payload), 12)}`, margin, y); y += lineH;
  text(doc, `ZFW                  ${padL(fmtKg(flight.summary.weights.zfw), 12)}`, margin, y); y += lineH;
  text(doc, `BLOCK FUEL           ${padL(fmtKg(flight.summary.fuel.block), 12)}`, margin, y); y += lineH;
  text(doc, `TOW                  ${padL(fmtKg(flight.summary.weights.tow), 12)}   MAX ${padL(fmtKg(flight.aircraft.mtow), 12)}`, margin, y); y += lineH * 1.5;

  y = divider(doc, y, W, margin);
  text(doc, `BRIEF SIGNED OFF BY: ${pilot}`, margin, y); y += lineH;
  text(doc, `Not for real-world navigation. SAFS Brief - ${new Date().toUTCString().slice(5, 25)}`, margin, y); y += lineH;

  const filename = `${cs}_${flight.dep}-${flight.arr}_${dateShort}.pdf`;
  doc.save(filename);
}

function text(doc, s, x, y) { doc.text(String(s), x, y); }
function hr(doc, x1, y, x2) {
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.4);
  doc.line(x1, y, x2, y);
  doc.setDrawColor(0, 0, 0);
}
// Safe divider: draws the rule a few pt below the previous baseline and
// returns a y far enough below it to clear the cap of the next text row.
function divider(doc, y, W, margin) {
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.4);
  doc.line(margin, y + 2, W - margin, y + 2);
  doc.setDrawColor(0, 0, 0);
  return y + 12;
}
function padR(s, n) { s = String(s); return s.length >= n ? s : s + ' '.repeat(n - s.length); }
function padL(s, n) { s = String(s); return s.length >= n ? s : ' '.repeat(n - s.length) + s; }
function pad2(n) { return String(n).padStart(2, '0'); }
function zeroPad(n, w) { return String(n ?? 0).padStart(w, '0'); }
function rand(min, max) { return Math.floor(min + Math.random() * (max - min)); }
function rand4() { return zeroPad(rand(0, 9999), 4); }
function wrap(s, n) {
  const out = [];
  for (let i = 0; i < s.length; i += n) out.push(s.slice(i, i + n));
  return out;
}
