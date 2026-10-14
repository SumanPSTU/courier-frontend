import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownUp, ArrowRight, Check, Clock3, Copy, Info, Package, Route, Scale, ShieldCheck, Truck } from 'lucide-react';
import { ordersApi } from '../api/orders';

const districts = [
  'Bagerhat', 'Bandarban', 'Barguna', 'Barishal', 'Bhola', 'Bogura', 'Brahmanbaria', 'Chandpur',
  'Chattogram', 'Chuadanga', 'Cumilla', "Cox's Bazar", 'Dhaka', 'Dinajpur', 'Faridpur', 'Feni',
  'Gaibandha', 'Gazipur', 'Gopalganj', 'Habiganj', 'Jamalpur', 'Jashore', 'Jhalokati', 'Jhenaidah',
  'Joypurhat', 'Khagrachhari', 'Khulna', 'Kishoreganj', 'Kurigram', 'Kushtia', 'Lakshmipur', 'Lalmonirhat',
  'Madaripur', 'Magura', 'Manikganj', 'Meherpur', 'Moulvibazar', 'Munshiganj', 'Mymensingh', 'Naogaon',
  'Narail', 'Narayanganj', 'Narsingdi', 'Natore', 'Netrokona', 'Nilphamari', 'Noakhali', 'Pabna',
  'Panchagarh', 'Patuakhali', 'Pirojpur', 'Rajbari', 'Rajshahi', 'Rangamati', 'Rangpur', 'Satkhira',
  'Shariatpur', 'Sherpur', 'Sirajganj', 'Sunamganj', 'Sylhet', 'Tangail', 'Thakurgaon',
];

