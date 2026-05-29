import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Plane, FileText, Edit, X, ChevronUp, ChevronDown, MessageSquareText
} from 'lucide-react';
import { useFlight } from '../lib/store.js';
import { fmtKg, fmtKm, fmtNm, formatMmSs, formatAltitudeFt } from '../lib/flightGen.js';
import { buildAtcPhrases } from '../lib/atc.js';
import { resolveCoord } from '../data/sids.js';
import { getAirport } from '../data/airports.js';
import { downloadFlightPdf } from '../lib/pdf.js';
import CopyButton from '../components/CopyButton.jsx';
import RouteMapShared from '../components/RouteMap.jsx';
import { useToast } from '../components/Toast.jsx';

export default function ViewFlightPlan() {
  const [flight] = useFlight();
  const { push } = useToast();
  const [bannerOpen, setBannerOpen] = useState(true);

  if (!flight) {
    return (
      <div className="page-body">
        <h1 className="page-title">View Flight Plan</h1>
        <p className="page-subtitle">Brief, route and ATC comms for the active flight.</p>
        <div className="card">
          <div className="empty-state">
            <Plane size={28} color="#475569" />
            <h3>No active flight</h3>
            <div className="muted">Generate a flight first.</div>
            <Link to="/new" className="btn btn-primary" style={{ marginTop: 14 }}>
              <Sparkles size={14} /> New Flight
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function handlePdf() {
    try {
      await downloadFlightPdf(flight);
      push({ message: 'PDF downloaded.', kind: 'good' });
    } catch (e) {
      console.error(e);
      push({ message: 'Could not generate PDF.', kind: 'bad' });
    }
  }

  return (
    <>
      <div className="action-bar">
        <Link to="/new" className="action-btn">
          <Edit size={15} /> Edit Flight
        </Link>
        <button className="action-btn primary" onClick={handlePdf}>
          <FileText size={15} /> Download PDF
        </button>
      </div>

      <div className="brief-layout">
        <div className="brief-content">
          {bannerOpen && (
            <div className="brief-banner">
              <span>
                <span className="brief-banner-icon">ⓘ</span>
                This briefing was generated on:{' '}
                <strong>{formatBannerDate(flight.createdAt)}</strong>.
              </span>
              <button className="brief-banner-close" onClick={() => setBannerOpen(false)} aria-label="Close">
                <X size={14} />
              </button>
            </div>
          )}

          <FlightInfoCard flight={flight} />
          <PlanSummaryCard flight={flight} />
          <LoadSheetCard flight={flight} />
          <RouteCard flight={flight} />
          <DispatchRemarksCard flight={flight} />
          <AtcCard flight={flight} />
        </div>

        <div className="brief-map-col">
          <RouteMap flight={flight} />
        </div>
      </div>
    </>
  );
}

/* ---------- Card primitives ---------- */
function BriefCard({ title, children, defaultOpen = true, action }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card brief-card">
      <div className="card-head">
        <div className="card-title">{title}</div>
        <div className="card-actions">
          {action}
          <button className="brief-toggle" onClick={() => setOpen(!open)}>
            {open ? 'Hide Details' : 'Show Details'}
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>
      {open && children}
    </div>
  );
}

/* ---------- Flight Info ---------- */
function FlightInfoCard({ flight }) {
  const { summary, aircraft } = flight;
  return (
    <BriefCard title="Flight Info">
      <div className="stat-row">
        <Stat label="Flight Number" value={flight.flightNumber || flight.callsign} />
        <Stat label="Callsign"      value={flight.callsign} />
        <Stat label="Departure"     value={`${flight.dep} / ${flight.depRwy || ''}`} />
        <Stat label="Arrival"       value={`${flight.arr} / ${flight.arrRwy || ''}`} />
        <Stat label="Alternate"     value={flight.alternate || ''} />
        <Stat label="Aircraft"      value={aircraft.icao} />
      </div>
      <div className="stat-row">
        <Stat label="Departure Date" value={dateOnly(flight.createdAt)} />
        <Stat label="Departure Time" value={timeOnly(flight.createdAt) + ' UTC'} />
        <Stat label="ETE"            value={formatMmSs(summary.totalTimeSec)} />
        <Stat label="ETA"            value={addSecondsUtc(flight.createdAt, summary.totalTimeSec)} />
        <Stat label="Pilot"          value={flight.pilotName || ''} />
        <Stat label="Airline"        value={flight.airlineCode} />
      </div>
    </BriefCard>
  );
}

/* ---------- Flight Plan Summary ---------- */
function PlanSummaryCard({ flight }) {
  const { summary, aircraft } = flight;
  const etops = aircraft.engines === 2 ? 'No' : 'N/A';
  return (
    <BriefCard title="Flight Plan Summary">
      <div className="stat-row">
        <Stat label="Initial Altitude" value={formatAltitudeFt(summary.cruiseFl)} />
        <Stat label="Cruise Profile"   value={`M${aircraft.cruiseMach}`} />
        <Stat label="Route Distance"   value={fmtKm(summary.totalKm)} />
        <Stat label="TAS"              value={`${summary.cruiseTas} kt`} />
        <Stat label="SID"              value={summary.sid?.name || ''} />
        <Stat label="STAR"             value={summary.star?.name || ''} />
      </div>
      <div className="stat-row">
        <Stat label="Flight Rules"   value={flight.rules} />
        <Stat label="Release Number" value="1" />
        <Stat label="Squawk"         value={flight.squawk} />
        <Stat label="ATIS"           value={flight.atisLetter} />
        <Stat label="Units"          value="KG" />
        <Stat label="ETOPS"          value={etops} />
      </div>
    </BriefCard>
  );
}

/* ---------- Load Sheet ---------- */
function LoadSheetCard({ flight }) {
  const { summary, aircraft } = flight;
  const baggage = Math.round(summary.weights.cargo * 0.3);
  return (
    <BriefCard title={<>Load Sheet <span className="muted" style={{ fontWeight: 400, marginLeft: 6 }}>– All weights in <span className="weight-tag">KG</span></span></>}>
      <div className="stat-row">
        <Stat label="Enroute Burn"    value={fmtKg(summary.fuel.trip)} />
        <Stat label="Passenger Count" value={summary.weights.paxCount} />
        <Stat label="Empty Weight"    value={fmtKg(summary.weights.oew)} />
        <Stat label="Estimated ZFW"   value={fmtKg(summary.weights.zfw)} />
        <Stat label="Estimated TOW"   value={fmtKg(summary.weights.tow)} />
        <Stat label="Estimated LW"    value={fmtKg(summary.weights.lw)} />
      </div>
      <div className="stat-row">
        <Stat label="Block Fuel" value={fmtKg(summary.fuel.block)} />
        <Stat label="Baggage"    value={fmtKg(baggage)} />
        <Stat label="Payload"    value={fmtKg(summary.weights.payload)} />
        <Stat label="Max ZFW"    value={fmtKg(Math.round(aircraft.mtow * 0.78))} />
        <Stat label="Max TOW"    value={fmtKg(aircraft.mtow)} />
        <Stat label="Max LW"     value={fmtKg(Math.round(aircraft.mtow * 0.85))} />
      </div>
    </BriefCard>
  );
}

/* ---------- Route ---------- */
function RouteCard({ flight }) {
  const { summary } = flight;
  const altRwy = summary.altStar?.runway || getAirport(flight.alternate)?.runways?.[0] || '';
  const action = <CopyButton text={summary.routeString} label="Copy" toastLabel="Route copied" />;
  return (
    <BriefCard title="Route" action={action}>
      <div className="card-body">
        <div className="route-box-simbrief">
          <RouteHighlighted text={summary.routeString} />
        </div>
        <div className="waypoint-chips" style={{ marginTop: 10 }}>
          <span className="waypoint-chip dep">{flight.dep}{flight.depRwy ? `/${flight.depRwy}` : ''}</span>
          {summary.sid && <span className="waypoint-chip sid">{summary.sid.name}</span>}
          {(summary.waypoints || []).map((w, i) => (
            <span key={`${w}-${i}`} className="waypoint-chip">{w}</span>
          ))}
          {summary.star && <span className="waypoint-chip sid">{summary.star.name}</span>}
          <span className="waypoint-chip arr">{flight.arr}{flight.arrRwy ? `/${flight.arrRwy}` : ''}</span>
        </div>

        {summary.altRouteString && (
          <>
            <div className="route-label" style={{ marginTop: 16 }}>
              Alternate Route <span className="muted">– {flight.arr} → {flight.alternate}</span>
            </div>
            <div className="route-box-simbrief" style={{ marginTop: 6 }}>
              <RouteHighlighted text={summary.altRouteString} />
            </div>
            <div className="waypoint-chips" style={{ marginTop: 10 }}>
              <span className="waypoint-chip arr">{flight.arr}{flight.arrRwy ? `/${flight.arrRwy}` : ''}</span>
              {(summary.altWaypoints || []).map((w, i) => (
                <span key={`alt-${w}-${i}`} className="waypoint-chip">{w}</span>
              ))}
              {summary.altStar && <span className="waypoint-chip sid">{summary.altStar.name}</span>}
              <span className="waypoint-chip dep">{flight.alternate}{altRwy ? `/${altRwy}` : ''}</span>
            </div>
          </>
        )}
      </div>
    </BriefCard>
  );
}

function RouteHighlighted({ text }) {
  // Color-code: speeds (N\d+F\d+) in light gray, everything else default.
  const parts = text.split(/(\s+)/);
  return (
    <span>
      {parts.map((p, i) => /^N\d+F\d+$/.test(p)
        ? <span key={i} style={{ color: '#94a0ad' }}>{p}</span>
        : <span key={i}>{p}</span>
      )}
    </span>
  );
}

/* ---------- Dispatch Remarks ---------- */
function DispatchRemarksCard({ flight }) {
  const remarks = [
    `Self-dispatched flight, SAFS Brief auto-generated.`,
    `Pilot in command: ${(flight.pilotName || 'Pilot').toString()}`,
    `Squawk ${flight.squawk}, contact ${flight.dep} Delivery on initial call with information ${flight.atisLetter}.`,
    `Climb via the ${flight.summary.sid?.name || ''} departure, then as filed to ${flight.arr}.`,
    flight.summary.star ? `Expect the ${flight.summary.star.name} arrival into ${flight.arr}${flight.arrRwy ? ` runway ${flight.arrRwy}` : ''}.` : '',
    flight.alternate ? `Alternate ${flight.alternate} planned${flight.summary.altStar ? ` via the ${flight.summary.altStar.name} arrival` : ''}; sufficient fuel for divert + 5 min reserves.` : '',
    `Not for real-world operations.`,
  ].filter(Boolean);

  return (
    <BriefCard title="Dispatch Remarks">
      <div className="card-body">
        <ul className="remarks-list">
          {remarks.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>
    </BriefCard>
  );
}

/* ---------- ATC Communication ---------- */
function AtcCard({ flight }) {
  const phrases = useMemo(() => buildAtcPhrases({
    callsign: flight.callsign,
    depIcao: flight.dep,
    arrIcao: flight.arr,
    sid: flight.summary.sid,
    star: flight.summary.star,
    runwayDep: flight.depRwy,
    runwayArr: flight.arrRwy,
    cruiseFl: flight.summary.cruiseFl,
    squawk: flight.squawk,
    atisLetter: flight.atisLetter,
  }), [flight]);

  const allText = phrases.map((p) => `${p.title}\n${p.body}`).join('\n\n');
  const action = <CopyButton text={allText} label="Copy all" toastLabel="All phrases copied" />;

  return (
    <BriefCard title={<><MessageSquareText size={14} /> ATC Communication</>} action={action} defaultOpen={false}>
      <div className="card-body">
        {phrases.map((p) => (
          <div key={p.title} className="phrase">
            <div className="phrase-title">{p.title}</div>
            <div className="phrase-preview">{p.body}</div>
            <div className="phrase-row">
              <span className="muted" style={{ fontSize: 11 }}>Paste into your sim's text chat.</span>
              <CopyButton text={p.body} label="Copy" toastLabel={`${p.title} copied`} />
            </div>
          </div>
        ))}
      </div>
    </BriefCard>
  );
}

/* ---------- Map (right column, sticky) ---------- */
function RouteMap({ flight }) {
  return (
    <div className="brief-map">
      <RouteMapShared
        depIcao={flight.dep}
        arrIcao={flight.arr}
        altIcao={flight.alternate}
        waypoints={flight.summary.waypoints}
        altWaypoints={flight.summary.altWaypoints}
      />
    </div>
  );
}

/* ---------- helpers ---------- */
function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function dateOnly(iso) {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2,'0')} ${d.toLocaleString('en',{month:'short'})}`;
}
function timeOnly(iso) {
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}`;
}
function addSecondsUtc(iso, sec) {
  const d = new Date(new Date(iso).getTime() + (sec || 0) * 1000);
  if (!Number.isFinite(d.getTime())) return '';
  return `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}:${String(d.getUTCSeconds()).padStart(2,'0')} UTC`;
}
function formatBannerDate(iso) {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return '';
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mon = d.toLocaleString('en', { month: 'short' });
  const y = d.getUTCFullYear();
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${dd} ${mon} ${y} at ${hh}:${mm} UTC`;
}
