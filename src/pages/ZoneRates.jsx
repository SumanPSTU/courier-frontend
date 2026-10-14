import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Clock3, PackageCheck, Zap } from 'lucide-react';
import { ordersApi } from '../api/orders';

const ZONE_LABELS = {
  INSIDE_DHAKA: 'Inside Dhaka',
  DHAKA_SUBURBAN: 'Dhaka Suburban',
  OUTSIDE_DHAKA: 'Outside Dhaka',
  DISTRICT_TO_DISTRICT: 'District to District',
};

const ZONE_SUB_LABELS = {
  INSIDE_DHAKA: 'Within DCC North & South',
  DHAKA_SUBURBAN: 'Gazipur, Savar, Narayanganj',
  OUTSIDE_DHAKA: 'All 63 other districts',
  DISTRICT_TO_DISTRICT: 'e.g. Sylhet to Chattogram',
};

const ZONE_SLAS = {
  INSIDE_DHAKA: 'Next day',
  DHAKA_SUBURBAN: '1–2 days',
  OUTSIDE_DHAKA: '2–3 days',
  DISTRICT_TO_DISTRICT: '2–3 days',
};

const ZONE_DOTS = {
  INSIDE_DHAKA: 'bg-primary',
  DHAKA_SUBURBAN: 'bg-secondary',
  OUTSIDE_DHAKA: 'bg-tertiary',
  DISTRICT_TO_DISTRICT: 'bg-primary-container',
};

const extras = [
  { icon: 'bolt', label: 'Same-day, inside Dhaka', note: 'Book before 11:30 AM', price: '+৳50' },
  { icon: 'inventory_2', label: 'Extra packaging', note: 'Bubble wrap or extra protection', price: '৳15–35' },
  { icon: 'published_with_changes', label: 'Failed delivery', note: 'Charged instead of delivery', price: '50%' },
  { icon: 'shield', label: 'Declared-value cover', note: 'Above ৳3,000', price: '0.5%' },
  { icon: 'pin_drop', label: 'Handover PIN', note: 'Recipient confirms by SMS', price: 'Free' },
];

const faqs = [
  {
    q: 'What happens if a parcel cannot be delivered?',
    a: 'You pay half the normal rate, not the full amount. A parcel sent inside Dhaka that costs ৳55 to deliver comes back at ৳27.50.',
  },
  {
    q: 'How are bulky parcels charged?',
    a: 'We bill whichever is higher: the weight on our scale, or the size of the box. Size is worked out as length × width × height in cm, divided by 5,000.',
  },
  {
    q: 'When do I get my cash-on-delivery money?',
    a: 'Within 24 hours of delivery, straight to your bank, bKash, or Nagad account, with no deduction on the payout.',
  },
  {
    q: 'Do prices go up during Eid or sales?',
    a: 'No. The rates on this page are what you pay all year, including Eid and big sale periods.',
  },
];

export default function ZoneRates() {
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currencySymbol = pricingData?.appConfig?.currencySymbol || '৳';

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

  const rateTable = useMemo(() => {
    if (!pricingData) return [];
    return pricingData.zoneConfigs.map((z) => {
      const base = z.basePrice;
      const extra = z.weightSurchargePerKg;
      return {
        zone: ZONE_LABELS[z.zoneKey],
        sub: ZONE_SUB_LABELS[z.zoneKey],
        sla: ZONE_SLAS[z.zoneKey],
        base: `${currencySymbol}${base}`,
        kg2: `${currencySymbol}${base + extra}`,
        kg3: `${currencySymbol}${base + extra * 2}`,
        extra: `${currencySymbol}${extra}/kg`,
        dot: ZONE_DOTS[z.zoneKey],
        zoneKey: z.zoneKey,
        basePrice: base,
        extraPrice: extra,
        sameDayPrice: z.sameDayPrice,
      };
    });
  }, [currencySymbol, pricingData]);
  const deliverySpeeds = useMemo(
    () => (pricingData?.appConfig?.deliveryServices || []).filter((service) => service.enabled),
    [pricingData]
  );

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
    <div className="w-full">
      <div className="zone-rates-screen-content">
        <ZoneRatesIntro />
        <ZoneRatesPriceList rateTable={rateTable} />
        <ZoneRatesSpeedList
          currencySymbol={currencySymbol}
          deliverySpeeds={deliverySpeeds}
          rateTable={rateTable}
        />
        <ZoneRatesExtras />
        <ZoneRatesFaq />
        <ZoneRatesCta />
      </div>
      <ZoneRatesPrintDocument
        currencySymbol={currencySymbol}
        deliverySpeeds={deliverySpeeds}
        rateTable={rateTable}
      />
    </div>
  );
}


