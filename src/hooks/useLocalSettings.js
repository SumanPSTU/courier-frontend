import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_NOTIFICATION_PREFERENCES } from '../utils/notificationPreferences';

const PROFILE_SETTINGS_KEY = 'courier.profileSettings';

export const DEFAULT_SETTINGS = {
  ...DEFAULT_NOTIFICATION_PREFERENCES,
  pickupNote: '',
  compactLayout: false,
};

const readStoredSettings = () => {
  try {
    const raw = localStorage.getItem(PROFILE_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_SETTINGS };
    const next = { ...DEFAULT_SETTINGS };
    Object.keys(DEFAULT_SETTINGS).forEach((key) => {
      if (typeof parsed[key] === typeof DEFAULT_SETTINGS[key]) next[key] = parsed[key];
    });
    return next;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

export default function useLocalSettings() {
  const [settings, setSettings] = useState(readStoredSettings);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // The in-memory setting still applies when storage is unavailable.
    }
  }, [settings]);

  const updateSetting = useCallback((key, value) => {
    setSettings((current) => (key in DEFAULT_SETTINGS ? { ...current, [key]: value } : current));
  }, []);

  const resetSettings = useCallback(() => setSettings({ ...DEFAULT_SETTINGS }), []);

  return { settings, updateSetting, resetSettings };
}
