import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Map, ChevronRight, Search, ArrowLeft, Plane } from 'lucide-react';
import { DEFAULT_AIRPORTS, getAirport } from '../data/airports.js';
import { getSidsFor, resolveCoord } from '../data/sids.js';
import { getStarsFor } from '../data/stars.js';
import CopyButton from '../components/CopyButton.jsx';

export default function Charts() {
  const { icao } = useParams();
  if (icao) return <AirportDetail icao={icao.toUpperCase()} />;
  return <AirportList />;
}

function AirportList() {
  const [query, setQuery] = useState('');
  const list = useMemo(() => {
    const q = query.trim().toUpperCase();
    return DEFAULT_AIRPORTS
      .filter((a) => a.icao !== 'VFR')
      .filter((a) => !q || a.icao.includes(q) || a.name.toUpperCase().includes(q) || (a.city || '').toUpperCase().includes(q));
  }, [query]);

  return (
    <div className="page-body">
      <h1 className="page-title">Charts</h1>
      <p className="page-subtitle">SAFS airports  runways, SIDs, STARs and route preview pulled live from the repo data.</p>

      <div className="card">
        <div className="card-head">
          <div className="card-title"><Map size={14} /> SAFS Airports ({DEFAULT_AIRPORTS.length - 1})</div>
          <div className="row-flex">
            <Search size={14} color="#8a96a3" />
            <input className="input" style={{ width: 220 }} placeholder="Search ICAO or city…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
        <div className="list">
          {list.map((a) => {
            const sidCount = getSidsFor(a.icao).length;
            const starCount = getStarsFor(a.icao).length;
            const rwyCount = (a.runways || []).length;
            return (
              <Link key={a.icao} to={`/charts/${a.icao}`} className="list-row" style={{ color: 'inherit', textDecoration: 'none' }}>
                <span className="icao-tag">{a.icao}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{a.name}</div>
                  <div className="muted">
                    {a.city || ''} · Elev {a.elev} ft · {rwyCount} runway{rwyCount === 1 ? '' : 's'} · {sidCount} SID{sidCount === 1 ? '' : 's'} · {starCount} STAR{starCount === 1 ? '' : 's'}
                  </div>
                </div>
                <ChevronRight size={16} color="#8a96a3" />
              </Link>
            );
          })}
          {list.length === 0 && (
            <div className="empty-state"><Plane size={26} color="#2c7fe6" /><h3>No matches</h3><div className="muted">Try a different ICAO or city.</div></div>
          )}
        </div>
      </div>
    </div>
  );
}

