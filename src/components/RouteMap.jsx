// Shared SimBrief-style route map used by ViewFlightPlan and NewFlight preview.
// Renders:
//   - Solid black main-route polyline
//   - Square markers for intermediate waypoints
//   - Dashed amber line + amber squares for alternate route
//   - Blue label boxes for dep / arr, yellow label box for alternate
import { getAirport } from '../data/airports.js';
import { resolveCoord } from '../data/sids.js';

const CHART_SRC = './SAFS_Navaids.jpeg';

export default function RouteMap({
  depIcao,
  arrIcao,
  altIcao,
  waypoints = [],
  altWaypoints = [],
}) {
  const dep = getAirport(depIcao);
  const arr = getAirport(arrIcao);
  const altn = getAirport(altIcao);

  // Main route polyline points (dep, intermediate waypoints, arr)
  const main = [];
  if (dep?.x != null) main.push({ x: dep.x, y: dep.y, label: dep.icao, kind: 'dep' });
  for (const wp of waypoints) {
    const c = resolveCoord(wp);
    if (c) main.push({ x: c.x, y: c.y, label: wp, kind: 'wp' });
  }
  if (arr?.x != null) main.push({ x: arr.x, y: arr.y, label: arr.icao, kind: 'arr' });

  // Alternate polyline points (arr, alt waypoints, alt)
  const altRoute = [];
  if (arr?.x != null && altn?.x != null && altn.icao !== arr.icao) {
    altRoute.push({ x: arr.x, y: arr.y });
    for (const wp of altWaypoints) {
      const c = resolveCoord(wp);
      if (c) altRoute.push({ x: c.x, y: c.y, label: wp });
    }
    altRoute.push({ x: altn.x, y: altn.y, label: altn.icao });
  }

  return (
    <div className="chart-frame">
      <img src={CHART_SRC} alt="SAFS chart" />
      <svg className="route-svg" viewBox="0 0 2000 1719" preserveAspectRatio="xMidYMid meet">
        {/* Main route line */}
        {main.slice(0, -1).map((p, i) => {
          const n = main[i + 1];
          return <line key={`m-${i}`} x1={p.x} y1={p.y} x2={n.x} y2={n.y} className="rl-main" />;
        })}
        {/* Alternate dashed line through alt waypoints */}
        {altRoute.slice(0, -1).map((p, i) => {
          const n = altRoute[i + 1];
          return <line key={`a-${i}`} x1={p.x} y1={p.y} x2={n.x} y2={n.y} className="rl-alt" />;
        })}
        {/* Intermediate waypoint squares */}
        {main.filter((p) => p.kind === 'wp').map((p, i) => (
          <rect key={`w-${i}`} x={p.x - 9} y={p.y - 9} width={18} height={18} className="wp-sq" />
        ))}
        {/* Alternate waypoint squares (amber) */}
        {altRoute.slice(1, -1).map((p, i) => (
          <rect key={`aw-${i}`} x={p.x - 8} y={p.y - 8} width={16} height={16} className="wp-alt-sq" />
        ))}
        {/* Airport labelled boxes */}
        {dep?.x != null && <AirportBox x={dep.x} y={dep.y} label={dep.icao} variant="blue" anchor="left" />}
        {arr?.x != null && <AirportBox x={arr.x} y={arr.y} label={arr.icao} variant="blue" anchor="right" />}
        {altn?.x != null && altn.icao !== arr.icao && (
          <AirportBox x={altn.x} y={altn.y} label={altn.icao} variant="yellow" anchor="top" />
        )}
      </svg>
    </div>
  );
}

function AirportBox({ x, y, label, variant = 'blue', anchor = 'right' }) {
  const W = 150;
  const H = 50;
  let bx;
  let by;
  if (anchor === 'left') {
    bx = x - W - 26;
    by = y - H / 2;
  } else if (anchor === 'top') {
    bx = x - W / 2;
    by = y - H - 28;
  } else {
    bx = x + 26;
    by = y - H / 2;
  }
  const stroke = variant === 'yellow' ? '#b8841c' : '#1d6fcb';
  const fill = variant === 'yellow' ? '#ffe16c' : '#dfeaf6';
  const text = variant === 'yellow' ? '#4a3a04' : '#0c3f76';

  return (
    <g>
      {/* anchor square at the airport coord */}
      <rect x={x - 11} y={y - 11} width={22} height={22} fill={stroke} stroke="#ffffff" strokeWidth={3} />
      {/* label box */}
      <rect x={bx} y={by} width={W} height={H} fill={fill} stroke={stroke} strokeWidth={4} rx={2} />
      <text
        x={bx + W / 2}
        y={by + H / 2 + 9}
        textAnchor="middle"
        fontSize="26"
        fontWeight="700"
        fontFamily="JetBrains Mono, monospace"
        fill={text}
      >
        {label}
      </text>
    </g>
  );
}
