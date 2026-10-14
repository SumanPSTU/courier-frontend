import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck } from 'lucide-react';
import RecentWaybills from '../components/RecentWaybills';
import TrackingResult from '../components/TrackingResult';
import { useLanguage } from '../context/languageContextValue';
import warehouse2 from '../assets/warehouse2.png';
import warehouse from '../assets/warehouse.png';
import { useAuthContext } from '../context/authContextValue';

export default function Home() {
  return (
    <div className="w-full bg-surface">
      <div className="flex flex-col w-full font-body antialiased">
        <AnnouncementRibbon />
        <TrackingConsole />
        <HeroSection />
        <PricingPreview />
        <FulfillmentSection />
        <MerchantToolsSection />
        <NetworkSection />
        <HomeCTA />
      </div>
    </div>
  );
}

function AnnouncementRibbon() {
  return (
    <section className="w-full bg-linear-to-r from-surface-container-low via-surface-container to-surface-container-low border-b border-outline-variant/30 px-3 py-2 sm:px-6 sm:py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-extrabold bg-primary text-on-primary text-[9px] tracking-wide uppercase shadow-xs sm:px-3 sm:text-[11px]">
            NATIONWIDE 64 DISTRICTS
          </span>
            <span className="hidden text-on-surface font-semibold items-center gap-1.5 sm:flex">
            <span className="material-symbols-outlined text-[15px] text-primary">local_shipping</span> Express Dispatch &amp; Nationwide Linehaul live across 495 Thanas</span>
        </div>
        <Link
          className="inline-flex items-center gap-1 font-syne text-[10px] font-bold text-primary transition-colors hover:text-primary-container sm:gap-1.5 sm:text-sm"
          to="/apply-as-rider"
        >
          <Truck aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="sm:hidden">Deliver with us</span>
          <span className="hidden sm:inline">Looking for a flexible student job? Deliver with us.</span>
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
        </Link>
      </div>
    </section>
  );
}


