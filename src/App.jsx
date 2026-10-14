import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

const NotFound = lazy(() => import('./pages/NotFound'));
const Home = lazy(() => import('./pages/Home'));
const Tracking = lazy(() => import('./pages/Tracking'));
const Services = lazy(() => import('./pages/Services'));
const ZoneRates = lazy(() => import('./pages/ZoneRates'));
const CalculateShipping = lazy(() => import('./pages/CalculateShipping'));
const Orders = lazy(() => import('./pages/Orders'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Registration = lazy(() => import('./pages/Registration'));
const Profile = lazy(() => import('./pages/Profile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const NotificationDetail = lazy(() => import('./pages/NotificationDetail'));
const BookParcel = lazy(() => import('./pages/BookParcel'));
const Coverage = lazy(() => import('./pages/Coverage'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Terms'));
const TermsBangla = lazy(() => import('./pages/TermsBangla'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const RiderApply = lazy(() => import('./pages/RiderApply'));

function App() {
  return (
    <>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<div className="grid min-h-[45vh] place-items-center px-4 text-sm font-semibold text-on-surface-variant" role="status">Loading page…</div>}>
        <Routes>
      <Route element={<Layout marketing />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/zone-rates" element={<ZoneRates />} />
        <Route path="/coverage" element={<Coverage />} />
        <Route path="/calculate-shipping" element={<CalculateShipping />} />
        <Route path="/tracking" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms-and-condition" element={<Terms />} />
        <Route path="/terms-and-condition-bn" element={<TermsBangla />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/apply-as-rider" element={<ProtectedRoute allowGuest><RiderApply /></ProtectedRoute>} />
        <Route path="/book-delivery" element={<ProtectedRoute allowGuest><BookParcel /></ProtectedRoute>} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications/:id" element={<NotificationDetail />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Route>
      <Route element={<Layout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
        </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
