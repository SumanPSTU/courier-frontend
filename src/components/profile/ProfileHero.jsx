import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Check, CircleHelp, ShieldCheck, UserRound } from 'lucide-react';
import { Spinner, StatusPill } from './ProfilePrimitives';
import useProfileImageUpload, { PROFILE_IMAGE_TYPES } from '../../hooks/useProfileImageUpload';
import { API_ORIGIN } from '../../api/config';

export default function ProfileHero({ accountId, onPhotoUpdated, profile, user }) {
  const { inputRef, busy, error, upload } = useProfileImageUpload({ onUpdated: onPhotoUpdated });

  const displayName = profile?.name || user?.name || user?.sub || 'Courier customer';
  const initials = displayName
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
  const role = (profile?.role || user?.role || 'customer').toLowerCase().replaceAll('_', ' ');
  const profileImageUrl = profile?.profileImage?.url || user?.profileImage?.url || '';
  const imageSrc = !profileImageUrl
    ? ''
    : profileImageUrl.startsWith('http') ? profileImageUrl : `${API_ORIGIN}${profileImageUrl}`;
  const approved = profile?.isApproved !== false;

  return (
    <section className="relative isolate overflow-hidden rounded-2xl border border-[#3a2b20] bg-linear-to-br from-[#241a13] via-[#302116] to-[#4b2b16] text-white shadow-xl shadow-[#4a2a14]/15 sm:rounded-3xl">
      <div aria-hidden="true" className="absolute -right-16 -top-28 -z-10 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-32 left-1/3 -z-10 h-64 w-64 rounded-full bg-secondary/30 blur-3xl" />

      <div className="flex flex-col gap-3 p-3 sm:gap-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-9">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <div className="relative shrink-0">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-secondary-container to-primary text-2xl font-extrabold text-on-primary shadow-lg shadow-black/20 ring-4 ring-white/10 sm:h-24 sm:w-24 sm:rounded-3xl sm:text-4xl">
              {imageSrc
                ? <img alt={`${displayName} profile photo`} className="h-full w-full object-cover" src={imageSrc} />
                : initials || <UserRound aria-hidden="true" className="h-8 w-8 sm:h-10 sm:w-10" />}
            </div>
            <button
              aria-label={imageSrc ? 'Change your profile photo' : 'Upload a profile photo'}
              className="absolute -bottom-1.5 -right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow-lg ring-2 ring-[#241a13] transition hover:bg-surface-container-low disabled:cursor-wait disabled:opacity-60"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              {busy ? <Spinner className="h-4 w-4" /> : <Camera aria-hidden="true" className="h-4 w-4" />}
            </button>
            <input
              accept={PROFILE_IMAGE_TYPES.join(',')}
              className="sr-only"
              onChange={(event) => upload(event.target.files?.[0])}
              ref={inputRef}
              type="file"
            />
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <StatusPill tone="primary">
                <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> {approved ? 'Active' : 'Pending'}
              </StatusPill>
              {profile?.twoFactorEnabled && (
                <StatusPill tone="positive">
                  <Check aria-hidden="true" className="h-3.5 w-3.5" /> 2FA on
                </StatusPill>
              )}
            </div>
            <h1 className="text-balance wrap-break-word font-syne text-xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              {displayName}
            </h1>
            <p className="mt-1 break-all text-xs text-white/65 sm:truncate sm:text-sm">
              {profile?.email || user?.email || 'Add an email to your account'}
            </p>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-[11px]">
              {role} account
            </p>
          </div>
        </div>

        {accountId && (
          <dl className="grid w-full shrink-0 grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:w-auto sm:min-w-[16rem]">
            <Stat label="Account type" value={role} capitalize />
            <Stat label="Status" value={approved ? 'Active' : 'Pending'} tone="positive" />
            <Stat
              className="col-span-2"
              label="Member since"
              value={profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
                : '—'}
            />
          </dl>
        )}
      </div>

      {error && (
        <p className="mx-4 mb-4 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white sm:mx-7 lg:mx-9">
          {error}
        </p>
      )}
    </section>
  );
}

function Stat({ capitalize = false, className = '', label, tone, value }) {
  return (
    <div className={`bg-[#2c2018]/70 px-4 py-3 ${className}`}>
      <dt className="font-mono text-[10px] uppercase tracking-widest text-white/45">{label}</dt>
      <dd className={`mt-1 text-sm font-semibold ${tone === 'positive' ? 'text-[#b8e2ae]' : 'text-white'} ${capitalize ? 'capitalize' : ''}`}>
        {value}
      </dd>
    </div>
  );
}

export function QuickLinkCard({ description, icon: Icon, to }) {
  return (
    <Link
      className="group flex min-w-0 items-center gap-2 rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:gap-4 sm:rounded-2xl sm:p-5"
      to={to}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary sm:h-12 sm:w-12 sm:rounded-xl">
        <Icon aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-bold leading-tight text-on-surface sm:font-syne sm:text-lg">{description.title}</span>
        <span className="mt-0.5 hidden text-sm text-on-surface-variant sm:block">{description.body}</span>
      </span>
      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-outline transition group-hover:translate-x-1 group-hover:text-primary sm:h-4 sm:w-4" />
    </Link>
  );
}

export function SupportCard() {
  return (
    <div className="rounded-2xl border border-primary/15 bg-linear-to-br from-surface-container-low to-[#f7e4d2] p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-primary shadow-sm">
          <CircleHelp aria-hidden="true" className="h-5 w-5" />
        </span>
        <h2 className="font-syne text-base font-bold text-on-surface sm:text-lg">Need a hand?</h2>
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-on-surface-variant">
        Our team can help with your account or an active delivery.
      </p>
      <a
        className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary hover:text-primary-container"
        href="tel:09612404040"
      >
        Call 09612-404040
      </a>
    </div>
  );
}