function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-12 pt-6 sm:pt-8 pb-10 sm:pb-16 lg:pb-24 overflow-hidden bg-linear-to-b from-surface via-surface-bright to-surface-container-low/60">

      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 sm:gap-12 xl:gap-8 items-center">

          <div className="xl:col-span-7 space-y-7">
            <ul className="flex flex-wrap items-center gap-2">
              <li className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-surface-container-lowest border border-primary/20 text-[11px] sm:text-xs font-bold text-on-surface tracking-wide shadow-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="bg-linear-to-r from-primary to-tertiary bg-clip-text text-transparent font-extrabold">{t('Next-day intra-city')}</span>
              </li>
              {[
                { icon: 'route', label: '2–3 days nationwide' },
                { icon: 'pin', label: 'Doorstep PIN release' },
              ].map((chip) => (
                <li className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 text-[11px] sm:text-xs font-semibold text-on-surface-variant" key={chip.label}>
                  <span className="material-symbols-outlined text-[15px] text-tertiary">{chip.icon}</span>
                  {t(chip.label)}
                </li>
              ))}
            </ul>
            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold text-on-surface leading-[1.12] tracking-tight">
              Fast, Sustainable Parcel Delivery Across All
              <span className="relative inline-block text-primary">
                64 Districts
                <span className="absolute bottom-1.5 left-0 w-full h-3 bg-secondary-container/40 -z-10 rounded-sm" />
              </span>
              of Bangladesh.
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-2xl font-normal">Book a pickup, follow every parcel in real time, and get your cash the next day. Built for online sellers, D2C brands, and shops that deliver across all 64 districts.</p>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1 max-w-xl">
              <div className="p-2.5 sm:p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-[0_4px_16px_rgba(137,77,13,0.06)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 bg-primary-fixed/30 rounded-bl-2xl" />
                <div className="text-2xl sm:text-3xl font-extrabold text-primary">99.4%</div>
                <div className="text-xs font-bold text-on-surface mt-0.5">On-Time SLA</div>
                <div className="text-[10px] text-on-surface-variant font-medium">Dhaka Metro Speed</div>
              </div>
              <div className="p-2.5 sm:p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-[0_4px_16px_rgba(137,77,13,0.06)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 bg-secondary-fixed/40 rounded-bl-2xl" />
                <div className="text-2xl sm:text-3xl font-extrabold text-tertiary">120k+</div>
                <div className="text-xs font-bold text-on-surface mt-0.5">Daily Orders</div>
                <div className="text-[10px] text-on-surface-variant font-medium">Nationwide Mesh</div>
              </div>
              <div className="p-2.5 sm:p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-[0_4px_16px_rgba(137,77,13,0.06)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 bg-primary-fixed-dim/30 rounded-bl-2xl" />
                <div className="text-2xl sm:text-3xl font-extrabold text-on-surface">24-Hr</div>
                <div className="text-xs font-bold text-on-surface mt-0.5">COD Payout</div>
                <div className="text-[10px] text-primary font-bold">bKash • Nagad • Bank</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <Link className="inline-flex items-center justify-center px-7 py-4 rounded-xl font-extrabold text-base text-on-primary bg-linear-to-r from-primary via-primary-container to-primary hover:brightness-110 shadow-[0_6px_24px_rgba(137,77,13,0.35)] transition-all group" data-path="merchant-sign-in-register" to="/registration">
                <span className="">Open Merchant Account</span>
                <span className="material-symbols-outlined text-[20px] ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link className="inline-flex items-center justify-center px-6 py-4 rounded-xl font-extrabold text-base text-on-secondary-container bg-linear-to-r from-secondary-fixed via-secondary-container to-secondary-fixed-dim hover:brightness-105 border border-secondary/20 shadow-md transition-all" data-path="calculate-shipping" to="/calculate-shipping">
                <span className="material-symbols-outlined text-[20px] mr-2 text-primary">calculate</span>
                <span className="">Open Rate &amp; Zone Calculator →</span>
              </Link>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-on-surface-variant">
              <div className="flex items-center gap-1.5 font-semibold text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-primary">local_shipping</span>
                <span className="">380+ Delivery Vans &amp; Motorbikes</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-primary">security_update_good</span>
                <span className="">OTP Secured Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-primary">price_check</span>
                <span className="">Transparent Rates from <strong className="text-primary font-bold">৳55</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="xl:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-surface-container border-2 border-primary/20 ring-4 ring-surface-container-high/50">
              <img alt="MadiSynthia warehouse and parcel operations" className="w-full h-82.5 sm:h-125 object-cover" src={warehouse2} />
              <div className="absolute inset-0 hidden bg-linear-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent sm:block" />
              <div className="absolute top-4 right-4 bg-surface-container-lowest/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-primary/30 flex items-center gap-2 text-xs font-bold text-primary shadow-md">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="">Live Fleet Dispatch 24/7</span>
              </div>
              <div className="hidden absolute bottom-4 left-4 right-4 p-5 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md border border-primary-fixed shadow-xl space-y-3 sm:block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-linear-to-br from-primary via-primary-container to-secondary flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-surface-bright text-[22px]">bolt</span>
                    </div>
                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-wider text-primary">MadiSynthia Express</div>
                      <div className="text-sm font-bold text-on-surface">Next Day in Dhaka and Chattogram</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-primary text-on-primary shadow-xs">Same Day</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-outline-variant/30 text-xs">
                  <div className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-[15px] text-primary">location_on</span>
                    <span className="">All 64 Districts</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-[15px] text-tertiary">sms</span>
                    <span className="">Bangla SMS Updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function TrackingConsole() {
  const { auth, user } = useAuthContext();
  const customerSignedIn = auth && user?.role === 'CUSTOMER';
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const historyRef = useRef(null);

  const startTracking = (trackingValue) => {
    if (!customerSignedIn) {
      const next = trackingValue
        ? `/tracking?id=${encodeURIComponent(trackingValue)}`
        : '/tracking';
      navigate(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    if (!trackingValue) return;
    setSearchVal(trackingValue);
    setShowResult(true);
    historyRef.current?.record(trackingValue);
  };

  const handleTrack = () => startTracking(inputVal.trim());

  const fillAndSearch = (val) => {
    setInputVal(val);
    startTracking(val);
  };

  return (
    <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-12 bg-linear-to-b from-surface-container-low via-surface to-[#fff9f5] border-b border-surface-dim/60 overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-225 h-125 bg-linear-to-br from-primary-fixed/40 via-tertiary-fixed/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-surface-dim text-primary shadow-sm mb-6">
          <span className="material-symbols-outlined text-base text-primary-container">radar</span>
          <span className="text-xs font-mono uppercase font-bold tracking-wider">Shipment status and delivery updates</span>
        </div>
        <h1 className="font-syne font-extrabold text-3xl sm:text-5xl lg:text-5xl text-[#1f1914] tracking-tight leading-[1.15] mb-4">
          Track Your Consignment in Real-Time <br className="hidden sm:inline" /><span className="text-primary underline decoration-primary-fixed-dim decoration-4 underline-offset-8">Across 64 Districts</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-on-surface-variant mb-10 leading-relaxed">
          Enter your tracking ID to view the latest recorded status and shipment details.
        </p>
        <div className="w-full bg-white rounded-3xl p-4 sm:p-7 shadow-xl shadow-primary/8 border border-surface-dim text-left">
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
          {showResult && <TrackingResult key={searchVal} val={searchVal} />}
        </div>
      </div>
    </section>
  );
}

function PricingPreview() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-8" id="pricing-preview-section">
      <div className="max-w-7xl mx-auto rounded-3xl bg-linear-to-br from-surface-container via-surface-container-low to-surface-container-high p-4 sm:p-8 lg:p-10 shadow-lg border border-primary/20 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex max-w-full items-center gap-2 px-3 py-1 sm:px-3.5 rounded-full bg-secondary-fixed border border-secondary/30 text-on-secondary-fixed text-[11px] sm:text-xs font-bold shadow-xs">
              <span className="material-symbols-outlined text-[16px] text-primary shrink-0">request_quote</span>
              <span className="truncate">Delivery from ৳55 · pay only for what you send</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight leading-snug">
              One rate card. No surprises at the door.
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              The zone decides the price, so you can quote a customer before the parcel is even booked. Pickup is free,
              digital payments carry no platform fee, and a failed delivery is billed at 50%.
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs sm:text-sm">
              {[
                { icon: 'door_front', label: 'Free doorstep pickup' },
                { icon: 'percent', label: 'No platform fee' },
                { icon: 'published_with_changes', label: '50% on failed delivery' },
              ].map((item) => (
                <li className="flex items-center gap-1.5 font-semibold text-on-surface" key={item.label}>
                  <span className="material-symbols-outlined text-[16px] text-primary">{item.icon}</span>
                  {item.label}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <Link className="inline-flex items-center justify-center px-5 sm:px-6 py-3.5 rounded-xl text-sm font-extrabold text-on-primary bg-linear-to-r from-primary via-primary-container to-primary hover:brightness-110 shadow-md transition-all group" data-path="calculate-shipping" to="/calculate-shipping">
                <span className="">Open Rate &amp; Zone Calculator</span>
                <span className="material-symbols-outlined text-[18px] ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl text-sm font-bold text-on-surface bg-surface-container-lowest hover:bg-surface-bright border border-outline-variant/60 shadow-xs transition-colors" data-path="zone-rates" to="/zone-rates">
                <span className="material-symbols-outlined text-[18px] mr-1.5 text-primary">download</span>
                <span className="">Download Rate Sheet 2025</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-surface-container-lowest p-4 sm:p-6 rounded-3xl border border-primary/20 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-outline-variant/30">
              <span className="text-xs font-extrabold uppercase tracking-wider text-on-surface">Standard Starting Rates</span>
              <span className="text-[11px] sm:text-xs font-extrabold text-primary bg-primary-fixed/80 border border-primary/30 px-2.5 py-0.5 rounded-full">Base up to 1 KG</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/30">
                <div className="text-[11px] sm:text-xs font-semibold text-on-surface-variant">Inside Dhaka</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-primary mt-1">৳55</div>
                <div className="text-[10px] sm:text-[11px] text-on-surface-variant font-medium mt-0.5">Next-day drop • 24h</div>
              </div>
              <div className="p-3 sm:p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/30">
                <div className="text-[11px] sm:text-xs font-semibold text-on-surface-variant">Suburban Zone</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">৳105</div>
                <div className="text-[10px] sm:text-[11px] text-on-surface-variant font-medium mt-0.5">Savar, Gazipur &amp; Narayanganj</div>
              </div>
              <div className="p-3 sm:p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/30">
                <div className="text-[11px] sm:text-xs font-semibold text-on-surface-variant">Outside Dhaka</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">৳115</div>
                <div className="text-[10px] sm:text-[11px] text-on-surface-variant font-medium mt-0.5">Nationwide Major Hubs</div>
              </div>
              <div className="p-3 sm:p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/30">
                <div className="text-[11px] sm:text-xs font-semibold text-on-surface-variant">District to District</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-tertiary mt-1">৳135</div>
                <div className="text-[10px] sm:text-[11px] text-on-surface-variant font-medium mt-0.5">Cross-Regional Fast Mesh</div>
              </div>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface">
              <span className="flex items-center gap-1.5 font-bold text-primary">
                <span className="material-symbols-outlined text-[16px]">done_all</span> 1% Guaranteed COD
              </span>
              <span className="flex items-center gap-1.5 font-bold text-tertiary">
                <span className="material-symbols-outlined text-[16px]">check_circle</span> 50% RTO Protection
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function FulfillmentSection() {
  const points = [
    { icon: 'inventory_2', title: 'Keep your stock with us', desc: 'Store at our Tejgaon hub and we pack each order as it comes in.' },
    { icon: 'qr_code_scanner', title: 'Scanned at every step', desc: 'Each parcel is scanned when it is packed, sorted, and delivered.' },
    { icon: 'redeem', title: 'Packed the way you want', desc: 'Bubble wrap, sealed, and your flyer or gift note inside.' },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="rounded-2xl overflow-hidden shadow-lg bg-surface-container">
          <img
            alt="Parcels sorted on racking inside a courier warehouse"
            className="w-full h-70 sm:h-105 object-cover"
            src={warehouse}
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight leading-tight">
            Store it with us, or just send it
          </h2>
          <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed max-w-lg">
            Some shops send us one box a day. Others keep their stock here and we pack each order as it comes in. Either
            way you get a tracking link for every parcel.
          </p>
          <ul className="space-y-3 pt-1">
            {points.map((p) => (
              <li className="flex items-start gap-3" key={p.title}>
                <span className="material-symbols-outlined text-xl text-primary shrink-0 mt-0.5">{p.icon}</span>
                <div>
                  <p className="font-sans text-sm font-semibold text-on-surface">{p.title}</p>
                  <p className="font-sans text-sm text-on-surface-variant leading-snug">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline pt-1" data-path="services" to="/services">
            See all services
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}


function MerchantToolsSection() {
  const tools = [
    { icon: 'payments', title: 'Your money back in a day', desc: 'Cash the rider collects lands in your account within 24 hours, to your bank, bKash, or Nagad.' },
    { icon: 'replay', title: 'Half price if it fails', desc: 'A parcel that cannot be delivered is charged at 50%, not the full rate. You are not billed twice.' },
    { icon: 'sms', title: 'Your customer gets a text', desc: 'We send delivery updates in Bangla and English under your shop name, plus the PIN they need to confirm handover.' },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-14">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight max-w-2xl">
          What you get as a sender
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/40 space-y-2.5" key={tool.title}>
              <span className="material-symbols-outlined text-2xl text-primary">{tool.icon}</span>
              <h3 className="font-sans text-base font-bold text-on-surface">{tool.title}</h3>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function NetworkSection() {
  const reach = [
    { value: '64', label: 'Districts', note: 'Every district in the country' },
    { value: '495', label: 'Thanas', note: 'City and rural drop points' },
    { value: '2–3 days', label: 'Nationwide', note: 'Typical time outside Dhaka' },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-14 bg-surface-container-low border-y border-outline-variant/30">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight max-w-2xl">
          Where we deliver
        </h2>
        <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-2xl -mt-4">
          Dhaka and Chattogram usually go out the next day. Everything else takes about two to three days. If a
          district is not on our rate list, contact us before you pay for shipping.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {reach.map((item) => (
            <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm" key={item.label}>
              <div className="text-3xl font-extrabold text-primary font-sans">{item.value}</div>
              <div className="text-sm font-bold text-on-surface font-sans">{item.label}</div>
              <div className="text-xs text-on-surface-variant mt-0.5 font-sans">{item.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function HomeCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-linear-to-br from-primary via-primary-container to-secondary px-4 py-16 text-white sm:px-6 lg:px-12">
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-secondary-fixed/20 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-primary-fixed">
          <span className="material-symbols-outlined text-base">rocket_launch</span>
          Modern Logistics for Scaled Retailers
        </div>
        <h2 className="mb-4 font-syne text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          Ready to Deliver Faster with Zero Delays?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-base font-light leading-relaxed text-white/90 sm:text-lg">
          Join thousands of smart retailers across Bangladesh leveraging algorithmic routing, 1% flat COD fees, and guaranteed 24-hour bank remittance.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-mono text-xs font-bold uppercase tracking-wider text-primary shadow-xl transition-all hover:scale-105 hover:bg-[#fff9f5] sm:w-auto" href="/registration">
            <span className="material-symbols-outlined text-base">app_registration</span>
            Create Merchant Account
          </a>
          <a className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/30 bg-black/20 px-8 py-4 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-black/30 sm:w-auto" href="/contact">
            <span className="material-symbols-outlined text-base">contact_support</span>
            Speak with Sales
          </a>
        </div>
      </div>
    </section>
  );
}
