import { useEffect } from 'react';
import {
  Banknote,
  Barcode,
  Box,
  CalendarClock,
  Check,
  Copy,
  Download,
  ExternalLink,
  History,
  Layers,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Truck,
  User,
  Wallet,
  X,
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/format';
import {
  CATEGORY_LABELS,
  PAYMENT_LABELS,
  PAYMENT_STATUS_META,
  getStatusMeta,
} from '../../utils/orderStatus';
import DeliveryProgress from '../DeliveryProgress';
import StatusPill from './StatusPill';

function Section({ title, icon: Icon, children, aside }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h4 className="flex min-w-0 items-center gap-2 font-syne text-sm font-extrabold uppercase tracking-wide text-slate-900">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <span className="truncate">{title}</span>
        </h4>
        {aside}
      </div>
      {children}
    </section>
  );
}

function DetailRow({ label, value, strong }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className="shrink-0 text-[11px] font-medium text-stone-500">{label}</span>
      <span className={`text-right text-[11px] ${strong ? 'font-mono text-sm font-extrabold text-primary' : 'font-semibold text-slate-800'}`}>
        {value}
      </span>
    </div>
  );
}

function PriceRow({ label, value, tone = 'default', note }) {
  const tones = {
    default: 'text-slate-700',
    muted: 'text-stone-400',
    accent: 'text-primary',
    total: 'text-[#1f1914]',
  };
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="min-w-0 text-[11px] font-medium text-stone-500">
        {label}
        {note ? <span className="ml-1 font-mono text-[9px] uppercase text-stone-400">{note}</span> : null}
      </span>
      <span className={`shrink-0 font-mono text-[11px] font-bold ${tones[tone]}`}>{value}</span>
    </div>
  );
}

