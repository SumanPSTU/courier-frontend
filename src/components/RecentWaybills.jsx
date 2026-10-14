import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { History, X } from 'lucide-react';

const WAYBILL_HISTORY_KEY = 'madisynthia:recent-waybills';
const MAX_ENTRIES = 4;

function readHistory() {
  try {
    const raw = window.localStorage.getItem(WAYBILL_HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((v) => typeof v === 'string' && v.trim()).slice(0, MAX_ENTRIES)
      : [];
  } catch {
    // Private mode or a corrupted entry should never break tracking.
    return [];
  }
}

function writeHistory(entries) {
  try {
    window.localStorage.setItem(WAYBILL_HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // Storage may be unavailable; history is a convenience, not a requirement.
  }
}

/**
 * Recent waybills the visitor has tracked, persisted locally. The parent owns
 * the query, so the submit handler records through the exposed `record` ref.
 */
const RecentWaybills = forwardRef(function RecentWaybills({ onSelect }, ref) {
  // Read once on mount; this is a client-only SPA, so there is no SSR window.
  const [entries, setEntries] = useState(readHistory);

  const record = useCallback((value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setEntries((prev) => {
      const next = [trimmed, ...prev.filter((v) => v.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_ENTRIES);
      writeHistory(next);
      return next;
    });
  }, []);

  useImperativeHandle(ref, () => ({ record }), [record]);

  const dismiss = (event, value) => {
    event.stopPropagation();
    setEntries((prev) => {
      const next = prev.filter((v) => v !== value);
      writeHistory(next);
      return next;
    });
  };

  const clearAll = () => {
    setEntries([]);
    writeHistory([]);
  };

  if (entries.length === 0) {
    return (
      <p className="mt-4 flex items-start gap-1.5 border-t border-surface-variant/80 pt-4 text-[11px] leading-relaxed text-on-surface-variant">
        <History className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Waybills you track will appear here for one-tap access next time.</span>
      </p>
    );
  }

  return (
    <div className="mt-4 border-t border-surface-variant/80 pt-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-outline">
          <History className="h-3.5 w-3.5" aria-hidden="true" /> Recently tracked
        </span>
        <button
          className="font-mono text-[10px] font-bold uppercase text-on-surface-variant transition hover:text-primary"
          onClick={clearAll}
          type="button"
        >
          Clear
        </button>
      </div>
      <ul className="flex flex-wrap items-center gap-2">
        {entries.map((value) => (
          <li key={value}>
            <span className="relative inline-flex items-center rounded-lg border border-outline-variant bg-surface-container-low">
              <button
                className="py-1.5 pl-3 pr-7 font-mono text-xs font-medium text-primary transition-colors hover:text-primary-container"
                onClick={() => onSelect(value)}
                type="button"
              >
                {value}
              </button>
              <button
                aria-label={`Remove ${value} from history`}
                className="absolute right-1 flex h-4 w-4 items-center justify-center rounded text-outline transition hover:bg-surface-container hover:text-primary"
                onClick={(event) => dismiss(event, value)}
                type="button"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default RecentWaybills;
