import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  KeyRound,
  Lock,
  Mail,
  MailCheck,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Timer,
  Truck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { authApi } from '../api/auth';
import OtpInput from '../components/auth/OtpInput';
import PasswordStrength from '../components/auth/PasswordStrength';

/** Mirrors backend constants in AuthController.js */
const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;
const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;
const MIN_PASSWORD_LENGTH = 8;

const STEPS = [
  { id: 1, title: 'Identify', subtitle: 'Account email', icon: Mail },
  { id: 2, title: 'Verify', subtitle: '6-digit code', icon: ShieldCheck },
  { id: 3, title: 'Secure', subtitle: 'New password', icon: Lock },
];

const SECURITY_NOTES = [
  { icon: Timer, text: `Code expires after ${OTP_EXPIRY_MINUTES} minutes and allows ${MAX_OTP_ATTEMPTS} attempts.` },
  { icon: MailCheck, text: 'The code is emailed only. Our staff can never read it.' },
  { icon: ShieldCheck, text: 'Resetting your password signs out nothing — your parcels stay untouched.' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function SecurityNotes({ className = '' }) {
  return (
    <ul className={`flex flex-col gap-2 text-sm text-on-surface-variant ${className}`}>
      {SECURITY_NOTES.map((item) => (
        <li className="flex items-start gap-2" key={item.text}>
          <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span className="leading-snug">{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

function Feedback({ error, notice }) {
  if (error) {
    return (
      <div
        className="flex items-start gap-2 rounded-lg bg-error-container px-3 py-2.5 text-on-error-container"
        role="alert"
      >
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <p className="text-sm leading-snug">{error}</p>
      </div>
    );
  }
  if (notice) {
    return (
      <div
        className="flex items-start gap-2 rounded-lg bg-surface-container px-3 py-2.5 text-on-surface"
        role="status"
      >
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm leading-snug">{notice}</p>
      </div>
    );
  }
  return null;
}

function extractMessage(error, fallback) {
  return (
    error?.response?.data?.errors?.[0]?.message ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [expiresIn, setExpiresIn] = useState(OTP_EXPIRY_MINUTES * 60);
  const [done, setDone] = useState(false);

  const emailRef = useRef(null);
  const otpSectionRef = useRef(null);
  const successRef = useRef(null);
  /* ---------- Timers ---------- */
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = window.setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  useEffect(() => {
    if (done || step < 2) return undefined;
    const id = window.setInterval(() => setExpiresIn((t) => Math.max(0, t - 1)), 1000);
    return () => window.clearInterval(id);
  }, [step, done]);

  const startTimers = useCallback(() => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    setExpiresIn(OTP_EXPIRY_MINUTES * 60);
  }, []);

  /* ---------- Scroll to the active step on mobile ---------- */
  useEffect(() => {
    const target = step === 2 ? otpSectionRef.current : done ? successRef.current : null;
    if (target && typeof window !== 'undefined' && window.innerWidth < 768) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step, done]);

  useEffect(() => {
    if (step === 1) emailRef.current?.focus();
  }, [step]);

  /* ---------- Derived ---------- */
  const emailValid = EMAIL_PATTERN.test(email.trim());
  const passwordValid = newPassword.length >= MIN_PASSWORD_LENGTH;
  const confirmMatches = confirmPassword.length > 0 && confirmPassword === newPassword;
  const otpComplete = otp.length === OTP_LENGTH;

  const expiryTone = useMemo(() => {
    if (expiresIn <= 0) return { text: 'text-error', label: 'Expired' };
    if (expiresIn <= 60) return { text: 'text-error', label: `${expiresIn}s` };
    if (expiresIn <= 120) return { text: 'text-secondary', label: `${Math.floor(expiresIn / 60)}m ${expiresIn % 60}s` };
    return { text: 'text-on-surface-variant', label: `${Math.floor(expiresIn / 60)}m ${expiresIn % 60}s` };
  }, [expiresIn]);

  const formatCooldown = (seconds) => `0:${String(seconds).padStart(2, '0')}`;

  /* ---------- Step 1: request OTP ---------- */
  const handleSendOtp = async (event) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalized)) {
      setError('Enter a valid email address to continue.');
      return;
    }
    if (cooldown > 0) {
      setError(`Please wait ${cooldown} seconds before requesting a new code.`);
      return;
    }

    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      const { data } = await authApi.forgotPassword({ email: normalized });
      setEmail(normalized);
      setOtp('');
      setStep(2);
      startTimers();
      // When the backend has no SMTP transport it returns the code directly
      // instead of emailing it. Surface it honestly rather than claiming mail
      // was sent, and prefill it so local testing is frictionless.
      if (data?.devOtp) {
        setOtp(data.devOtp);
        setNotice(data.message || 'SMTP is not configured on the server, so the code could not be emailed.');
      } else {
        setNotice(data?.message || `Verification code sent to ${normalized}.`);
      }
    } catch (requestError) {
      const message = extractMessage(requestError, 'We could not send a verification code. Please try again.');
      setError(message);
      // Align the local cooldown with the server so the UI cannot get out of sync.
      const waitMatch = message.match(/wait\s+(\d+)\s+second/i);
      if (waitMatch) setCooldown(Number(waitMatch[1]));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      const { data } = await authApi.forgotPassword({ email });
      setOtp(data?.devOtp || '');
      startTimers();
      setNotice(
        data?.devOtp
          ? data.message || 'SMTP is not configured on the server, so the code could not be emailed.'
          : data?.message || 'A fresh verification code is on its way.',
      );
    } catch (requestError) {
      const message = extractMessage(requestError, 'We could not resend the code. Please try again.');
      setError(message);
      const waitMatch = message.match(/wait\s+(\d+)\s+second/i);
      if (waitMatch) setCooldown(Number(waitMatch[1]));
    } finally {
      setResending(false);
    }
  };

  /* ---------- Step 2 -> 3 ---------- */
  const handleVerifyContinue = (event) => {
    event.preventDefault();
    if (!otpComplete) {
      setError(`Enter all ${OTP_LENGTH} digits of the verification code.`);
      return;
    }
    if (expiresIn <= 0) {
      setError('This code has expired. Request a new one to continue.');
      return;
    }
    setError('');
    setNotice('');
    setStep(3);
  };

  /* ---------- Step 3: reset ---------- */
  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (!otpComplete) {
      setError('Enter the verification code from your email.');
      return;
    }
    if (!passwordValid) {
      setError(`New password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (!confirmMatches) {
      setError('The two passwords do not match.');
      return;
    }

    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      const { data } = await authApi.resetPassword({
        email,
        otp,
        newPassword,
      });
      setNotice(data?.message || 'Password reset successful.');
      setDone(true);
      setOtp('');
    } catch (requestError) {
      const message = extractMessage(requestError, 'We could not reset your password. Please try again.');
      setError(message);

      // The backend burns an attempt on every wrong guess and deletes the code
      // once it is exhausted, so send the user back to re-request one.
      if (/expired|no active|maximum otp|request for a new/i.test(message)) {
        setStep(2);
        setOtp('');
        startTimers();
      } else if (/invalid otp/i.test(message)) {
        setOtp('');
        setStep(2);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartOver = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setNotice('');
    setCooldown(0);
    setExpiresIn(OTP_EXPIRY_MINUTES * 60);
    setDone(false);
  };

  const handleEditEmail = () => {
    setStep(1);
    setOtp('');
    setError('');
    setNotice('');
    setCooldown(0);
  };

  /* ---------- Shared feedback banners ---------- */

  return (
    <section className="w-full px-4 py-6 sm:px-6 sm:py-10 lg:px-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
        {/* ---- Left rail: reassurance panel ---- */}
        <ForgotPasswordAside
          done={done}
          step={step}
        />

        {/* ---- Right: the form card ---- */}
        <ForgotPasswordFormCard done={done} step={step}>
            {done ? (
              /* ---------- Success ---------- */
              <ForgotPasswordSuccess
                email={email}
                handleStartOver={handleStartOver}
                navigate={navigate}
                successRef={successRef}
              />
            ) : step === 1 ? (
              /* ---------- Step 1: email ---------- */
              <ForgotPasswordStepEmail
                email={email}
                emailRef={emailRef}
                emailValid={emailValid}
                error={error}
                handleSendOtp={handleSendOtp}
                notice={notice}
                setEmail={setEmail}
                setError={setError}
                submitting={submitting}
              />
            ) : step === 2 ? (
              /* ---------- Step 2: OTP ---------- */
              <ForgotPasswordStepOtp
                cooldown={cooldown}
                email={email}
                error={error}
                expiresIn={expiresIn}
                expiryTone={expiryTone}
                formatCooldown={formatCooldown}
                handleEditEmail={handleEditEmail}
                handleResend={handleResend}
                handleVerifyContinue={handleVerifyContinue}
                notice={notice}
                otp={otp}
                otpComplete={otpComplete}
                otpSectionRef={otpSectionRef}
                resending={resending}
                setError={setError}
                setOtp={setOtp}
                submitting={submitting}
              />
            ) : (
              /* ---------- Step 3: new password ---------- */
              <ForgotPasswordStepReset
                confirmMatches={confirmMatches}
                confirmPassword={confirmPassword}
                error={error}
                expiresIn={expiresIn}
                handleResetPassword={handleResetPassword}
                newPassword={newPassword}
                notice={notice}
                passwordValid={passwordValid}
                setConfirmPassword={setConfirmPassword}
                setError={setError}
                setNewPassword={setNewPassword}
                setShowConfirm={setShowConfirm}
                setShowNew={setShowNew}
                setStep={setStep}
                showConfirm={showConfirm}
                showNew={showNew}
                submitting={submitting}
              />
            )}
        </ForgotPasswordFormCard>
      </div>
    </section>
  );
}


function ForgotPasswordAside({ done, step }) {
  return (
<aside className="order-2 hidden flex-col gap-5 lg:order-1 lg:col-span-5 lg:flex">
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-1.5 rounded bg-primary-fixed px-2.5 py-1 font-mono text-xs font-semibold uppercase text-on-primary-fixed">
              <KeyRound className="h-3.5 w-3.5 text-primary" />
              Account Recovery
            </span>
            <h1 className="font-syne text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl lg:text-4xl">
              Locked out? <span className="text-primary">Get back in.</span>
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-on-surface-variant">
              We verify every reset with a single-use code sent to your registered email, so nobody can take over
              your consignment account. It takes about a minute.
            </p>
          </div>

          {/* The step list mirrors the progress bar in the form card, so it is
              redundant on phones where the card already shows a compact tracker. */}
          <ol className="hidden flex-col gap-2.5 lg:flex">
            {STEPS.map((item) => {
              const Icon = item.icon;
              const state = done || step > item.id ? 'done' : step === item.id ? 'active' : 'todo';
              return (
                <li
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors ${
                    state === 'active'
                      ? 'border-primary/30 bg-surface-container-lowest shadow-sm'
                      : 'border-surface-dim bg-surface-container-low/50'
                  }`}
                  key={item.id}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      state === 'done'
                        ? 'bg-primary text-on-primary'
                        : state === 'active'
                          ? 'bg-primary text-on-primary shadow-[0_0_0_4px_rgba(137,77,13,0.12)]'
                          : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {state === 'done' ? (
                      <Check className="h-4 w-4" strokeWidth={3} />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-syne text-sm font-bold ${state === 'todo' ? 'text-on-surface-variant' : 'text-on-surface'}`}
                    >
                      {item.title}
                    </p>
                    <p className="truncate font-mono text-[11px] text-on-surface-variant">{item.subtitle}</p>
                  </div>
                  {state === 'active' && (
                    <span className="shrink-0 font-mono text-[10px] font-bold uppercase text-primary">Now</span>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="hidden flex-col gap-2 rounded-xl bg-surface-container-low p-4 lg:flex">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">Security notes</p>
            <SecurityNotes />
          </div>

          <div className="hidden flex-col gap-2 rounded-xl bg-surface-container-lowest p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:flex">
            <p className="text-sm text-on-surface-variant">Remembered it after all?</p>
            <Link
              className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase text-primary hover:underline"
              to="/login"
            >
              Back to sign in <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
  );
}

function ForgotPasswordStepEmail({ email, emailRef, emailValid, error, handleSendOtp, notice, setEmail, setError, submitting }) {
  return (
<form className="flex flex-col gap-5" onSubmit={handleSendOtp} noValidate>
                <div className="flex flex-col gap-1">
                  <h2 className="font-syne text-2xl text-on-surface sm:text-3xl">Reset your password</h2>
                  <p className="text-sm text-on-surface-variant">
                    Enter the email you registered with and we will send a 6-digit verification code.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs font-semibold uppercase text-on-surface" htmlFor="recoveryEmail">
                    Registered email
                  </label>
                  <div className="relative flex items-center">
                    <div className="pointer-events-none absolute left-3 flex items-center text-on-surface-variant">
                      <Mail className="h-4.5 w-4.5" />
                    </div>
                    <input
                      aria-invalid={Boolean(error) && !emailValid}
                      autoCapitalize="none"
                      autoComplete="email"
                      className={`w-full rounded bg-surface py-3 pl-10 pr-4 font-sans text-sm text-on-surface outline-none transition-all placeholder:text-outline/70 focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_rgba(137,77,13,0.35)] ${
                        error && !emailValid ? 'shadow-[0_0_0_1px_rgba(186,26,26,0.6)]' : ''
                      }`}
                      id="recoveryEmail"
                      inputMode="email"
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError('');
                      }}
                      placeholder="you@example.com"
                      ref={emailRef}
                      type="email"
                      value={email}
                    />
                  </div>
                  {email.trim() && !emailValid && (
                    <p className="text-xs text-error">That email address doesn’t look right.</p>
                  )}
                </div>

                  <Feedback error={error} notice={notice} />

                  <button
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-primary px-4 py-3 font-syne text-base font-semibold tracking-wide text-on-primary shadow-[0_4px_16px_rgba(137,77,13,0.25)] transition hover:bg-primary-container active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={submitting}
                    type="submit"
                  >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary border-t-transparent" />
                      Sending secure code…
                    </>
                  ) : (
                    <>
                      Send verification code
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <p className="hidden text-center font-mono text-xs uppercase text-on-surface-variant lg:block">
                  Step 1 of 3 • No active shipments are affected
                </p>
              </form>
  );
}

function ForgotPasswordStepOtp({ cooldown, email, error, expiresIn, expiryTone, formatCooldown, handleEditEmail, handleResend, handleVerifyContinue, notice, otp, otpComplete, otpSectionRef, resending, setError, setOtp, submitting }) {
  return (
<div className="flex flex-col gap-5" ref={otpSectionRef}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-syne text-2xl text-on-surface sm:text-3xl">Enter your code</h2>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 font-mono text-[10px] font-bold uppercase ${expiryTone.text}`}
                    >
                      <Timer className="h-3.5 w-3.5" />
                      {expiryTone.label}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    We sent a {OTP_LENGTH}-digit code to{' '}
                    <span className="font-mono font-semibold text-on-surface">{email}</span>
                  </p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleVerifyContinue} noValidate>
                  <div className="flex flex-col gap-2">
                    <OtpInput
                      disabled={submitting || expiresIn <= 0}
                      hasError={Boolean(error)}
                      onChange={(value) => {
                        setOtp(value);
                        setError('');
                      }}
                      value={otp}
                    />
                    <p className="text-center text-xs text-on-surface-variant">
                      Paste the code from your inbox, or type it digit by digit.
                    </p>
                  </div>

                  {expiresIn <= 0 && (
                    <div className="flex items-start gap-2 rounded-lg bg-error-container px-3 py-2.5 text-on-error-container" role="alert">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p className="text-sm leading-snug">
                        This code has expired. Request a new one to continue.
                      </p>
                    </div>
                  )}

                  <Feedback error={error} notice={notice} />

                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <button
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded bg-primary px-4 py-3 font-syne text-sm font-semibold text-on-primary shadow-[0_4px_16px_rgba(137,77,13,0.25)] transition hover:bg-primary-container active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={submitting || !otpComplete || expiresIn <= 0}
                      type="submit"
                    >
                      Verify and continue
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-surface-container px-4 py-3 font-syne text-sm font-semibold text-on-surface transition hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={cooldown > 0 || resending}
                      onClick={handleResend}
                      type="button"
                    >
                      {resending ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-surface border-t-transparent" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      {cooldown > 0 ? `Resend in ${formatCooldown(cooldown)}` : 'Resend code'}
                    </button>
                  </div>
                </form>

                <div className="h-px w-full bg-surface-container-high" />

                <button
                  className="inline-flex items-center gap-1.5 self-start font-mono text-xs font-bold uppercase text-primary hover:underline"
                  onClick={handleEditEmail}
                  type="button"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Change email address
                </button>

                <p className="hidden text-center font-mono text-xs uppercase text-on-surface-variant lg:block">
                  Step 2 of 3 • Single-use and time limited
                </p>
              </div>
  );
}

function ForgotPasswordStepReset({ confirmMatches, confirmPassword, error, expiresIn, handleResetPassword, newPassword, notice, passwordValid, setConfirmPassword, setError, setNewPassword, setShowConfirm, setShowNew, setStep, showConfirm, showNew, submitting }) {
  return (
<form className="flex flex-col gap-5" onSubmit={handleResetPassword} noValidate>
                <div className="flex flex-col gap-1">
                  <h2 className="font-syne text-2xl text-on-surface sm:text-3xl">Choose a new password</h2>
                  <p className="text-sm text-on-surface-variant">
                    Pick something you have not used before. You will sign in with it immediately after.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs font-semibold uppercase text-on-surface" htmlFor="newPassword">
                    New password
                  </label>
                  <div className="relative flex items-center">
                    <div className="pointer-events-none absolute left-3 flex items-center text-on-surface-variant">
                      <Lock className="h-4.5 w-4.5" />
                    </div>
                    <input
                      aria-invalid={Boolean(error) && !passwordValid}
                      autoComplete="new-password"
                      className={`w-full rounded bg-surface py-3 pl-10 pr-12 font-sans text-sm text-on-surface outline-none transition-all placeholder:text-outline/70 focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_rgba(137,77,13,0.35)] ${
                        error && !passwordValid ? 'shadow-[0_0_0_1px_rgba(186,26,26,0.6)]' : ''
                      }`}
                      id="newPassword"
                      onChange={(event) => {
                        setNewPassword(event.target.value);
                        setError('');
                      }}
                      placeholder="At least 8 characters"
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                    />
                    <button
                      aria-label={showNew ? 'Hide password' : 'Show password'}
                      className="absolute right-2 flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition hover:text-on-surface"
                      onClick={() => setShowNew((prev) => !prev)}
                      type="button"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <PasswordStrength value={newPassword} />

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs font-semibold uppercase text-on-surface" htmlFor="confirmPassword">
                    Confirm new password
                  </label>
                  <div className="relative flex items-center">
                    <div className="pointer-events-none absolute left-3 flex items-center text-on-surface-variant">
                      <Lock className="h-4.5 w-4.5" />
                    </div>
                    <input
                      aria-invalid={Boolean(error) && !confirmMatches}
                      autoComplete="new-password"
                      className={`w-full rounded bg-surface py-3 pl-10 pr-12 font-sans text-sm text-on-surface outline-none transition-all placeholder:text-outline/70 focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_rgba(137,77,13,0.35)] ${
                        error && !confirmMatches ? 'shadow-[0_0_0_1px_rgba(186,26,26,0.6)]' : ''
                      }`}
                      id="confirmPassword"
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        setError('');
                      }}
                      placeholder="Re-type your new password"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                    />
                    <button
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      className="absolute right-2 flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition hover:text-on-surface"
                      onClick={() => setShowConfirm((prev) => !prev)}
                      type="button"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && !confirmMatches && (
                    <p className="text-xs text-error">The two passwords do not match.</p>
                  )}
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-surface-container px-3 py-2.5">
                  <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs leading-relaxed text-on-surface-variant">
                    The code stays valid for {Math.floor(expiresIn / 60)}m {expiresIn % 60}s and can be used once. If
                    it lapses, you will be sent back to request a new one.
                  </p>
                </div>

                  <Feedback error={error} notice={notice} />

                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <button
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded bg-primary px-4 py-3 font-syne text-base font-semibold text-on-primary shadow-[0_4px_16px_rgba(137,77,13,0.25)] transition hover:bg-primary-container active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={submitting}
                      type="submit"
                    >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary border-t-transparent" />
                        Updating password…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Update password
                      </>
                    )}
                  </button>
                  <button
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-surface-container px-4 py-3 font-syne text-sm font-semibold text-on-surface transition hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={submitting}
                    onClick={() => setStep(2)}
                    type="button"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                </div>

                <p className="hidden text-center font-mono text-xs uppercase text-on-surface-variant lg:block">
                  Step 3 of 3 • You will not be signed out automatically
                </p>
              </form>
  );
}

