import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, BellOff, Check, CheckCheck, ChevronLeft, ChevronRight, Inbox, RefreshCw,
} from 'lucide-react';
import { notificationsApi } from '../api/notifications';
import { useNotifications } from '../context/notificationContextValue';
import { SectionCard, Spinner } from '../components/profile/ProfilePrimitives';
import { formatWhen, getTypeMeta, groupByDay } from '../components/notifications/notificationMeta';

const NOTIFICATIONS_PAGE_SIZE = 20;

export default function Notifications() {
  const { refresh, unreadCount } = useNotifications();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (targetPage = 1) => {
    setError('');
    try {
      const { data } = await notificationsApi.getAll({ page: targetPage, limit: NOTIFICATIONS_PAGE_SIZE });
      setItems(data.data || []);
      setPagination(data.pagination || { total: 0, page: 1, pages: 1 });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not load your notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => load(page), 0);
    return () => window.clearTimeout(timerId);
  }, [load, page]);

  const markAllAsRead = async () => {
    if (!unreadCount) return;
    setMarkingAll(true);
    setError('');
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

  const visible = onlyUnread ? items.filter((item) => !item.isRead) : items;

  return (
    <div className="min-h-full bg-[radial-gradient(ellipse_at_top,rgba(253,186,69,0.12),transparent_34rem)] px-3 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <SectionCard
          action={unreadCount > 0 ? (
            <button
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-outline-variant/60 bg-white px-3 py-2 text-xs font-bold text-primary transition hover:bg-surface-container-low disabled:cursor-wait disabled:opacity-60"
              disabled={markingAll}
              onClick={markAllAsRead}
              type="button"
            >
              {markingAll ? <Spinner className="h-3.5 w-3.5" /> : <CheckCheck aria-hidden="true" className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">Mark all read</span>
            </button>
          ) : null}
          description={unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.` : 'You are all caught up.'}
          icon={Bell}
          title="Notifications"
        >
          <NotificationFilters
            load={load}
            loading={loading}
            onlyUnread={onlyUnread}
            page={page}
            setLoading={setLoading}
            setOnlyUnread={setOnlyUnread}
          />
        </SectionCard>

        {error && (
          <p className="mt-4 rounded-xl border border-error/20 bg-error-container/50 px-4 py-3 text-sm text-on-error-container">
            {error}
          </p>
        )}

        <NotificationList
          items={items}
          loading={loading}
          onlyUnread={onlyUnread}
          visible={visible}
        />

        {pagination.pages > 1 && (
          <NotificationPagination
            loading={loading}
            page={page}
            pagination={pagination}
            setLoading={setLoading}
            setPage={setPage}
          />
        )}

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-on-surface-variant">
          <Check aria-hidden="true" className="h-3.5 w-3.5" />
          Choose which updates reach you from{' '}
          <Link className="font-bold text-primary hover:text-primary-container" to="/profile">
            Profile settings
          </Link>
        </p>
      </div>
    </div>
  );
}


function NotificationFilters({ load, loading, onlyUnread, page, setLoading, setOnlyUnread }) {
  return (
<div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition ${
                !onlyUnread ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
              onClick={() => setOnlyUnread(false)}
              type="button"
            >
              <Inbox aria-hidden="true" className="h-4 w-4" /> All
            </button>
            <button
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition ${
                onlyUnread ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
              onClick={() => setOnlyUnread(true)}
              type="button"
            >
              <Bell aria-hidden="true" className="h-4 w-4" /> Unread
            </button>
            <button
              aria-label="Refresh notifications"
              className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/60 bg-white text-on-surface-variant transition hover:bg-surface-container-low disabled:cursor-wait disabled:opacity-60"
              disabled={loading}
              onClick={() => { setLoading(true); load(page); }}
              type="button"
            >
              {loading
                ? <Spinner className="h-4 w-4" />
                : <RefreshCw aria-hidden="true" className="h-4 w-4" />}
            </button>
          </div>
  );
}

function NotificationList({ items, loading, onlyUnread, visible }) {
  return (
<div className="mt-4">
          {loading && items.length === 0 ? (
            <div className="flex items-center gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-low p-6 text-sm text-on-surface-variant">
              <Spinner className="h-5 w-5 text-primary" /> Loading your notifications…
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container text-outline">
                <BellOff aria-hidden="true" className="h-7 w-7" />
              </span>
              <h2 className="mt-4 font-syne text-lg font-bold text-on-surface">
                {onlyUnread ? 'No unread notifications' : 'No notifications yet'}
              </h2>
              <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-on-surface-variant">
                Order status changes and delivery updates will appear here once you book a delivery.
              </p>
              <Link
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-container"
                to="/book-delivery"
              >
                Book a delivery
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {groupByDay(visible).map((section) => (
                <section key={section.key}>
                  <h2 className="mb-2.5 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-outline">
                    {section.key}
                    <span aria-hidden="true" className="h-px flex-1 bg-outline-variant/40" />
                    <span className="text-primary">{section.items.length}</span>
                  </h2>
                  <ul className="space-y-2.5">
                    {section.items.map((notification) => {
                      const meta = getTypeMeta(notification.type);
                      const TypeIcon = meta.icon;
                      return (
                        <li key={notification._id}>
                          <Link
                            className={`flex items-start gap-3 rounded-xl border p-3.5 transition hover:border-primary/40 hover:bg-surface-container-low ${
                              notification.isRead
                                ? 'border-outline-variant/40 bg-surface-container-lowest'
                                : 'border-primary/20 bg-primary-fixed/15'
                            }`}
                            to={`/notifications/${notification._id}`}
                          >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.chip}`}>
                        <TypeIcon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className={`text-sm ${notification.isRead ? 'font-semibold text-on-surface-variant' : 'font-extrabold text-on-surface'}`}>
                            {notification.title}
                          </span>
                          {!notification.isRead && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                              New
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-on-surface-variant">{notification.message}</span>
                        <span className="mt-1 block font-mono text-[10px] text-outline">
                          {meta.label} · {formatWhen(notification.createdAt)}
                          {notification.order?.trackingId ? ` · ${notification.order.trackingId}` : ''}
                        </span>
                      </span>
                      {!notification.isRead && (
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      )}
                    </Link>
                          </li>
                        );
                      })}
                    </ul>
                </section>
              ))}
            </div>
          )}
        </div>
  );
}

function NotificationPagination({ loading, page, pagination, setLoading, setPage }) {
  return (
<div className="mt-5 flex items-center justify-between gap-3">
            <button
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-outline-variant/60 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
              disabled={loading || page <= 1}
              onClick={() => { setLoading(true); setPage((current) => Math.max(1, current - 1)); }}
              type="button"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" /> Previous
            </button>
            <span className="text-xs font-semibold text-on-surface-variant">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-outline-variant/60 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
              disabled={loading || page >= pagination.pages}
              onClick={() => { setLoading(true); setPage((current) => current + 1); }}
              type="button"
            >
              Next <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
  );
}
