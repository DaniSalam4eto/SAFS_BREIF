import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { copyToClipboard } from '../lib/clipboard.js';
import { useToast } from './Toast.jsx';

export default function CopyButton({ text, label = 'Copy', toastLabel = 'Copied' }) {
  const { push } = useToast();
  const [done, setDone] = useState(false);

  async function handle() {
    const ok = await copyToClipboard(text);
    push({ message: ok ? `${toastLabel}` : 'Copy failed', kind: ok ? 'good' : 'bad' });
    if (ok) {
      setDone(true);
      setTimeout(() => setDone(false), 1100);
    }
  }

  return (
    <button className="btn btn-sm" onClick={handle} title="Copy to clipboard">
      {done ? <Check size={14} /> : <Copy size={14} />}
      {label}
    </button>
  );
}
