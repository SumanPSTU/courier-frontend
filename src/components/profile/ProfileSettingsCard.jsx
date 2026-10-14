import { useState } from 'react';
import { Bell, Check, Info, Languages, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { SectionCard, Spinner } from './ProfilePrimitives';
import { useLanguage } from '../../context/languageContextValue';
import { useNotifications } from '../../context/notificationContextValue';
import useLocalSettings from '../../hooks/useLocalSettings';

/** The four channel switches, kept in the same order as the profile settings list. */
const CHANNELS = [
  {
    key: 'emailOrderUpdates',
    label: 'Email me order updates',
    description: 'Order status changes and delivery attempts.',
  },
  {
    key: 'smsDeliveryAlerts',
    label: 'Text me delivery alerts',
    description: 'Rider arrival and failed-delivery alerts by SMS.',
  },
  {
    key: 'pickupReminders',
    label: 'Pickup reminders',
    description: 'A reminder if a scheduled pickup has not been collected.',
  },
  {
    key: 'offersAndNews',
    label: 'Offers and news',
    description: 'Seasonal offers and service announcements.',
  },
];

export default function ProfileSettingsCard({ settings, updateSetting, resetSettings }) {
  const { preferences, ready, updatePreference } = useNotifications();
  const { resetSettings: resetLocal } = useLocalSettings();
  const [savingKey, setSavingKey] = useState('');
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [noteDraft, setNoteDraft] = useState(settings.pickupNote || '');

  const toggle = async (key, value) => {
    setSavingKey(key);
    setError('');
    try {
      await updatePreference(key, value);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not save that preference. Please try again.');
    } finally {
      setSavingKey('');
    }
  };

  const saveNote = () => {
    updateSetting('pickupNote', noteDraft.trim());
    setNote('Default pickup note saved to this device.');
    window.setTimeout(() => setNote(''), 2600);
  };

  const handleReset = () => {
    resetSettings();
    resetLocal();
    setNoteDraft('');
    setNote('Preferences restored to their defaults.');
    window.setTimeout(() => setNote(''), 2600);
  };

  return (
    <SectionCard
      description="Notification channels are saved to your account. The pickup note and layout stay on this device."
      icon={SlidersHorizontal}
      title="Preferences"
      tone="primary"
    >
      <div className="mt-5 space-y-2">
        {CHANNELS.map((channel) => (
          <ToggleRow
            busy={savingKey === channel.key}
            description={channel.description}
            key={channel.key}
            label={channel.label}
            loading={!ready}
            onChange={(value) => toggle(channel.key, value)}
            value={Boolean(preferences[channel.key])}
          />
        ))}
        <ToggleRow
          description="Tighter spacing across this page for smaller screens."
          icon={SlidersHorizontal}
          label="Compact layout"
          onChange={(value) => updateSetting('compactLayout', value)}
          value={settings.compactLayout}
        />
      </div>

      {error && (
        <p className="mt-3 rounded-xl border border-error/20 bg-error-container/50 px-4 py-3 text-sm text-on-error-container">
          {error}
        </p>
      )}

      <div className="mt-5 border-t border-outline-variant/40 pt-5">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
            <Info aria-hidden="true" className="h-3.5 w-3.5 text-primary" /> Default pickup note
          </span>
          <textarea
            className="min-h-20 w-full resize-y rounded-xl border border-outline-variant/60 bg-surface px-3.5 py-2.5 text-base text-on-surface outline-none transition placeholder:text-outline/70 focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm"
            maxLength={200}
            onChange={(event) => setNoteDraft(event.target.value)}
            placeholder="e.g. Call before arriving, parcel is behind the counter"
            value={noteDraft}
          />
        </label>
        <p className="mt-1 text-right text-xs text-on-surface-variant">{noteDraft.length}/200</p>
        <button
          className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-5"
          disabled={noteDraft.trim() === (settings.pickupNote || '')}
          onClick={saveNote}
          type="button"
        >
          <Check aria-hidden="true" className="h-4 w-4" /> Save note
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-outline-variant/40 pt-5 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between">
        <p className="text-xs leading-relaxed text-on-surface-variant">
          Resets the device preferences on this page, including the pickup note. Notification channels stay as they are.
        </p>
        <button
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-outline-variant/60 bg-white px-4 py-2.5 text-sm font-bold text-error transition hover:bg-error-container/40"
          onClick={handleReset}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" /> Reset preferences
        </button>
      </div>

      {note && (
        <p className="mt-3 flex items-center gap-1.5 rounded-xl border border-[#2d5a27]/20 bg-[#d4edda] px-4 py-3 text-sm font-semibold text-[#2d5a27]">
          <Check aria-hidden="true" className="h-4 w-4 shrink-0" /> {note}
        </p>
      )}
    </SectionCard>
  );
}

export function LanguageCard() {
  return (
    <SectionCard
      description="Language applies across the whole site on this device."
      icon={Languages}
      title="Language"
    >
      <LanguageToggle />
    </SectionCard>
  );
}

function ToggleRow({ busy = false, description, icon: Icon = Bell, label, loading = false, onChange, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-outline-variant/35 bg-white/70 px-3.5 py-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-primary">
        <Icon aria-hidden="true" className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-on-surface">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-on-surface-variant">{description}</p>
      </div>
      {loading ? (
        <Spinner className="mt-0.5 h-6 w-6 text-outline" />
      ) : (
        <button
          aria-checked={value}
          aria-label={`${label}: ${value ? 'on' : 'off'}`}
          className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60 ${value ? 'bg-primary' : 'bg-outline/50'}`}
          disabled={busy}
          onClick={() => onChange(!value)}
          role="switch"
          type="button"
        >
          <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      )}
    </div>
  );
}

function LanguageToggle() {
  const { isBangla, toggleLanguage } = useLanguage();
  const [busy, setBusy] = useState(false);

  const handleToggle = () => {
    setBusy(true);
    toggleLanguage();
    window.setTimeout(() => setBusy(false), 400);
  };

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-xl border border-outline-variant/35 bg-surface px-4 py-4 min-[440px]:flex-row min-[440px]:items-center min-[440px]:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-bold text-on-surface">{isBangla ? 'বাংলা' : 'English'}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-on-surface-variant">
          {isBangla ? 'এখন ইন্টারফেস বাংলায় দেখানো হচ্ছে।' : 'Switch the interface language.'}
        </p>
      </div>
      <button
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-outline-variant/60 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-surface-container-low"
        onClick={handleToggle}
        type="button"
      >
        {busy ? <Spinner className="h-3.5 w-3.5" /> : <Languages aria-hidden="true" className="h-4 w-4" />}
        {isBangla ? 'Switch to English' : 'Switch to বাংলা'}
      </button>
    </div>
  );
}