function ForgotPasswordSuccess({ email, handleStartOver, navigate, successRef }) {
  return (
<div className="flex flex-col items-center gap-5 py-4 text-center" ref={successRef}>
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-fixed text-primary">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/15" />
                  <CheckCircle2 className="relative h-10 w-10" />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="font-syne text-2xl font-extrabold text-on-surface sm:text-3xl">Password updated</h2>
                  <p className="mx-auto max-w-md text-sm leading-relaxed text-on-surface-variant">
                    Your password for <span className="font-mono font-semibold text-on-surface">{email}</span> has been
                    changed. Use it the next time you sign in to your recipient account.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-2.5 rounded-xl bg-surface-container-low p-4 text-left">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">What happens next</p>
                  <ul className="flex flex-col gap-2 text-sm text-on-surface-variant">
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                      The verification code has been permanently voided.
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                      Your parcels, COD ledger, and saved addresses are unchanged.
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                      If you spot anything unfamiliar, call 09612-404040 immediately.
                    </li>
                  </ul>
                </div>

                <div className="flex w-full flex-col gap-2.5 sm:flex-row">
                  <button
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded bg-primary px-5 py-3 font-syne text-sm font-bold text-on-primary shadow-[0_4px_16px_rgba(137,77,13,0.25)] transition hover:bg-primary-container active:scale-[0.99]"
                    onClick={() => navigate('/login', { replace: true })}
                    type="button"
                  >
                    Sign in with new password
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded bg-surface-container px-5 py-3 font-syne text-sm font-bold text-on-surface transition hover:bg-surface-container-high"
                    onClick={handleStartOver}
                    type="button"
                  >
                    <RotateCcw className="h-4 w-4" /> Reset another account
                  </button>
                </div>
              </div>
  );
}

