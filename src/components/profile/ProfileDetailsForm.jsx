import { Check, Lock, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { InlineAlert, SectionCard, Spinner } from './ProfilePrimitives';

const FIELDS = [
  { name: 'name', label: 'Full name', icon: UserRound, required: true, maxLength: 100, autoComplete: 'name' },
  { name: 'phone', label: 'Phone number', icon: Phone, type: 'tel', placeholder: '01XXXXXXXXX', autoComplete: 'tel' },
  { name: 'address', label: 'Delivery address', icon: MapPin, maxLength: 300, placeholder: 'House, road, area, district', autoComplete: 'street-address' },
];

export default function ProfileDetailsForm({ error, form, loading, onChange, onSave, onRetry, profile, saving, success }) {
  const canSave = Boolean(form.name.trim());

  return (
    <SectionCard
      description="These details are used on your bookings, invoices, and rider handovers."
      icon={UserRound}
      title="Personal details"
    >
      {loading ? (
        <div aria-live="polite" className="mt-5 flex items-center gap-3 rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
          <Spinner className="h-5 w-5 text-primary" /> Loading your profile details…
        </div>
      ) : profile ? (
        <form className="mt-5 space-y-4" onSubmit={onSave}>
          <div className="grid grid-cols-1 gap-3 min-[440px]:grid-cols-2 sm:gap-4">
            {FIELDS.map((field) => (
              <ProfileInput key={field.name} {...field} onChange={onChange} value={form[field.name]} />
            ))}
            <LockedEmail value={form.email} />
          </div>

          <InlineAlert>{error}</InlineAlert>
          {success && (
            <p className="flex items-center gap-2 rounded-xl border border-[#2d5a27]/20 bg-[#d4edda] px-4 py-3 text-sm font-semibold text-[#2d5a27]">
              <Check aria-hidden="true" className="h-4 w-4 shrink-0" /> {success}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-outline-variant/30 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-on-surface-variant">
              Changes apply to future deliveries. Past waybills keep their original details.
            </p>
            <button
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              disabled={saving || !canSave}
              type="submit"
            >
              {saving ? <><Spinner /> Saving…</> : <><Check aria-hidden="true" className="h-4 w-4" /> Save changes</>}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-5 rounded-xl border border-error/20 bg-error-container/40 p-4">
          <p aria-live="polite" className="text-sm text-on-error-container">
            {error || 'Profile details are unavailable right now.'}
          </p>
          <button
            className="mt-3 inline-flex min-h-10 items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-container"
            onClick={onRetry}
            type="button"
          >
            Try again
          </button>
        </div>
      )}
    </SectionCard>
  );
}

function LockedEmail({ value }) {
  return (
    <div className="block min-w-0">
      <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
        <Mail aria-hidden="true" className="h-3.5 w-3.5 text-primary" /> Email address
        <Lock aria-hidden="true" className="h-3 w-3 text-outline" />
      </span>
      <input
        aria-describedby="email-locked-hint"
        className="min-h-11 w-full cursor-not-allowed rounded-xl border border-outline-variant/40 bg-surface-container px-3.5 py-2.5 text-base text-on-surface-variant sm:text-sm"
        disabled
        readOnly
        tabIndex={-1}
        type="email"
        value={value || ''}
      />
      <p className="mt-1.5 flex items-start gap-1 text-xs leading-relaxed text-on-surface-variant">
        <Lock aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0" />
        <span id="email-locked-hint">Fixed at registration. Contact support if you need it changed.</span>
      </p>
    </div>
  );
}

function ProfileInput({ autoComplete, icon: Icon, label, maxLength, name, onChange, placeholder, required = false, type = 'text', value }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
        <Icon aria-hidden="true" className="h-3.5 w-3.5 text-primary" /> {label}
      </span>
      <input
        autoComplete={autoComplete}
        className="min-h-11 w-full rounded-xl border border-outline-variant/60 bg-surface px-3.5 py-2.5 text-base text-on-surface outline-none transition placeholder:text-outline/70 focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm"
        maxLength={maxLength}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}