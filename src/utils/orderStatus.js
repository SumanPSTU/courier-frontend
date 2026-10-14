import {
  AlertTriangle,
  Archive,
  Ban,
  Bike,
  ClipboardCheck,
  Clock3,
  PackageCheck,
  PackageOpen,
  Truck,
  Undo2,
} from 'lucide-react';

export const LIVE_FLOW = [
  'PENDING',
  'CONFIRMED',
  'PICKUP_ASSIGNED',
  'PICKUP_ACCEPTED',
  'PICKED_UP',
  'AT_ORIGIN_WAREHOUSE',
  'ON_TRANSIT',
  'AT_DESTINATION_WAREHOUSE',
  'DELIVERY_ASSIGNED',
  'DELIVERY_ACCEPTED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export const getLiveFlow = (order) => order?.routeType === 'LOCAL'
  ? LIVE_FLOW.filter((status) => !['ON_TRANSIT', 'AT_DESTINATION_WAREHOUSE'].includes(status))
  : LIVE_FLOW;

export const progressStatus = (status) => ({ RIDER_ASSIGNED: 'PICKUP_ASSIGNED', IN_TRANSIT: 'ON_TRANSIT' }[status] || status);

export const STATUS_META = {
  PENDING: {
    label: 'Awaiting Confirmation',
    short: 'Pending',
    icon: Clock3,
    chip: 'bg-amber-100 text-amber-900 border-amber-200',
    dot: 'bg-amber-500',
    bar: 'from-amber-400 to-amber-600',
    soft: 'bg-amber-50 text-amber-900 border-amber-200',
    terminal: false,
    stage: 0,
  },
  CONFIRMED: {
    label: 'Order Confirmed',
    short: 'Confirmed',
    icon: ClipboardCheck,
    chip: 'bg-sky-100 text-sky-900 border-sky-200',
    dot: 'bg-sky-500',
    bar: 'from-sky-400 to-sky-600',
    soft: 'bg-sky-50 text-sky-900 border-sky-200',
    terminal: false,
    stage: 1,
  },
  RIDER_ASSIGNED: {
    label: 'Rider Assigned',
    short: 'Rider Assigned',
    icon: Bike,
    chip: 'bg-violet-100 text-violet-900 border-violet-200',
    dot: 'bg-violet-500',
    bar: 'from-violet-400 to-violet-600',
    soft: 'bg-violet-50 text-violet-900 border-violet-200',
    terminal: false,
    stage: 2,
  },
  PICKED_UP: {
    label: 'Picked Up From Origin',
    short: 'Picked Up',
    icon: PackageOpen,
    chip: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    dot: 'bg-indigo-500',
    bar: 'from-indigo-400 to-indigo-600',
    soft: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    terminal: false,
    stage: 3,
  },
  IN_TRANSIT: {
    label: 'In Linehaul Transit',
    short: 'In Transit',
    icon: Truck,
    chip: 'bg-primary/10 text-primary border-primary-container/30',
    dot: 'bg-primary',
    bar: 'from-primary to-primary-container',
    soft: 'bg-[#fef7f2] text-[#6f3c0a] border-primary-container/30',
    terminal: false,
    stage: 4,
  },
  OUT_FOR_DELIVERY: {
    label: 'Out For Delivery',
    short: 'Out For Delivery',
    icon: Bike,
    chip: 'bg-teal-100 text-teal-900 border-teal-200',
    dot: 'bg-teal-500',
    bar: 'from-teal-400 to-teal-600',
    soft: 'bg-teal-50 text-teal-900 border-teal-200',
    terminal: false,
    stage: 5,
  },
  DELIVERED: {
    label: 'Delivered Successfully',
    short: 'Delivered',
    icon: PackageCheck,
    chip: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    dot: 'bg-emerald-500',
    bar: 'from-emerald-400 to-emerald-600',
    soft: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    terminal: true,
    stage: 6,
  },
  PARTIAL_DELIVERY: {
    label: 'Partially Delivered',
    short: 'Partial',
    icon: AlertTriangle,
    chip: 'bg-lime-100 text-lime-900 border-lime-200',
    dot: 'bg-lime-500',
    bar: 'from-lime-400 to-lime-600',
    soft: 'bg-lime-50 text-lime-900 border-lime-200',
    terminal: true,
    stage: 6,
  },
  CANCELLED: {
    label: 'Cancelled',
    short: 'Cancelled',
    icon: Ban,
    chip: 'bg-rose-100 text-rose-900 border-rose-200',
    dot: 'bg-rose-500',
    bar: 'from-rose-400 to-rose-600',
    soft: 'bg-rose-50 text-rose-900 border-rose-200',
    terminal: true,
    stage: -1,
  },
  RETURNED: {
    label: 'Returned To Origin',
    short: 'Returned',
    icon: Undo2,
    chip: 'bg-stone-200 text-stone-800 border-stone-300',
    dot: 'bg-stone-500',
    bar: 'from-stone-400 to-stone-600',
    soft: 'bg-stone-100 text-stone-800 border-stone-300',
    terminal: true,
    stage: -1,
  },
  FAILED: {
    label: 'Delivery Attempt Failed',
    short: 'Failed',
    icon: AlertTriangle,
    chip: 'bg-red-100 text-red-900 border-red-200',
    dot: 'bg-red-500',
    bar: 'from-red-400 to-red-600',
    soft: 'bg-red-50 text-red-900 border-red-200',
    terminal: true,
    stage: -1,
  },
};

export const FALLBACK_META = {
  label: 'Unknown',
  short: 'Unknown',
  icon: Archive,
  chip: 'bg-stone-100 text-stone-700 border-stone-200',
  dot: 'bg-stone-400',
  bar: 'from-stone-300 to-stone-500',
  soft: 'bg-stone-50 text-stone-700 border-stone-200',
  terminal: false,
  stage: 0,
};

STATUS_META.PICKUP_ASSIGNED = { ...STATUS_META.RIDER_ASSIGNED, label: 'Pickup Rider Assigned', short: 'Pickup rider assigned', stage: 2 };
STATUS_META.PICKUP_ACCEPTED = { ...STATUS_META.RIDER_ASSIGNED, label: 'Pickup Rider Accepted', short: 'Pickup accepted', stage: 3 };
STATUS_META.AT_ORIGIN_WAREHOUSE = { ...STATUS_META.PICKED_UP, label: 'At Origin Warehouse', short: 'Origin warehouse', stage: 5 };
STATUS_META.ON_TRANSIT = { ...STATUS_META.IN_TRANSIT, label: 'In District Transit', short: 'On transit', stage: 6 };
STATUS_META.AT_DESTINATION_WAREHOUSE = { ...STATUS_META.IN_TRANSIT, label: 'At Destination Warehouse', short: 'Destination warehouse', stage: 7 };
STATUS_META.DELIVERY_ASSIGNED = { ...STATUS_META.RIDER_ASSIGNED, label: 'Delivery Rider Assigned', short: 'Delivery rider assigned', stage: 8 };
STATUS_META.DELIVERY_ACCEPTED = { ...STATUS_META.RIDER_ASSIGNED, label: 'Delivery Rider Accepted', short: 'Delivery accepted', stage: 9 };

export function getStatusMeta(status) {
  return STATUS_META[status] || FALLBACK_META;
}

export function isLiveStatus(status) {
  const meta = STATUS_META[status];
  return Boolean(meta && !meta.terminal);
}

export function stageIndex(status) {
  const meta = STATUS_META[status];
  if (!meta) return 0;
  if (meta.stage < 0) return LIVE_FLOW.length;
  return meta.stage;
}

export function progressPercent(status) {
  const meta = STATUS_META[status];
  if (!meta) return 0;
  if (meta.terminal) return meta.stage === 6 ? 100 : 0;
  const stage = meta.stage;
  return Math.round(((stage + 0.35) / LIVE_FLOW.length) * 100);
}

export const FILTER_GROUPS = [
  { id: 'ALL', label: 'All', match: () => true },
  { id: 'ACTIVE', label: 'Active', match: (order) => isLiveStatus(order.status) },
  { id: 'DELIVERED', label: 'Delivered', match: (order) => order.status === 'DELIVERED' || order.status === 'PARTIAL_DELIVERY' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out For Delivery', match: (order) => order.status === 'OUT_FOR_DELIVERY' },
  { id: 'COD', label: 'COD Due', match: (order) => order?.pricing?.paymentMethod === 'COD' && order?.status !== 'DELIVERED' && order?.status !== 'CANCELLED' && order?.status !== 'RETURNED' },
  { id: 'ISSUES', label: 'Exceptions', match: (order) => order.status === 'FAILED' || order.status === 'RETURNED' || order.status === 'CANCELLED' },
];

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'status', label: 'Furthest along' },
  { id: 'amount', label: 'Highest value' },
];

