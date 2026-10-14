export function SectionCard({ action, children, description, icon: Icon, title, tone = 'default' }) {
  const isPrimary = tone === 'primary';
  return (
    <section
      className={`rounded-2xl border p-3 shadow-sm transition sm:p-6 ${
        isPrimary
          ? 'border-primary/25 bg-linear-to-br from-surface-container-low to-[#f9e6d4]'
          : 'border-outline-variant/50 bg-surface-container-lowest'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
          {Icon && (
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl ${
                isPrimary ? 'bg-white/80 text-primary shadow-sm' : 'bg-surface-container-low text-primary'
              }`}
            >
              <Icon aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="font-syne text-base font-bold text-on-surface sm:text-xl">{title}</h2>
            {description && <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{description}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}

export function StatusPill({ children, tone = 'neutral' }) {
  const tones = {
    positive: 'border-[#2d5a27]/20 bg-[#d4edda] text-[#2d5a27]',
    negative: 'border-error/20 bg-error-container/50 text-on-error-container',
    primary: 'border-primary/25 bg-primary-fixed/45 text-primary',
    neutral: 'border-outline-variant/60 bg-surface text-on-surface-variant',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function InlineAlert({ children, tone = 'error' }) {
  if (!children) return null;
  const isError = tone === 'error';
  return (
    <p
      aria-live="polite"
      className={`rounded-xl border px-4 py-3 text-sm ${
        isError
          ? 'border-error/20 bg-error-container/50 text-on-error-container'
          : 'border-[#2d5a27]/20 bg-[#d4edda] font-semibold text-[#2d5a27]'
      }`}
    >
      {children}
    </p>
  );
}

export function MetaRow({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-xl border border-outline-variant/35 bg-surface px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-primary">
        <Icon aria-hidden="true" className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-outline">{label}</p>
        <p className="mt-1 wrap-break-word text-sm font-semibold text-on-surface">{value}</p>
      </div>
    </div>
  );
}

export function Spinner({ className = 'h-4 w-4' }) {
  return <span className={`${className} inline-block animate-spin rounded-full border-2 border-current/25 border-t-current`} />;
}
