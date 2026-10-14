import { useEffect, useState } from 'react';
import { ordersApi } from '../api/orders';
import { formatDateTime } from '../utils/format';
import { CATEGORY_LABELS, PAYMENT_LABELS, getStatusMeta } from '../utils/orderStatus';

export default function TrackingResult({ val, onOrderFound }) {
  const [order, setOrder] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let active = true;
    let hasReceivedResponse = false;
    let requestInFlight = false;
    const load = async () => {
      if (requestInFlight) return;
      requestInFlight = true;
      try {
        const { data } = await ordersApi.track(val);
        if (!active) return;
        const tracked = data.data || null;
        hasReceivedResponse = true;
        setOrder(tracked);
        onOrderFound?.(tracked);
        setState(tracked ? 'ready' : 'notfound');
      } catch (error) {
        if (!active) return;
        if (error.response?.status === 404) {
          hasReceivedResponse = true;
          setOrder(null);
          onOrderFound?.(null);
          setState('notfound');
        } else if (!hasReceivedResponse) {
          setState('error');
        }
      } finally {
        requestInFlight = false;
      }
    };

    load();
    const refreshTimer = window.setInterval(load, 30_000);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, [val, onOrderFound]);

  if (state === 'loading') {
    return <p className="mt-4 border-t border-surface-variant/80 pt-4 text-xs text-on-surface-variant">Loading tracking details for <strong className="break-all">{val}</strong>…</p>;
  }

  if (state === 'notfound' || state === 'error') {
    return (
      <div className="mt-4 border-t border-surface-variant/80 pt-4 text-left">
        <p className="rounded-2xl border border-error-container bg-surface-container-low p-4 text-xs text-error">
          {state === 'notfound' ? `No consignment found for “${val}”. Check the tracking ID and try again.` : 'Unable to load tracking details. Check your connection and try again.'}
        </p>
      </div>
    );
  }

  const statusMeta = getStatusMeta(order.status);
  const StatusIcon = statusMeta.icon;
  const history = Array.isArray(order.statusHistory) ? [...order.statusHistory].reverse() : [];
  const pickupAddress = order.pickupDetails?.address || 'Origin address pending';
  const deliveryAddress = order.deliveryDetails?.address || 'Destination address pending';
  const packageInfo = order.packageDetails || order.parcel || {};
  const weight = order.packageDetails?.weightKG ?? order.parcel?.actualWeight;
  const category = CATEGORY_LABELS[packageInfo.category] || 'Parcel';
  const paymentMethod = PAYMENT_LABELS[order.pricing?.paymentMethod] || 'Payment details unavailable';
  const codAmount = Number(order.pricing?.codAmount || 0);
  const paymentDetails = order.pricing?.paymentMethod === 'COD' && codAmount > 0
    ? `${paymentMethod} · COD ৳${codAmount.toLocaleString()}`
    : `${paymentMethod} · ${order.pricing?.paymentStatus || 'Payment status unavailable'}`;
  const vehicleLabels = { BIKE: 'Motorbike', CAR: 'Car', VAN: 'Van', FOOT: 'On foot' };

  return (
    <div className="mt-4 border-t border-surface-variant/80 pt-4 text-left">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 text-xs">
        <span className="break-all font-bold text-[#1f1914]">Parcel: <span className="font-mono font-extrabold text-primary">{order.trackingId}</span></span>
        <span className="inline-flex items-center gap-1 rounded-full border border-primary-fixed bg-primary-fixed/60 px-2 py-1 text-[11px] font-bold text-primary"><StatusIcon className="h-3 w-3" />{statusMeta.label}</span>
      </div>
      <div className="relative space-y-3 pl-6 text-xs">
        {history.length === 0 && <p className="text-[11px] text-on-surface-variant">No status events recorded yet.</p>}
        {history.map((entry, index) => {
          const meta = getStatusMeta(entry.status);
          const Icon = meta.icon;
          return (
            <div className="relative min-w-0" key={`${entry.status}-${entry.updatedAt || entry.timestamp}-${index}`}>
              <div className={`absolute -left-6 top-0 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${index === 0 ? 'bg-primary-container' : 'bg-primary'}`}><Icon className="h-2.5 w-2.5 text-white" /></div>
              <div className={`wrap-break-word font-bold ${index === 0 ? 'text-primary' : 'text-[#1f1914]'}`}>{meta.label}</div>
              <div className="wrap-break-word text-[10px] text-on-surface-variant">{formatDateTime(entry.updatedAt || entry.timestamp)}{entry.userRole ? ` • ${entry.userRole}` : ''}{entry.reason ? ` • ${entry.reason}` : ''}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-2">
        <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-3"><div className="font-mono text-[10px] font-bold uppercase text-outline">Origin / Pickup</div><p className="mt-0.5 wrap-break-word font-bold text-[#1f1914]">{pickupAddress}</p></div>
        <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-3"><div className="font-mono text-[10px] font-bold uppercase text-outline">Destination / Delivery</div><p className="mt-0.5 wrap-break-word font-bold text-[#1f1914]">{deliveryAddress}</p></div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-2">
        <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-3"><div className="font-mono text-[10px] font-bold uppercase text-outline">Package</div><p className="mt-0.5 wrap-break-word font-bold text-[#1f1914]">{weight ? `${weight} kg · ` : ''}{category}{packageInfo.description ? ` · ${packageInfo.description}` : ''}</p></div>
        <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-3"><div className="font-mono text-[10px] font-bold uppercase text-outline">Payment</div><p className="mt-0.5 wrap-break-word font-bold text-[#1f1914]">{paymentDetails}</p></div>
      </div>
      <div className="mt-2 rounded-xl border border-outline-variant/50 bg-surface-container-low p-3 text-[11px]">
        <div className="font-mono text-[10px] font-bold uppercase text-outline">Assigned courier</div>
        <p className="mt-0.5 wrap-break-word font-bold text-[#1f1914]">{order.rider?.name || 'Not assigned yet'}</p>
        {order.rider?.vehicleType && <p className="mt-0.5 text-on-surface-variant">{vehicleLabels[order.rider.vehicleType] || order.rider.vehicleType}</p>}
      </div>
    </div>
  );
}
