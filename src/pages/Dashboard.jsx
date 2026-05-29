import { Link } from 'react-router-dom';
import {
  Plane, ArrowRight, Map, ClipboardList, Trash2, FileText, Radio,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFlight, useFlights, clearFlights, setActiveFlight } from '../lib/store.js';
import { fmtKm, formatMmSs } from '../lib/flightGen.js';
import { AIRCRAFT, CATEGORY_LABELS } from '../data/aircraft.js';
import { DEFAULT_AIRPORTS, getAirport } from '../data/airports.js';
import { SIDS } from '../data/sids.js';
import { STARS } from '../data/stars.js';
import { downloadFlightPdf } from '../lib/pdf.js';
import { useToast } from '../components/Toast.jsx';

const CAT_COLORS = {
  airliner: '#1d6fcb', regional: '#14b8a6', businessjet: '#8b5cf6',
  turboprop: '#d97706', fighter: '#dc2626', cargo: '#475569',
  ga: '#65a30d', helicopter: '#ea580c',
};

export default function Dashboard() {
  const [flight] = useFlight();
  const flights = useFlights();

  return (
    <div className="page-body">
      <div className="banner-info">
        <Radio size={14} />
        <span>SAFS Brief  flight dispatch for SAFS / FiveM ATC. {DEFAULT_AIRPORTS.length - 1} airports · {SIDS.length} SIDs · {STARS.length} STARs · {AIRCRAFT.length} aircraft.</span>
      </div>

      <div className="dash-grid">
        <LatestFlight flight={flight} />
        <FlightPlansWidget flight={flight} />
        <AircraftTypesWidget flight={flight} />
        <SafsPackWidget />
      </div>

      <RecentFlightsTable rows={flights} onClear={() => clearFlights()} />
    </div>
  );
}

/* ---------- Latest Flight Plan ---------- */
function LatestFlight({ flight }) {
  return (
    <div className="dash-card">
      <div className="dash-head">
        <span className="dash-title">Latest Flight Plan</span>
        <span className="dash-sub mono">{flight ? formatDateShort(flight.createdAt) : ''}</span>
      </div>
      <div className="dash-body" style={{ padding: '6px 0', justifyContent: 'flex-start' }}>
        {flight ? (
          <div className="route-hero">
            <div className="callsign">{flight.callsign}</div>
            <div className="route-line">
              <div className="route-end">
                <div className="icao">{flight.dep}</div>
                <div className="city">{cityOf(flight.dep)}</div>
              </div>
              <Plane size={22} className="arrow" />
              <div className="route-end">
                <div className="icao">{flight.arr}</div>
                <div className="city">{cityOf(flight.arr)}</div>
              </div>
            </div>
            <div className="aircraft-line">
              {flight.aircraft.name} <span className="aircraft-tag">{flight.aircraft.icao}</span>
            </div>
          </div>
        ) : (
          <div className="dash-empty">
            <Plane size={28} color="#94a0ad" />
            <div className="muted" style={{ marginTop: 8 }}>No flight generated yet</div>
          </div>
        )}
      </div>
      <div className="dash-actions">
        <Link to="/plan" className={`btn btn-block ${!flight ? 'disabled' : ''}`} aria-disabled={!flight}>View Flight Plan</Link>
        <Link to="/new" className="btn btn-block">{flight ? 'Edit Flight' : 'Create Flight'}</Link>
      </div>
    </div>
  );
}

/* ---------- Flight Plans (mini area chart) ---------- */
function FlightPlansWidget({ flight }) {
  const days = 30;
  const data = Array(days).fill(0);
  if (flight) data[days - 1] = 1;
  return (
    <div className="dash-card">
      <div className="dash-head">
        <span className="dash-title">Flight Plans</span>
        <span className="dash-sub">last {days} days</span>
      </div>
      <div className="dash-body chart-body">
        <AreaChart data={data} />
      </div>
      <div className="dash-actions">
        <Link to="/new" className="btn btn-block">Create New Flight</Link>
        <Link to="/plan" className="btn btn-block">View Saved Flights</Link>
      </div>
    </div>
  );
}

/* ---------- Aircraft Types (donut) ---------- */
function AircraftTypesWidget({ flight }) {
  return (
    <div className="dash-card">
      <div className="dash-head">
        <span className="dash-title">Aircraft Types</span>
        <span className="dash-sub">Active</span>
      </div>
      <div className="dash-body chart-body" style={{ position: 'relative' }}>
        <Donut filled={!!flight} />
        {flight && (
          <div className="donut-legend">
            <span className="cat-dot" style={{ background: CAT_COLORS[flight.aircraft.category] || '#94a0ad' }} />
            <span className="mono">{flight.aircraft.icao}</span>
            <span className="muted" style={{ marginLeft: 6 }}>100%</span>
          </div>
        )}
      </div>
      <div className="dash-actions">
        <Link to="/new" className="btn btn-block">Browse {AIRCRAFT.length} Aircraft</Link>
        <Link to="/charts" className="btn btn-block">Browse Charts</Link>
      </div>
    </div>
  );
}

