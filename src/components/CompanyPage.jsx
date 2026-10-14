import { Link } from 'react-router-dom';
import { useLanguage } from '../context/languageContextValue';

const phone = '09612-404040';

function IconBadge({ icon, className = '' }) {
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center [&>span]:block [&>span]:leading-none ${className}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </span>
  );
}

export default function CompanyPage({ eyebrow = 'MadiSynthia Courier Service', title, intro, sections, highlights = [], lang = 'en', children }) {
  const { t } = useLanguage();
  return (
    <main lang={lang} className="relative isolate w-full overflow-hidden bg-linear-to-b from-surface via-surface to-surface-container-low/60 px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-14">
      <div className="pointer-events-none absolute -right-24 top-0 -z-10 h-80 w-80 rounded-full bg-secondary-fixed/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-96 -z-10 h-96 w-96 rounded-full bg-primary-fixed/25 blur-3xl" />
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-4 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-on-surface-variant sm:mb-5">
          <Link className="transition-colors hover:text-primary" to="/">{t('Home')}</Link><span className="text-outline">/</span><span aria-current="page" className="font-semibold text-primary">{t(title)}</span>
        </nav>

        <header className="relative mb-8 overflow-hidden rounded-2xl border border-primary/15 bg-linear-to-br from-surface-container-lowest via-surface-container-lowest to-primary-fixed/30 p-6 shadow-sm sm:mb-10 sm:p-9 lg:p-12">
          <div className="absolute -right-8 -top-12 hidden h-56 w-56 rounded-full border-24 border-primary/5 sm:block" />
          <div className="relative min-w-0 max-w-4xl">
            <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-primary-fixed px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-on-primary-fixed">
              <span aria-hidden="true" className="material-symbols-outlined shrink-0 text-base leading-none text-primary">local_shipping</span><span className="min-w-0 wrap-break-word">{t(eyebrow)}</span>
            </span>
            <h1 className="mt-4 wrap-break-word font-syne text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl lg:text-5xl">{t(title)}</h1>
            <p className="mt-3 max-w-3xl wrap-break-word text-sm leading-6 text-on-surface-variant sm:mt-4 sm:text-base sm:leading-7">{t(intro)}</p>
            {highlights.length > 0 && (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-3">
                {highlights.map(({ icon, label, value }) => (
                  <div key={label} className="flex min-w-0 flex-col items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest/90 p-4 text-center shadow-sm">
                    <IconBadge icon={icon} className="h-10 w-10 rounded-xl bg-primary-fixed text-2xl text-primary" />
                    <div className="min-w-0"><p className="wrap-break-word font-syne text-base font-bold leading-tight text-on-surface sm:text-lg">{t(value)}</p><p className="mt-1 wrap-break-word font-mono text-[9px] uppercase leading-tight tracking-wide text-on-surface-variant sm:text-[10px]">{t(label)}</p></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        {children}

        {sections?.length > 0 && (
          <div className="space-y-4">
            {sections.map(({ title: sectionTitle, body, items, icon = 'info', note }) => (
              <section key={sectionTitle} className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6 lg:p-7">
                <div className="flex min-w-0 flex-col items-center gap-3 text-center">
                  <IconBadge icon={icon} className="h-11 w-11 rounded-xl bg-surface-container-low text-2xl text-primary sm:h-12 sm:w-12" />
                  <div className="min-w-0 w-full">
                    <h2 className="wrap-break-word font-syne text-lg font-bold leading-snug text-on-surface sm:text-xl">{t(sectionTitle)}</h2>
                    {body && <p className="mt-2 wrap-break-word text-sm leading-6 text-on-surface-variant sm:leading-7">{typeof body === 'string' ? t(body) : body}</p>}
                    {items && <ul className="mt-3 space-y-2.5 text-left text-sm leading-6 text-on-surface-variant">{items.map((item, index) => <li key={typeof item === 'string' ? item : index} className="flex min-w-0 items-start gap-2"><IconBadge icon={typeof item === 'string' ? 'check_circle' : 'arrow_right_alt'} className="mt-1 h-4 w-4 text-base text-primary" /><span className="min-w-0 wrap-break-word">{typeof item === 'string' ? t(item) : item}</span></li>)}</ul>}
                    {note && <p className="mt-4 wrap-break-word rounded-lg bg-primary-fixed/40 p-3 text-xs leading-5 text-on-surface-variant">{note}</p>}
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}

        <footer className="mt-6 flex flex-col gap-4 rounded-2xl bg-inverse-surface p-4 text-inverse-on-surface sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:gap-3 sm:text-left"><IconBadge icon="support_agent" className="h-9 w-9 rounded-full bg-inverse-on-surface/10 text-2xl text-inverse-primary" /><div className="min-w-0"><h2 className="font-syne font-bold">{t('Need a hand?')}</h2><p className="mt-1 text-sm leading-6 text-inverse-on-surface/80">{t('Our team can help with deliveries, services, or these pages.')}</p></div></div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0">
            <a className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 font-mono text-[11px] font-bold uppercase text-on-primary transition-colors hover:bg-primary-container sm:flex-none sm:px-4 sm:text-xs" href={`tel:${phone}`}><span aria-hidden="true" className="material-symbols-outlined text-base leading-none">call</span>{phone}</a>
            <Link className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-inverse-on-surface/20 px-3 py-2.5 font-mono text-[11px] font-bold uppercase text-inverse-on-surface transition-colors hover:bg-inverse-on-surface/10 sm:flex-none sm:px-4 sm:text-xs" to="/contact">Contact</Link>
          </div>
        </footer>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-wide text-on-surface-variant">
          <Link className="hover:text-primary" to="/about">{t('About Us')}</Link><Link className="hover:text-primary" to="/contact">{t('Contact')}</Link><Link className="hover:text-primary" to="/terms-and-condition">{t('Terms')}</Link><Link className="hover:text-primary" to="/terms-and-condition-bn">শর্তাবলি (বাংলা)</Link><Link className="hover:text-primary" to="/privacy-policy">{t('Privacy')}</Link>
        </div>
      </div>
    </main>
  );
}
