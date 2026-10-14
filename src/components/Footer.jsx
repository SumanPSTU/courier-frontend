import { Link } from 'react-router-dom';
import { useLanguage } from '../context/languageContextValue';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="w-full bg-surface-container-low border-t border-surface-dim print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-surface-dim">
          <div className="lg:col-span-2 flex flex-col items-start pr-0 lg:pr-8">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
              </div>
              <span className="font-syne font-extrabold text-xl text-[#1f1914] tracking-tight">MadiSynthia</span>
            </div>
            <span className="font-mono text-xs tracking-widest text-outline uppercase mb-4">{t('Courier Service Limited • Bangladesh')}</span>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-6 max-w-sm min-h-[4.5rem]">
              {t('Next-generation algorithmic parcel dispatch, secured transit corridors, and integrated cash-on-delivery systems engineered across 64 administrative districts in Bangladesh.')}
            </p>
            <div className="flex flex-wrap gap-2 font-mono text-[11px]">
              <span className="px-2.5 py-1 bg-white border border-surface-dim text-on-surface-variant rounded-lg uppercase">ISO 9001:2015</span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-xs uppercase tracking-wider text-[#1f1914] font-bold mb-1">{t('Logistics Hubs')}</span>
            <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" to="/coverage">{t('Dhaka Central Sorting (Tejgaon)')}</Link>
            <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" to="/coverage">{t('Chittagong Port Terminal (Agrabad)')}</Link>
            <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" to="/coverage">{t('Sylhet Hub (Subidbazar)')}</Link>
            <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" to="/coverage">{t('Rajshahi Northern Depot')}</Link>
            <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" to="/coverage">{t('Khulna Distribution Facility')}</Link>
            <Link className="text-xs text-primary font-bold hover:underline mt-1" to="/coverage">{t('All 64 District Points →')}</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-xs uppercase tracking-wider text-[#1f1914] font-bold mb-1">{t('Services')}</span>
            <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" to="/tracking">{t('Track a parcel')}</Link>
            <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" to="/calculate-shipping">{t('Delivery rates')}</Link>
            <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" to="/coverage">{t('Coverage')}</Link>
            <Link className="text-xs text-primary font-bold hover:underline" to="/apply-as-rider">{t('Apply as a rider')}</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-xs uppercase tracking-wider text-[#1f1914] font-bold mb-1">{t('Company')}</span>
            <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" to="/about">{t('About Us')}</Link>
            <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" to="/contact">{t('Contact')}</Link>
            <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" to="/terms-and-condition">{t('Terms and conditions')}</Link>
            <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" to="/terms-and-condition-bn">শর্তাবলি (বাংলা)</Link>
            <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" to="/privacy-policy">{t('Privacy policy')}</Link>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-outline">
          <div>{t('© 2025 MadiSynthia Courier Service Ltd. Incorporated in Bangladesh.')}</div>
          <div className="flex flex-wrap items-center gap-5">
            <span>TIN: 739201948211</span>
            <span>Trade License: TRAD/DNCC/029144/2021</span>
            <span>DBID Approved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
