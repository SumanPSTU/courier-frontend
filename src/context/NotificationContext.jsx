import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { notificationsApi } from '../api/notifications';
import { useAuthContext } from './authContextValue';
import { NotificationContext } from './notificationContextValue';
import { DEFAULT_NOTIFICATION_PREFERENCES } from '../utils/notificationPreferences';

const POLL_INTERVAL_MS = 60000;

const defaultPreferences = DEFAULT_NOTIFICATION_PREFERENCES;

export function NotificationProvider({ children }) {
  const { auth } = useAuthContext();
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [ready, setReady] = useState(false);
  const mounted = useRef(true);

  useEffect(() => () => { mounted.current = false; }, []);

  // Reads the unread badge and the four channel switches in one pass.
  const refresh = useCallback(async () => {
    if (!auth) return;
    try {
      const [list, prefs] = await Promise.all([
        notificationsApi.getAll({ limit: 1 }),
        notificationsApi.getPreferences(),
      ]);
      if (!mounted.current) return;
      setUnreadCount(list.data.pagination?.unreadCount || 0);
      setPreferences({ ...defaultPreferences, ...prefs.data.data });
      setReady(true);
    } catch {
      // A failed poll must not clear the last known badge or block the page.
      if (mounted.current) setReady(true);
    }
  }, [auth]);

  useEffect(() => {
    if (!auth) return undefined;
    const initialRefresh = window.setTimeout(refresh, 0);
    const timer = window.setInterval(refresh, POLL_INTERVAL_MS);
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(initialRefresh);
      window.removeEventListener('focus', onFocus);
    };
  }, [auth, refresh]);

  const updatePreference = useCallback(async (key, value) => {
    const previous = preferences;
    // Optimistic so the switch never lags behind the tap.
    setPreferences((current) => ({ ...current, [key]: value }));
    try {
      const { data } = await notificationsApi.updatePreferences({ [key]: value });
      if (mounted.current) setPreferences({ ...defaultPreferences, ...data.data });
    } catch (error) {
      if (mounted.current) setPreferences(previous);
      throw error;
    }
  }, [preferences]);

  const adjustUnread = useCallback((delta) => {
    setUnreadCount((current) => Math.max(0, current + delta));
  }, []);

  // Signed-out users read as empty, so the badge never survives a logout.
  const value = useMemo(
    () => ({
      unreadCount: auth ? unreadCount : 0,
      preferences: auth ? preferences : defaultPreferences,
      ready: auth ? ready : true,
      refresh,
      updatePreference,
      adjustUnread,
    }),
    [auth, unreadCount, preferences, ready, refresh, updatePreference, adjustUnread]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
