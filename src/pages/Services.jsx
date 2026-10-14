import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../api/orders';

const services = [
  {
    icon: 'electric_moped',
    badge: 'From ৳55',
    title: 'Next-day delivery',
    zones: 'Dhaka and nearby',
    desc: 'Book before 4 PM and the parcel reaches the customer the next day. They get an SMS and a 4-digit PIN to confirm handover.',
    points: ['4 PM cut-off for next-day delivery', 'SMS with a 4-digit handover PIN', 'Three delivery attempts included'],
  },
  {
    icon: 'local_shipping',
    badge: 'From ৳115',
    title: 'Nationwide delivery',
    zones: 'All 64 districts',
    desc: 'Nightly linehaul to every district hub, then a rider completes the last mile. Most parcels arrive in two to three days.',
    points: ['48–72 hours nationwide', 'We run our own fleet and hubs', 'Live tracking at every scan'],
  },
  {
    icon: 'payments',
    badge: '1% flat',
    title: 'Cash on delivery',
    zones: 'Cash, bKash, Nagad',
    desc: 'The rider collects payment at the door and it reaches your bank account the next day. You always see a full breakdown.',
    points: ['Paid out within 24 hours', 'Invoice receipt for every parcel', 'Ledger you can export any time'],
  },
  {
    icon: 'sync_alt',
    badge: '50% on returns',
    title: 'Returns and exchanges',
    zones: 'Customer returns',
    desc: 'A failed delivery is billed at half the usual rate. Size exchanges happen in one trip, so the customer is not charged twice.',
    points: ['50% rate on failed delivery', 'Exchange and pickup in one visit', 'Rider checks the returned item'],
  },
  {
    icon: 'warehouse',
    badge: 'Included',
    title: 'Storage and packing',
    zones: 'Tejgaon and Agrabad',
    desc: 'Keep stock at our hub. When an order comes in, we pick, pack, and hand it straight to the next departure.',
    points: ['Barcode scanning to avoid errors', 'Tamper-evident sealing', 'Gift wrap on request'],
  },
  {
    icon: 'domain',
    badge: 'On request',
    title: 'Bulk and corporate',
    zones: 'Pallets and full loads',
    desc: 'For regular large shipments we set up a dedicated arrangement with agreed rates and a named contact.',
    points: ['Pallet and full-load transport', 'Monthly invoicing with VAT', 'Dedicated account contact'],
  },
];

const ZONE_DOT_MAP = {
  INSIDE_DHAKA: 'bg-primary',
  DHAKA_SUBURBAN: 'bg-secondary',
  OUTSIDE_DHAKA: 'bg-tertiary',
  DISTRICT_TO_DISTRICT: 'bg-primary-container',
};

const ZONE_LABEL_MAP = {
  INSIDE_DHAKA: 'Inside Dhaka',
  DHAKA_SUBURBAN: 'Dhaka suburbs',
  OUTSIDE_DHAKA: 'Outside Dhaka',
  DISTRICT_TO_DISTRICT: 'District to district',
};

const ZONE_DETAIL_MAP = {
  INSIDE_DHAKA: undefined,
  DHAKA_SUBURBAN: 'Savar, Gazipur, Narayanganj',
  OUTSIDE_DHAKA: 'All 64 districts',
  DISTRICT_TO_DISTRICT: 'e.g. Sylhet to Chattogram',
};

const ZONE_TIME_MAP = {
  INSIDE_DHAKA: 'Next day',
  DHAKA_SUBURBAN: '1–2 days',
  OUTSIDE_DHAKA: '2–3 days',
  DISTRICT_TO_DISTRICT: '2–3 days',
};

