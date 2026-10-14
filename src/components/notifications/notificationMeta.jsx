import { Banknote, Megaphone, Truck } from 'lucide-react';

export const TYPE_META = {
  ORDER_UPDATE: { label: 'Order update', icon: Truck, chip: 'bg-primary-fixed text-primary' },
  PAYOUT_ALERT: { label: 'Payout', icon: Banknote, chip: 'bg-[#d4edda] text-[#2d5a27]' },
  SYSTEM: { label: 'System', icon: Megaphone, chip: 'bg-surface-container text-on-surface-variant' },
};

export const getTypeMeta = (type) => TYPE_META[type] || TYPE_META.SYSTEM;

export const formatWhen = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const DAY_MS = 86400000;

/** Buckets a timestamp into Today / Yesterday / This week / Earlier. */
export const dayGroup = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Earlier';
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const time = date.getTime();
  if (time >= startOfToday) return 'Today';
  if (time >= startOfToday - DAY_MS) return 'Yesterday';
  if (time >= startOfToday - 7 * DAY_MS) return 'Earlier this week';
  return 'Older';
};

/** Groups an already-sorted (newest first) list into ordered sections. */
export const groupByDay = (items) => {
  const sections = [];
  items.forEach((item) => {
    const key = dayGroup(item.createdAt);
    const last = sections[sections.length - 1];
    if (last && last.key === key) last.items.push(item);
    else sections.push({ key, items: [item] });
  });
  return sections;
};

export const formatDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
};

export const formatMoney = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
