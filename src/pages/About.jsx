import { Link } from 'react-router-dom';
import CompanyPage from '../components/CompanyPage';
import { useLanguage } from '../context/languageContextValue';
import warehouse2 from '../assets/warehouse2.png';

const reasons = [
  { icon: 'travel_explore', title: 'Reach across Bangladesh', text: 'Plan deliveries across a network designed for all 64 districts.' },
  { icon: 'monitoring', title: 'Stay informed', text: 'Use shipment tracking to follow the latest available parcel updates.' },
  { icon: 'support_agent', title: 'Help when you need it', text: 'Get in touch with our team for delivery and service questions.' },
];

const steps = [
  { number: '01', title: 'Prepare your parcel', text: 'Pack securely and check sender, recipient, address, and phone details.' },
  { number: '02', title: 'Choose your service', text: 'Review the delivery options and estimate the rate for your destination.' },
  { number: '03', title: 'Follow the journey', text: 'Keep the consignment number handy and check tracking for updates.' },
];

function ReasonCard({ icon, title, text, t }) {
  return (
    <article className="h-full rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <span className="material-symbols-outlined mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-xl leading-none text-primary">{icon}</span>
      <h3 className="mt-4 font-syne text-base font-bold text-on-surface sm:text-lg">{t(title)}</h3>
      <p className="mt-2 text-sm leading-6 text-on-surface-variant">{t(text)}</p>
    </article>
  );
}

export default function About() {
  const { t } = useLanguage();
  return <CompanyPage
    title="About Us"
    intro="MadiSynthia Courier Service helps businesses send and customers receive parcels across Bangladesh. We bring delivery planning, tracking, and support together to make each step easier to understand—from preparing a parcel to its final handover."
    highlights={[
      { icon: 'map', value: '64', label: 'District coverage' },
      { icon: 'route', value: '495', label: 'Thanas served' },
      { icon: 'track_changes', value: 'One place', label: 'For shipment updates' },
    ]}
  >
    <section className="mb-8 grid overflow-hidden rounded-2xl border border-primary/15 bg-surface-container-lowest shadow-md lg:grid-cols-2">
      <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary-fixed px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-on-secondary-fixed"><span className="material-symbols-outlined text-sm leading-none">moving</span>{t('Delivery that keeps business moving')}</span>
        <h2 className="mt-4 font-syne text-2xl font-extrabold leading-tight text-on-surface sm:text-3xl">{t('A simpler way to move every parcel forward.')}</h2>
        <p className="mt-3 text-sm leading-7 text-on-surface-variant">{t('Whether you are shipping customer orders or waiting for a delivery, the right information makes the experience smoother. MadiSynthia brings service options, rate planning, tracking, and support into one connected courier experience.')}</p>
        <div className="mt-6 flex flex-col gap-3 min-[420px]:flex-row">
          <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-center font-mono text-xs font-bold uppercase tracking-wide text-on-primary shadow-md transition-all hover:bg-primary-container hover:shadow-lg" to="/calculate-shipping">{t('Calculate a delivery rate')}<span className="material-symbols-outlined text-base leading-none">arrow_forward</span></Link>
          <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-outline-variant/60 bg-surface-container-low px-5 py-3 text-center font-mono text-xs font-bold uppercase tracking-wide text-primary transition-colors hover:bg-surface-container" to="/services">{t('Explore services')}</Link>
        </div>
      </div>
      <div className="relative min-h-64 overflow-hidden sm:min-h-80 lg:min-h-full">
        <img alt="MadiSynthia warehouse and parcel operations" className="absolute inset-0 h-full w-full object-cover" src={warehouse2} />
        <div className="absolute inset-0 bg-linear-to-t from-inverse-surface/85 via-inverse-surface/10 to-transparent lg:bg-linear-to-r lg:from-inverse-surface/15 lg:via-transparent lg:to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-inverse-surface/80 p-4 text-inverse-on-surface backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-6">
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-inverse-primary"><span className="material-symbols-outlined text-base leading-none">hub</span>Connected delivery network</div>
          <p className="mt-1 text-sm leading-6 text-inverse-on-surface/90">{t('Tools and people working together to help parcels reach their destination.')}</p>
        </div>
      </div>
    </section>

    <AboutReasons
      t={t}
    />

    <AboutHowItWorks
      t={t}
    />

    <AboutCta
      t={t}
    />

    <div className="space-y-4">
      <article className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 text-center shadow-sm sm:p-6"><div className="flex min-w-0 flex-col items-center"><span className="material-symbols-outlined flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-low text-xl leading-none text-primary">public</span><div className="mt-3 w-full"><h2 className="font-syne text-lg font-bold text-on-surface sm:text-xl">A network built for Bangladesh</h2><p className="mt-2 text-sm leading-6 text-on-surface-variant sm:leading-7">Our delivery network is designed to connect major cities, district towns, and surrounding communities. Explore the Coverage page for service areas, or check the Zone Rates page to understand how destination zones affect delivery.</p><div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2"><Link className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase text-primary hover:underline" to="/coverage">View coverage<span className="material-symbols-outlined text-sm leading-none">arrow_forward</span></Link><Link className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase text-primary hover:underline" to="/zone-rates">Review zone rates<span className="material-symbols-outlined text-sm leading-none">arrow_forward</span></Link></div></div></div></article>
      <article className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 text-center shadow-sm sm:p-6"><div className="flex min-w-0 flex-col items-center"><span className="material-symbols-outlined flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-low text-xl leading-none text-primary">verified_user</span><div className="mt-3 w-full"><h2 className="font-syne text-lg font-bold text-on-surface sm:text-xl">Service built around clear handovers</h2><p className="mt-2 text-sm leading-6 text-on-surface-variant sm:leading-7">We aim to make delivery information clear, handle parcels responsibly, and communicate when a shipment needs attention. Delivery timelines and availability can vary with destination, access, weather, and other operating conditions.</p></div></div></article>
    </div>
  </CompanyPage>;
}


