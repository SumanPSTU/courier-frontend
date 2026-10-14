export const inputClass = 'min-h-11 w-full rounded-xl border border-outline-variant/60 bg-surface px-3.5 py-2.5 text-base text-on-surface outline-none transition placeholder:text-outline/70 focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm';

export default function TextField({
  autoComplete, className = '', hint, icon: Icon, inputMode, label, max, min,
  name, onChange, pattern, placeholder, required = false, step, type = 'text', value,
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
        {label} {required && <span className="text-error">*</span>}
      </span>
      <span className="relative block">
        {Icon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-outline"><Icon aria-hidden="true" className="h-4 w-4" /></span>}
        <input
          autoComplete={autoComplete}
          className={`${inputClass} ${Icon ? 'pl-10 pr-3.5' : ''}`}
          inputMode={inputMode}
          max={max}
          min={min}
          name={name}
          onChange={onChange}
          pattern={pattern}
          placeholder={placeholder}
          required={required}
          step={step}
          type={type}
          value={value}
        />
      </span>
      {hint && <span className="mt-1 block font-mono text-[10px] font-medium text-on-surface-variant">{hint}</span>}
    </label>
  );
}
