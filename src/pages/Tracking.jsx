import { useCallback, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TrackingResult from '../components/TrackingResult';
import DeliveryProgress from '../components/DeliveryProgress';
import { formatDateTime } from '../utils/format';
import { CATEGORY_LABELS, PAYMENT_LABELS, getStatusMeta } from '../utils/orderStatus';
import RecentWaybills from '../components/RecentWaybills';

export default function Tracking() {
  const [trackedOrder, setTrackedOrder] = useState(null);
  const onTrack = useCallback(() => setTrackedOrder(null), []);

  return (
    <>
      <HeroSearch onTrack={onTrack} onOrderFound={setTrackedOrder} />
      {trackedOrder && <>
        <StatusMetrics order={trackedOrder} />
        <WorkflowSection order={trackedOrder} />
      </>}
      <SLASection />
      <FAQSection />
      <BottomCTA />
    </>
  );
}
function StatusMetrics({ order }) {
  const status = getStatusMeta(order.status);
  const StatusIcon = status.icon;
  const packageInfo = order.packageDetails || order.parcel || {};
  const weight = order.packageDetails?.weightKG ?? order.parcel?.actualWeight;
  const category = CATEGORY_LABELS[packageInfo.category] || 'Parcel';
  const payment = PAYMENT_LABELS[order.pricing?.paymentMethod] || 'Payment details unavailable';
  const codAmount = Number(order.pricing?.codAmount || 0);

  return (
    <section aria-label="Current shipment summary" className="w-full bg-[#fff9f5] px-4 py-7 sm:px-6 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-primary-fixed bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary"><StatusIcon aria-hidden="true" className="h-5 w-5" /></span>
          <div className="min-w-0"><p className="font-mono text-[10px] font-bold uppercase tracking-wider text-outline">Status</p><p className="truncate text-sm font-bold text-on-surface">{status.label}</p></div>
        </div>
        <div className="rounded-2xl border border-outline-variant/40 bg-white p-4 shadow-sm">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-outline">Package</p>
          <p className="mt-1 truncate text-sm font-bold text-on-surface">{weight ? `${weight} kg · ` : ''}{category}</p>
        </div>
        <div className="rounded-2xl border border-outline-variant/40 bg-white p-4 shadow-sm">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-outline">Payment</p>
          <p className="mt-1 truncate text-sm font-bold text-on-surface">{codAmount > 0 ? `${payment} · COD ৳${codAmount.toLocaleString()}` : payment}</p>
        </div>
      </div>
    </section>
  );
}

function HeroSearch({ onTrack, onOrderFound }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const prefill = searchParams.get('id') || searchParams.get('trackingId') || '';
  const [inputVal, setInputVal] = useState(prefill);
  const [showResult, setShowResult] = useState(Boolean(prefill));
  const [searchVal, setSearchVal] = useState(prefill);
  const historyRef = useRef(null);

  const handleTrack = () => {
    const trackingValue = inputVal.trim();
    if (!trackingValue) return;
    setSearchVal(trackingValue);
    setShowResult(true);
    setSearchParams({ id: trackingValue }, { replace: true });
    historyRef.current?.record(trackingValue);
    onTrack();
  };

  const fillAndSearch = (val) => {
    setInputVal(val);
    setSearchVal(val);
    setShowResult(true);
    setSearchParams({ id: val }, { replace: true });
    historyRef.current?.record(val);
    onTrack();
  };

  return (
    <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-12 bg-linear-to-b from-surface-container-low via-surface to-[#fff9f5] border-b border-surface-dim/60 overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-225 h-125 bg-linear-to-br from-primary-fixed/40 via-tertiary-fixed/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-surface-dim text-primary shadow-sm mb-6">
          <span className="material-symbols-outlined text-base text-primary-container">radar</span>
          <span className="text-xs font-mono uppercase font-bold tracking-wider">Shipment status and delivery updates</span>
        </div>
        <h1 className="font-syne font-extrabold text-2xl leading-tight sm:text-5xl lg:text-5xl text-[#1f1914] tracking-tight mb-4 wrap-break-word">
          Track Your Consignment <br className="hidden sm:inline" /><span className="text-primary underline decoration-primary-fixed-dim decoration-4 underline-offset-8">View Shipment Updates</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-on-surface-variant mb-10 leading-relaxed">
          Enter your tracking ID to view the shipment status, update history, origin, and destination.
        </p>
        <div className="w-full min-w-0 bg-white rounded-3xl p-4 sm:p-7 shadow-xl shadow-primary/8 border border-surface-dim text-left">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
              </div>
              <input
                className="w-full pl-12 pr-4 py-4 bg-[#fff9f5] border border-outline-variant focus:border-primary focus:bg-white rounded-2xl font-mono text-sm sm:text-base font-semibold text-[#1f1914] placeholder:text-outline focus:outline-none transition-all shadow-inner"
                placeholder="Enter tracking ID"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTrack();
                }}
                aria-label="Tracking ID"
              />
            </div>
            <button
              className="w-full sm:w-auto px-5 sm:px-8 py-4 rounded-2xl bg-linear-to-r from-primary to-primary-container hover:from-primary-container hover:to-primary text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
              onClick={handleTrack}
              type="button"
            >
              <span className="material-symbols-outlined text-lg">search</span> Track Parcel
            </button>
          </div>
          <RecentWaybills onSelect={fillAndSearch} ref={historyRef} />
          {showResult && <TrackingResult key={searchVal} val={searchVal} onOrderFound={onOrderFound} />}
        </div>
      </div>
    </section>
  );
}

