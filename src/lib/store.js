// Tiny in-memory + localStorage flight plan store.
// Tracks a single "active" flight (used by /plan and /new) plus a list of
// recent flights generated this session (shown on the dashboard).
import { useState, useCallback, useEffect } from 'react';

const KEY = 'safs.brief.flight.v1';
const LIST_KEY = 'safs.brief.flights.v1';
const MAX_RECENT = 25;

const activeListeners = new Set();
const listListeners = new Set();

export function loadFlight() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function loadFlights() {
  try {
    const raw = localStorage.getItem(LIST_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function persistActive(flight) {
  try {
    if (flight) localStorage.setItem(KEY, JSON.stringify(flight));
    else localStorage.removeItem(KEY);
  } catch { /* ignore */ }
  for (const l of activeListeners) l(flight);
}

function persistList(flights) {
  try { localStorage.setItem(LIST_KEY, JSON.stringify(flights)); } catch { /* ignore */ }
  for (const l of listListeners) l(flights);
}

function ensureId(flight) {
  if (flight.id) return flight;
  const id = `${flight.callsign || 'FLT'}-${flight.createdAt || Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  return { ...flight, id };
}

// Save a flight: make it active AND upsert it into the recent list.
export function saveFlight(flight) {
  if (!flight) { clearFlight(); return; }
  const f = ensureId(flight);
  persistActive(f);
  const list = loadFlights().filter((x) => x.id !== f.id);
  persistList([f, ...list].slice(0, MAX_RECENT));
}

// Clear just the active flight (keeps recent history).
export function clearFlight() {
  persistActive(null);
}

// Clear the recent list (and the active flight along with it).
export function clearFlights() {
  persistActive(null);
  persistList([]);
}

// Make an existing recent flight the active one (for View/Edit on a row).
export function setActiveFlight(id) {
  const f = loadFlights().find((x) => x.id === id);
  if (f) persistActive(f);
  return f || null;
}

export function useFlight() {
  const [flight, setFlightState] = useState(() => loadFlight());
  useEffect(() => {
    const onChange = (f) => setFlightState(f);
    activeListeners.add(onChange);
    return () => { activeListeners.delete(onChange); };
  }, []);
  const setFlight = useCallback((f) => {
    if (f) saveFlight(f); else clearFlight();
  }, []);
  return [flight, setFlight];
}

export function useFlights() {
  const [flights, setFlights] = useState(() => loadFlights());
  useEffect(() => {
    const onChange = (list) => setFlights(list);
    listListeners.add(onChange);
    return () => { listListeners.delete(onChange); };
  }, []);
  return flights;
}
