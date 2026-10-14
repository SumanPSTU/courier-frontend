import { Check } from 'lucide-react';
import { formatDateTime } from '../utils/format';
import { getLiveFlow, getStatusMeta, progressStatus } from '../utils/orderStatus';

export default function DeliveryProgress({ order, compact = false }) {
  const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
  const flow = getLiveFlow(order);
  const normalizedStatus = progressStatus(order.status);
  const statusIndex = flow.indexOf(normalizedStatus);
  const reachedIndex = history.reduce((latest, event) => Math.max(latest, flow.indexOf(progressStatus(event.status))), -1);
  const currentIndex = statusIndex >= 0 ? statusIndex : Math.max(0, reachedIndex);
  const delivered = order.status === 'DELIVERED';
  const exception = ['FAILED', 'PARTIAL_DELIVERY', 'RETURNED', 'CANCELLED'].includes(order.status);
  const percent = delivered ? 100 : Math.round((currentIndex / (flow.length - 1)) * 100);
  const latestEvent = [...history].reverse().find((event) => event.status === order.status);
  const currentMeta = getStatusMeta(order.status);
  const CurrentIcon = currentMeta.icon;

  if (compact) {
    return (
      <section aria-label="Delivery progress" className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-sm sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary"><CurrentIcon aria-hidden="true" className="h-4 w-4" /></span><div className="min-w-0"><p className="font-mono text-[9px] font-bold uppercase tracking-wider text-primary">Delivery progress</p><p className="truncate text-xs font-extrabold text-[#1f1914]">{currentMeta.short}</p></div></div>
          <span className="shrink-0 rounded-full bg-surface-container-low px-2.5 py-1 font-mono text-[10px] font-bold text-primary">{percent}%</span>
        </div>
        <div aria-label={`${percent}% complete`} aria-valuemax="100" aria-valuemin="0" aria-valuenow={percent} className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-100" role="progressbar"><div className="h-full rounded-full bg-linear-to-r from-primary to-emerald-600 transition-[width] duration-500" style={{ width: `${percent}%` }} /></div>
        <div aria-hidden="true" className="mt-2 flex gap-1">{flow.map((step, index) => <span className={`h-1.5 flex-1 rounded-full ${delivered || index < currentIndex ? 'bg-primary' : index === currentIndex ? 'bg-primary-container ring-1 ring-primary/20' : 'bg-stone-200'}`} key={step} />)}</div>
        <p className={`mt-2 text-[10px] leading-4 ${exception ? 'text-amber-800' : 'text-stone-500'}`}>{exception ? `${currentMeta.label} · See consignment details for the latest update.` : latestEvent ? `Updated ${formatDateTime(latestEvent.updatedAt || latestEvent.timestamp)}` : 'Waiting for first shipment update'}</p>
      </section>
    );
  }

  const renderStep = (status, index, mobile = false) => {
    const meta = getStatusMeta(status);
    const Icon = meta.icon;
    const event = [...history].reverse().find((entry) => progressStatus(entry.status) === status);
    const complete = delivered || index < currentIndex;
    const active = !delivered && index === currentIndex;

    return (
      <div className={mobile ? 'relative flex gap-3 pb-5 last:pb-0' : 'relative flex min-w-0 flex-1 flex-col items-center px-1 text-center'} key={status}>
        {mobile && index < flow.length - 1 && <span aria-hidden="true" className={`absolute bottom-0 left-[17px] top-9 w-px ${complete ? 'bg-primary' : 'bg-outline-variant'}`} />}
        {!mobile && index < flow.length - 1 && <span aria-hidden="true" className={`absolute left-1/2 right-[-50%] top-[18px] h-0.5 ${index < currentIndex || delivered ? 'bg-primary' : 'bg-outline-variant'}`} />}
        <span className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${complete ? 'border-primary bg-primary text-white' : active ? 'border-primary bg-primary-fixed text-primary ring-4 ring-primary-fixed/70' : 'border-outline-variant bg-white text-outline'}`}>
          {complete ? <Check aria-hidden="true" className="h-4 w-4" /> : <Icon aria-hidden="true" className="h-4 w-4" />}
        </span>
        <div className={mobile ? 'min-w-0 pt-0.5' : 'mt-2 min-w-0'}>
          <p className={`text-xs font-bold ${active ? 'text-primary' : complete ? 'text-on-surface' : 'text-outline'}`}>{meta.short}</p>
          <p className="mt-0.5 text-[10px] leading-4 text-outline">{event ? formatDateTime(event.updatedAt || event.timestamp) : 'Awaiting update'}</p>
          {mobile && event?.reason && <p className="mt-1 text-xs leading-5 text-on-surface-variant">{event.reason}</p>}
        </div>
      </div>
    );
  };

  return (
    <section aria-label="Delivery progress" className="overflow-hidden rounded-3xl border border-surface-dim bg-white shadow-sm">
      <div className="bg-linear-to-br from-primary-fixed/65 via-white to-surface-container-low p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm"><CurrentIcon aria-hidden="true" className="h-5 w-5" /></span>
            <div className="min-w-0"><p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-primary">Delivery progress · {percent}%</p><h2 className="mt-0.5 truncate font-syne text-lg font-extrabold text-[#1f1914]">{currentMeta.label}</h2><p className="mt-0.5 text-xs text-on-surface-variant">{latestEvent ? `Updated ${formatDateTime(latestEvent.updatedAt || latestEvent.timestamp)}` : 'Waiting for the first shipment update'}</p></div>
          </div>
          <span className={`inline-flex rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide ${currentMeta.chip}`}>{currentMeta.short}</span>
        </div>
        <div aria-label={`${percent}% complete`} aria-valuemax="100" aria-valuemin="0" aria-valuenow={percent} className="mt-5 h-2 overflow-hidden rounded-full bg-white/90 ring-1 ring-primary/10" role="progressbar"><div className="h-full rounded-full bg-linear-to-r from-primary to-emerald-600 transition-[width] duration-500" style={{ width: `${percent}%` }} /></div>
        {exception && <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-950">This parcel needs attention. The milestones show the last standard delivery stage reached; see shipment updates below for details.</p>}
      </div>
      <div className="hidden px-4 py-6 xl:block sm:px-6"><div className="flex items-start">{flow.map((status, index) => renderStep(status, index))}</div></div>
      <ol aria-label="Shipment milestones" className="px-5 py-5 xl:hidden sm:px-6">{flow.map((status, index) => <li key={status}>{renderStep(status, index, true)}</li>)}</ol>
    </section>
  );
}