export default function Services() {
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    ordersApi.getPricingConfig()
      .then(({ data }) => {
        if (active) {
          setPricingData(data.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.response?.data?.message || 'Failed to load pricing');
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, []);

  const rates = useMemo(() => {
    if (!pricingData) return [];
    return pricingData.zoneConfigs.map((z) => ({
      zone: ZONE_LABEL_MAP[z.zoneKey],
      detail: ZONE_DETAIL_MAP[z.zoneKey],
      time: ZONE_TIME_MAP[z.zoneKey],
      fare: `৳${z.basePrice}`,
      extra: `৳${z.weightSurchargePerKg}/kg`,
      dot: ZONE_DOT_MAP[z.zoneKey],
    }));
  }, [pricingData]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-error">Failed to load pricing data: {error}</p>
      </div>
    );
  }

  return (
    <ServicesMain rates={rates} />
  );
}


function ServicesHero() {
  return (
<section className="bg-surface py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 space-y-5">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-container font-mono text-[11px] font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Courier services
          </span>
          <h1 className="font-syne font-extrabold text-3xl sm:text-4xl lg:text-5xl text-on-surface tracking-tight leading-tight max-w-3xl">
            Delivery that works the same in <span className="text-primary">every district</span>.
          </h1>
          <p className="font-sans text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Six things we do, one price for each, and a tracking link for every parcel. No minimum order, no monthly fee.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
            <Link className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-on-primary font-sans text-base font-semibold hover:bg-primary-container transition-all shadow-md active:scale-95" to="/calculate-shipping">
              <span>Check a price</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
            <a className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-sans text-base font-semibold hover:bg-surface-container transition-all shadow-sm border border-outline-variant/50" href="tel:09612404040">
              <span className="material-symbols-outlined text-base text-primary">call</span>
              Call 09612-404040
            </a>
          </div>
        </div>
      </section>
  );
}

function ServicesMain({ rates }) {
  return (
<div className="w-full">
      {/* Hero */}
      <ServicesHero />

      {/* Services */}
      <section className="w-full bg-surface-container-low py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 space-y-8">
          <h2 className="font-syne text-2xl sm:text-3xl text-on-surface font-extrabold tracking-tight">What we do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {services.map((s) => (
              <div key={s.title} className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-xl">{s.icon}</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold bg-surface-container text-primary px-2 py-0.5 rounded shrink-0">{s.badge}</span>
                </div>
                <h3 className="font-syne text-base text-on-surface font-bold">{s.title}</h3>
                <p className="font-mono text-[11px] text-outline uppercase tracking-wider mt-0.5">{s.zones}</p>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed mt-2.5">{s.desc}</p>
                <ul className="space-y-1.5 mt-3 pt-3 border-t border-outline-variant/30">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 font-sans text-[13px] text-on-surface">
                      <span className="material-symbols-outlined text-[15px] text-primary shrink-0 mt-px">check</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rates */}
      <ServicesRates rates={rates} />

      {/* CTA */}
      <ServicesCta />
    </div>
  );
}

function ServicesRates({ rates }) {
  return (
<section className="w-full bg-surface py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <h2 className="font-syne text-2xl sm:text-3xl text-on-surface font-extrabold tracking-tight">Prices</h2>
              <p className="font-sans text-sm text-on-surface-variant">Per parcel up to 1 kg. Cash on delivery adds 1%, and a failed delivery costs half.</p>
            </div>
            <Link className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary font-sans text-sm font-semibold hover:bg-primary-container transition-colors shrink-0" to="/calculate-shipping">
              <span className="material-symbols-outlined text-base">calculate</span>
              Exact price for my parcel
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {rates.map((r) => (
              <div key={r.zone} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${r.dot}`} />
                  <span className="font-sans text-sm font-semibold text-on-surface">{r.zone}</span>
                </div>
                {r.detail && <p className="font-mono text-[11px] text-outline mt-1 ml-4">{r.detail}</p>}
                <div className="font-syne text-3xl font-extrabold text-primary mt-2.5">{r.fare}</div>
                <div className="font-mono text-[11px] text-on-surface-variant mt-1">{r.time} · {r.extra} after 1 kg</div>
              </div>
            ))}
          </div>

          <p className="font-sans text-xs text-on-surface-variant">
            Parcels are covered up to ৳3,000 in transit at no extra cost.
          </p>
        </div>
      </section>
  );
}

function ServicesCta() {
  return (
<section className="w-full bg-surface-container-low py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
          <div className="rounded-xl bg-surface-container p-6 lg:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="space-y-1.5">
              <h2 className="font-syne text-2xl sm:text-3xl text-on-surface font-extrabold tracking-tight">Start sending parcels</h2>
              <p className="font-sans text-sm text-on-surface-variant max-w-xl">Create a free merchant account. You can send your first parcel the same day.</p>
            </div>
            <Link className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-on-primary font-sans text-sm font-bold hover:bg-primary-container transition-all shadow-md shrink-0" to="/registration">
              <span>Create account</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
  );
}