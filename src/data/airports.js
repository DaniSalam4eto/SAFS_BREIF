// SAFS / FiveM airports. Chart pixel coords are on the 2000x1719 SAFS_Navaids
// chart and used by the SID Generator to plot routes.

export const DEFAULT_AIRPORTS = [
  { icao: 'KLSX', name: 'Los Santos International Airport', city: 'Los Santos', x: 797, y: 843, elev: 31, runways: ['12', '30'] },
  { icao: 'KEYW', name: 'Key West International Airport', city: 'Key West', x: 449, y: 1159, elev: 4, runways: ['09', '27'] },
  { icao: 'KGJJ', name: 'Jersey International Airport', city: 'Jersey', x: 455, y: 671, elev: 18, runways: ['08', '26'] },
  { icao: 'KZAA', name: 'Auckland International Airport', city: 'Auckland', x: 529, y: 250, elev: 23, runways: ['18', '36'] },
  { icao: 'KZAN', name: 'Fort Zancudo', city: 'Zancudo', x: 740, y: 446, elev: 22, runways: ['03', '21'] },
  { icao: 'KSSI', name: 'Sandy Shores International Airport', city: 'Sandy Shores', x: 928, y: 372, elev: 1240, runways: ['11', '29'] },
  { icao: 'KSSR', name: 'Sandy Shores Regional Airport', city: 'Sandy Shores', x: 975, y: 435, elev: 1290, runways: ['12', '30'] },
  { icao: 'KMCD', name: 'Mount Chiliad Airfield', city: 'Chiliad', x: 953, y: 301, elev: 2230, runways: ['09', '27'] },
  { icao: 'KMCK', name: 'McKenzie Airfield', city: 'McKenzie', x: 1020, y: 325, elev: 1850, runways: ['18', '36'] },
  { icao: 'KPIA', name: 'Procopio International Airport', city: 'Procopio', x: 970, y: 116, elev: 12, runways: ['09', '27'] },
  { icao: 'KMDW', name: 'Midway International Airport', city: 'Midway', x: 1301, y: 225, elev: 620, runways: ['22L', '22R', '13L', '31R', '4L', '4R'] },
  { icao: 'KSZA', name: 'Lugano Regional Airport', city: 'Lugano', x: 1110, y: 537, elev: 920, runways: ['08', '26'] },
  { icao: 'KRDI', name: 'Red Dead International Airport', city: 'Red Dead', x: 1291, y: 610, elev: 6800, runways: ['18', '36'] },
  { icao: 'KBID', name: 'Block Island State Airport', city: 'Block Island', x: 1205, y: 816, elev: 108, runways: ['10', '28'] },
  { icao: 'KICJ', name: 'Palermo International Airport', city: 'Palermo', x: 1265, y: 1121, elev: 70, runways: ['07', '25', '02', '20'] },
  { icao: 'KPFC', name: 'Pacific International Airport', city: 'Pacific', x: 710, y: 1382, elev: 13, runways: ['06L', '06R', '24L', '24R'] },
  { icao: 'KVNW', name: 'Vinewood', city: 'Vinewood', x: 880, y: 581, elev: 510, runways: ['09', '27'] },
];

export function getAirport(icao) {
  return DEFAULT_AIRPORTS.find((a) => a.icao === (icao || '').toUpperCase());
}

export const PHONETIC = {
  A: 'ALPHA', B: 'BRAVO', C: 'CHARLIE', D: 'DELTA', E: 'ECHO', F: 'FOXTROT',
  G: 'GOLF', H: 'HOTEL', I: 'INDIA', J: 'JULIET', K: 'KILO', L: 'LIMA',
  M: 'MIKE', N: 'NOVEMBER', O: 'OSCAR', P: 'PAPA', Q: 'QUEBEC', R: 'ROMEO',
  S: 'SIERRA', T: 'TANGO', U: 'UNIFORM', V: 'VICTOR', W: 'WHISKEY', X: 'XRAY',
  Y: 'YANKEE', Z: 'ZULU',
};
