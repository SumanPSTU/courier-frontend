import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../api/orders';

const divisions = [
  { name: 'Dhaka', districts: ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'] },
  { name: 'Chattogram', districts: ['Bandarban', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Cumilla', "Cox's Bazar", 'Feni', 'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati'] },
  { name: 'Rajshahi', districts: ['Bogura', 'Joypurhat', 'Naogaon', 'Natore', 'Chapainawabganj', 'Pabna', 'Rajshahi', 'Sirajganj'] },
  { name: 'Khulna', districts: ['Bagerhat', 'Chuadanga', 'Jashore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'] },
  { name: 'Barishal', districts: ['Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'] },
  { name: 'Sylhet', districts: ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'] },
  { name: 'Rangpur', districts: ['Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon'] },
  { name: 'Mymensingh', districts: ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur'] },
];

const rateColumns = [
  ['transit', 'Transit window'],
  ['base', 'Base fare (up to 1 kg)'],
  ['additional', 'Additional (per kg)'],
  ['cod', 'COD surcharge'],
  ['rto', 'Return-to-origin'],
  ['mode', 'Transit mode'],
];

const ZONE_MODE_MAP = {
  INSIDE_DHAKA: 'Motorbike Dispatch',
  DHAKA_SUBURBAN: 'Dedicated Covered Van',
  OUTSIDE_DHAKA: 'Trunk Linehaul Van',
  DISTRICT_TO_DISTRICT: 'Multi-Hub Linehaul Van',
};

const ZONE_TERRITORY_MAP = {
  INSIDE_DHAKA: 'Within DCC North & South Areas',
  DHAKA_SUBURBAN: 'Savar, Ashulia, Gazipur, Keraniganj, Narayanganj',
  OUTSIDE_DHAKA: 'All Sadar municipalities & 495 Upazila outposts',
  DISTRICT_TO_DISTRICT: 'e.g., Sylhet to Chattogram or Rajshahi to Khulna direct',
};

const ZONE_TRANSIT_MAP = {
  INSIDE_DHAKA: '24 Hours (Next-Day)',
  DHAKA_SUBURBAN: '24–48 Hours',
  OUTSIDE_DHAKA: '48–72 Hours',
  DISTRICT_TO_DISTRICT: '48–72 Hours',
};

const ZONE_LABEL_MAP = {
  INSIDE_DHAKA: 'Inside Dhaka Metro',
  DHAKA_SUBURBAN: 'Dhaka Suburban Corridor',
  OUTSIDE_DHAKA: 'Outside Dhaka (All 64 Districts)',
  DISTRICT_TO_DISTRICT: 'District to District (Inter-Divisional)',
};

export default function Coverage() {
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

  const shippingRates = useMemo(() => {
    if (!pricingData) return [];
    return pricingData.zoneConfigs.map((z) => ({
      zone: ZONE_LABEL_MAP[z.zoneKey],
      territory: ZONE_TERRITORY_MAP[z.zoneKey],
      transit: ZONE_TRANSIT_MAP[z.zoneKey],
      base: `৳${z.basePrice}`,
      additional: `৳${z.weightSurchargePerKg} / KG`,
      cod: `${z.codPercentage}% Flat`,
      rto: `50% Base (৳${(z.basePrice * 0.5).toFixed(2)})`,
      mode: ZONE_MODE_MAP[z.zoneKey],
    }));
  }, [pricingData]);

  if (loading) {
    return (
      <section className="w-full px-6 lg:px-12 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-100">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full px-6 lg:px-12 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-error">Failed to load pricing data: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 lg:px-12 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto">
        <CoverageIntro />

        <CoverageDivisions />

        <CoverageRatesSection shippingRates={shippingRates} />

        <CoverageRatesNote />
      </div>
    </section>
  );
}


function CoverageIntro() {
  return (
<div className="max-w-3xl mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-mono text-xs uppercase font-bold tracking-wider">
            <span className="material-symbols-outlined text-sm">public</span> Nationwide delivery network
          </span>
          <h1 className="font-syne font-extrabold text-3xl sm:text-5xl text-on-surface tracking-tight mt-4">Coverage across all 64 districts</h1>
          <p className="font-sans text-base text-on-surface-variant mt-3">Explore our delivery coverage by division. We serve every district in Bangladesh.</p>
        </div>
  );
}

function CoverageDivisions() {
  return (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {divisions.map(({ name, districts }) => (
            <article key={name} className="rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="font-syne text-lg font-bold text-on-surface">{name} Division</h2>
                <span className="font-mono text-xs text-primary bg-primary-fixed px-2 py-1 rounded">{districts.length} districts</span>
              </div>
              <ul className="flex flex-col gap-2">
                {districts.map((district) => (
                  <li key={district} className="flex items-center gap-2 font-sans text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-base">location_on</span>{district}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
  );
}

function CoverageRatesSection({ shippingRates }) {
  return (
<section className="mt-12" aria-labelledby="shipping-rates-title">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
            <div>
              <span className="font-mono text-xs uppercase font-bold tracking-wider text-primary">Transparent pricing</span>
              <h2 id="shipping-rates-title" className="font-syne font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight mt-1">Official Standard Shipping Rates (2025 Schedule)</h2>
              <p className="font-sans text-sm text-on-surface-variant mt-2 max-w-3xl">No hidden fuel surcharges, no surprise return surcharges. Every rate includes real-time SMS alerts and live parcel track-and-trace.</p>
            </div>
            <Link className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-mono text-xs uppercase font-bold tracking-wide transition-colors" to="/calculate-shipping">
              <span className="material-symbols-outlined text-base">calculate</span> Open Dynamic Calculator
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-outline-variant/40 shadow-sm">
            <table className="w-full min-w-262.5 border-collapse text-left">
              <thead className="bg-surface-container text-on-surface">
                <tr>
                  <th className="p-4 font-mono text-[11px] uppercase tracking-wider">Delivery zone / territory</th>
                  {rateColumns.map(([, label]) => <th key={label} className="p-4 font-mono text-[11px] uppercase tracking-wider">{label}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 bg-surface-container-lowest">
                {shippingRates.map((rate) => (
                  <tr key={rate.zone} className="align-top hover:bg-surface-container-low transition-colors">
                    <th scope="row" className="p-4 min-w-58.75 font-sans text-sm font-bold text-on-surface">
                      {rate.zone}<span className="block mt-1 font-normal text-xs leading-relaxed text-on-surface-variant">{rate.territory}</span>
                    </th>
                    {rateColumns.map(([key]) => <td key={key} className="p-4 font-sans text-sm text-on-surface-variant whitespace-nowrap">{rate[key]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
  );
}

function CoverageRatesNote() {
  return (
<div className="mt-6 p-4 rounded-xl bg-linear-to-r from-secondary-container/30 via-primary-fixed/40 to-secondary-container/20 text-on-surface font-sans text-sm">
          <strong className="text-primary">64 districts covered.</strong> Check the delivery rates page for an estimate to your destination.
        </div>
  );
}