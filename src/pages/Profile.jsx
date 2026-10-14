import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Bike, Box, Check, Copy, Gauge, IdCard, KeyRound, LogOut,
  PackageCheck, Search, ShieldCheck, UserCog,
} from 'lucide-react';
import { useAuthContext } from '../context/authContextValue';
import { authApi } from '../api/auth';
import useLocalSettings from '../hooks/useLocalSettings';
import ProfileHero, { QuickLinkCard, SupportCard } from '../components/profile/ProfileHero';
import ProfileDetailsForm from '../components/profile/ProfileDetailsForm';
import ProfilePhotoCard from '../components/profile/ProfilePhotoCard';
import ProfileSecurityCard from '../components/profile/ProfileSecurityCard';
import ProfileSettingsCard, { LanguageCard } from '../components/profile/ProfileSettingsCard';
import { InlineAlert, MetaRow, SectionCard } from '../components/profile/ProfilePrimitives';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'details', label: 'Personal details', icon: UserCog },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'preferences', label: 'Settings', icon: KeyRound },
];

const QUICK_LINKS = [
  {
    to: '/orders',
    icon: Box,
    description: { title: 'My orders', body: 'View shipment history and status' },
  },
  {
    to: '/tracking',
    icon: Search,
    description: { title: 'Track a parcel', body: 'Check a shipment’s latest progress' },
  },
  {
    to: '/book-delivery',
    icon: PackageCheck,
    description: { title: 'Book a delivery', body: 'Send a parcel with a new pickup' },
  },
  {
    to: '/apply-as-rider',
    icon: Bike,
    description: { title: 'Apply as a rider', body: 'Earn for every delivery you complete' },
  },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthContext();
  const { settings, updateSetting, resetSettings } = useLocalSettings();

  const [tab, setTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [loadToken, setLoadToken] = useState(0);

  const accountId = profile?.id || user?.id || user?._id || user?.sub;
  const compact = settings.compactLayout;
  const gap = compact ? 'gap-2.5 sm:gap-3' : 'gap-3 sm:gap-5';

  useEffect(() => {
    let active = true;
    authApi.getProfile()
      .then(({ data }) => {
        if (!active) return;
        const next = data.data;
        setProfile(next);
        setForm({
          name: next.name || '',
          email: next.email || '',
          phone: next.phone || '',
          address: next.address || '',
        });
        updateUser(next);
        setError('');
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'We could not load your profile. Please try again.');
      })
      .finally(() => {
        if (active) setLoadingProfile(false);
      });
    return () => { active = false; };
  }, [updateUser, loadToken]);

  const retryProfile = useCallback(() => {
    setError('');
    setLoadingProfile(true);
    setLoadToken((token) => token + 1);
  }, []);

  const applyProfile = useCallback((next) => {
    setProfile(next);
    updateUser(next);
  }, [updateUser]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
    setSuccess('');
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      // Email is fixed at registration, so it is deliberately never sent.
      const { data } = await authApi.updateProfile({
        name: form.name,
        phone: form.phone,
        address: form.address,
      });
      const next = data.data;
      setProfile(next);
      setForm({
        name: next.name || '',
        email: next.email || '',
        phone: next.phone || '',
        address: next.address || '',
      });
      updateUser(next);
      setSuccess('Your profile details have been saved.');
    } catch (requestError) {
      const validationMessage = requestError.response?.data?.errors?.find((item) => item.message)?.message;
      setError(validationMessage || requestError.response?.data?.message || 'We could not save your changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const copyAccountId = async () => {
    if (!accountId || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(String(accountId));
      setCopiedId(true);
      window.setTimeout(() => setCopiedId(false), 1800);
    } catch {
      setCopiedId(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const completion = useMemo(() => {
    const checks = [
      { label: 'Full name added', done: Boolean(form.name.trim()) },
      { label: 'Email verified on the account', done: Boolean(form.email.trim()) },
      { label: 'Phone number added', done: Boolean(form.phone.trim()) },
      { label: 'Delivery address added', done: Boolean(form.address.trim()) },
      { label: 'Profile photo added', done: Boolean(profile?.profileImage?.url) },
      { label: 'Two-step verification on', done: Boolean(profile?.twoFactorEnabled) },
    ];
    const done = checks.filter((check) => check.done).length;
    return { checks, done, total: checks.length, percent: Math.round((done / checks.length) * 100) };
  }, [form, profile]);

  return (
    <div className="min-h-full bg-[radial-gradient(ellipse_at_top,rgba(253,186,69,0.12),transparent_34rem)] px-2 py-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <ProfileHero
          accountId={accountId}
          onPhotoUpdated={applyProfile}
          profile={profile}
          user={user}
        />

        <div className={`mt-3 grid grid-cols-1 sm:mt-5 lg:mt-7 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-7 ${gap}`}>
          <ProfileSidebar
            completion={completion}
            setTab={setTab}
            tab={tab}
          />

          <div
            aria-labelledby={`profile-tab-${tab}`}
            className="flex flex-col gap-3 sm:gap-5"
            id={`profile-panel-${tab}`}
            role="tabpanel"
          >
            <ProfileOverviewTab
              accountId={accountId}
              copiedId={copiedId}
              copyAccountId={copyAccountId}
              error={error}
              loadingProfile={loadingProfile}
              profile={profile}
              tab={tab}
              user={user}
            />

            <ProfileDetailsTab
              applyProfile={applyProfile}
              completion={completion}
              error={error}
              form={form}
              loadingProfile={loadingProfile}
              profile={profile}
              retryProfile={retryProfile}
              saveProfile={saveProfile}
              saving={saving}
              success={success}
              tab={tab}
              updateField={updateField}
              user={user}
            />

            <ProfileSecurityTab
              applyProfile={applyProfile}
              handleLogout={handleLogout}
              profile={profile}
              setProfile={setProfile}
              tab={tab}
              user={user}
            />

            <ProfilePreferencesTab
              handleLogout={handleLogout}
              resetSettings={resetSettings}
              settings={settings}
              tab={tab}
              updateSetting={updateSetting}
            />
          </div>
        </div>

        <ProfileFooter
          profile={profile}
          user={user}
        />
      </div>
    </div>
  );
}

function ProfileOverviewTab({ accountId, copiedId, copyAccountId, error, loadingProfile, profile, tab, user }) {
  return (
tab === 'overview' && (
              <>
                {error && !loadingProfile && (
                  <InlineAlert>{error}</InlineAlert>
                )}

                <div className="grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 sm:gap-5">
                  {QUICK_LINKS.filter((link) => !(link.to === '/apply-as-rider' && (profile?.role || user?.role) === 'RIDER')).map((link) => (
                    <QuickLinkCard description={link.description} icon={link.icon} key={link.to} to={link.to} />
                  ))}
                </div>

                <SectionCard description="A quick reference for support and invoices." icon={IdCard} title="Account">
                  <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3">
                    <MetaRow icon={UserCog} label="Account role" value={(profile?.role || user?.role || 'customer').replaceAll('_', ' ')} />
                    <MetaRow icon={ShieldCheck} label="Two-step verification" value={profile?.twoFactorEnabled ? 'Enabled' : 'Not enabled'} />
                    <MetaRow icon={IdCard} label="Member since" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : '—'} />
                  </div>
                  {accountId && (
                    <div className="mt-3 flex flex-col items-stretch gap-3 rounded-xl border border-outline-variant/35 bg-surface px-4 py-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-outline">Account ID</p>
                        <p className="mt-1 break-all font-mono text-xs font-semibold text-on-surface">{accountId}</p>
                      </div>
                      <button
                        className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-outline-variant/60 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-surface-container-low min-[420px]:w-auto"
                        onClick={copyAccountId}
                        type="button"
                      >
                        {copiedId ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
                        {copiedId ? 'Copied' : 'Copy ID'}
                      </button>
                    </div>
                  )}
                </SectionCard>

                <SupportCard />
              </>
            )
  );
}

function ProfileDetailsTab({ applyProfile, completion, error, form, loadingProfile, profile, retryProfile, saveProfile, saving, success, tab, updateField, user }) {
  return (
tab === 'details' && (
              <>
                <ProfileDetailsForm
                  error={error}
                  form={form}
                  loading={loadingProfile}
                  onChange={updateField}
                  onRetry={retryProfile}
                  onSave={saveProfile}
                  profile={profile}
                  saving={saving}
                  success={success}
                />
                <SectionCard
                  description="Finish these to make pickups smoother and cut down support calls."
                  icon={Gauge}
                  title="Profile strength"
                >
                  <div className="mt-5 flex flex-col gap-4 min-[520px]:flex-row min-[520px]:items-center">
                    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center self-start">
                      <div className="absolute inset-0 rounded-full" style={{
                        background: `conic-gradient(#894d0d ${completion.percent * 3.6}deg, #feeadc 0deg)`,
                      }} />
                      <div className="absolute inset-2 flex items-center justify-center rounded-full bg-surface-container-lowest">
                        <span className="font-syne text-2xl font-extrabold text-on-surface">{completion.percent}%</span>
                      </div>
                    </div>
                    <ul className="grid min-w-0 flex-1 grid-cols-1 gap-2 min-[380px]:grid-cols-2">
                      {completion.checks.map((check) => (
                        <li
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm ${
                            check.done
                              ? 'border-[#2d5a27]/20 bg-[#d4edda]/60 text-[#2d5a27]'
                              : 'border-outline-variant/40 bg-surface text-on-surface-variant'
                          }`}
                          key={check.label}
                        >
                          <Check aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 ${check.done ? '' : 'opacity-30'}`} />
                          <span className="min-w-0 truncate font-semibold">{check.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SectionCard>
                <ProfilePhotoCard
                  hasImage={Boolean(profile?.profileImage?.url || user?.profileImage?.url)}
                  onUpdated={applyProfile}
                />
              </>
            )
  );
}

function ProfileSecurityTab({ applyProfile, handleLogout, profile, setProfile, tab, user }) {
  return (
tab === 'security' && (
              <>
                <ProfileSecurityCard
                  email={profile?.email || user?.email || ''}
                  enabled={Boolean(profile?.twoFactorEnabled)}
                  onChange={(next) => setProfile((current) => ({ ...current, twoFactorEnabled: next }))}
                />
                <ProfilePhotoCard
                  hasImage={Boolean(profile?.profileImage?.url || user?.profileImage?.url)}
                  onUpdated={applyProfile}
                />
                <SectionCard description="Signing out ends this session on this device." icon={LogOut} title="Session">
                  <button
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-error/30 bg-white px-4 py-2.5 text-sm font-bold text-error transition hover:bg-error-container/40 sm:w-auto sm:px-6"
                    onClick={handleLogout}
                    type="button"
                  >
                    <LogOut aria-hidden="true" className="h-4 w-4" /> Sign out
                  </button>
                </SectionCard>
              </>
            )
  );
}

function ProfilePreferencesTab({ handleLogout, resetSettings, settings, tab, updateSetting }) {
  return (
tab === 'preferences' && (
              <>
                <ProfileSettingsCard
                  resetSettings={resetSettings}
                  settings={settings}
                  updateSetting={updateSetting}
                />
                <LanguageCard />
                <SectionCard description="Ready to hand this device over to someone else?" icon={LogOut} title="Session">
                  <button
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-error/30 bg-white px-4 py-2.5 text-sm font-bold text-error transition hover:bg-error-container/40 sm:w-auto sm:px-6"
                    onClick={handleLogout}
                    type="button"
                  >
                    <LogOut aria-hidden="true" className="h-4 w-4" /> Sign out of this device
                  </button>
                </SectionCard>
              </>
            )
  );
}

function ProfileSidebar({ completion, setTab, tab }) {
  return (
<div className="lg:sticky lg:top-6 lg:self-start">
            <div
              aria-label="Profile sections"
              className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0"
              role="tablist"
            >
              {TABS.map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    aria-selected={active}
                    className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold transition lg:w-full lg:shrink ${
                      active
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                    id={`profile-tab-${item.id}`}
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    role="tab"
                    type="button"
                  >
                    <item.icon aria-hidden="true" className="h-4 w-4 shrink-0" /> {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-5 shadow-sm lg:block">
              <h2 className="font-syne text-base font-bold text-on-surface">Profile strength</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                {completion.percent}% complete
              </p>
              <div
                aria-label={`Profile ${completion.percent} percent complete`}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={completion.percent}
                className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-container"
                role="progressbar"
              >
                <div
                  className="h-full rounded-full bg-linear-to-r from-secondary-container to-primary transition-[width] duration-500"
                  style={{ width: `${completion.percent}%` }}
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
                Complete profiles get fewer support calls and faster rider verification.
              </p>
            </div>
          </div>
  );
}

function ProfileFooter({ profile, user }) {
  return (
<div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-secondary-container px-5 py-2.5 text-sm font-bold text-on-secondary-container shadow-md transition hover:bg-secondary-fixed sm:w-auto"
            to="/book-delivery"
          >
            Book a delivery <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </Link>
          <p className="text-center text-xs text-on-surface-variant sm:text-right">
            Signed in as {profile?.email || user?.email || 'this account'}.
          </p>
        </div>
  );
}
