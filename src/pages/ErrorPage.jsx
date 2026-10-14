import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RefreshCw, Home, Bug, Wrench, ShieldCheck, Mail } from 'lucide-react';

export default function ErrorPage({ error, resetError }) {
  const location = useLocation();
  const [errorId] = useState(() => `ERR-${Date.now().toString(36).toUpperCase()}`);

  const reportError = () => {
    const errorDetails = {
      message: error?.message || 'Unknown error',
      stack: error?.stack || '',
      url: location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    
    const blob = new Blob([JSON.stringify(errorDetails, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const contactSupport = () => {
    const subject = encodeURIComponent('Error Report - MadiSynthia Courier');
    const body = encodeURIComponent(
      `Error Details:\n` +
      `Message: ${error?.message || 'Unknown error'}\n` +
      `URL: ${location.pathname}\n` +
      `Time: ${new Date().toISOString()}\n` +
      `Browser: ${navigator.userAgent}\n\n` +
      `--- Please describe what you were doing when this happened ---\n`
    );
    window.location.href = `mailto:support@madisynthia.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="mx-auto min-h-[60vh] max-w-5xl flex flex-col items-center justify-center px-4 py-12 sm:py-16 lg:py-20">
      {/* Animated Background Decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-secondary/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
        {/* Illustration Area */}
        <div className="relative mb-8">
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-linear-to-br from-primary/10 to-primary/5 border-2 border-primary/20 flex items-center justify-center shadow-xl">
              <div className="relative">
                <Wrench className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary/80" />
                <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-400 border-2 border-white flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                </div>
              </div>
            </div>
            
            {/* Floating particles */}
            <div className="absolute -top-4 -right-4 w-3 h-3 rounded-full bg-primary/20 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="absolute -bottom-4 -left-4 w-2 h-2 rounded-full bg-secondary/30 animate-pulse" style={{ animationDelay: '500ms' }} />
            <div className="absolute top-1/2 -right-8 w-1.5 h-1.5 rounded-full bg-primary/30 animate-ping" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-primary">
            Temporary Glitch
          </p>
          <h1 className="mt-2 font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight">
            Something went<br />unexpectedly wrong
          </h1>
          <p className="mt-4 text-on-surface-variant text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Our team has been automatically notified. This won't affect your data or bookings — 
            everything is safely stored on our servers.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-center sm:gap-3 mb-8">
          <button
            onClick={resetError}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-primary to-primary-container px-6 py-3.5 font-bold text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-200 active:scale-[0.98]"
          >
            <RefreshCw className="h-5 w-5 sm:h-5 sm:w-5" />
            <span className="text-base sm:text-lg">Try Again</span>
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-primary/30 bg-white px-6 py-3.5 font-bold text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 active:scale-[0.98]"
          >
            <Home className="h-5 w-5 sm:h-5 sm:w-5" />
            <span className="text-base sm:text-lg">Go Home</span>
          </Link>
        </div>

        {/* Support Section */}
        <div className="rounded-2xl bg-surface-container-low/50 border border-outline-variant/30 p-5 sm:p-6 backdrop-blur-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-on-surface text-sm sm:text-base">
                Need help right away?
              </p>
              <p className="mt-1 text-on-surface-variant text-sm sm:text-base">
                Our support team typically responds within 1 hour during business hours.
              </p>
              <button
                onClick={contactSupport}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-container transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                Email Support
              </button>
            </div>
          </div>
        </div>

        {/* Subtle Report Button */}
        <details className="mt-6 w-full">
          <summary className="flex items-center justify-center gap-2 text-xs font-mono font-medium text-on-surface-variant/60 cursor-pointer hover:text-on-surface-variant transition-colors select-none">
            <Bug className="h-3.5 w-3.5" />
            Technical Details (for support)
          </summary>
          <div className="mt-3 p-3 rounded-xl bg-slate-900/95 border border-slate-700 text-[10px] font-mono text-slate-200 overflow-auto max-h-40 text-left">
            <div className="text-slate-400 mb-1">Error ID: {errorId}</div>
            <div className="text-slate-400 mb-1">Path: {location.pathname}</div>
            <div className="text-slate-400 mb-1">Time: {new Date().toLocaleString()}</div>
            <div className="text-slate-400">Message: {error?.message || 'Unknown error'}</div>
            <button
              onClick={reportError}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-container transition-colors"
            >
              <Bug className="h-3 w-3" />
              Download Full Report
            </button>
          </div>
        </details>
      </div>

      {/* Brand Footer */}
      <p className="mt-10 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-on-surface-variant/40">
        MadiSynthia Courier &bull; Bangladesh Logistics Express
      </p>
    </section>
  );
}
