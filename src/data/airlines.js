// Lightweight airline/callsign table for SAFS. Extend as needed.
export const AIRLINES = [
  { code: 'BAW', name: 'British Airways', spoken: 'Speedbird' },
  { code: 'AAL', name: 'American Airlines', spoken: 'American' },
  { code: 'UAL', name: 'United Airlines', spoken: 'United' },
  { code: 'DAL', name: 'Delta Air Lines', spoken: 'Delta' },
  { code: 'LH',  name: 'Lufthansa', spoken: 'Lufthansa' },
  { code: 'AFR', name: 'Air France', spoken: 'Air France' },
  { code: 'KLM', name: 'KLM Royal Dutch', spoken: 'KLM' },
  { code: 'RYR', name: 'Ryanair', spoken: 'Ryanair' },
  { code: 'EZY', name: 'easyJet', spoken: 'Easy' },
  { code: 'SWA', name: 'Southwest', spoken: 'Southwest' },
  { code: 'EK',  name: 'Emirates', spoken: 'Emirates' },
  { code: 'QTR', name: 'Qatar Airways', spoken: 'Qatari' },
  { code: 'SIA', name: 'Singapore Airlines', spoken: 'Singapore' },
  { code: 'ANA', name: 'All Nippon', spoken: 'All Nippon' },
  { code: 'JAL', name: 'Japan Airlines', spoken: 'Japan Air' },
  { code: 'TAM', name: 'LATAM Brasil', spoken: 'Tam' },
  { code: 'IBE', name: 'Iberia', spoken: 'Iberia' },
  { code: 'TAP', name: 'TAP Portugal', spoken: 'Air Portugal' },
  { code: 'AZA', name: 'ITA Airways', spoken: 'ITA' },
  { code: 'AAR', name: 'Asiana Airlines', spoken: 'Asiana' },
  { code: 'WZZ', name: 'Wizz Air', spoken: 'Wizz Air' },
  { code: 'TUI', name: 'TUI Airways', spoken: 'TUI' },
  { code: 'LAB', name: 'SAFS Logistics', spoken: 'Labcoin' },
  { code: 'GMR', name: 'SAFS Government', spoken: 'Government' },
];

export function lookupAirline(code) {
  const c = (code || '').trim().toUpperCase();
  return AIRLINES.find((a) => a.code === c);
}

export function spokenCallsign(callsign) {
  if (!callsign) return '';
  const cs = callsign.trim().toUpperCase();
  const m = cs.match(/^([A-Z]{2,3})(\d+[A-Z]?)$/);
  if (!m) return cs;
  const airline = lookupAirline(m[1]);
  if (!airline) return cs;
  const digits = m[2].split('').join(' ');
  return `${airline.spoken} ${digits}`;
}
