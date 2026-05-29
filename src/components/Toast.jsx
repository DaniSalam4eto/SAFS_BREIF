import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ToastContext = createContext({ push: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((arr) => [...arr, { id, ...t }]);
    setTimeout(() => setToasts((arr) => arr.filter((x) => x.id !== id)), 2400);
  }, []);
  return (
    <ToastContext.Provider value={{ push, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

export function ToastHost() {
  const { toasts } = useContext(ToastContext);
  return (
    <div className="toast-host">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind === 'bad' ? 'bad' : ''}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