function AboutReasons({ t }) {
  return (
<section aria-labelledby="why-madisynthia" className="mb-8">
      <div className="mb-4 max-w-2xl">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{t('Made for everyday delivery')}</p>
        <h2 id="why-madisynthia" className="mt-2 font-syne text-2xl font-extrabold text-on-surface sm:text-3xl">{t('What matters on every shipment')}</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((reason) => <ReasonCard key={reason.title} {...reason} t={t} />)}
      </div>
    </section>
  );
}

function AboutHowItWorks({ t }) {
  return (
<section aria-labelledby="how-it-works" className="mb-8 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5 sm:p-7">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{t('A clear path from start to finish')}</p><h2 id="how-it-works" className="mt-2 font-syne text-2xl font-extrabold text-on-surface">{t('How a delivery comes together')}</h2></div>
        <Link className="inline-flex items-center gap-1 self-start font-mono text-xs font-bold uppercase text-primary hover:underline sm:self-auto" to="/tracking">{t('Track a parcel')}<span className="material-symbols-outlined text-sm leading-none">arrow_outward</span></Link>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.number} className="relative rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 sm:p-5">
            <div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-on-primary">{step.number}</span><h3 className="font-syne font-bold text-on-surface">{t(step.title)}</h3></div>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">{t(step.text)}</p>
            {index < steps.length - 1 && <span aria-hidden="true" className="material-symbols-outlined absolute -bottom-4 left-1/2 z-10 hidden -translate-x-1/2 rounded-full bg-primary-fixed p-1 text-sm leading-none text-primary md:block">arrow_forward</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutCta({ t }) {
  return (
<div className="mb-8 flex flex-col gap-4 rounded-2xl bg-linear-to-r from-primary to-primary-container p-5 text-on-primary shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div className="max-w-2xl"><p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary-fixed">{t('Ready when you are')}</p><h2 className="mt-1 font-syne text-xl font-extrabold sm:text-2xl">{t('Plan your next delivery with confidence.')}</h2><p className="mt-1 text-sm leading-6 text-on-primary/85">{t('Compare services, estimate a rate, or talk with our team about your parcel.')}</p></div>
      <div className="flex flex-col gap-2 min-[420px]:flex-row sm:shrink-0"><Link className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-surface-container-lowest px-4 py-2.5 font-mono text-xs font-bold uppercase text-primary transition-colors hover:bg-primary-fixed" to="/book-delivery">{t('Book a delivery')}</Link><Link className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-on-primary/35 px-4 py-2.5 font-mono text-xs font-bold uppercase text-on-primary transition-colors hover:bg-on-primary/10" to="/contact">{t('Talk to us')}<span className="material-symbols-outlined text-sm leading-none">arrow_forward</span></Link></div>
    </div>
  );
}
