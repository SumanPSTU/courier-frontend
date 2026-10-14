import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuthContext } from '../context/authContextValue';
import OtpInput from '../components/auth/OtpInput';
import { inputClass } from '../components/ui/TextField';
import warehouse2 from '../assets/warehouse2.png';

export default function RecipientLogin() {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState('info');
  const [feedbackIcon, setFeedbackIcon] = useState('info');
  const [feedbackText, setFeedbackText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonState, setButtonState] = useState({ label: 'Sign In to Recipient Account', icon: 'arrow_forward' });
  // Set once the password is accepted and this account has two-step verification.
  const [challenge, setChallenge] = useState(null);
  const [challengeOtp, setChallengeOtp] = useState('');
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const finishLogin = async (profile) => {
    if (profile?.role !== 'CUSTOMER') {
      await authApi.logout().catch(() => {});
      setFeedbackType('error');
      setFeedbackIcon('error');
      setFeedbackText(`This account has the ${profile?.role || 'unknown'} role. Use its matching portal to sign in.`);
      return false;
    }
    login({ accessToken: profile.token });
    setFeedbackType('success');
    setFeedbackIcon('verified_user');
    setFeedbackText('Signed in successfully. Loading your account…');
    const requestedNext = searchParams.get('next');
    const next = requestedNext?.startsWith('/') && !requestedNext.startsWith('//') ? requestedNext : '/';
    navigate(next, { replace: true });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!identity.trim() || !password) return;

    setIsLoading(true);
    setFeedbackVisible(true);
    setFeedbackType('info');
    setFeedbackIcon('sync');
    setFeedbackText('Signing you in securely…');
    setButtonState({ label: 'Authenticating Recipient...', icon: null, spin: true });
    const signInButton = { label: 'Sign In to Recipient Account', icon: 'arrow_forward', spin: false };
    const verifyButton = { label: 'Verify and Sign In', icon: 'arrow_forward', spin: false };
    try {
      const { data } = await authApi.login({ email: identity.trim().toLowerCase(), password });

      if (data.requiresTwoFactor) {
        setChallenge({ id: data.challengeId, email: identity.trim().toLowerCase(), devOtp: data.devOtp || '' });
        setChallengeOtp('');
        setFeedbackType('info');
        setFeedbackIcon('mark_email_read');
        setFeedbackText(data.message);
        setButtonState(verifyButton);
        return;
      }

      await finishLogin(data.data);
      setButtonState(signInButton);
    } catch (requestError) {
      setFeedbackType('error');
      setFeedbackIcon('error');
      setFeedbackText(requestError.response?.data?.errors?.[0]?.message || requestError.response?.data?.message || 'We could not sign you in. Check your details and try again.');
      setButtonState(signInButton);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (challengeOtp.length !== 6) {
      setFeedbackType('error');
      setFeedbackIcon('error');
      setFeedbackText('Enter the 6-digit code from your email.');
      return;
    }

    setIsLoading(true);
    setButtonState({ label: 'Checking your code...', icon: null, spin: true });
    try {
      const { data } = await authApi.verifyTwoFactorLogin({ challengeId: challenge.id, otp: challengeOtp });
      await finishLogin(data.data);
    } catch (requestError) {
      setFeedbackType('error');
      setFeedbackIcon('error');
      setFeedbackText(requestError.response?.data?.message || 'That code was not correct. Please try again.');
      setChallengeOtp('');
      setButtonState({ label: 'Verify and Sign In', icon: 'arrow_forward', spin: false });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelChallenge = async () => {
    if (challenge?.id) await authApi.cancelTwoFactorLogin({ challengeId: challenge.id }).catch(() => {});
    setChallenge(null);
    setChallengeOtp('');
    setPassword('');
    setFeedbackVisible(false);
    setButtonState({ label: 'Sign In to Recipient Account', icon: 'arrow_forward', spin: false });
  };

  const feedbackClass = feedbackType === 'success'
    ? 'bg-secondary-fixed text-on-secondary-fixed'
    : feedbackType === 'error'
      ? 'bg-error-container text-on-error-container'
      : 'bg-surface-container text-on-surface';

  return (
    <>
      <section className="w-full px-6 lg:px-12 py-6 lg:py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <LoginBenefits />

          <div className="order-1 flex flex-col gap-4 lg:order-2 lg:col-span-5">
            <LoginFormCard
              buttonState={buttonState}
              cancelChallenge={cancelChallenge}
              challenge={challenge}
              challengeOtp={challengeOtp}
              feedbackClass={feedbackClass}
              feedbackIcon={feedbackIcon}
              feedbackText={feedbackText}
              feedbackType={feedbackType}
              feedbackVisible={feedbackVisible}
              handleLoginSubmit={handleLoginSubmit}
              handleVerifySubmit={handleVerifySubmit}
              identity={identity}
              isLoading={isLoading}
              password={password}
              setChallengeOtp={setChallengeOtp}
              setIdentity={setIdentity}
              setPassword={setPassword}
              showPassword={showPassword}
              togglePassword={togglePassword}
            />

            <LoginTrustBadges />
          </div>
        </div>
      </section>
    </>
  );
}

function LoginBenefits() {
  return (
<div className="order-2 hidden flex-col gap-6 lg:order-1 lg:col-span-7 lg:flex">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary-fixed text-on-primary-fixed font-mono text-xs uppercase font-semibold">
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                  Prestige Delivery Pass
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-mono text-xs uppercase font-medium">
                  <span className="material-symbols-outlined text-[13px] text-tertiary">speed</span>
                  Instant Account Access
                </span>
              </div>
              <h1 className="font-syne font-extrabold text-3xl sm:text-4xl text-on-surface mt-1 tracking-tight">Welcome Back to Your Priority Recipient Hub</h1>
              <p className="font-sans text-sm text-on-surface-variant max-w-2xl">Manage incoming deliveries across 64 districts with verified driver radar, dynamic doorstep PIN, and zero-fee bKash/Nagad digital COD.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: 'pin', title: 'Dynamic Handover PIN', desc: 'Tamper-proof package release key for riders' },
                { icon: 'two_wheeler', title: 'Real-Time Motorbike Radar', desc: 'Direct line to assigned delivery hero' },
                { icon: 'schedule', title: 'Flexible Time Window', desc: 'Shift deliveries to evening or office hours with 1 tap' },
                { icon: 'qr_code_scanner', title: 'Digital Cash on Delivery', desc: 'Instant bKash, Nagad QR scan receipts at doorstep' },
              ].map((p, i) => (
                <div key={i} className="p-4 rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-2 hover:bg-surface-container transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{p.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-syne text-base text-on-surface font-semibold">{p.title}</h3>
                    <p className="font-sans text-sm text-on-surface-variant mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-md group">
              <img alt="MadiSynthia courier warehouse and delivery operations" className="w-full h-64 sm:h-72 object-cover transition-transform duration-700 group-hover:scale-[1.02]" src={warehouse2} />
              <div className="absolute inset-0 bg-linear-to-t from-inverse-surface/85 via-inverse-surface/30 to-transparent flex flex-col justify-end p-4 sm:p-6 text-on-tertiary-container">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-primary text-on-primary font-mono text-xs uppercase font-semibold shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">local_shipping</span>Linehaul Fleet Serving 495 Thanas Nationwide
                  </span>
                </div>
                <p className="font-sans text-sm text-surface-container-highest max-w-xl">Equipped with telematics and smart parcel lockers, delivering over 45,000 doorstep consignments daily with zero tamper tolerance.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">check_circle</span>
                </div>
                <div>
                  <p className="font-syne font-bold text-lg text-on-surface">99.4%</p>
                  <p className="font-mono text-xs uppercase text-on-surface-variant">On-Time Linehaul</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-surface-variant" />
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">groups</span>
                </div>
                <div>
                  <p className="font-syne font-bold text-lg text-on-surface">250,000+</p>
                  <p className="font-mono text-xs uppercase text-on-surface-variant">Active Recipients</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-surface-variant" />
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <div>
                  <p className="font-syne font-bold text-lg text-on-surface">4.9 ★</p>
                  <p className="font-mono text-xs uppercase text-on-surface-variant">Satisfaction Rating</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low shadow-sm flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-0.5 font-bold font-mono text-sm">FR</div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-secondary">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="font-sans text-sm text-on-surface italic">"The dynamic handover PIN is a game changer for online shopping deliveries. The courier doesn't hand over my package until I verify on my portal, and paying COD via bKash QR took literally three seconds."</p>
                <p className="font-mono text-xs text-on-surface-variant">— <strong className="text-on-surface">Farhana Rahman</strong>, Uttara Sector 7, Dhaka (Verified Recipient)</p>
              </div>
            </div>
          </div>
  );
}


function LoginFormCard({ buttonState, cancelChallenge, challenge, challengeOtp, feedbackClass, feedbackIcon, feedbackText, feedbackType, feedbackVisible, handleLoginSubmit, handleVerifySubmit, identity, isLoading, password, setChallengeOtp, setIdentity, setPassword, showPassword, togglePassword }) {
  return (
<div className="p-4 sm:p-10 rounded-xl bg-surface-container-lowest shadow-md flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-primary via-secondary to-primary-container" />

              {/* The marketing rail is desktop-only, so a phone needs just a
                  sliver of context above the form. */}
              <div className="flex items-center justify-between gap-2 lg:hidden">
                <span className="inline-flex min-w-0 items-center gap-1.5 rounded bg-primary-fixed px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-on-primary-fixed">
                  <span className="material-symbols-outlined text-[13px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                  <span className="truncate">Recipient Portal</span>
                </span>
                <span className="shrink-0 font-mono text-[10px] font-bold uppercase text-on-surface-variant">Secure Sign In</span>
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="font-syne text-2xl text-on-surface">{challenge ? 'Check your email' : 'Welcome Back'}</h2>
                <p className="font-sans text-sm text-on-surface-variant">
                  {challenge
                    ? 'Enter the 6-digit code we sent to your email to finish signing in.'
                    : 'Sign in to track parcels, manage deliveries, and pay COD online.'}
                </p>
              </div>

              <LoginFormBody
                buttonState={buttonState}
                cancelChallenge={cancelChallenge}
                challenge={challenge}
                challengeOtp={challengeOtp}
                feedbackClass={feedbackClass}
                feedbackIcon={feedbackIcon}
                feedbackText={feedbackText}
                feedbackType={feedbackType}
                feedbackVisible={feedbackVisible}
                handleLoginSubmit={handleLoginSubmit}
                handleVerifySubmit={handleVerifySubmit}
                identity={identity}
                isLoading={isLoading}
                password={password}
                setChallengeOtp={setChallengeOtp}
                setIdentity={setIdentity}
                setPassword={setPassword}
                showPassword={showPassword}
                togglePassword={togglePassword}
              />

              <div className="w-full h-px bg-surface-container-high my-1" />

              <div className="p-3 rounded-lg bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[18px]">travel_explore</span>
                  <span className="font-sans text-sm font-medium">Looking for a single parcel?</span>
                </div>
                <Link className="font-mono text-xs uppercase font-semibold text-primary hover:text-primary-container flex items-center gap-1 hover:underline" to="/tracking">Track by Waybill Number<span className="material-symbols-outlined text-[14px]">north_east</span></Link>
              </div>

              <div className="text-center pt-1">
                <p className="font-sans text-sm text-on-surface-variant">New here? <Link className="font-semibold text-primary hover:underline ml-1" to="/registration">Register in 2 minutes →</Link></p>
              </div>

              <div className="text-center p-2 rounded bg-surface-container-high/60">
                <p className="font-sans text-sm text-on-surface-variant">Are you an e-commerce seller? <Link className="font-semibold text-tertiary hover:underline inline-flex items-center gap-0.5 ml-1" to="/registration">Create a merchant account<span className="material-symbols-outlined text-[14px]">arrow_right_alt</span></Link></p>
              </div>
            </div>
  );
}

function LoginTrustBadges() {
  return (
<div className="grid grid-cols-2 gap-1 rounded-lg bg-surface-container-low px-2 py-2 sm:flex sm:items-center sm:justify-center sm:gap-5 sm:rounded-xl sm:bg-surface-container-low sm:px-3 sm:py-3">
              <span className="flex flex-col items-center gap-1 text-center font-mono text-[9px] uppercase leading-tight text-on-surface-variant sm:flex-row sm:gap-1.5 sm:text-xs">
                <span className="material-symbols-outlined text-base text-primary">verified</span>Secure Sign Up
              </span>
              <span className="flex flex-col items-center gap-1 text-center font-mono text-[9px] uppercase leading-tight text-on-surface-variant sm:flex-row sm:gap-1.5 sm:text-xs">
                <span className="material-symbols-outlined text-base text-secondary">lock</span>256-Bit SSL
              </span>
            </div>
  );
}

function LoginFormBody({ buttonState, cancelChallenge, challenge, challengeOtp, feedbackClass, feedbackIcon, feedbackText, feedbackType, feedbackVisible, handleLoginSubmit, handleVerifySubmit, identity, isLoading, password, setChallengeOtp, setIdentity, setPassword, showPassword, togglePassword }) {
  return (
challenge ? (
                <form className="flex flex-col gap-4" onSubmit={handleVerifySubmit}>
                  {challenge.devOtp && (
                    <p className="rounded border border-primary/25 bg-primary-fixed/40 px-3 py-2 font-mono text-xs text-primary">
                      No email server configured, so your code is {challenge.devOtp}
                    </p>
                  )}

                  <div className="flex justify-center py-1">
                    <OtpInput hasError={feedbackType === 'error'} id="loginTwoFactorOtp" onChange={setChallengeOtp} value={challengeOtp} />
                  </div>

                  <div className={`${feedbackVisible ? '' : 'hidden'} p-3 rounded ${feedbackClass} flex items-center gap-2 font-sans text-sm`}>
                    <span className="material-symbols-outlined text-primary text-[18px]">{feedbackIcon}</span>
                    <span>{feedbackText}</span>
                  </div>

                  <button className="w-full py-3 px-4 rounded bg-primary hover:bg-primary-container text-on-primary font-syne text-base tracking-wide font-semibold shadow-[0_4px_16px_rgba(137,77,13,0.25)] active:scale-[0.99] transition-all flex items-center justify-center gap-2" disabled={isLoading} type="submit">
                    {buttonState.spin ? (
                      <>
                        <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin inline-block" />
                        <span>{buttonState.label}</span>
                      </>
                    ) : (
                      <>
                        <span>{buttonState.label}</span>
                        <span className="material-symbols-outlined text-[18px]">{buttonState.icon}</span>
                      </>
                    )}
                  </button>

                  <button className="w-full min-h-11 rounded border border-outline-variant/50 font-sans text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition" disabled={isLoading} onClick={cancelChallenge} type="button">
                    Use a different account
                  </button>
                </form>
              ) : (
              <form className="flex flex-col gap-4" id="customerLoginForm" onSubmit={handleLoginSubmit}>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs uppercase text-on-surface font-semibold flex items-center justify-between" htmlFor="recipientIdentity">
                    <span>Registered Email</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center gap-1 pointer-events-none text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">mail</span>
                    </div>
                    <input autoComplete="email" className={`${inputClass} pl-10 pr-4 font-sans`} id="recipientIdentity" placeholder="you@example.com" required type="email" value={identity} onChange={(e) => setIdentity(e.target.value)} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-xs uppercase text-on-surface font-semibold" htmlFor="recipientPassword">Password</label>
                    <Link className="font-mono text-xs text-primary hover:underline font-semibold inline-flex items-center gap-1" to="/forgot-password">Forgot Password?</Link>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center pointer-events-none text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                    </div>
                    <input className={`${inputClass} pl-10 pr-12 font-sans`} id="recipientPassword" placeholder="Enter your security password" required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button aria-label="Toggle password visibility" className="absolute right-3 text-on-surface-variant hover:text-on-surface flex items-center justify-center p-1" id="togglePasswordBtn" type="button" onClick={togglePassword}>
                      <span className="material-symbols-outlined text-[20px]" id="passwordEyeIcon">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <div className={`${feedbackVisible ? '' : 'hidden'} p-3 rounded ${feedbackClass} flex items-center gap-2 font-sans text-sm`} id="loginFeedback">
                  <span className="material-symbols-outlined text-primary text-[18px]" id="feedbackIcon">{feedbackIcon}</span>
                  <span id="feedbackText">{feedbackText}</span>
                </div>

                <button disabled={isLoading} className="w-full py-3 px-4 rounded bg-primary hover:bg-primary-container text-on-primary font-syne text-base tracking-wide font-semibold shadow-[0_4px_16px_rgba(137,77,13,0.25)] hover:shadow-[0_6px_20px_rgba(137,77,13,0.35)] active:scale-[0.99] transition-all flex items-center justify-center gap-2" id="submitLoginBtn" type="submit">
                  {buttonState.spin ? (
                    <>
                      <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin inline-block mr-2" />
                      <span>{buttonState.label}</span>
                    </>
                  ) : (
                    <>
                      <span>{buttonState.label}</span>
                      <span className="material-symbols-outlined text-[18px]">{buttonState.icon}</span>
                    </>
                  )}
                </button>

                <p className="hidden text-center font-mono text-xs uppercase text-on-surface-variant lg:block">Instant Access • Direct Password Login</p>
              </form>
              )
  );
}
