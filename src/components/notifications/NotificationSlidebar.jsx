import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, BellOff, CheckCheck, RefreshCw, X } from 'lucide-react';
import { notificationsApi } from '../../api/notifications';
import { useNotifications } from '../../context/notificationContextValue';
import { Spinner } from '../profile/ProfilePrimitives';
import { formatWhen, getTypeMeta, groupByDay } from './notificationMeta';

const PREVIEW_LIMIT = 8;
export default function NotificationSlidebar({ isDesktop, onClose, open, triggerRef }) {
  const navigate = useNavigate();
  const dialogRef = useRef(null);
  const { adjustUnread, refresh, unreadCount } = useNotifications();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [markingAll, setMarkingAll] = useState(false);
  const [busyId, setBusyId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await notificationsApi.getAll({ page: 1, limit: PREVIEW_LIMIT });
      setItems(data.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not load your notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const timerId = window.setTimeout(load, 0);
    return () => window.clearTimeout(timerId);
  }, [open, load]);

  useEffect(() => {
    if (!open) return undefined;

    const dialog = dialogRef.current;
    const focusable = () => [...dialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter((element) => !element.hasAttribute('hidden'));
    const shouldFocusPanel = !isDesktop || document.activeElement === triggerRef.current;
    if (shouldFocusPanel) focusable()[0]?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || isDesktop) return;
      const elements = focusable();
      if (!elements.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isDesktop, onClose, open, triggerRef]);

  const sections = useMemo(() => groupByDay(items), [items]);

  const openItem = async (notification) => {
    onClose();
    if (notification.isRead) {
      navigate(`/notifications/${notification._id}`);
      return;
    }
    setBusyId(notification._id);
    try {
      await notificationsApi.markAsRead(notification._id);
      adjustUnread(-1);
    } catch {
      // A failed read must not block opening the detail view.
    } finally {
      setBusyId('');
      navigate(`/notifications/${notification._id}`);
      refresh();
    }
  };

  const markAllAsRead = async () => {
    if (!unreadCount) return;
    setMarkingAll(true);
    try {
      await notificationsApi.markAllAsRead();
      setItems((current) => current.map((item) => ({ ...item, isRead: true })));
      refresh();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not mark everything as read.');
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <>
      <button
        aria-label="Close notifications"
        className={`fixed inset-0 z-60 border-0 bg-[#1f1914]/40 p-0 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        type="button"
      />

      <aside
        aria-hidden={!open}
        aria-label="Notifications"
        aria-modal={isDesktop ? undefined : true}
        className={`fixed right-0 top-0 z-70 flex h-full w-full max-w-[25rem] flex-col border-l border-outline-variant/50 bg-surface shadow-[0_0_50px_-16px_rgba(31,25,20,0.4)] transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        id="notification-panel"
        inert={!open}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            <h2 className="font-syne text-base font-bold text-on-surface">Notifications</h2>
            <p className="mt-0.5 text-xs text-on-surface-variant">
              {unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up'}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              aria-label="Refresh notifications"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-container-low hover:text-primary disabled:cursor-wait disabled:opacity-60"
              disabled={loading}
              onClick={load}
              type="button"
            >
              {loading
                ? <Spinner className="h-4 w-4" />
                : <RefreshCw aria-hidden="true" className="h-4 w-4" />}
            </button>
            {unreadCount > 0 && (
              <button
                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold text-primary transition hover:bg-surface-container-low disabled:cursor-wait disabled:opacity-60"
                disabled={markingAll}
                onClick={markAllAsRead}
                type="button"
              >
                {markingAll
                  ? <Spinner className="h-3.5 w-3.5" />
                  : <CheckCheck aria-hidden="true" className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">Read all</span>
              </button>
            )}
            <button
              aria-label="Close notifications"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-container-low"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div aria-hidden="true" className="h-px bg-outline-variant/40" />

        {error && (
          <p className="border-b border-error/15 bg-error-container/40 px-4 py-2.5 text-xs text-on-error-container sm:px-5">
            {error}
          </p>
        )}

        <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4">
          {loading && items.length === 0 ? (
            <div className="flex items-center gap-3 px-2 py-6 text-sm text-on-surface-variant">
              <Spinner className="h-4 w-4 text-primary" /> Loading notifications…
            </div>
          ) : items.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container text-outline">
                <BellOff aria-hidden="true" className="h-7 w-7" />
              </span>
              <p className="mt-4 font-syne text-base font-bold text-on-surface">Nothing here yet</p>
              <p className="mx-auto mt-1.5 max-w-[14rem] text-sm leading-relaxed text-on-surface-variant">
                Order updates and delivery alerts will show up here.
              </p>
              <Link
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-container"
                onClick={onClose}
                to="/book-delivery"
              >
                Book a delivery <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section) => (
                <section key={section.key}>
                  <h3 className="mb-1.5 px-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-outline">
                    {section.key}
                  </h3>
                  <ul className="space-y-0.5">
                    {section.items.map((notification) => {
                      const meta = getTypeMeta(notification.type);
                      const TypeIcon = meta.icon;
                      return (
                        <li key={notification._id}>
                          <button
                            className={`flex w-full items-start gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-surface-container-low focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70 ${
                              notification.isRead ? '' : 'bg-primary-fixed/15'
                            }`}
                            disabled={busyId === notification._id}
                            onClick={() => openItem(notification)}
                            type="button"
                          >
                            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.chip}`}>
                              <TypeIcon aria-hidden="true" className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-baseline justify-between gap-2">
                                <span className={`text-sm leading-snug ${notification.isRead ? 'font-semibold text-on-surface-variant' : 'font-bold text-on-surface'}`}>
                                  {notification.title}
                                </span>
                                {!notification.isRead && (
                                  <span className="h-1.5 w-1.5 shrink-0 self-center rounded-full bg-primary" aria-hidden="true" />
                                )}
                              </span>
                              <span className="mt-0.5 block text-xs leading-relaxed text-on-surface-variant">
                                {notification.message}
                              </span>
                              <span className="mt-1 block font-mono text-[10px] text-outline">
                                {formatWhen(notification.createdAt)}
                                {notification.order?.trackingId ? ` · ${notification.order.trackingId}` : ''}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>

        <footer className="border-t border-outline-variant/40 p-3 sm:p-4">
          <Link
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white transition hover:bg-primary-container"
            onClick={onClose}
            to="/notifications"
          >
            <Bell aria-hidden="true" className="h-4 w-4" /> View all notifications
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </footer>
      </aside>
    </>
  );
}
