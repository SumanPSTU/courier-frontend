import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth';
import { inputClass } from '../components/ui/TextField';
import { useAuthContext } from '../context/authContextValue';
import warehouse2 from '../assets/warehouse2.png';


export default function Registration() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', termsAccepted: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        termsAccepted: form.termsAccepted,
      });
      // Registration must not leave a previous browser session active.
      await logout();
      const requestedNext = searchParams.get('next');
      const next = requestedNext?.startsWith('/') && !requestedNext.startsWith('//') ? requestedNext : '/';
      navigate(`/login?next=${encodeURIComponent(next)}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'We could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="w-full bg-linear-to-r from-secondary-container/30 via-primary-fixed/40 to-secondary-container/20 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-on-surface">
          <div className="min-w-0"><p className="min-w-0 text-sm"><strong className="font-semibold text-primary">Welcome to MadiSynthia:</strong> <span className="hidden sm:inline">Create your account to track deliveries and manage your recipient details.</span><span className="sm:hidden">Create your account to track deliveries.</span></p></div>
          <span className="hidden shrink-0 items-center gap-1 rounded bg-surface-container-lowest/80 px-2.5 py-1 font-mono text-xs font-semibold uppercase text-primary shadow-sm sm:inline-flex"><span className="h-1.5 w-1.5 animate-ping rounded-full bg-primary" />64 Districts Active</span>
        </div>
      </section>

      <main className="w-full px-4 py-6 sm:px-6 lg:px-12 lg:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <RegistrationBenefits />

          <section className="relative order-1 flex min-w-0 flex-col gap-4 lg:order-2 lg:col-span-5">
            <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl bg-surface-container-lowest p-4 shadow-md sm:p-10">
              <div className="absolute left-0 right-0 top-0 h-1.5 bg-linear-to-r from-primary via-secondary to-primary-container" />
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-syne text-2xl text-on-surface">Create Account</h2><span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-xs font-semibold uppercase text-primary">Recipient</span></div>
                <p className="font-sans text-sm text-on-surface-variant">Takes about 2 minutes. Start tracking parcels and paying COD online.</p>
              </div>

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center justify-between font-mono text-xs font-semibold uppercase text-on-surface" htmlFor="name"><span>Full Name</span><span className="text-[11px] font-normal normal-case text-on-surface-variant">As shown on deliveries</span></label>
                  <div className="relative flex items-center"><span className="material-symbols-outlined absolute left-3 text-[18px] text-on-surface-variant">person</span><input autoComplete="name" className={`${inputClass} pl-10`} id="name" name="name" onChange={update} placeholder="Your full name" required value={form.name} /></div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs font-semibold uppercase text-on-surface" htmlFor="email"><span>Email Address</span></label>
                  <div className="relative flex items-center"><span className="material-symbols-outlined absolute left-3 flex items-center text-[18px] text-on-surface-variant">mail</span><input autoComplete="email" className={`${inputClass} pl-10`} id="email" name="email" onChange={update} placeholder="you@example.com" required type="email" value={form.email} /></div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center justify-between font-mono text-xs font-semibold uppercase text-on-surface" htmlFor="phone"><span>Phone Number</span><span className="text-[11px] font-normal normal-case text-on-surface-variant">Bangladesh format</span></label>
                  <div className="relative flex items-center"><span className="material-symbols-outlined absolute left-3 text-[18px] text-on-surface-variant">phone_iphone</span><input autoComplete="tel" className={`${inputClass} pl-10`} id="phone" name="phone" onChange={update} placeholder="01XXXXXXXXX" required type="tel" value={form.phone} /></div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs font-semibold uppercase text-on-surface" htmlFor="password">Password</label>
                  <div className="relative flex items-center"><span className="material-symbols-outlined pointer-events-none absolute left-3 text-[18px] text-on-surface-variant">lock</span><input autoComplete="new-password" className={`${inputClass} pr-12 pl-10`} id="password" minLength={8} name="password" onChange={update} placeholder="At least 8 characters" required type={showPassword ? 'text' : 'password'} value={form.password} /><button aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 flex items-center justify-center p-1 text-on-surface-variant hover:text-on-surface" onClick={() => setShowPassword((visible) => !visible)} type="button"><span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span></button></div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs font-semibold uppercase text-on-surface" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="relative flex items-center"><span className="material-symbols-outlined pointer-events-none absolute left-3 text-[18px] text-on-surface-variant">lock</span><input autoComplete="new-password" className={`${inputClass} pl-10`} id="confirmPassword" minLength={8} name="confirmPassword" onChange={update} placeholder="Re-enter your password" required type={showPassword ? 'text' : 'password'} value={form.confirmPassword} /></div>
                </div>

                {error && <p aria-live="polite" className="rounded bg-error-container p-3 text-sm text-on-error-container">{error}</p>}

                <button className="flex w-full items-center justify-center gap-2 rounded bg-primary px-4 py-3 font-syne text-base font-semibold tracking-wide text-on-primary shadow-[0_4px_16px_rgba(137,77,13,0.25)] transition-all hover:bg-primary-container hover:shadow-[0_6px_20px_rgba(137,77,13,0.35)] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70" disabled={loading} type="submit">
                  {loading ? <><span className="mr-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-on-primary border-t-transparent" />Creating Account…</> : <>Create My Account<span className="material-symbols-outlined text-[18px]">arrow_forward</span></>}
                </button>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-outline-variant/60 bg-surface-container-low p-3 text-sm text-on-surface">
                  <input
                    checked={form.termsAccepted}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                    name="termsAccepted"
                    onChange={(event) => setForm((current) => ({ ...current, termsAccepted: event.target.checked }))}
                    required
                    type="checkbox"
                  />
                  <span>
                    I have read and agree to the{' '}
                    <Link className="font-semibold text-primary underline underline-offset-2 hover:text-primary-container" onClick={(event) => event.stopPropagation()} target="_blank" to="/terms-and-condition">Terms and Conditions</Link>
                    {' '}and{' '}
                    <Link className="font-semibold text-primary underline underline-offset-2 hover:text-primary-container" onClick={(event) => event.stopPropagation()} target="_blank" to="/privacy-policy">Privacy Policy</Link>.
                  </span>
                </label>
              </form>

              <div className="my-1 h-px w-full bg-surface-container-high" />
              <p className="text-center font-sans text-sm text-on-surface-variant">Already have an account? <Link className="ml-1 font-semibold text-primary hover:underline" to="/login">Sign In</Link></p>
            </div>

            <div className="grid grid-cols-2 gap-1 rounded-lg bg-surface-container-low px-2 py-2 sm:flex sm:items-center sm:justify-center sm:gap-5 sm:rounded-xl sm:px-3 sm:py-3">
              <span className="flex flex-col items-center gap-1 text-center font-mono text-[9px] uppercase leading-tight text-on-surface-variant sm:flex-row sm:gap-1.5 sm:text-xs">
                <span className="material-symbols-outlined text-base text-primary">verified</span>Secure Sign Up
              </span>
              <span className="flex flex-col items-center gap-1 text-center font-mono text-[9px] uppercase leading-tight text-on-surface-variant sm:flex-row sm:gap-1.5 sm:text-xs">
                <span className="material-symbols-outlined text-base text-secondary">lock</span>256-Bit SSL
              </span>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function RegistrationBenefits() {
  return (
<section className="order-2 hidden min-w-0 flex-col gap-6 lg:order-1 lg:col-span-7 lg:flex">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded bg-primary-fixed px-2.5 py-1 font-mono text-xs font-semibold uppercase text-on-primary-fixed">
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                  Prestige Delivery Pass
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-surface-container-high px-2.5 py-1 font-mono text-xs font-medium uppercase text-on-surface-variant">
                  <span className="material-symbols-outlined text-[13px] text-tertiary">speed</span>
                  Instant Account Access
                </span>
              </div>
              <h1 className="mt-1 font-syne text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">Start Your Priority Recipient Account</h1>
              <p className="max-w-2xl text-sm text-on-surface-variant">Manage incoming deliveries across 64 districts with verified driver radar, dynamic doorstep PIN, and zero-fee bKash/Nagad digital COD.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { icon: 'pin', title: 'Dynamic Handover PIN', desc: 'Tamper-proof package release key for riders' },
                { icon: 'two_wheeler', title: 'Real-Time Motorbike Radar', desc: 'Direct line to assigned delivery hero' },
                { icon: 'schedule', title: 'Flexible Time Window', desc: 'Shift deliveries to evening or office hours with 1 tap' },
                { icon: 'qr_code_scanner', title: 'Digital Cash on Delivery', desc: 'Instant bKash, Nagad QR scan receipts at doorstep' },
              ].map((item, index) => (
                <div key={index} className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-4 shadow-sm transition-colors hover:bg-surface-container">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-lowest text-primary shadow-sm">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  </div>
                  <div><h2 className="font-syne text-base font-semibold text-on-surface">{item.title}</h2><p className="mt-0.5 text-sm text-on-surface-variant">{item.desc}</p></div>
                </div>
              ))}
            </div>

            <div className="group relative overflow-hidden rounded-xl shadow-md">
              <img alt="MadiSynthia courier warehouse and delivery operations" className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] sm:h-72" src={warehouse2} />
              <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-inverse-surface/85 via-inverse-surface/30 to-transparent p-4 text-on-tertiary-container sm:p-6">
                <div className="mb-1.5 flex items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1 font-mono text-xs font-semibold uppercase text-on-primary shadow-sm"><span className="material-symbols-outlined text-[14px]">local_shipping</span>Linehaul Fleet Serving 495 Thanas Nationwide</span></div>
                <p className="max-w-xl text-sm text-surface-container-highest">Equipped with telematics and smart parcel lockers, delivering over 45,000 doorstep consignments daily with zero tamper tolerance.</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-sm sm:flex-row">
              <div className="flex w-full items-center gap-3 sm:w-auto"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-primary"><span className="material-symbols-outlined text-[22px]">check_circle</span></div><div><p className="font-syne text-lg font-bold text-on-surface">99.4%</p><p className="font-mono text-xs uppercase text-on-surface-variant">On-Time Linehaul</p></div></div>
              <div className="hidden h-8 w-px bg-surface-variant sm:block" />
              <div className="flex w-full items-center gap-3 sm:w-auto"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-primary"><span className="material-symbols-outlined text-[22px]">groups</span></div><div><p className="font-syne text-lg font-bold text-on-surface">250,000+</p><p className="font-mono text-xs uppercase text-on-surface-variant">Active Recipients</p></div></div>
              <div className="hidden h-8 w-px bg-surface-variant sm:block" />
              <div className="flex w-full items-center gap-3 sm:w-auto"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-secondary"><span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span></div><div><p className="font-syne text-lg font-bold text-on-surface">4.9 ★</p><p className="font-mono text-xs uppercase text-on-surface-variant">Satisfaction Rating</p></div></div>
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-surface-container-low p-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-fixed font-mono text-sm font-bold text-primary">FR</div>
              <div className="flex flex-col gap-1"><div className="flex items-center gap-1 text-secondary">{[...Array(5)].map((_, index) => <span key={index} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}</div><p className="text-sm italic text-on-surface">"The dynamic handover PIN is a game changer for online shopping deliveries. The courier doesn't hand over my package until I verify on my portal, and paying COD via bKash QR took literally three seconds."</p><p className="font-mono text-xs text-on-surface-variant">— <strong className="text-on-surface">Farhana Rahman</strong>, Uttara Sector 7, Dhaka (Verified Recipient)</p></div>
            </div>
          </section>
  );
}
