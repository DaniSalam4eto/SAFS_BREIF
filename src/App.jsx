import { useEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { LayoutDashboard, PlaneTakeoff, ClipboardList, Map, Plane } from 'lucide-react';
import Dashboard from './pages/Dashboard.jsx';
import NewFlight from './pages/NewFlight.jsx';
import ViewFlightPlan from './pages/ViewFlightPlan.jsx';
import Charts from './pages/Charts.jsx';
import { ToastHost, ToastProvider } from './components/Toast.jsx';

export default function App() {
  return (
    <ToastProvider>
      <div className="app">
        <Sidebar />
        <div className="main">
          <Topbar />
          <main className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/new" element={<NewFlight />} />
              <Route path="/plan" element={<ViewFlightPlan />} />
              <Route path="/charts" element={<Charts />} />
              <Route path="/charts/:icao" element={<Charts />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
        <ToastHost />
      </div>
    </ToastProvider>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img className="brand-mark" src="/safs_breif.png" alt="SAFS Brief" />
        <span>SAFS Brief</span>
      </div>
      <nav className="nav">
        <NavLink to="/" end><LayoutDashboard size={16} /> Dashboard</NavLink>
        <NavLink to="/new"><PlaneTakeoff size={16} /> New Flight</NavLink>
        <NavLink to="/plan"><ClipboardList size={16} /> View Flight Plan</NavLink>
        <NavLink to="/charts"><Map size={16} /> Charts</NavLink>
      </nav>
      <div className="sidebar-footer">
        <Clock />
        <div className="footer-block">© SAFS Brief  not for real-world navigation.</div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <Plane size={16} />
        <span>SAFS Brief Dispatch</span>
      </div>
      <span className="user-chip">Pilot · SAFS</span>
    </header>
  );
}

function Clock() {
  const [now, setNow] = useState(() => formatUtc(new Date()));
  useEffect(() => {
    const id = setInterval(() => setNow(formatUtc(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return <div className="mono">{now}</div>;
}

function formatUtc(d) {
  const dd = d.getUTCDate().toString().padStart(2, '0');
  const mon = d.toLocaleString('en', { month: 'short' });
  const y = d.getUTCFullYear();
  const hh = d.getUTCHours().toString().padStart(2, '0');
  const mm = d.getUTCMinutes().toString().padStart(2, '0');
  const ss = d.getUTCSeconds().toString().padStart(2, '0');
  return `${dd} ${mon} ${y} · ${hh}:${mm}:${ss} UTC`;
}
