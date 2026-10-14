import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Bell, Box, Check, ChevronRight, MapPin, Package, Phone, Truck, User, Wallet,
} from 'lucide-react';
import { notificationsApi } from '../api/notifications';
import { useNotifications } from '../context/notificationContextValue';
import { SectionCard, Spinner, StatusPill } from '../components/profile/ProfilePrimitives';
import { formatDateTime, formatMoney, getTypeMeta } from '../components/notifications/notificationMeta';

export default function NotificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adjustUnread, refresh } = useNotifications();

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await notificationsApi.getById(id);
      const item = data.data;
      setNotification(item);
      if (!item.isRead) {
        await notificationsApi.markAsRead(id);
        setNotification((current) => ({ ...current, isRead: true }));
        adjustUnread(-1);
        refresh();
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not open that notification.');
    } finally {
      setLoading(false);
    }
  }, [id, adjustUnread, refresh]);

  useEffect(() => {
    const timerId = window.setTimeout(load, 0);
    return () => window.clearTimeout(timerId);
  }, [load]);

  if (loading) {
    return (
      <Frame>
        <div className="flex items-center gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-low p-6 text-sm text-on-surface-variant">
          <Spinner className="h-5 w-5 text-primary" /> Opening notification…
        </div>
      </Frame>
    );
  }

  if (error || !notification) {
    return (
      <Frame>
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-10 text-center">
          <h1 className="font-syne text-lg font-bold text-on-surface">Notification unavailable</h1>
          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-on-surface-variant">
            {error || 'That notification does not exist, or it belongs to another account.'}
          </p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-container"
            to="/notifications"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to notifications
          </Link>
        </div>
      </Frame>
    );
  }

  const meta = getTypeMeta(notification.type);
  const order = notification.order;
  const history = Array.isArray(order?.statusHistory) ? [...order.statusHistory].reverse() : [];

  return (
    <Frame>
      <SectionCard
        action={<StatusPill tone={notification.isRead ? 'neutral' : 'primary'}>{notification.isRead ? 'Read' : 'New'}</StatusPill>}
        description={meta.label}
        icon={BellIcon}
        title={notification.title}
      >
        <p className="mt-4 text-sm leading-relaxed text-on-surface sm:text-base">{notification.message}</p>
        <dl className="mt-4 grid grid-cols-1 gap-3 min-[440px]:grid-cols-2">
          <Detail label="Type" value={meta.label} />
          <Detail label="Received" value={formatDateTime(notification.createdAt)} />
        </dl>
      </SectionCard>

      {order && (
        <>
          <SectionCard
            description="The delivery this update refers to."
            icon={Box}
            title="Linked delivery"
          >
            <div className="mt-5 flex flex-col gap-4 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-outline">Tracking ID</p>
                <p className="mt-1 break-all font-mono text-lg font-bold text-on-surface">{order.trackingId}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  <Truck aria-hidden="true" className="h-4 w-4" />
                  {String(order.status || '').replaceAll('_', ' ')}
                </p>
              </div>
              <Link
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-container"
                to={`/tracking?trackingId=${encodeURIComponent(order.trackingId)}`}
              >
                Track parcel <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            {Number(order.failedDeliveryAttempts) > 0 && (
              <p className="mt-4 rounded-xl border border-error/20 bg-error-container/40 px-4 py-3 text-sm text-on-error-container">
                Delivery has been attempted {order.failedDeliveryAttempts} time{order.failedDeliveryAttempts === 1 ? '' : 's'} so far.
              </p>
            )}

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PartyCard
                address={order.pickupAddress}
                details={order.pickupDetails}
                icon={MapPin}
                title="Pickup"
              />
              <PartyCard
                address={order.deliveryAddress}
                details={order.deliveryDetails}
                icon={Package}
                title="Delivery"
              />
            </div>
          </SectionCard>

          {history.length > 0 && (
            <SectionCard description="Every recorded change, newest first." icon={Truck} title="Progress history">
              <ol className="mt-5 space-y-0">
                {history.map((entry, index) => (
                  <li className="relative flex gap-3 pb-5 last:pb-0" key={`${entry.status}-${index}`}>
                    {index < history.length - 1 && (
                      <span aria-hidden="true" className="absolute left-[0.6875rem] top-6 h-full w-px bg-outline-variant" />
                    )}
                    <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                      <Check aria-hidden="true" className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-on-surface">{String(entry.status || '').replaceAll('_', ' ')}</p>
                      <p className="mt-0.5 text-xs text-on-surface-variant">
                        {formatDateTime(entry.timestamp || entry.updatedAt)}
                        {entry.userRole ? ` · ${entry.userRole}` : ''}
                      </p>
                      {entry.reason && <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">{entry.reason}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </SectionCard>
          )}
        </>
      )}

      {order?.rider && (
        <SectionCard description="Assigned to this delivery." icon={Truck} title="Rider">
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed text-secondary">
              <User aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-on-surface">{order.rider.name}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-on-surface-variant">
                {order.rider.vehicleType && (
                  <span className="font-semibold uppercase">{order.rider.vehicleType}</span>
                )}
                {order.rider.phone && (
                  <a className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary-container" href={`tel:${order.rider.phone}`}>
                    <Phone aria-hidden="true" className="h-3.5 w-3.5" /> {order.rider.phone}
                  </a>
                )}
              </p>
            </div>
          </div>
        </SectionCard>
      )}

      {notification.metadata?.totalAmount != null && (
        <SectionCard description="Amount associated with this update." icon={Wallet} title="Amount">
          <p className="mt-4 font-syne text-2xl font-extrabold text-on-surface">
            {formatMoney(notification.metadata.totalAmount)}
          </p>
        </SectionCard>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/60 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-surface-container-low sm:w-auto"
          onClick={() => navigate(-1)}
          type="button"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Go back
        </button>
        <Link
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-container sm:w-auto sm:px-6"
          to="/notifications"
        >
          All notifications <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </Frame>
  );
}

function Frame({ children }) {
  return (
    <div className="min-h-full bg-[radial-gradient(ellipse_at_top,rgba(253,186,69,0.12),transparent_34rem)] px-3 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-5">
        {children}
      </div>
    </div>
  );
}

function BellIcon({ className = 'h-5 w-5' }) {
  return <Bell aria-hidden="true" className={className} />;
}

function Detail({ label, value }) {
  return (
    <div className="rounded-xl border border-outline-variant/35 bg-surface px-3.5 py-3">
      <dt className="font-mono text-[10px] font-semibold uppercase tracking-wider text-outline">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-on-surface">{value}</dd>
    </div>
  );
}

function PartyCard({ address, details, icon: Icon, title }) {
  return (
    <div className="rounded-xl border border-outline-variant/40 bg-surface p-4">
      <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-outline">
        <Icon aria-hidden="true" className="h-3.5 w-3.5 text-primary" /> {title}
      </p>
      <p className="mt-2 text-sm font-bold text-on-surface">{details?.name || '—'}</p>
      {details?.phone && (
        <p className="mt-0.5 text-sm text-on-surface-variant">{details.phone}</p>
      )}
      {details?.address && (
        <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">{details.address}</p>
      )}
      {(address?.area || address?.district) && (
        <p className="mt-1.5 text-xs font-semibold text-primary">
          {[address?.area, address?.district].filter(Boolean).join(', ')}
        </p>
      )}
    </div>
  );
}
