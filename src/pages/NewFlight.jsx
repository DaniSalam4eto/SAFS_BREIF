import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, RotateCcw } from 'lucide-react';
import { DEFAULT_AIRPORTS, getAirport } from '../data/airports.js';
import { CATEGORY_LABELS, groupedAircraft, getAircraft } from '../data/aircraft.js';
import { computeFlightSummary, randomSquawk } from '../lib/flightGen.js';
import { useFlight } from '../lib/store.js';
import { useToast } from '../components/Toast.jsx';
import RouteMap from '../components/RouteMap.jsx';

const FLIGHT_RULES = ['IFR', 'VFR'];

export default function NewFlight() {
  const navigate = useNavigate();
  const { push } = useToast();
  const [, setFlight] = useFlight();

  const [airlineCode, setAirlineCode] = useState('LAB');
  const [flightNumber, setFlightNumber] = useState(() => String(Math.floor(100 + Math.random() * 900)));
  const [pilotName, setPilotName] = useState('');
  const [aircraftIcao, setAircraftIcao] = useState('A320');
  const [dep, setDep] = useState('KLSX');
  const [arr, setArr] = useState('KMDW');
  const [alt, setAlt] = useState('KZAA');
  const [rules, setRules] = useState('IFR');
  const [paxCount, setPaxCount] = useState(120);
  const [cargo, setCargo] = useState(800);
  const [depRwy, setDepRwy] = useState('');
  const [arrRwy, setArrRwy] = useState('');

  const aircraft = useMemo(() => getAircraft(aircraftIcao), [aircraftIcao]);
  const grouped = useMemo(() => groupedAircraft(), []);
  const depRwys = useMemo(() => getAirport(dep)?.runways || [], [dep]);
  const arrRwys = useMemo(() => getAirport(arr)?.runways || [], [arr]);

  const callsign = (airlineCode.trim().toUpperCase() + flightNumber.trim().toUpperCase()).replace(/\s+/g, '');

  function randomizeNumber() {
    setFlightNumber(String(Math.floor(100 + Math.random() * 900)));
  }

  function generate() {
    if (!aircraft)         { push({ message: 'Pick an aircraft.', kind: 'bad' }); return; }
    if (!airlineCode.trim()){ push({ message: 'Enter an airline code.', kind: 'bad' }); return; }
    if (!flightNumber.trim()){ push({ message: 'Enter a flight number.', kind: 'bad' }); return; }
    if (!dep || !arr)      { push({ message: 'Set departure and arrival.', kind: 'bad' }); return; }
    if (dep === arr)       { push({ message: 'Departure and arrival cannot match.', kind: 'bad' }); return; }

    const summary = computeFlightSummary({
      aircraft, depIcao: dep, arrIcao: arr, altIcao: alt,
      paxCount: Number(paxCount) || 0,
      cargoKg: Number(cargo) || 0,
      depRwy, arrRwy,
    });
    if (!summary) { push({ message: 'Could not compute flight plan.', kind: 'bad' }); return; }

    const flight = {
      callsign,
      airlineCode: airlineCode.trim().toUpperCase(),
      flightNumber: flightNumber.trim().toUpperCase(),
      pilotName: pilotName.trim() || 'Pilot',
      aircraft, dep, arr, alternate: alt, rules,
      depRwy: depRwy || summary.sid?.runway || depRwys[0] || '',
      arrRwy: arrRwy || summary.star?.runway || arrRwys[0] || '',
      squawk: randomSquawk(),
      atisLetter: ['A','B','C','D','E','F','G','H','J','K','L','M','N','P','R'][Math.floor(Math.random()*15)],
      qnh: 1013 + Math.floor(Math.random() * 14) - 7,
      createdAt: new Date().toISOString(),
      summary,
    };
    setFlight(flight);
    push({ message: 'Flight generated.', kind: 'good' });
    navigate('/plan');
  }

  function reset() {
    setAirlineCode('LAB');
    setFlightNumber(String(Math.floor(100 + Math.random() * 900)));
    setPilotName('');
    setAircraftIcao('A320');
    setDep('KLSX'); setArr('KMDW'); setAlt('KZAA');
    setPaxCount(120); setCargo(800); setDepRwy(''); setArrRwy('');
  }

  return (
    <div className="flight-layout">
      <div className="flight-form-col">
        {/* Top action bar */}
        <div className="form-actions-top">
          <button className="btn btn-primary" onClick={generate}>
            <Sparkles size={14} /> Generate Flight
          </button>
          <button className="btn" onClick={reset}>
            <RotateCcw size={14} /> Reset
          </button>
          <div className="spacer" />
          <span className="muted mono" style={{ fontSize: 12 }}>{callsign || ''}</span>
        </div>

        <h1 className="page-title" style={{ marginTop: 14 }}>New Flight</h1>
        <p className="page-subtitle">Configure airline, route and load. Cruise level is computed automatically.</p>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Flight Info</div>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <Field label="Airline ICAO">
                <input className="input" maxLength={4} value={airlineCode}
                       onChange={(e) => setAirlineCode(e.target.value.toUpperCase())}
                       placeholder="e.g. LAB" />
              </Field>
              <Field label="Flight Number">
                <div className="row-flex">
                  <input className="input" maxLength={5} value={flightNumber}
                         onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                         placeholder="e.g. 488" />
                  <button className="btn btn-sm" onClick={randomizeNumber}>Random</button>
                </div>
              </Field>
              <Field label="Pilot Name (PDF)">
                <input className="input" value={pilotName} onChange={(e) => setPilotName(e.target.value)} placeholder="e.g. D. Smith" />
              </Field>
              <Field label="Flight Rules">
                <select className="select" value={rules} onChange={(e) => setRules(e.target.value)}>
                  {FLIGHT_RULES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Route</div>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <Field label="Departure">
                <AirportSelect value={dep} onChange={setDep} />
              </Field>
              <Field label="Dep Runway">
                <select className="select" value={depRwy} onChange={(e) => setDepRwy(e.target.value)}>
                  <option value="">AUTO</option>
                  {depRwys.map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Arrival">
                <AirportSelect value={arr} onChange={setArr} />
              </Field>
              <Field label="Arr Runway">
                <select className="select" value={arrRwy} onChange={(e) => setArrRwy(e.target.value)}>
                  <option value="">AUTO</option>
                  {arrRwys.map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Alternate">
                <AirportSelect value={alt} onChange={setAlt} />
              </Field>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Aircraft &amp; Load</div>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <Field label="Aircraft Type">
                <select className="select" value={aircraftIcao} onChange={(e) => setAircraftIcao(e.target.value)}>
                  {Object.entries(grouped).map(([cat, list]) => (
                    <optgroup key={cat} label={CATEGORY_LABELS[cat] || cat}>
                      {list.map((a) => <option key={a.icao} value={a.icao}>{a.icao}  {a.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </Field>
              <Field label="Max pax / MTOW">
                <input className="input" disabled value={aircraft ? `${aircraft.maxPax} pax · ${aircraft.mtow.toLocaleString()} kg` : ''} />
              </Field>
              <Field label="Passengers">
                <input className="input" type="number" min={0} max={aircraft?.maxPax || 1000}
                       value={paxCount} onChange={(e) => setPaxCount(e.target.value)} />
              </Field>
              <Field label="Cargo (kg)">
                <input className="input" type="number" min={0} value={cargo} onChange={(e) => setCargo(e.target.value)} />
              </Field>
            </div>
          </div>
        </div>
      </div>

      <div className="flight-map-col">
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-head">
            <div className="card-title">Route Preview</div>
            <span className="muted mono" style={{ fontSize: 11 }}>{dep} → {arr} · alt {alt}</span>
          </div>
          <div className="card-body" style={{ padding: 10 }}>
            <LivePreviewMap dep={dep} arr={arr} alt={alt} aircraft={aircraft}
                            depRwy={depRwy} arrRwy={arrRwy}
                            paxCount={paxCount} cargo={cargo} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Live preview that runs the same computeFlightSummary as Generate so the
// preview matches the brief 1:1  including alternate route waypoints.
function LivePreviewMap({ dep, arr, alt, aircraft, depRwy, arrRwy, paxCount, cargo }) {
  const summary = useMemo(() => {
    if (!aircraft) return null;
    return computeFlightSummary({
      aircraft,
      depIcao: dep,
      arrIcao: arr,
      altIcao: alt,
      paxCount: Number(paxCount) || 0,
      cargoKg: Number(cargo) || 0,
      depRwy,
      arrRwy,
    });
  }, [aircraft, dep, arr, alt, depRwy, arrRwy, paxCount, cargo]);

  return (
    <div className="preview-map-wrap">
      <RouteMap
        depIcao={dep}
        arrIcao={arr}
        altIcao={alt}
        waypoints={summary?.waypoints || []}
        altWaypoints={summary?.altWaypoints || []}
      />
    </div>
  );
}

function AirportSelect({ value, onChange }) {
  return (
    <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
      {DEFAULT_AIRPORTS.filter((a) => a.icao !== 'VFR').map((a) => (
        <option key={a.icao} value={a.icao}>{a.icao}  {a.name}</option>
      ))}
    </select>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}
