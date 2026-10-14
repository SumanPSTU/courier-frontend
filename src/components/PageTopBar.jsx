import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronRight, Truck } from 'lucide-react';

const pageNames = {
  '/': 'Home',
  '/about': 'About Us',
  '/apply-as-rider': 'Apply as a Rider',
  '/book-delivery': 'Book Delivery',
  '/calculate-shipping': 'Calculate Shipping',
  '/contact': 'Contact',
  '/coverage': 'Coverage',
  '/forgot-password': 'Forgot Password',
  '/login': 'Login',
  '/notifications': 'Notifications',
  '/orders': 'My Orders',
  '/privacy-policy': 'Privacy Policy',
  '/profile': 'My Profile',
  '/registration': 'Create Account',
  '/services': 'Services',
  '/terms-and-condition': 'Terms and Conditions',
  '/terms-and-condition-bn': 'শর্তাবলি',
  '/tracking': 'Track a Parcel',
  '/zone-rates': 'Zone Rates',
};

function getPageName(pathname) {
  if (pathname.startsWith('/notifications/')) return 'Notification Details';
  return pageNames[pathname] || 'Page Not Found';
}

export default function PageTopBar() {
  const { pathname } = useLocation();
  if (['/', '/forgot-password', '/login', '/registration'].includes(pathname)) return null;

  const pageName = getPageName(pathname);

  return (
    <div className="w-full border-b border-outline-variant/30 bg-surface-container-low px-4 py-2.5 lg:px-6 print:hidden">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 font-mono text-xs text-on-surface-variant">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          {pathname !== '/' && (
            <>
              <Link className="font-medium transition-colors hover:text-primary" to="/">Home</Link>
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-outline" />
            </>
          )}
          <span aria-current="page" className="font-bold text-primary">{pageName}</span>
        </nav>
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
    </div>
  );
}