function ForgotPasswordStepTracker({ done, step }) {
  return (
<div className="flex flex-col gap-2 lg:hidden">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex min-w-0 items-center gap-1.5 rounded bg-primary-fixed px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-on-primary-fixed">
                  <KeyRound className="h-3 w-3 shrink-0 text-primary" />
                  <span className="truncate">Recovery</span>
                </span>
                <span className="shrink-0 font-mono text-[10px] font-bold uppercase text-on-surface-variant">
                  {done ? 'Done' : `Step ${step} of 3`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {STEPS.map((item) => (
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      done || step > item.id ? 'bg-primary' : step === item.id ? 'bg-primary-container' : 'bg-surface-container'
                    }`}
                    key={item.id}
                  />
                ))}
              </div>
            </div>
  );
}

function ForgotPasswordSecurityFooter() {
  return (
<div className="flex items-center justify-between gap-3 border-t border-surface-container-high pt-3 lg:hidden">
              <details className="group min-w-0">
                <summary className="flex cursor-pointer list-none items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant marker:hidden transition hover:text-primary">
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-180" />
                  Security notes
                </summary>
                <SecurityNotes className="mt-2 text-[13px]" />
              </details>

              <Link
                className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] font-bold uppercase text-primary hover:underline"
                to="/login"
              >
                Back to sign in <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
  );
}

function ForgotPasswordFormCard({ done, step, children }) {
  return (
<div className="order-1 lg:order-2 lg:col-span-7">
          <div className="relative flex flex-col gap-5 overflow-hidden rounded-xl bg-surface-container-lowest p-4 shadow-md sm:p-8 lg:p-10">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-primary via-secondary to-primary-container" />

            {/* Phones lead with the step tracker only: the form's own heading
                already explains the task, so the rail's hero copy is dropped
                here rather than repeating it. */}
            <ForgotPasswordStepTracker
              done={done}
              step={step}
            />

            {children}

            {!done && (
              <div className="h-px w-full bg-surface-container-high" />
            )}

            {!done && (
              <div className="grid grid-cols-3 gap-1 rounded-lg bg-surface-container-low px-2 py-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-5 sm:rounded-xl sm:bg-transparent sm:px-0 sm:py-0">
                {[
                  { icon: ShieldCheck, tone: 'text-primary', label: '256-Bit SSL' },
                  { icon: Timer, tone: 'text-secondary', label: `${OTP_EXPIRY_MINUTES}-Min Expiry` },
                  { icon: Truck, tone: 'text-tertiary', label: 'Parcels Safe' },
                ].map((badge) => (
                  <span
                    className="flex flex-col items-center gap-1 text-center font-mono text-[9px] uppercase leading-tight text-on-surface-variant sm:flex-row sm:gap-1.5 sm:text-xs"
                    key={badge.label}
                  >
                    <badge.icon className={`h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 ${badge.tone}`} />
                    {badge.label}
                  </span>
                ))}
              </div>
            )}

            {/* Folded-in rail footer for phones: one line, with the notes
                collapsed until asked for so the form keeps the screen. */}
            <ForgotPasswordSecurityFooter />
          </div>
        </div>
  );
}
