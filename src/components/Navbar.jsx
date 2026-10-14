import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bike, LogOut } from 'lucide-react';
import { useLanguage } from '../context/languageContextValue';
import { useDesktopLayout } from '../utils/media';
import { useAuthContext } from '../context/authContextValue';
import { useNotifications } from '../context/notificationContextValue';
import NotificationBell from './NotificationBell';
import NotificationSlidebar from './notifications/NotificationSlidebar';


export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isBangla, toggleLanguage, t } = useLanguage();
  const { auth, logout } = useAuthContext();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  const [panelOpen, setPanelOpen] = useState(false);
  const desktopBellRef = useRef(null);
  const activeBellRef = useRef(null);
  const isDesktop = useDesktopLayout();
  const setDesktopBellRef = useCallback((node) => { desktopBellRef.current = node; }, []);

  useEffect(() => {
    activeBellRef.current = isDesktop ? desktopBellRef.current : null;
  }, [isDesktop]);

  const isActive = (path) => location.pathname === path;

  const closeMobile = () => setMobileOpen(false);
  const handleLogout = async () => {
    closeMobile();
    await logout();
    navigate('/login', { replace: true });
  };
  const closePanel = useCallback(() => {
    const panel = document.getElementById('notification-panel');
    if (panel?.contains(document.activeElement)) {
      activeBellRef.current?.focus({ preventScroll: true });
    }
    setPanelOpen(false);
  }, []);

  // Any navigation dismisses the panel after returning focus to its trigger.
  useEffect(() => {
    const closeTimerId = window.setTimeout(closePanel, 0);
    return () => window.clearTimeout(closeTimerId);
  }, [closePanel, location.pathname]);

  // The panel is a fixed overlay, so a plain onMouseLeave on the trigger would close it
  // the moment the pointer crossed the gap. A short delay lets the trip complete.
  const closeTimer = useRef(null);
  const cancelClose = useCallback(() => window.clearTimeout(closeTimer.current), []);
  const scheduleClose = useCallback(() => {
    // Touch browsers fire a synthetic mouseleave right after a tap, which would
    // otherwise close the panel the moment it opened.
    if (!isDesktop) return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(closePanel, 260);
  }, [closePanel, isDesktop]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const openPanel = () => {
    if (!isDesktop) return;
    cancelClose();
    setPanelOpen(true);
  };

  return (
    <>
      <aside className="w-full border-b border-inverse-surface bg-[#1f1914] px-3 py-2 text-xs font-mono tracking-wide text-primary-fixed sm:px-4 sm:py-1 lg:h-8 print:hidden">
        <div className="mx-auto flex min-h-6 w-full max-w-screen-2xl items-center justify-between gap-x-3 lg:flex-nowrap">
          <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden whitespace-nowrap shrink-0 lg:flex-initial">
            <span className="inline-flex items-center gap-1.5 bg-primary-container text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> {t('LIVE DISPATCH')}
            </span>
            <span className="text-stone-500 hidden md:inline text-[10px] sm:text-xs">•</span>
            <span className="text-stone-300 hidden md:inline text-[10px] sm:text-xs">{t('1% Flat COD Fee with 24-Hour Settlement')}</span>
            <span className="text-stone-500 hidden lg:inline text-[10px] sm:text-xs">•</span>
            <span className="text-stone-300 hidden lg:inline text-[10px] sm:text-xs">{t('50% Fair RTO Guarantee')}</span>
          </div>
          <div className="flex items-center gap-4 text-stone-300 shrink-0 lg:ml-auto">
              <Link className="hidden hover:text-white text-stone-300 sm:flex items-center gap-1 transition-colors" to="/zone-rates">
              <span className="material-symbols-outlined text-[14px] text-inverse-primary">receipt_long</span> {t('2025 Standard Tariffs')}
            </Link>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <a className="hover:text-white flex items-center gap-1 text-primary-fixed font-semibold transition-colors" href="tel:09612404040">
              <span className="material-symbols-outlined text-[14px] text-inverse-primary">call</span> 09612404040
            </a>
          </div>
        </div>
      </aside>
      <header className="sticky top-0 z-50 bg-[#fff9f5]/90 backdrop-blur-md border-surface-dim/80 transition-all print:hidden">
        <div className="mx-auto px-3 sm:px-4 w-full max-w-screen-2xl min-h-12 sm:min-h-14 flex items-center justify-between gap-2 sm:gap-4">
          <Link className="flex min-w-0 items-center gap-2 sm:gap-3 group" to="/">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-linear-to-br from-primary to-primary-container flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <Bike aria-hidden="true" className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate font-syne font-extrabold text-[15px] text-[#1f1914] tracking-tight min-[400px]:text-base sm:text-lg">{t('MadiSynthia')}</span>
              <span className="hidden shrink-0 sm:inline text-[10px] font-mono font-bold uppercase bg-surface-container text-primary px-1.5 py-0.5 rounded border border-primary-fixed">{t('COURIER')}</span>
              </div>
              <span className="hidden truncate sm:block text-[11px] font-mono tracking-widest text-outline uppercase">{t('Bangladesh Logistics Express')}</span>
            </div>
          </Link>
          <nav className="hidden xl:flex items-center gap-1 bg-surface-container/60 p-1.5 rounded-full border-surface-dim">
            <Link className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] xl:px-3 xl:text-xs font-semibold transition-all ${isActive('/services') ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary hover:bg-white/80'}`} to="/services">{t('Services')}</Link>
            <Link className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] xl:px-3 xl:text-xs font-semibold transition-all ${isActive('/zone-rates') ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary hover:bg-white/80'}`} to="/zone-rates">{t('Zone Rates')}</Link>
            <Link className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] xl:px-3 xl:text-xs font-semibold transition-all ${isActive('/book-delivery') ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary hover:bg-white/80'}`} to="/book-delivery">{t('Book Delivery')}</Link>
            <Link className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] xl:px-3 xl:text-xs font-bold transition-all flex items-center gap-1.5 ${isActive('/tracking') ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary hover:bg-white/80'}`} to="/tracking">
              <span className="w-1.5 h-1.5 rounded-full bg-inverse-primary animate-ping" /> {t('Live Tracking')}
            </Link>
          </nav>
          <div className="flex shrink-0 items-center gap-1 min-[400px]:gap-1.5 sm:gap-2.5">
            <Link className="hidden lg:inline-flex whitespace-nowrap items-center gap-1.5 px-3 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary border-outline-variant/60 text-[11px] xl:px-4 xl:text-xs font-mono uppercase font-bold tracking-wider transition-all" to="/calculate-shipping">
              <span className="material-symbols-outlined text-base">calculate</span> {t('Calculate Shipping')}
            </Link>
            {auth ? (
              <>
                <NotificationBell
                  active={panelOpen || isActive('/notifications')}
                  className="hidden xl:inline-flex"
                  expanded={panelOpen}
                  onClick={() => setPanelOpen((open) => (isDesktop ? true : !open))}
                  onFocus={openPanel}
                  onMouseEnter={openPanel}
                  onMouseLeave={scheduleClose}
                  setElement={setDesktopBellRef}
                  unreadCount={unreadCount}
                />
                <Link aria-label="Open profile" className={`hidden xl:inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${isActive('/profile') ? 'border-primary bg-primary text-white' : 'border-outline-variant bg-surface-container-low text-primary hover:bg-surface-container'}`} title="Profile" to="/profile">
                  <span aria-hidden="true" className="material-symbols-outlined text-xl">account_circle</span>
                </Link>
                <button aria-label="Sign out" className="hidden xl:inline-flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-low text-primary hover:bg-surface-container" onClick={handleLogout} title="Sign out" type="button">
                  <LogOut aria-hidden="true" className="h-4 w-4" />
                </button>
              </>
            ) : (
            <Link className="hidden xl:inline-flex whitespace-nowrap items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] xl:px-5 xl:text-xs font-mono uppercase font-bold tracking-wider transition-all bg-primary hover:bg-primary-container text-white shadow-md shadow-primary/25" to="/login">
                <span className="material-symbols-outlined text-base">login</span> {t('Login')}
              </Link>
            )}
            <button aria-expanded={mobileOpen} aria-label={t('Toggle navigation')} className="xl:hidden flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border border-outline-variant/60 bg-surface-container-low text-on-surface-variant transition-colors hover:bg-surface-container" onClick={() => setMobileOpen(!mobileOpen)} type="button">
              <span aria-hidden="true" className="material-symbols-outlined text-[20px] leading-none sm:text-[22px]">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="xl:hidden border-surface-dim/80 py-3 bg-[#fff9f5]">
            <div className="flex flex-col gap-1">
              <button aria-label={isBangla ? 'Switch to English' : 'বাংলায় দেখুন'} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-on-surface-variant transition-all hover:bg-surface-container hover:text-primary" onClick={toggleLanguage} type="button">
                <span className="material-symbols-outlined text-lg">translate</span> {isBangla ? 'English' : 'বাংলা'}
              </button>
              <Link className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive('/') ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`} to="/" onClick={closeMobile}>{t('Home')}</Link>
              <Link className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive('/services') ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`} to="/services" onClick={closeMobile}>{t('Services')}</Link>
              <Link className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive('/zone-rates') ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`} to="/zone-rates" onClick={closeMobile}>{t('Zone Rates')}</Link>
              <Link className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive('/book-delivery') ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`} to="/book-delivery" onClick={closeMobile}>{t('Book Delivery')}</Link>
              <Link className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${isActive('/tracking') ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`} to="/tracking" onClick={closeMobile}>
                <span className="w-1.5 h-1.5 rounded-full bg-inverse-primary animate-ping" /> {t('Live Tracking')}
              </Link>
              <Link className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive('/calculate-shipping') ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`} to="/calculate-shipping" onClick={closeMobile}>{t('Calculate Shipping')}</Link>
              {auth ? (
                <>
                  <Link className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive('/notifications') ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`} to="/notifications" onClick={closeMobile}>
                    <span aria-hidden="true" className="material-symbols-outlined text-lg">notifications</span> Notifications
                    {unreadCount > 0 && (
                      <span className="ml-auto rounded-full bg-error px-2 py-0.5 text-[11px] font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive('/profile') ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`} to="/profile" onClick={closeMobile}>
                    <span aria-hidden="true" className="material-symbols-outlined text-lg">account_circle</span> Profile
                  </Link>
                  <button className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-left text-sm font-semibold text-on-surface-variant transition-all hover:bg-surface-container hover:text-primary" onClick={handleLogout} type="button">
                    <LogOut aria-hidden="true" className="h-4 w-4" /> Sign out
                  </button>
                </>
              ) : (
                <Link className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive('/login') ? 'bg-primary-container text-white border border-primary-fixed/30' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`} to="/login" onClick={closeMobile}>{t('Login')}</Link>
              )}
            </div>
          </div>
        )}
      </header>
      {auth && (
        <div className="print:hidden" onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
          <NotificationSlidebar
            isDesktop={isDesktop}
            onClose={closePanel}
            open={panelOpen}
            triggerRef={activeBellRef}
          />
        </div>
      )}
    </>
  );
}
