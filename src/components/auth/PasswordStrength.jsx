import { Check, X } from 'lucide-react';

const RULES = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'lower', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { id: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { id: 'number', label: 'One number', test: (v) => /\d/.test(v) },
  { id: 'symbol', label: 'One symbol (!@#$…)', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const LEVELS = [
  { id: 0, label: 'Too weak', bar: 'w-0', text: 'text-error', chip: 'bg-error-container text-on-error-container' },
  { id: 1, label: 'Weak', bar: 'w-1/5', text: 'text-error', chip: 'bg-error-container text-on-error-container' },
  { id: 2, label: 'Fair', bar: 'w-2/5', text: 'text-secondary', chip: 'bg-secondary-fixed text-on-secondary-fixed' },
  { id: 3, label: 'Good', bar: 'w-3/5', text: 'text-primary', chip: 'bg-primary-fixed text-on-primary-fixed' },
  { id: 4, label: 'Strong', bar: 'w-4/5', text: 'text-primary', chip: 'bg-primary-fixed text-on-primary-fixed' },
  { id: 5, label: 'Very strong', bar: 'w-full', text: 'text-primary', chip: 'bg-primary text-on-primary' },
];

function scorePassword(value) {
  if (!value) return { score: 0, level: LEVELS[0] };
  const passed = RULES.filter((rule) => rule.test(value)).length;
  // 8-char minimum is mandatory, so start the scale once it is met.
  const score = value.length < 8 ? Math.min(passed, 1) : Math.max(2, passed);
  return { score, level: LEVELS[Math.min(score, 5)] };
}

export default function PasswordStrength({ value }) {
  const { level } = scorePassword(value);
  const showDetails = value.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container">
          <div className={`h-full rounded-full bg-primary transition-all duration-300 ${level.bar}`} />
        </div>
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide ${level.chip}`}
        >
          {level.label}
        </span>
      </div>

      {showDetails && (
        <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {RULES.map((rule) => {
            const passed = rule.test(value);
            return (
              <li
                className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
                  passed ? 'text-primary' : 'text-on-surface-variant/70'
                }`}
                key={rule.id}
              >
                {passed ? (
                  <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />
                ) : (
                  <X className="h-3.5 w-3.5 shrink-0 opacity-50" />
                )}
                <span className="truncate">{rule.label}</span>
              </li>
            );
          })}
        </ul>
      )}

      {!showDetails && (
        <p className="text-[11px] text-on-surface-variant">
          Use 8+ characters with upper and lower case letters, a number, and a symbol.
        </p>
      )}
    </div>
  );
}