/* ---------- SAFS Pack ---------- */
function SafsPackWidget() {
  return (
    <div className="dash-card">
      <div className="dash-head">
        <span className="dash-title">SAFS Pack</span>
        <span className="dash-sub">Loaded from repo</span>
      </div>
      <div className="dash-body" style={{ gap: 6, padding: '4px 0', justifyContent: 'flex-start' }}>
        <div className="pack-stat">
          <div>
            <div className="pack-num">{DEFAULT_AIRPORTS.filter((a) => a.icao !== 'VFR').length}</div>
            <div className="pack-lbl">SAFS Airports</div>
          </div>
          <Map size={16} color="#94a0ad" />
        </div>
        <div className="pack-stat">
          <div>
            <div className="pack-num">{SIDS.length}</div>
            <div className="pack-lbl">Published SIDs</div>
          </div>
          <ClipboardList size={16} color="#94a0ad" />
        </div>
        <div className="pack-stat">
          <div>
            <div className="pack-num">{AIRCRAFT.length}</div>
            <div className="pack-lbl">Aircraft types</div>
          </div>
          <Plane size={16} color="#94a0ad" />
        </div>
      </div>
      <div className="dash-actions">
        <Link to="/charts" className="btn btn-block">Open Charts</Link>
        <Link to="/new" className="btn btn-block">Plan a Flight</Link>
      </div>
    </div>
  );
}

/* ---------- Recent Flights table with PDF/Edit/View columns ---------- */
function RecentFlightsTable({ rows, onClear }) {
  const { push } = useToast();
  const navigate = useNavigate();

  function open(id, to) {
    setActiveFlight(id);
    navigate(to);
  }

  async function dl(flight) {
    try {
      await downloadFlightPdf(flight);
      push({ message: 'PDF downloaded.', kind: 'good' });
    } catch (e) {
      push({ message: 'Could not generate PDF.', kind: 'bad' });
    }
  }

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Your Recent Flights <span className="muted" style={{ fontWeight: 400, marginLeft: 6 }}>– Flight plans generated this session</span></div>
        {rows.length > 0 && (
          <button className="btn btn-sm" onClick={onClear} title="Clear">
            <Trash2 size={13} /> Clear
          </button>
        )}
      </div>
      {rows.length === 0 ? (
        <div className="empty-state" style={{ padding: '40px 20px' }}>
          <ClipboardList size={26} color="#94a0ad" />
          <h3>No flights yet</h3>
          <div className="muted">Use New Flight to create your first SAFS brief.</div>
          <Link to="/new" className="btn btn-primary" style={{ marginTop: 14 }}>
            <Plane size={14} /> New Flight <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <table className="recent-table">
          <thead>
            <tr>
              <th>Flight</th>
              <th>Depart</th>
              <th>Arrive</th>
              <th>Aircraft</th>
              <th>Distance</th>
              <th>ETE</th>
              <th>Depart Time</th>
              <th>Date Generated</th>
              <th>View</th>
              <th>PDF</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f, i) => (
              <tr key={f.id || i}>
                <td className="mono"><strong>{f.callsign}</strong></td>
                <td className="mono">{f.dep} / {f.depRwy || ''}</td>
                <td className="mono">{f.arr} / {f.arrRwy || ''}</td>
                <td>
                  <span className="cat-dot" style={{ background: CAT_COLORS[f.aircraft.category] || '#94a0ad' }} />
                  <span className="mono" style={{ marginLeft: 6 }}>{f.aircraft.icao}</span>
                </td>
                <td className="mono">{fmtKm(f.summary.totalKm)}</td>
                <td className="mono">{formatMmSs(f.summary.totalTimeSec)}</td>
                <td className="mono">{timeOnly(f.createdAt)} UTC</td>
                <td className="mono muted">{formatDateShort(f.createdAt)}</td>
                <td><button className="btn btn-sm" onClick={() => open(f.id, '/plan')}>View</button></td>
                <td><button className="btn btn-sm" onClick={() => dl(f)}><FileText size={12} /> PDF</button></td>
                <td><button className="btn btn-sm" onClick={() => open(f.id, '/new')}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */
function cityOf(icao) {
  const a = getAirport(icao);
  return a?.city || a?.name?.split(' ').slice(0, 2).join(' ') || '';
}
function formatDateShort(iso) {
  const d = new Date(iso);
  const dd = d.getUTCDate().toString().padStart(2, '0');
  const mon = d.toLocaleString('en', { month: 'short' });
  const hh = d.getUTCHours().toString().padStart(2, '0');
  const mm = d.getUTCMinutes().toString().padStart(2, '0');
  return `${dd} ${mon} · ${hh}:${mm} UTC`;
}
function timeOnly(iso) {
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}`;
}

function AreaChart({ data }) {
  const max = Math.max(...data, 1);
  const w = 260; const h = 90;
  const step = w / Math.max(1, data.length - 1);
  const pts = data.map((v, i) => [i * step, h - (v / max) * (h - 8) - 4]);
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 90 }}>
      <path d={area} fill="rgba(71,85,105,0.18)" />
      <path d={path} fill="none" stroke="#334155" strokeWidth="1.5" />
      {pts.map((p, i) => data[i] > 0 && <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="#334155" />)}
    </svg>
  );
}

function Donut({ filled }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const pct = filled ? 1 : 0.04;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e3e6ea" strokeWidth="10" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="#334155" strokeWidth="10"
        strokeDasharray={`${c * pct} ${c}`} transform="rotate(-90 50 50)" strokeLinecap="round" />
      <text x="50" y="56" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="18" fontWeight="700" fill="#0f172a">
        {filled ? 1 : 0}
      </text>
    </svg>
  );
}