export default function CalculateShipping() {
  const [pickupDistrict, setPickupDistrict] = useState('Dhaka');
  const [deliveryDistrict, setDeliveryDistrict] = useState('Chattogram');
  const [weight, setWeight] = useState('1');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PREPAID');
  const [codAmount, setCodAmount] = useState('0');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');

  const copyEstimate = async () => {
    if (!quote) return;
    const text = [
      'Delivery estimate',
      `${pickupDistrict} → ${deliveryDistrict}`,
      `Billable weight: ${quote.billableWeightKg.toFixed(2)} kg`,
      `Estimated total: ৳${quote.breakdown.totalDeliveryFee.toFixed(2)}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopyError('');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyError('Copy is unavailable in this browser.');
    }
  };

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      if (active) {
        setLoading(true);
        setQuote(null);
        setError('');
      }
      try {
        const { data } = await ordersApi.estimate({
          pickupAddress: { district: pickupDistrict },
          deliveryAddress: { district: deliveryDistrict },
          parcel: {
            actualWeight: Number(weight),
            dimensions: {
              length: Number(length) || 0,
              width: Number(width) || 0,
              height: Number(height) || 0,
            },
          },
          paymentMethod,
          codAmount: paymentMethod === 'COD' ? Number(codAmount) || 0 : 0,
        });
        if (active) setQuote(data.data);
      } catch (requestError) {
        if (active) {
          setQuote(null);
          setError(requestError.response?.data?.message || 'We couldn’t calculate this route right now. Please try again.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [pickupDistrict, deliveryDistrict, weight, length, width, height, paymentMethod, codAmount]);

  return (
    <main className="min-h-screen bg-surface pb-24 lg:pb-14">
      <section className="relative overflow-hidden bg-linear-to-b from-surface via-surface-bright to-surface-container-low/60 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border border-primary/10 sm:right-16 sm:h-[30rem] sm:w-[30rem]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 top-8 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute right-12 top-8 h-56 w-56 rounded-full bg-secondary-container/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-7 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center lg:gap-12">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface-container-lowest px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary shadow-sm"><Truck className="h-3.5 w-3.5" /> Bangladesh delivery estimate</span>
            <h1 className="mt-4 max-w-2xl font-syne text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl lg:text-5xl">A clear route. A clearer delivery cost.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base">Choose the districts, parcel weight and payment method. The estimate uses the same zone tariff engine that prices orders.</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant sm:text-xs">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> District based pricing</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Volumetric weight support</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> COD fee preview</span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-[0_8px_28px_rgba(137,77,13,0.10)] sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Your route</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-fixed/55 px-2.5 py-1 text-[10px] font-bold text-primary"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> LIVE QUOTE</span>
            </div>
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className="min-w-0"><div className="flex items-center gap-1.5 text-outline"><span className="h-2 w-2 rounded-full border-2 border-primary" /><span className="font-mono text-[9px] font-bold uppercase tracking-wider">Pickup</span></div><p className="mt-1 truncate pl-3.5 text-sm font-bold text-on-surface sm:text-base">{pickupDistrict}</p></div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/15 bg-primary-fixed/40 text-primary"><ArrowRight className="h-4 w-4" /></span>
              <div className="min-w-0 text-right"><div className="flex items-center justify-end gap-1.5 text-outline"><span className="font-mono text-[9px] font-bold uppercase tracking-wider">Delivery</span><span className="h-2 w-2 rounded-sm bg-secondary" /></div><p className="mt-1 truncate pr-3.5 text-sm font-bold text-on-surface sm:text-base">{deliveryDistrict}</p></div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-outline-variant/35 pt-3"><span className="text-xs text-on-surface-variant">Estimated delivery charge</span><span className="font-syne text-xl font-extrabold text-primary">{quote ? `৳${quote.breakdown.totalDeliveryFee.toFixed(2)}` : loading ? '…' : '—'}</span></div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl items-start gap-5 px-4 pt-6 sm:px-6 sm:pt-8 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-7 lg:px-8">
        <div className="space-y-5">
          <section className="overflow-hidden rounded-2xl border border-outline-variant/45 bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md">
            <div className="bg-linear-to-r from-surface-container-low to-white p-4 sm:p-6"><SectionTitle icon={Route} number="01" title="Set your route" subtitle="Choose pickup and delivery districts" /></div>
            <div className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              <DistrictSelect label="Pickup district" value={pickupDistrict} onChange={setPickupDistrict} icon="A" />
              <button aria-label="Swap pickup and delivery districts" className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/50 bg-surface text-xs font-semibold text-on-surface-variant transition hover:border-primary/50 hover:text-primary sm:mb-0.5 sm:h-11 sm:w-11" onClick={() => { setPickupDistrict(deliveryDistrict); setDeliveryDistrict(pickupDistrict); }} type="button"><ArrowDownUp className="h-4 w-4" /><span className="sm:hidden">Swap route</span></button>
              <DistrictSelect label="Delivery district" value={deliveryDistrict} onChange={setDeliveryDistrict} icon="B" />
            </div>
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-secondary/20 bg-secondary-fixed/25 p-3 text-xs leading-relaxed text-on-surface-variant"><Info className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />Rates use district zones. Your exact area and final payable charge are confirmed when you create the booking.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-outline-variant/45 bg-surface-container-lowest p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
            <SectionTitle icon={Package} number="02" title="Parcel details" subtitle="Billable weight uses actual or volumetric weight, whichever is higher" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Actual weight (kg)</span>
                <div className="relative"><input aria-invalid={weight !== '' && (Number(weight) <= 0 || Number(weight) > 100)} className={`${inputClass} pr-12 ${weight !== '' && (Number(weight) <= 0 || Number(weight) > 100) ? 'border-error focus:border-error focus:ring-error/15' : ''}`} min="0.1" max="100" step="0.1" type="number" value={weight} onChange={(event) => setWeight(event.target.value)} /><span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-outline">KG</span></div>
                {weight !== '' && (Number(weight) <= 0 || Number(weight) > 100) && <span className="mt-1.5 block text-xs font-medium text-error">Enter a weight between 0.1 and 100 kg.</span>}
              </label>
              <div className="rounded-xl bg-surface-container-low p-3.5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Weight rule</p>
                <p className="mt-1 text-sm font-semibold text-on-surface">First 1 kg included</p>
                <p className="mt-0.5 text-xs text-on-surface-variant">Additional kg is rounded up and charged by zone tariff.</p>
              </div>
            </div>
            <details className="mt-5 group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl border border-outline-variant/40 px-4 py-3 text-sm font-semibold text-on-surface transition hover:border-primary/40 hover:bg-surface-container-low"><span className="inline-flex items-center gap-2"><Scale className="h-4 w-4 text-primary" /> Add parcel dimensions <span className="font-normal text-on-surface-variant">(optional)</span></span><span className="text-primary transition-transform group-open:rotate-180">⌄</span></summary>
              <div className="mt-3 grid gap-3 rounded-xl bg-surface-container-low p-4 sm:grid-cols-3">
                <DimensionField label="Length (cm)" value={length} onChange={setLength} />
                <DimensionField label="Width (cm)" value={width} onChange={setWidth} />
                <DimensionField label="Height (cm)" value={height} onChange={setHeight} />
                <p className="text-xs leading-relaxed text-on-surface-variant sm:col-span-3">Volumetric weight is calculated as L × W × H ÷ 5000. It only affects the estimate when it exceeds actual weight.</p>
                {[length, width, height].some((value) => value !== '') && [length, width, height].some((value) => value === '') && <p className="text-xs font-medium text-secondary sm:col-span-3">Fill in all three dimensions to include volumetric weight.</p>}
              </div>
            </details>
          </section>

          <section className="rounded-2xl border border-outline-variant/45 bg-surface-container-lowest p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
            <SectionTitle icon={ShieldCheck} number="03" title="Payment method" subtitle="COD handling is estimated from the amount collected" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <PaymentChoice selected={paymentMethod === 'PREPAID'} title="Prepaid" text="No COD collection fee" onClick={() => setPaymentMethod('PREPAID')} />
              <PaymentChoice selected={paymentMethod === 'COD'} title="Cash on delivery" text="Includes the 1% COD handling fee" onClick={() => setPaymentMethod('COD')} />
            </div>
            {paymentMethod === 'COD' && <label className="mt-4 block max-w-sm"><span className={labelClass}>Amount to collect (৳)</span><input className={inputClass} min="0" step="1" type="number" value={codAmount} onChange={(event) => setCodAmount(event.target.value)} /></label>}
          </section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <section aria-live="polite" className="overflow-hidden rounded-2xl border border-outline-variant/45 bg-surface-container-lowest shadow-md">
            <div className="bg-linear-to-br from-primary to-primary-container p-5 text-on-primary sm:p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">Live rate estimate</p>
              <div className="mt-2 flex items-end justify-between gap-3"><h2 className="font-syne text-xl font-bold">Delivery total</h2>{quote && <p className="font-syne text-3xl font-extrabold">৳{quote.breakdown.totalDeliveryFee.toFixed(2)}</p>}</div>
              {quote && <p className="mt-2 text-xs text-white/80">{quote.zone.replaceAll('_', ' ')} · {quote.billableWeightKg.toFixed(2)} kg billable</p>}
              {loading && <div className="mt-3 flex items-center gap-2 text-xs text-white/80"><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Updating estimate…</div>}
            </div>
            <div className="space-y-3 p-5 sm:p-6">
              {error ? <p className="rounded-xl border border-error/20 bg-error-container/50 p-3 text-sm text-on-error-container">{error}</p> : quote ? <>
              <BreakdownRow label="Base delivery fee" value={quote.breakdown.baseAndDistanceFee} />
              <BreakdownRow label={`Weight surcharge · ${quote.billableWeightKg.toFixed(2)} kg`} value={quote.breakdown.weightSurcharge} />
              {paymentMethod === 'COD' && <BreakdownRow label="COD handling" value={quote.breakdown.codFee} />}
              <div className="border-t border-outline-variant/40 pt-3"><BreakdownRow label="Estimated total" value={quote.breakdown.totalDeliveryFee} strong /></div>
                {quote.isVolumetricApplied && <p className="rounded-lg bg-primary-fixed/45 px-3 py-2 text-xs text-on-surface-variant">Volumetric weight is used for this estimate.</p>}
                <button className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/50 bg-white px-4 py-2 text-xs font-bold text-on-surface transition hover:border-primary/40 hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50" disabled={!quote || loading} onClick={copyEstimate} type="button"><Copy className="h-3.5 w-3.5 text-primary" />{copied ? 'Estimate copied' : 'Copy estimate'}</button>
                {copyError && <p className="text-center text-xs text-error">{copyError}</p>}
              </> : <p className="text-sm text-on-surface-variant">Enter parcel details to calculate your route.</p>}
              <div className="rounded-xl bg-surface-container-low p-3.5"><p className="flex items-center gap-2 text-sm font-bold text-on-surface"><Clock3 className="h-4 w-4 text-primary" />Calculated with current tariff rules</p><p className="mt-1 text-xs leading-relaxed text-on-surface-variant">The booking server recalculates the final charge using the same pricing engine.</p></div>
              <Link className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-container" to="/book-delivery">Continue to book <ArrowRight className="h-4 w-4" /></Link>
              <p className="text-center text-[11px] leading-relaxed text-on-surface-variant">Estimate only. The confirmed charge appears with your booking.</p>
            </div>
          </section>
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-outline-variant/40 bg-surface-container-lowest/95 p-3 shadow-[0_-8px_30px_rgba(35,26,17,0.10)] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="min-w-0"><p className="font-mono text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">Your estimate</p><p className="truncate font-syne text-xl font-extrabold text-primary">{quote ? `৳${quote.breakdown.totalDeliveryFee.toFixed(2)}` : loading ? 'Updating…' : 'Unavailable'}</p></div>
          <Link className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-container" to="/book-delivery">Continue <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </main>
  );
}

const labelClass = 'mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant';
const inputClass = 'w-full rounded-xl border border-outline-variant/60 bg-surface px-3.5 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15';

function SectionTitle({ icon: Icon, number, title, subtitle }) {
  return <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed/60 text-primary"><Icon className="h-5 w-5" /></span><div><div className="flex items-center gap-2"><span className="font-mono text-[10px] font-bold tracking-widest text-primary">{number}</span><h2 className="font-syne text-lg font-bold text-on-surface">{title}</h2></div><p className="mt-0.5 text-xs leading-relaxed text-on-surface-variant">{subtitle}</p></div></div>;
}

function DistrictSelect({ label, value, onChange, icon }) {
  return <label className="block"><span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant"><span className={`flex h-5 w-5 items-center justify-center rounded-md text-[9px] font-extrabold ${icon === 'A' ? 'bg-primary-fixed text-primary' : 'bg-secondary-fixed text-on-secondary-container'}`}>{icon}</span>{label}</span><select className={`${inputClass} cursor-pointer font-semibold`} value={value} onChange={(event) => onChange(event.target.value)}>{districts.map((district) => <option key={district} value={district}>{district}</option>)}</select></label>;
}

function DimensionField({ label, value, onChange }) {
  return <label className="block"><span className={labelClass}>{label}</span><input className={inputClass} min="0" step="0.1" type="number" value={value} onChange={(event) => onChange(event.target.value)} placeholder="0" /></label>;
}

function PaymentChoice({ selected, title, text, onClick }) {
  return <button aria-pressed={selected} className={`rounded-xl border p-4 text-left transition ${selected ? 'border-primary bg-primary-fixed/30 ring-1 ring-primary/25' : 'border-outline-variant/50 bg-surface hover:border-primary/40'}`} onClick={onClick} type="button"><span className="flex items-center justify-between text-sm font-bold text-on-surface">{title}{selected && <Check className="h-4 w-4 text-primary" />}</span><span className="mt-1 block text-xs text-on-surface-variant">{text}</span></button>;
}

function BreakdownRow({ label, value, strong = false }) {
  return <div className={`flex items-center justify-between gap-3 ${strong ? 'text-sm font-bold text-on-surface' : 'text-sm text-on-surface-variant'}`}><span>{label}</span><span className={`shrink-0 font-mono ${strong ? 'text-primary' : 'font-semibold text-on-surface'}`}>৳{value.toFixed(2)}</span></div>;
}