function WorkflowSection({ order }) {
  const history = Array.isArray(order.statusHistory) ? [...order.statusHistory].sort((a, b) => new Date(a.updatedAt || a.timestamp) - new Date(b.updatedAt || b.timestamp)) : [];
  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-8 bg-[#fff9f5]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <DeliveryProgress order={order} />
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-dim">
            <div className="flex items-center justify-between pb-6 border-b border-surface-variant">
              <div className="flex flex-col"><span className="font-mono text-xs uppercase text-primary font-bold tracking-wider">Shipment Updates</span><h2 className="font-syne text-xl sm:text-2xl text-[#1f1914] font-bold mt-1">Status history</h2></div>
              <span className="font-mono text-xs px-3 py-1 bg-surface-container text-primary rounded-full uppercase font-bold">{history.length} updates</span>
            </div>
            <div className="relative flex flex-col space-y-7 pt-6 pl-4 sm:pl-6 before:content-[''] before:absolute before:left-0 sm:before:left-0 before:top-9 before:bottom-6 before:w-0.5 before:bg-surface-dim">
              {history.length === 0 && <p className="text-sm text-on-surface-variant">No status updates have been recorded yet.</p>}
              {history.map((entry, index) => {
                const meta = getStatusMeta(entry.status);
                const Icon = meta.icon;
                const isCurrent = index === history.length - 1;
                return <Milestone key={`${entry.status}-${entry.updatedAt || entry.timestamp}-${index}`} icon={Icon} status={isCurrent ? 'active' : 'done'} title={meta.label} time={formatDateTime(entry.updatedAt || entry.timestamp)} desc={entry.reason || entry.notes || (isCurrent ? 'Current shipment status' : 'Status update recorded')} meta={entry.userRole ? <>Updated by: {entry.userRole}</> : null} />;
              })}
            </div>
          </div>
        </div>
        <RouteMap order={order} />
      </div>
    </section>
  );
}

