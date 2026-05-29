// STAR (Standard Terminal Arrival) procedures keyed by arrival ICAO.
// Waypoints are ordered entry-first → closest-to-airport last, so the last
// waypoint feeds the final approach. Runways match each airport's naming.
import { getAirport } from './airports.js';
import { resolveCoord } from './sids.js';

export const STARS = [
  { airport: 'KSSI', runway: '29', name: 'TOSCO8', waypoints: ['ISLND', 'HIPIE'] },
  { airport: 'KZAA', runway: '18', name: 'EMRAG1', waypoints: ['KPIA', 'EMRAG', 'ORESO'] },
  { airport: 'KZAA', runway: '36', name: 'LENGU3', waypoints: ['HADLO', 'LENGU', 'IGPOL'] },
  { airport: 'KLSX', runway: '12', name: 'OSHNN1', waypoints: ['OSHNN', 'WADUP'] },
  { airport: 'KLSX', runway: '30', name: 'WINDD1', waypoints: ['WINDD', 'AVATR', 'SHELL', 'PORTT', 'MNROE'] },
  { airport: 'KLSX', runway: '30', name: 'STDUM1', waypoints: ['STDUM', 'RUSTY', 'PORTT', 'MNROE'] },
  { airport: 'KGJJ', runway: '08', name: 'BOSET2', waypoints: ['BOSET', 'DESTO', 'MURAN'] },
  { airport: 'KGJJ', runway: '26', name: 'TASAR1', waypoints: ['SURFF', 'STEYN', 'HADLO'] },
  { airport: 'KEYW', runway: '09', name: 'FNTSY1', waypoints: ['MURAN', 'MOODI'] },
  { airport: 'KEYW', runway: '27', name: 'KRAKN1', waypoints: ['TASAR', 'WISUL'] },
  { airport: 'KMDW', runway: '4L', name: 'FISSK6', waypoints: ['HIPIE', 'COAST', 'ACITO'] },
  { airport: 'KMDW', runway: '4R', name: 'FISSK5', waypoints: ['QWRTZ', 'ISLND', 'BACEN'] },
  { airport: 'KMDW', runway: '13L', name: 'PANGG5', waypoints: ['CBILL', 'TCHDN'] },
  { airport: 'KMDW', runway: '22L', name: 'MEGGZ7', waypoints: ['CBILL', 'IROCK', 'AWSUM'] },
  { airport: 'KMDW', runway: '22R', name: 'STASH2', waypoints: ['CBILL', 'IROCK', 'BOCAH'] },
  { airport: 'KMDW', runway: '31R', name: 'ENDEE6', waypoints: ['WINDD', 'BREEN', 'WNNRS', 'GAGGA'] },
  { airport: 'KICJ', runway: '02', name: 'GIANO7A', waypoints: ['KAPIL', 'GIANO'] },
  { airport: 'KICJ', runway: '07', name: 'LURON6R', waypoints: ['FERRO', 'LURON'] },
  { airport: 'KICJ', runway: '20', name: 'ROSAS9B', waypoints: ['AVATR', 'KOLOR', 'ROSAS'] },
  { airport: 'KICJ', runway: '25', name: 'LAVRU2C', waypoints: ['SHELL', 'BADUK', 'LAVRU'] },
  { airport: 'KPFC', runway: '06L', name: 'GLORY1', waypoints: ['GLORY', 'BABEL', 'LUIGE'] },
  { airport: 'KPFC', runway: '06R', name: 'AKASI1', waypoints: ['AKASI', 'ZELDA', 'ATACK'] },
  { airport: 'KPFC', runway: '24L', name: 'ICEMN6', waypoints: ['ICEMN', 'DANDE', 'JOLLY'] },
  { airport: 'KPFC', runway: '24R', name: 'ROSAS1', waypoints: ['ROSAS', 'LURON', 'MAYAH'] },
  { airport: 'KRDI', runway: '18', name: 'RNDAL2', waypoints: ['RNDAL', 'ISLND', 'BREEN'] },
  { airport: 'KRDI', runway: '18', name: 'MSTRY2', waypoints: ['MSTRY', 'BACEN', 'DOCEB'] },
  { airport: 'KRDI', runway: '36', name: 'ICEMN1', waypoints: ['ICEMN', 'SHELL', 'HOMEY'] },
  { airport: 'KRDI', runway: '36', name: 'ROSAS2', waypoints: ['ROSAS', 'KOLOR', 'HOMEY'] },
  { airport: 'KPIA', runway: '09', name: 'FORTT1', waypoints: ['FORTT', 'FLWRZ'] },
  { airport: 'KPIA', runway: '27', name: 'ACITO1', waypoints: ['ACITO', 'MONKY'] },
];

export function getStarsFor(airport, runway) {
  return STARS.filter((s) => s.airport === airport && (runway ? s.runway === runway : true));
}

// Pick the STAR whose entry fix best continues from where the flight is coming
// from. Prefer STARs matching the arrival runway; fall back to any STAR for the
// airport if the chosen runway has none.
export function pickBestStar(arrival, runway, fromCoord) {
  let candidates = getStarsFor(arrival, runway);
  if (candidates.length === 0) candidates = getStarsFor(arrival);
  if (candidates.length === 0) return undefined;
  if (candidates.length === 1) return candidates[0];
  if (!fromCoord) return candidates[0];
  let best, bestDist = Infinity;
  for (const star of candidates) {
    const entry = resolveCoord(star.waypoints[0]);
    if (!entry) continue;
    const d = Math.hypot(entry.x - fromCoord.x, entry.y - fromCoord.y);
    if (d < bestDist) { bestDist = d; best = star; }
  }
  return best ?? candidates[0];
}
