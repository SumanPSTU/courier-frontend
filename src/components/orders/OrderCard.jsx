import { useState } from 'react';
import {
  ArrowRight,
  Banknote,
  Box,
  CalendarDays,
  Check,
  Copy,
  Layers,
  MapPin,
  Navigation,
  Phone,
  Receipt,
  Scale,
  Truck,
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/format';
import { CATEGORY_LABELS, PAYMENT_LABELS, getStatusMeta } from '../../utils/orderStatus';
import DeliveryProgress from '../DeliveryProgress';
import StatusPill from './StatusPill';

function MetaChip({ icon: Icon, label, value, tone = 'default' }) {
  const tones = {
    default: 'border-stone-200 bg-stone-50 text-slate-700',
    accent: 'border-amber-200 bg-amber-50 text-primary',
  };
  return (
    <span className={`inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-semibold ${tones[tone]}`}>
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
      {value ? <span className="shrink-0 text-stone-400">{label}</span> : null}
      <span className="min-w-0 truncate">{value || label}</span>
    </span>
  );
}

export default function OrderCard({ order, onOpen, onTrack }) {
  const [copied, setCopied] = useState(false);
  const meta = getStatusMeta(order.status);
  const pricing = order.pricing || {};
  const parcel = order.parcel || {};
  const packageDetails = order.packageDetails || {};
  const pickup = order.pickupDetails || {};
  const delivery = order.deliveryDetails || {};
  const pickupZone = order.pickupAddress || {};
  const deliveryZone = order.deliveryAddress || {};
  const rider = order.rider && typeof order.rider === 'object' ? order.rider : null;

  const weight = parcel.actualWeight || packageDetails.weightKG || 0;
  const dimensions = parcel.dimensions || {};
  const hasDimensions = dimensions.length > 0 && dimensions.width > 0 && dimensions.height > 0;
  const category = CATEGORY_LABELS[parcel.category] || CATEGORY_LABELS[packageDetails.category] || 'General Parcel';

  const copyTracking = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(String(order.trackingId));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
      <div className={`h-1.5 w-full bg-linear-to-r ${meta.bar} opacity-90`} />

      <div className="flex flex-1 flex-col gap-4 p-4 sm:gap-4 sm:p-6">
        <header className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="min-w-0 truncate font-mono text-[13px] font-extrabold tracking-tight text-[#1f1914] sm:text-base">
                {order.trackingId}
              </span>
              <button
                aria-label="Copy tracking ID"
                className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors sm:h-6 sm:w-6 ${
                  copied
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-stone-200 text-stone-400 hover:border-primary/40 hover:text-primary'
                }`}
                onClick={copyTracking}
                title="Copy tracking ID"
                type="button"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              {pricing.zone && (
                <span className="max-w-full truncate rounded-md border border-stone-200 bg-stone-50 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-stone-500">
                  {pricing.zone.replaceAll('_', ' ')}
                </span>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Booked {formatDateTime(order.createdAt)}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-1.5">
            <StatusPill status={order.status} size="lg" />
            <span className="min-w-0 truncate font-mono text-[10px] font-bold uppercase tracking-wider text-stone-400 sm:max-w-[12rem]">
              {meta.label}
            </span>
          </div>
        </header>

        <DeliveryProgress compact order={order} />

        <div className="relative rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 sm:p-4">
          <span className="absolute left-3.5 top-9 bottom-9 w-px bg-stone-300 sm:left-4" />
          <div className="relative flex items-start gap-3">
            <span className="z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-sm">
              <Navigation className="h-3 w-3" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-stone-400">Pickup</p>
              <p className="truncate text-xs font-bold text-slate-800">{pickupZone.district || '—'}{pickupZone.area ? `, ${pickupZone.area}` : ''}</p>
              <p className="truncate text-[11px] text-stone-500">{pickup.address || pickup.name || 'Address pending'}</p>
            </div>
          </div>
          <div className="relative mt-3 flex items-start gap-3">
            <span className="z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white bg-tertiary text-white shadow-sm">
              <MapPin className="h-3 w-3" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-stone-400">Delivery</p>
              <p className="truncate text-xs font-bold text-slate-800">{deliveryZone.district || '—'}{deliveryZone.area ? `, ${deliveryZone.area}` : ''}</p>
              <p className="truncate text-[11px] text-stone-500">{delivery.address || delivery.name || 'Address pending'}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <MetaChip icon={Box} label="Category" value={category} tone="accent" />
          <MetaChip icon={Scale} label="Weight" value={`${Number(weight).toFixed(2)} kg`} />
          {pricing.billableWeightKg > 0 && Math.abs(Number(pricing.billableWeightKg) - Number(weight)) > 0.01 && (
            <MetaChip icon={Scale} label="Billable" value={`${Number(pricing.billableWeightKg).toFixed(2)} kg`} />
          )}
          {hasDimensions && (
            <MetaChip
              icon={Layers}
              label="Dims"
              value={`${dimensions.length}×${dimensions.width}×${dimensions.height} cm`}
            />
          )}
          <MetaChip icon={Banknote} label="Pay" value={PAYMENT_LABELS[pricing.paymentMethod] || pricing.paymentMethod || 'COD'} />
        </div>

        {rider && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-teal-200 bg-teal-50/70 px-3 py-2.5 sm:px-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 font-mono text-[11px] font-bold text-white">
                {(rider.name || 'R').slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-teal-950">Rider {rider.name || 'Assigned'}</p>
                <p className="truncate font-mono text-[10px] text-teal-800/70">{rider.phone || 'Contact via desk'}</p>
              </div>
            </div>
            {rider.phone && (
              <a
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white transition hover:bg-teal-700 sm:h-8 sm:w-8"
                href={`tel:${rider.phone}`}
                onClick={(event) => event.stopPropagation()}
                title="Call rider"
              >
                <Phone className="h-4 w-4" />
              </a>
            )}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-3 border-t border-stone-200 pt-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-stone-400">
              Delivery charge
            </p>
            <p className="font-syne text-lg font-extrabold text-primary">
              {formatCurrency(pricing.deliveryFee || 0)}
            </p>
            {Number(pricing.codAmount) > 0 && (
              <p className="mt-0.5 font-mono text-[10px] font-semibold text-stone-500">
                COD {formatCurrency(pricing.codAmount)}
              </p>
            )}
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <button
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-700 transition hover:border-primary/50 hover:text-primary sm:flex-none"
              onClick={() => onOpen(order)}
              type="button"
            >
              <Receipt className="h-3.5 w-3.5 shrink-0" />
              Details
            </button>
            <button
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[11px] font-bold text-white shadow-md shadow-primary/25 transition hover:bg-primary-container sm:flex-none"
              onClick={() => onTrack(order)}
              type="button"
            >
              <Truck className="h-3.5 w-3.5 shrink-0" />
              Track
              <ArrowRight className="h-3 w-3 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