export const CATEGORY_LABELS = {
  DOCUMENTS: 'Documents',
  FRAGILE: 'Fragile',
  ELECTRONICS: 'Electronics',
  CLOTHING: 'Apparel',
  HEAVY: 'Heavy Cargo',
  PARCEL: 'General Parcel',
  Book: 'Books',
};

export const PAYMENT_LABELS = {
  COD: 'Cash on Delivery',
  PREPAID: 'Prepaid',
  CARD: 'Card',
};

export const PAYMENT_STATUS_META = {
  PENDING: { label: 'Payment Pending', className: 'bg-amber-50 text-amber-800 border-amber-200' },
  PAID: { label: 'Payment Settled', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  FAILED: { label: 'Payment Failed', className: 'bg-rose-50 text-rose-800 border-rose-200' },
  REFUNDED: { label: 'Refunded', className: 'bg-slate-100 text-slate-700 border-slate-300' },
};

export function summarize(orders) {
  const summary = {
    total: orders.length,
    active: 0,
    delivered: 0,
    issues: 0,
    inTransit: 0,
    codCollected: 0,
    codOutstanding: 0,
    totalFreight: 0,
    totalParcels: 0,
  };

  for (const order of orders) {
    const meta = STATUS_META[order.status];
    const pricing = order.pricing || {};
    const fee = Number(pricing.deliveryFee) || 0;
    const cod = Number(pricing.codAmount) || 0;

    summary.totalParcels += 1;
    summary.totalFreight += fee;

    if (meta && !meta.terminal) summary.active += 1;
    if (order.status === 'DELIVERED' || order.status === 'PARTIAL_DELIVERY') summary.delivered += 1;
    if (['PICKED_UP', 'AT_ORIGIN_WAREHOUSE', 'ON_TRANSIT', 'AT_DESTINATION_WAREHOUSE', 'DELIVERY_ASSIGNED', 'DELIVERY_ACCEPTED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(order.status)) summary.inTransit += 1;
    if (order.status === 'FAILED' || order.status === 'RETURNED' || order.status === 'CANCELLED') summary.issues += 1;

    if (pricing.paymentMethod === 'COD') {
      if (pricing.paymentStatus === 'PAID') {
        summary.codCollected += cod;
      } else if (order.status !== 'CANCELLED' && order.status !== 'RETURNED') {
        summary.codOutstanding += cod;
      }
    }
  }

  return summary;
}