function ZoneRatesIntro() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(253,186,69,0.16),transparent_34rem)] py-8 sm:py-11 lg:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary-fixed/40 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/85 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-primary shadow-sm sm:text-[11px]">
            <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" /> Clear delivery rates
          </span>
          <h1 className="mt-4 font-syne text-3xl font-extrabold leading-tight tracking-tight text-on-surface sm:text-4xl lg:text-5xl">
            Choose a route. <span className="text-primary">Know the price.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant sm:text-base sm:leading-7">
            Compare delivery zones, parcel weight rates, and available delivery speeds in one place.
          </p>
        </div>
      </div>
    </section>
  );
}

function ZoneRatesPriceList({ rateTable }) {
  return (
    <section className="w-full bg-surface py-8 sm:py-10 lg:py-12" id="price-list">
      <div className="mx-auto max-w-7xl space-y-5 px-4 sm:space-y-6 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-primary">01 · By delivery zone</p>
            <h2 className="mt-1 font-syne text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">Full price list</h2>
            <p className="mt-1.5 max-w-2xl text-xs leading-5 text-on-surface-variant sm:text-sm">Starting rate and weight charges for each route. Prices are per parcel.</p>
          </div>
          <span className="hidden shrink-0 rounded-full border border-outline-variant/40 bg-white px-3 py-1.5 text-xs font-semibold text-on-surface-variant sm:inline-flex">{rateTable.length} zones</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {rateTable.map((rate) => (
            <article className="group rounded-2xl border border-outline-variant/35 bg-surface-container-lowest p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:p-5" key={rate.zoneKey}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${rate.dot}`} />
                    <h3 className="font-syne text-sm font-bold leading-snug text-on-surface sm:text-base">{rate.zone}</h3>
                  </div>
                  <p className="mt-1 pl-[18px] text-xs leading-5 text-on-surface-variant">{rate.sub || 'Delivery zone'}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface-container-low px-2 py-1 text-[10px] font-semibold text-on-surface-variant"><Clock3 aria-hidden="true" className="h-3 w-3 text-primary" />{rate.sla}</span>
              </div>
              <div className="mt-4 rounded-xl bg-primary-fixed/35 px-3.5 py-3">
                <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">Starting rate</p>
                <p className="mt-0.5 font-syne text-3xl font-extrabold tracking-tight text-primary">{rate.base}</p>
              </div>
              <dl className="mt-3 divide-y divide-outline-variant/30 text-xs">
                <RateRow label="1–2 kg" value={rate.kg2} />
                <RateRow label="2–3 kg" value={rate.kg3} />
                <RateRow label="Each extra kg" value={rate.extra} />
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RateRow({ label, value }) {
  return <div className="flex items-center justify-between gap-3 py-2"><dt className="text-on-surface-variant">{label}</dt><dd className="font-mono font-bold text-on-surface">{value}</dd></div>;
}

function ZoneRatesSpeedList({ currencySymbol, deliverySpeeds, rateTable }) {
  if (!deliverySpeeds.length) return null;

  return (
    <section className="w-full bg-surface-container-low py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl space-y-5 px-4 sm:space-y-6 sm:px-6 lg:px-8">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-primary">02 · Choose your timing</p>
          <h2 className="mt-1 font-syne text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">Delivery speeds</h2>
          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-on-surface-variant sm:text-sm">Available delivery options and their current prices.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {deliverySpeeds.map((service, index) => {
            const Icon = service.id?.includes('SAME') ? Zap : index === 0 ? PackageCheck : Clock3;
            const zonePrices = rateTable.filter((rate) => service.zonePrices?.[rate.zoneKey] != null);
            return (
              <article className="flex min-w-0 flex-col rounded-2xl border border-outline-variant/35 bg-surface-container-lowest p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:p-5" key={service.id}>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed/50 text-primary"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-syne text-base font-bold text-on-surface sm:text-lg">{service.name}</h3>
                    {service.eta && <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-primary"><Clock3 aria-hidden="true" className="h-3.5 w-3.5" />{service.eta}</p>}
                  </div>
                </div>
                {service.description && <p className="mt-3 min-h-10 text-xs leading-5 text-on-surface-variant sm:text-sm">{service.description}</p>}
                <div className="mt-4 border-t border-outline-variant/35 pt-3">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-outline">Price</p>
                  {service.priceMode === 'BASE' && <p className="mt-1 text-sm font-bold text-on-surface">Included in the zone rate</p>}
                  {service.priceMode === 'FLAT_FEE' && <p className="mt-1 font-syne text-xl font-extrabold text-primary">+{currencySymbol}{Number(service.flatFee || 0).toLocaleString()} <span className="font-sans text-xs font-semibold text-on-surface-variant">per parcel</span></p>}
                  {service.priceMode === 'ZONE_PRICE' && (zonePrices.length ? (
                    <dl className="mt-2 grid grid-cols-1 gap-1.5 min-[400px]:grid-cols-2">
                      {zonePrices.map((rate) => <div className="flex min-w-0 items-center justify-between gap-2 rounded-lg bg-surface-container-low px-2.5 py-2" key={rate.zoneKey}><dt className="truncate text-[11px] text-on-surface-variant">{rate.zone}</dt><dd className="shrink-0 font-mono text-xs font-bold text-primary">{currencySymbol}{Number(service.zonePrices[rate.zoneKey]).toLocaleString()}</dd></div>)}
                    </dl>
                  ) : <p className="mt-1 text-sm font-semibold text-on-surface-variant">Price depends on the route</p>)}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ZoneRatesExtras() {
  return (
    <section className="w-full bg-surface py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl space-y-5 px-4 sm:space-y-6 sm:px-6 lg:px-8">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-primary">03 · Optional add-ons</p>
          <h2 className="mt-1 font-syne text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">Extra options</h2>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3 sm:gap-3">
            {extras.map((x) => (
              <div key={x.label} className="flex min-w-0 items-center gap-3 rounded-2xl border border-outline-variant/35 bg-surface-container-lowest p-3.5 shadow-sm sm:p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-fixed/50 text-primary"><span className="material-symbols-outlined text-lg">{x.icon}</span></span>
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-bold text-on-surface">{x.label}</p>
                  <p className="mt-0.5 text-xs leading-4 text-on-surface-variant">{x.note}</p>
                </div>
                <span className="shrink-0 rounded-full bg-surface-container-low px-2.5 py-1 font-mono text-[11px] font-bold text-primary">{x.price}</span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function ZoneRatesFaq() {
  return (
<section className="w-full bg-surface-container-low py-8 sm:py-10 lg:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
          <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-primary">04 · Need to know</p><h2 className="mt-1 font-syne text-2xl sm:text-3xl text-on-surface font-extrabold tracking-tight">Common questions</h2></div>
          {faqs.map((f) => (
            <details className="group rounded-2xl border border-outline-variant/35 bg-surface-container-lowest px-4 py-3.5 shadow-sm" key={f.q}>
              <summary className="flex items-center justify-between gap-3 font-sans text-sm font-semibold text-on-surface cursor-pointer list-none">
                <span>{f.q}</span>
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform shrink-0">expand_more</span>
              </summary>
              <p className="pt-2.5 font-sans text-sm text-on-surface-variant leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
  );
}

function ZoneRatesCta() {
  return (
<section className="w-full bg-surface py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-[#3a2b20] bg-linear-to-br from-[#241a13] via-[#302116] to-[#4b2b16] p-5 text-white shadow-lg shadow-[#4a2a14]/10 sm:flex-row sm:items-center sm:justify-between sm:p-7 lg:p-9 flex flex-col gap-5">
            <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
            <div className="relative space-y-1.5">
              <h2 className="font-syne text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to send a parcel?</h2>
              <p className="font-sans text-sm text-white/75 max-w-xl">Create a free account and book your first pickup.</p>
            </div>
            <Link className="relative inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-primary-fixed sm:w-auto" to="/registration">
              Create account <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
  );
}

function ZoneRatesPrintDocument({ currencySymbol, deliverySpeeds, rateTable }) {
  const publishedDate = new Intl.DateTimeFormat('en-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <article className="zone-rates-print-document" aria-label="Zone rates PDF document">
      <header className="zone-rates-print-header">
        <div>
          <p className="zone-rates-print-brand">MadiSynthia Courier Service</p>
          <p className="zone-rates-print-subtitle">Bangladesh delivery rates</p>
        </div>
        <p className="zone-rates-print-date">Prepared {publishedDate}</p>
      </header>
      <h1>Zone rate schedule</h1>
      <p className="zone-rates-print-intro">Delivery prices by route and parcel weight. All prices are shown in {currencySymbol}.</p>
      <table>
        <thead>
          <tr>
            <th scope="col">Delivery zone</th>
            <th scope="col">Coverage</th>
            <th scope="col">Base rate</th>
            <th scope="col">1–2 kg</th>
            <th scope="col">2–3 kg</th>
            <th scope="col">Each extra kg</th>
            <th scope="col">Estimated time</th>
          </tr>
        </thead>
        <tbody>
          {rateTable.map((rate) => (
            <tr key={rate.zoneKey}>
              <th scope="row">{rate.zone}</th>
              <td>{rate.sub || '—'}</td>
              <td>{rate.base}</td>
              <td>{rate.kg2}</td>
              <td>{rate.kg3}</td>
              <td>{rate.extra}</td>
              <td>{rate.sla || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {deliverySpeeds.length > 0 && (
        <section className="zone-rates-print-speeds">
          <h2>Delivery speeds</h2>
          <table>
            <thead>
              <tr><th scope="col">Service</th><th scope="col">Estimated time</th><th scope="col">Price</th></tr>
            </thead>
            <tbody>
              {deliverySpeeds.map((service) => {
                const zonePrices = rateTable
                  .filter((rate) => service.zonePrices?.[rate.zoneKey] != null)
                  .map((rate) => `${rate.zone}: ${currencySymbol}${Number(service.zonePrices[rate.zoneKey]).toLocaleString()}`)
                  .join('; ');
                const price = service.priceMode === 'BASE'
                  ? 'Included in zone rate'
                  : service.priceMode === 'FLAT_FEE'
                    ? `+${currencySymbol}${Number(service.flatFee || 0).toLocaleString()} per parcel`
                    : zonePrices || 'Price depends on the route';
                return <tr key={service.id}><th scope="row">{service.name}</th><td>{service.eta || '—'}</td><td>{price}</td></tr>;
              })}
            </tbody>
          </table>
        </section>
      )}
      <p className="zone-rates-print-note">Rates shown are per parcel. Final delivery charges are calculated from the saved tariff and the parcel details.</p>
      <footer className="zone-rates-print-footer">MadiSynthia Courier Service · Bangladesh</footer>
    </article>
  );
}