export default function OrderDetailDrawer({ order, onClose, onTrack }) {
  useEffect(() => {
    if (!order) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [order, onClose]);

  if (!order) return null;

  const meta = getStatusMeta(order.status);
  const pricing = order.pricing || {};
  const parcel = order.parcel || {};
  const packageDetails = order.packageDetails || {};
  const pickup = order.pickupDetails || {};
  const delivery = order.deliveryDetails || {};
  const pickupZone = order.pickupAddress || {};
  const deliveryZone = order.deliveryAddress || {};
  const rider = order.rider && typeof order.rider === 'object' ? order.rider : null;
  const customer = order.customer && typeof order.customer === 'object' ? order.customer : null;
  const dimensions = parcel.dimensions || {};
  const weight = parcel.actualWeight || packageDetails.weightKG || 0;
  const history = Array.isArray(order.statusHistory) ? [...order.statusHistory].reverse() : [];
  const paymentMeta = PAYMENT_STATUS_META[pricing.paymentStatus] || PAYMENT_STATUS_META.PENDING;

  return (
    <div className="fixed inset-0 z-70 flex items-end justify-end sm:items-stretch" role="dialog" aria-modal="true" aria-label={`Order ${order.trackingId}`}>
      <button aria-label="Close order details" className="absolute inset-0 h-full w-full cursor-default bg-[#1f1914]/45 backdrop-blur-sm" onClick={onClose} type="button" />

      <aside className="relative flex h-[92dvh] w-full animate-[slideUp_240ms_ease-out] flex-col overflow-hidden rounded-t-3xl bg-[#fff9f5] shadow-2xl sm:h-full sm:max-w-xl sm:animate-[slideIn_240ms_ease-out] sm:rounded-none">
        <div className={`h-1.5 w-full shrink-0 bg-linear-to-r ${meta.bar}`} />

        <header className="shrink-0 border-b border-stone-200 bg-white px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-400">Consignment Detail</span>
              <h3 className="truncate font-mono text-sm font-extrabold text-[#1f1914] sm:text-base lg:text-lg">{order.trackingId}</h3>
              <p className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <StatusPill size="sm" status={order.status} />
                <span className="min-w-0 truncate text-[11px] font-medium text-stone-500">{meta.label}</span>
              </p>
            </div>
            <button
              aria-label="Close"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 text-stone-500 transition hover:border-stone-300 hover:text-slate-900"
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
            <button
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-[11px] font-bold text-white shadow-md shadow-primary/25 transition hover:bg-primary-container"
              onClick={() => onTrack(order)}
              type="button"
            >
              <Truck className="h-3.5 w-3.5 shrink-0" /> Live Tracking
            </button>
            <button
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border border-stone-200 px-3.5 py-2 text-[11px] font-bold text-slate-700 transition hover:border-primary/50 hover:text-primary"
              onClick={() => {
                if (navigator.clipboard) navigator.clipboard.writeText(String(order.trackingId));
              }}
              type="button"
            >
              <Copy className="h-3.5 w-3.5 shrink-0" /> Copy ID
            </button>
            <button
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border border-stone-200 px-3.5 py-2 text-[11px] font-bold text-slate-700 transition hover:border-primary/50 hover:text-primary"
              onClick={() => window.print()}
              type="button"
            >
              <Download className="h-3.5 w-3.5 shrink-0" /> Print Waybill
            </button>
            <a
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border border-stone-200 px-3.5 py-2 text-[11px] font-bold text-slate-700 transition hover:border-primary/50 hover:text-primary"
              href={`/tracking?id=${encodeURIComponent(order.trackingId)}`}
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" /> Public Page
            </a>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
          <DeliveryProgress order={order} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                  <Navigation className="h-4 w-4" />
                </span>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">Origin</p>
              </div>
              <p className="wrap-break-word text-sm font-bold text-slate-900">{pickupZone.district || 'District not set'}</p>
              <p className="text-xs font-semibold text-slate-600">{pickupZone.area || '—'}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-stone-500">{pickup.address || '—'}</p>
              <div className="mt-2.5 space-y-1 border-t border-stone-100 pt-2.5">
                <p className="flex items-start gap-1.5 text-[11px] font-semibold text-slate-700">
                  <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-stone-400" /> <span className="min-w-0 wrap-break-word">{pickup.name || '—'}</span>
                </p>
                {pickup.phone && (
                  <a className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-primary" href={`tel:${pickup.phone}`}>
                    <Phone className="h-3.5 w-3.5 shrink-0" /> {pickup.phone}
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-tertiary text-white">
                  <MapPin className="h-4 w-4" />
                </span>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-tertiary">Destination</p>
              </div>
              <p className="wrap-break-word text-sm font-bold text-slate-900">{deliveryZone.district || 'District not set'}</p>
              <p className="text-xs font-semibold text-slate-600">{deliveryZone.area || '—'}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-stone-500">{delivery.address || '—'}</p>
              <div className="mt-2.5 space-y-1 border-t border-stone-100 pt-2.5">
                <p className="flex items-start gap-1.5 text-[11px] font-semibold text-slate-700">
                  <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-stone-400" /> <span className="min-w-0 wrap-break-word">{delivery.name || '—'}</span>
                </p>
                {delivery.phone && (
                  <a className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-tertiary" href={`tel:${delivery.phone}`}>
                    <Phone className="h-3.5 w-3.5 shrink-0" /> {delivery.phone}
                  </a>
                )}
              </div>
            </div>
          </div>

          <Section title="Parcel Manifest" icon={Box}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-stone-400">Category</p>
                <p className="mt-0.5 text-xs font-bold text-slate-800">{CATEGORY_LABELS[parcel.category] || CATEGORY_LABELS[packageDetails.category] || 'General Parcel'}</p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-stone-400">Actual Weight</p>
                <p className="mt-0.5 font-mono text-xs font-bold text-slate-800">{Number(weight).toFixed(2)} kg</p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-stone-400">Billable</p>
                <p className="mt-0.5 font-mono text-xs font-bold text-slate-800">
                  {Number(pricing.billableWeightKg || 0).toFixed(2)} kg
                </p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-stone-400">Dimensions</p>
                <p className="mt-0.5 font-mono text-xs font-bold text-slate-800">
                  {dimensions.length || 0} × {dimensions.width || 0} × {dimensions.height || 0} cm
                </p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-stone-400">Zone</p>
                <p className="mt-0.5 text-xs font-bold text-slate-800">{(pricing.zone || '—').replaceAll('_', ' ')}</p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-stone-400">Ledger</p>
                <p className="mt-0.5 text-xs font-bold text-slate-800">
                  {order.financialsSettled ? 'Settled' : 'Provisional'}
                </p>
              </div>
            </div>
            {(parcel.description || packageDetails.description) && (
              <p className="mt-3 rounded-xl border border-stone-200 bg-white p-3 text-xs leading-relaxed text-stone-600">
                {parcel.description || packageDetails.description}
              </p>
            )}
          </Section>

          <Section
            aside={
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${paymentMeta.className}`}>
                <Wallet className="h-3.5 w-3.5" />
                {paymentMeta.label}
              </span>
            }
            icon={Banknote}
            title="Charge Breakdown"
          >
            <div className="divide-y divide-stone-100">
              <PriceRow label="Base & distance fee" value={formatCurrency(pricing.baseFee || 0)} />
              <PriceRow label="Weight surcharge" value={formatCurrency(pricing.weightSurcharge || 0)} />
              {(order.serviceSpeedName || order.serviceSpeed) && <PriceRow label={order.serviceSpeedName || 'Delivery speed'} value={formatCurrency(pricing.speedFee ?? pricing.priorityFee ?? 0)} />}
              {(order.extraServices || []).map((service) => <PriceRow key={service.id} label={service.name} value={formatCurrency(service.fee || 0)} />)}
              <PriceRow label="COD handling fee" value={formatCurrency(pricing.codFee || 0)} />
              {Number(pricing.returnHandlingFee) > 0 && (
                <PriceRow label="Return handling" value={formatCurrency(pricing.returnHandlingFee)} tone="muted" />
              )}
              <PriceRow
                label="Payment method"
                tone="accent"
                value={PAYMENT_LABELS[pricing.paymentMethod] || pricing.paymentMethod || '—'}
              />
              <PriceRow label="Total delivery charge" tone="total" value={formatCurrency(pricing.deliveryFee || 0)} />
            </div>
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 sm:p-3.5">
              <DetailRow label="Parcel value (COD)" value={formatCurrency(pricing.codAmount || 0)} />
              <DetailRow label="Collected so far" value={formatCurrency(pricing.codAmountCollected || 0)} />
              <DetailRow
                label="Net payable to you"
                strong
                value={formatCurrency(pricing.netPayableToMerchant || 0)}
              />
            </div>
          </Section>

          {rider && (
            <Section title="Assigned Courier" icon={Truck}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-600 font-syne text-base font-bold text-white">
                    {(rider.name || 'R').slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{rider.name || 'Assigned courier'}</p>
                    <p className="truncate font-mono text-[11px] text-stone-500">{rider.email || rider.phone || 'Contact via dispatch desk'}</p>
                  </div>
                </div>
                {rider.phone && (
                  <a
                    className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-[11px] font-bold text-white transition hover:bg-teal-700"
                    href={`tel:${rider.phone}`}
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" /> Call
                  </a>
                )}
              </div>
            </Section>
          )}

          <Section
            aside={<span className="font-mono text-[10px] font-bold text-stone-400">{history.length} events</span>}
            icon={History}
            title="Status Audit Trail"
          >
            {history.length === 0 ? (
              <p className="text-xs text-stone-500">No status events recorded yet.</p>
            ) : (
              <ol className="relative space-y-4 border-l-2 border-stone-200 pl-5">
                {history.map((entry, index) => {
                  const entryMeta = getStatusMeta(entry.status);
                  const EntryIcon = entryMeta.icon;
                  return (
                    <li className="relative" key={`${entry.status}-${index}`}>
                      <span
                        className={`absolute -left-0 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${entryMeta.dot}`}
                      >
                        <EntryIcon className="h-2.5 w-2.5 text-white" />
                      </span>
                      <p className="text-xs font-bold text-slate-800">{entryMeta.label}</p>
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-stone-500">
                        <span className="inline-flex min-w-0 items-center gap-1">
                          <CalendarClock className="h-3 w-3 shrink-0" />
                          <span className="truncate">{formatDateTime(entry.updatedAt || entry.timestamp)}</span>
                        </span>
                        {entry.userRole && (
                          <span className="shrink-0 rounded bg-stone-100 px-1.5 py-0.5 uppercase">{entry.userRole}</span>
                        )}
                      </p>
                      {entry.reason && <p className="mt-0.5 text-[11px] wrap-break-word text-rose-700">Reason: {entry.reason}</p>}
                      {entry.notes && <p className="mt-0.5 text-[11px] wrap-break-word text-stone-600">Note: {entry.notes}</p>}
                    </li>
                  );
                })}
              </ol>
            )}
          </Section>

          <Section title="Waybill & Compliance" icon={ShieldCheck}>
            <div className="space-y-2.5">
              <DetailRow label="Tracking ID" value={order.trackingId} />
              <DetailRow label="Booked on" value={formatDateTime(order.createdAt)} />
              <DetailRow label="Last updated" value={formatDateTime(order.updatedAt || order.createdAt)} />
              {customer && <DetailRow label="Account" value={customer.email || customer.name || '—'} />}
              {Number(order.failedDeliveryAttempts) > 0 && (
                <DetailRow label="Failed delivery attempts" value={order.failedDeliveryAttempts} />
              )}
            </div>
            <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500">Digital Barcode</p>
              <div aria-hidden="true" className="flex h-14 max-w-full items-end gap-0.5 overflow-hidden">
                {String(order.trackingId || '').split('').map((char, index) => (
                  <span
                    className="w-0.75 shrink-0 rounded-sm bg-slate-800"
                    key={`${char}-${index}`}
                    style={{ height: `${30 + ((char.charCodeAt(0) + index * 7) % 26)}%`, opacity: char === char.toUpperCase() ? 1 : 0.6 }}
                  />
                ))}
              </div>
              <p className="break-all text-center font-mono text-xs font-extrabold tracking-widest text-slate-900">{order.trackingId}</p>
              <p className="flex items-center gap-1.5 text-center text-[10px] font-semibold text-stone-500">
                <Check className="h-3 w-3 shrink-0 text-emerald-600" /> Tamper-evident digital consignment label
              </p>
            </div>
          </Section>
        </div>

        <footer className="shrink-0 border-t border-stone-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p className="text-center text-[11px] text-stone-500 sm:text-left">
              Need help with this parcel?{' '}
              <a className="font-bold text-primary underline" href="tel:09612404040">Call 09612-404040</a>
            </p>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <button
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 px-3.5 py-2 text-[11px] font-bold text-slate-700 transition hover:border-stone-300 sm:flex-none"
                onClick={() => window.print()}
                type="button"
              >
                <Layers className="h-3.5 w-3.5 shrink-0" /> Print
              </button>
              <button
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-[11px] font-bold text-white transition hover:bg-primary-container sm:flex-none"
                onClick={() => onTrack(order)}
                type="button"
              >
                <Barcode className="h-3.5 w-3.5 shrink-0" /> Track Parcel
              </button>
            </div>
          </div>
        </footer>
      </aside>
    </div>
  );
}
