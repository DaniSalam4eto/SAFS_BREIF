// ATC phrase generator. Produces /ATC slash commands for each phase of flight.
import { spokenCallsign } from '../data/airlines.js';

export function buildAtcPhrases({ callsign, depIcao, arrIcao, sid, star, runwayDep, runwayArr, cruiseFl, squawk, atisLetter }) {
  const spoken = spokenCallsign(callsign) || callsign || 'Aircraft';
  const dep = (depIcao || '').toUpperCase();
  const arr = (arrIcao || '').toUpperCase();
  const sidName = (sid?.name || sid || '').toUpperCase();
  const starName = (star?.name || star || '').toUpperCase();
  const rwyD = (runwayDep || '').toUpperCase();
  const rwyA = (runwayArr || '').toUpperCase();
  const altFt = `${((cruiseFl || 24) * 100).toLocaleString('en-US')} ft`;
  const sq = squawk || '2000';
  const info = atisLetter ? `, information ${atisLetter}` : '';

  return [
    {
      title: 'Radio check',
      body: `${spoken}, ${dep} radio check, how do you read?`,
    },
    {
      title: 'Initial contact / clearance request',
      body: `/ATC ${dep} Delivery, ${spoken}${info}, stand requesting IFR clearance to ${arr}.`,
    },
    {
      title: 'IFR clearance readback',
      body: `/ATC ${dep} Delivery, ${spoken}, cleared to ${arr} via the ${sidName || 'as filed'} departure, climb via SID, ${altFt}, squawk ${sq}.`,
    },
    {
      title: 'Pushback & start',
      body: `/ATC ${dep} Ground, ${spoken}, request pushback and start.`,
    },
    {
      title: 'Taxi',
      body: `/ATC ${dep} Ground, ${spoken}, ready to taxi, runway ${rwyD}.`,
    },
    {
      title: 'Line up and wait',
      body: `/ATC ${dep} Tower, ${spoken}, holding short runway ${rwyD}, ready for departure.`,
    },
    {
      title: 'Take-off clearance readback',
      body: `/ATC ${dep} Tower, ${spoken}, cleared for take-off runway ${rwyD}.`,
    },
    {
      title: 'Departure / handoff to Center',
      body: `/ATC ${dep} Departure, ${spoken}, passing 2000 ft climbing ${altFt}, ${sidName || 'as filed'} departure.`,
    },
    {
      title: 'Top of climb',
      body: `/ATC Center, ${spoken}, level ${altFt}.`,
    },
    {
      title: 'Top of descent / arrival check-in',
      body: `/ATC ${arr} Approach, ${spoken}, descending ${altFt} for ${arr}${starName ? ` via the ${starName} arrival` : ''}, with information ${atisLetter || 'Alpha'}.`,
    },
    {
      title: 'Approach clearance readback',
      body: `/ATC ${arr} Approach, ${spoken}, cleared ILS approach runway ${rwyA}, report established.`,
    },
    {
      title: 'Tower handoff',
      body: `/ATC ${arr} Tower, ${spoken}, ILS established runway ${rwyA}.`,
    },
    {
      title: 'Landing clearance readback',
      body: `/ATC ${arr} Tower, ${spoken}, cleared to land runway ${rwyA}.`,
    },
    {
      title: 'Vacate / taxi to stand',
      body: `/ATC ${arr} Ground, ${spoken}, runway vacated, request taxi to stand.`,
    },
  ];
}