function Milestone({ icon: Icon, status, title, time, desc, meta }) {
  const bgMap = { done: 'bg-primary text-white', active: 'bg-primary-container text-white ring-4 ring-primary-fixed animate-pulse', pending: 'bg-surface-container text-outline border border-outline-variant' };
  const cardMap = { done: 'bg-surface-container-low p-4 rounded-2xl border border-primary-fixed', active: 'bg-white p-5 rounded-2xl border-2 border-primary-container shadow-md', pending: 'bg-[#fff9f5] p-4 rounded-2xl border border-surface-dim opacity-80' };
  return (
    <div className="relative flex items-start gap-4">
      <div className={`z-10 shrink-0 w-8 h-8 rounded-full ${bgMap[status]} flex items-center justify-center shadow-md ${status === 'active' ? 'shadow-lg' : ''}`}><Icon className="h-4 w-4" /></div>
      <div className={`min-w-0 grow ${cardMap[status]}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2"><span className="min-w-0 wrap-break-word font-syne text-sm font-bold text-[#1f1914]">{title}</span>{status === 'active' && <span className="shrink-0 px-2 py-0.5 rounded-full bg-primary text-white font-mono text-[10px] uppercase font-bold">Current</span>}</div>
          <span className={`font-mono text-xs ${status === 'active' ? 'text-primary font-bold' : 'text-outline'}`}>{time}</span>
        </div>
        <p className={`text-xs ${status === 'pending' ? 'text-outline' : 'text-on-surface-variant'} leading-relaxed`}>{desc}</p>
        {meta && <div className="mt-2.5 flex items-center gap-3 font-mono text-[11px] text-outline">{meta}</div>}
      </div>
    </div>
  );
}

function RouteMap({ order }) {
  const pickupAddress = order.pickupDetails?.address || 'Origin address pending';
  const deliveryAddress = order.deliveryDetails?.address || 'Destination address pending';
  const StatusIcon = getStatusMeta(order.status).icon;
  return (
    <div className="lg:col-span-5 flex flex-col gap-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-surface-dim flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col"><span className="font-mono text-xs uppercase text-primary font-bold tracking-wider">Shipment Locations</span><h3 className="font-syne text-lg font-bold text-[#1f1914]">Origin and destination</h3></div>
        </div>
        <div aria-label="Schematic route illustration, not a geographic map" className="relative min-h-80 w-full rounded-2xl bg-surface-container/60 border border-surface-dim overflow-hidden flex flex-col justify-between gap-5 p-3 sm:p-4 shadow-inner" role="img">
          <span className="absolute right-3 top-3 z-20 rounded-md bg-white/90 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-outline">Route schematic · not to scale</span>
          <svg className="absolute inset-0 w-full h-full text-outline-variant/30 pointer-events-none" xmlns="http://www.w3.org/2000/svg"><defs><pattern height="28" id="grid-tracking-pattern" patternUnits="userSpaceOnUse" width="28"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeDasharray="2,2" strokeWidth="1"></path></pattern></defs><rect fill="url(#grid-tracking-pattern)" height="100%" width="100%"></rect></svg>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg"><path d="M 60 40 L 140 70 L 190 140 L 260 210 L 330 260" stroke="#d8c3b4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8"></path><path d="M 60 40 L 140 70 L 190 140 L 250 200" stroke="#894d0d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path><path d="M 250 200 L 260 210 L 330 260" stroke="#a76526" strokeDasharray="6,6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path><text fill="#524439" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" x="65" y="32">ORIGIN</text><text fill="#857467" fontFamily="JetBrains Mono" fontSize="8" x="145" y="85">TRANSIT</text><text fill="#524439" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" x="240" y="280">DESTINATION</text></svg>
          <div className="relative z-10 w-fit max-w-[90%] self-start wrap-break-word bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm font-mono text-xs border border-surface-dim"><span className="text-[10px] font-bold uppercase text-primary">Origin</span><p className="wrap-break-word [overflow-wrap:anywhere] font-bold leading-snug text-[#1f1914]">{pickupAddress}</p></div>
          <div className="relative z-10 my-auto flex max-w-full flex-col items-center self-center"><div className="max-w-full wrap-break-word rounded-xl bg-primary px-3 py-1.5 text-center font-mono text-[10px] sm:text-xs uppercase font-bold text-white shadow-lg flex items-center justify-center gap-1.5"><StatusIcon className="h-4 w-4 shrink-0" />{getStatusMeta(order.status).label}</div><div className="w-3 h-3 bg-primary rotate-45 -mt-1.5"></div><div className="w-4 h-4 rounded-full bg-primary/30 mt-1"></div></div>
          <div className="relative z-10 w-fit max-w-[90%] self-end wrap-break-word bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm font-mono text-xs border border-surface-dim"><span className="text-[10px] font-bold uppercase text-primary">Destination</span><p className="wrap-break-word [overflow-wrap:anywhere] font-bold leading-snug text-[#1f1914]">{deliveryAddress}</p></div>
        </div>
      </div>
    </div>
  );
}

function SLASection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-16 bg-surface-container-low border-y border-surface-dim">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-primary-fixed text-primary font-mono text-xs uppercase font-bold mb-3 shadow-sm"><span className="material-symbols-outlined text-sm">hub</span> Real-Time SLA &amp; Gateway Mesh</div><h2 className="font-syne text-2xl sm:text-4xl font-extrabold text-[#1f1914] tracking-tight">Engineered Across All 64 Districts</h2></div>
          <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">From central capital distribution lines to the most remote union upazilas, MadiSynthia guarantees strict waybill traceability and guaranteed settlement cycles.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-surface-dim"><span className="font-syne text-4xl sm:text-5xl font-extrabold text-primary block mb-1">64</span><span className="font-syne text-base font-bold text-[#1f1914] block">Districts Covered</span><span className="text-xs text-outline mt-1 block">Full coverage across 495 thanas.</span></div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-surface-dim"><span className="font-syne text-4xl sm:text-5xl font-extrabold text-primary-container block mb-1">24h</span><span className="font-syne text-base font-bold text-[#1f1914] block">COD Remittance</span><span className="text-xs text-outline mt-1 block">Daily automated bank &amp; bKash/Nagad settlements.</span></div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-surface-dim"><span className="font-syne text-4xl sm:text-5xl font-extrabold text-secondary block mb-1">99.2%</span><span className="font-syne text-base font-bold text-[#1f1914] block">On-Time SLA</span><span className="text-xs text-outline mt-1 block">Next-day intra-Dhaka &amp; major corridor speed.</span></div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-surface-dim"><span className="font-syne text-4xl sm:text-5xl font-extrabold text-tertiary block mb-1">100%</span><span className="font-syne text-base font-bold text-[#1f1914] block">OTP Validated</span><span className="text-xs text-outline mt-1 block">Zero unauthorized return disputes.</span></div>
        </div>
        <div className="mt-8 pt-8 border-t border-surface-dim/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {['Dhaka Tejgaon','Chittagong Agrabad','Sylhet Subidbazar','Rajshahi Depot','Khulna Center','Barisal Hub'].map((h, i) => (
            <div key={i} className="bg-white/80 p-3 rounded-2xl border border-surface-dim text-center font-mono"><div className="flex items-center justify-center gap-1.5 text-xs text-primary font-bold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> {h}</div><div className="text-[11px] text-outline mt-0.5">Active</div></div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { q: 'How does 24-Hour COD disbursement work for merchants?', a: 'Once cash is collected by the delivery rider or received via our integrated bKash/Nagad gateway at the customer\'s door, funds are automatically audited during end-of-day reconciliation. Settlements disburse directly to your registered Bangladeshi commercial bank account or merchant digital wallet within 24 hours.' },
    { q: 'What happens if I miss the courier rider\'s phone call?', a: 'Our riders are mandated to attempt a minimum of 3 calls spaced 10 minutes apart. If the recipient remains unreachable, an automated SMS advisory is dispatched, and the parcel returns securely to the nearest zonal distribution facility.' },
    { q: 'How do OTP delivery verifications work?', a: 'To ensure zero package tampering, a 4-digit numeric OTP is generated and transmitted to the recipient\'s phone number as soon as the parcel enters "Out for Delivery" status. The rider can only mark the parcel complete once the recipient provides this exact code.' },
    { q: 'What is the 50% Fair Return-to-Origin (RTO) guarantee?', a: 'In the event that an end recipient rejects the order at the doorstep or fails to accept handover after three documented delivery attempts, MadiSynthia assesses only 50% of the standard reverse linehaul fee back to the merchant\'s warehouse.' },
  ];
  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-16 bg-[#fff9f5]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10"><span className="font-mono text-xs uppercase text-primary font-bold tracking-wider">Support &amp; Operational Policies</span><h2 className="font-syne text-2xl sm:text-4xl font-extrabold text-[#1f1914] mt-2">Frequently Asked Questions</h2></div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className={`bg-white rounded-3xl p-6 shadow-sm border transition-all ${openIndex === i ? 'border-primary bg-surface-container-low' : 'border-surface-dim'}`}>
              <button className="flex items-start justify-between w-full min-w-0 text-left gap-2" onClick={() => setOpenIndex(openIndex === i ? null : i)} type="button">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                  <h3 className="wrap-break-word font-syne text-base sm:text-lg font-bold text-[#1f1914]">{f.q}</h3>
                  <span className="text-[11px] font-mono text-outline uppercase font-bold">{openIndex === i ? 'Hide answer' : 'Click to expand'}</span>
                </div>
                <span className="material-symbols-outlined text-primary shrink-0 mt-1">{openIndex === i ? 'expand_less' : 'expand_more'}</span>
              </button>
              {openIndex === i && <p className="text-sm text-on-surface-variant leading-relaxed mt-2">{f.a}</p>}
            </div>
          ))}
        </div>
        <div className="mt-8 bg-linear-to-r from-surface-container to-surface-container-low p-6 rounded-3xl border border-primary-fixed flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md"><span className="material-symbols-outlined text-2xl">support_agent</span></div><div className="flex flex-col"><span className="font-syne text-base font-bold text-[#1f1914]">Need Direct Dispatcher Escalation?</span><span className="text-xs font-mono text-on-surface-variant">Hotline: 09612-404040 • 24 Hours Nationwide Linehaul Desk</span></div></div>
          <a className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-container text-white font-mono text-xs uppercase font-bold tracking-wider shadow-md shadow-primary/20 whitespace-nowrap transition-all" href="tel:09612404040">Call Central Desk</a>
        </div>
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-16 bg-linear-to-br from-primary via-primary-container to-secondary text-white relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-secondary-fixed/20 blur-3xl pointer-events-none"></div>
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-primary-fixed font-mono text-xs uppercase font-bold tracking-wider mb-5"><span className="material-symbols-outlined text-base">rocket_launch</span> Modern Logistics for Scaled Retailers</div>
        <h2 className="font-syne text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white leading-tight">Ready to Deliver Faster with Zero Delays?</h2>
        <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-8 font-light leading-relaxed">Join thousands of smart retailers across Bangladesh leveraging algorithmic routing, 1% flat COD fees, and guaranteed 24-hour bank remittance.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-primary font-mono text-xs uppercase font-bold tracking-wider hover:bg-[#fff9f5] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"><span className="material-symbols-outlined text-base">app_registration</span> Create Merchant Account</a>
          <a className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-black/20 hover:bg-black/30 text-white border border-white/30 font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2"><span className="material-symbols-outlined text-base">contact_support</span> Speak with Sales</a>
        </div>
      </div>
    </section>
  );
}