function AirportDetail({ icao }) {
  const airport = getAirport(icao);
  const sids = airport ? getSidsFor(icao) : [];
  const stars = airport ? getStarsFor(icao) : [];

  if (!airport) {
    return (
      <div className="page-body">
        <h1 className="page-title">Charts</h1>
        <p className="page-subtitle">Airport not found.</p>
        <Link to="/charts" className="btn"><ArrowLeft size={14} /> Back</Link>
      </div>
    );
  }

  return (
    <div className="page-body">
      <Link to="/charts" className="btn btn-sm" style={{ marginBottom: 12 }}><ArrowLeft size={13} /> All airports</Link>
      <h1 className="page-title">{airport.icao} <span className="muted" style={{ fontSize: 14, fontWeight: 400 }}>{airport.name}</span></h1>
      <p className="page-subtitle">{airport.city || ''} · Elev {airport.elev} ft · Runways {airport.runways?.join(', ') || ''}</p>

      <div className="card">
        <div className="card-head">
          <div className="card-title">Airport Info</div>
          <CopyButton text={`${airport.icao} ${airport.name} · Elev ${airport.elev} ft · RWY ${airport.runways?.join('/') || ''}`} label="Copy info" toastLabel="Airport info copied" />
        </div>
        <div className="stat-row">
          <Stat label="ICAO" value={airport.icao} />
          <Stat label="Name" value={airport.name} />
          <Stat label="City" value={airport.city || ''} />
          <Stat label="Elev" value={`${airport.elev} ft`} />
          <Stat label="Runways" value={(airport.runways || []).join(', ') || ''} />
          <Stat label="SIDs" value={sids.length} />
          <Stat label="STARs" value={stars.length} />
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">Standard Instrument Departures</div>
        </div>
        {sids.length === 0 ? (
          <div className="card-body muted">No published SIDs for this airport.</div>
        ) : (
          <table className="recent-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>SID</th>
                <th style={th}>Runway</th>
                <th style={th}>Waypoints</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {sids.map((s) => {
                const wpText = s.waypoints.join(' ');
                return (
                  <tr key={`${s.name}-${s.runway}`} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={td}><span className="tag">{s.name}</span></td>
                    <td style={td} className="mono">{s.runway}</td>
                    <td style={td} className="mono">{wpText}</td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <CopyButton text={`${airport.icao} ${s.name} ${wpText}`} label="Copy" toastLabel={`${s.name} copied`} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">Standard Terminal Arrivals</div>
        </div>
        {stars.length === 0 ? (
          <div className="card-body muted">No published STARs for this airport.</div>
        ) : (
          <table className="recent-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>STAR</th>
                <th style={th}>Runway</th>
                <th style={th}>Waypoints</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {stars.map((s) => {
                const wpText = s.waypoints.join(' ');
                return (
                  <tr key={`${s.name}-${s.runway}`} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={td}><span className="tag">{s.name}</span></td>
                    <td style={td} className="mono">{s.runway}</td>
                    <td style={td} className="mono">{wpText}</td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <CopyButton text={`${airport.icao} ${s.name} ${wpText}`} label="Copy" toastLabel={`${s.name} copied`} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">Procedure Map</div>
          <span className="muted mono" style={{ fontSize: 11 }}>SIDs (solid) &amp; STARs (dashed) for {airport.icao}</span>
        </div>
        <div className="card-body" style={{ padding: 10 }}>
          <AirportSidMap airport={airport} sids={sids} stars={stars} />
        </div>
      </div>
    </div>
  );
}

function AirportSidMap({ airport, sids, stars = [] }) {
  // Draw every SID (solid) and STAR (dashed) from this airport, colored by index.
  const palette = ['#1d6fcb', '#2f9b6a', '#c97a17', '#8e44ad', '#16a085', '#c0392b', '#2980b9', '#d35400'];

  const lines = [];
  const labels = [];
  const seenWps = new Set();

  sids.forEach((sid, idx) => {
    const color = palette[idx % palette.length];
    let prev = { x: airport.x, y: airport.y };
    sid.waypoints.forEach((wp) => {
      const c = resolveCoord(wp);
      if (!c) return;
      lines.push({ x1: prev.x, y1: prev.y, x2: c.x, y2: c.y, color, dashed: false, key: `sid-${sid.name}-${wp}` });
      if (!seenWps.has(wp)) {
        labels.push({ x: c.x, y: c.y, label: wp, kind: 'wp' });
        seenWps.add(wp);
      }
      prev = c;
    });
  });

  // STARs arrive into the airport: waypoints run entry → airport, so connect
  // each waypoint to the next and the final one to the field.
  stars.forEach((star, idx) => {
    const color = palette[(idx + 4) % palette.length];
    const pts = star.waypoints.map(resolveCoord).filter(Boolean);
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[i + 1] || { x: airport.x, y: airport.y };
      lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, color, dashed: true, key: `star-${star.name}-${i}` });
    }
    star.waypoints.forEach((wp) => {
      const c = resolveCoord(wp);
      if (c && !seenWps.has(wp)) {
        labels.push({ x: c.x, y: c.y, label: wp, kind: 'wp' });
        seenWps.add(wp);
      }
    });
  });

  return (
    <div className="chart-frame">
      <img src="./SAFS_Navaids.jpeg" alt="SAFS chart" />
      <svg className="sid-svg" viewBox="0 0 2000 1719" preserveAspectRatio="xMidYMid meet">
        {lines.map((l) => (
          <line key={l.key} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} style={{ stroke: l.color }} strokeDasharray={l.dashed ? '14 10' : undefined} />
        ))}
        {airport.x != null && (
          <g>
            <circle cx={airport.x} cy={airport.y} r={18} className="dep" />
            <text x={airport.x + 22} y={airport.y + 8}>{airport.icao}</text>
          </g>
        )}
        {labels.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r={12} className="wp" />
            <text x={p.x + 18} y={p.y + 6}>{p.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const th = { textAlign: 'left', padding: '10px 14px', borderBottom: '1px solid var(--border)', color: 'var(--text-dim)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, background: '#f6f8fb' };
const td = { padding: '10px 14px', fontSize: 13, color: 'var(--text)' };

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
