import { useState } from 'react';
import { Check, KeyRound, ShieldCheck, X } from 'lucide-react';
import OtpInput from '../auth/OtpInput';
import { InlineAlert, SectionCard, Spinner } from './ProfilePrimitives';
import { authApi } from '../../api/auth';

export default function ProfileSecurityCard({ email, enabled, onChange }) {
  const [stage, setStage] = useState('idle');
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const reset = () => {
    setStage('idle');
    setOtp('');
    setError('');
    setNotice('');
    setDevOtp('');
  };

  const startToggle = async () => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const { data } = enabled ? await authApi.disableTwoFactor() : await authApi.enableTwoFactor();
      setDevOtp(data.devOtp || '');
      setNotice(data.message);
      setStage('confirm');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not send your code. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    if (otp.length !== 6) {
      setError('Enter the 6-digit code from your email.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { data } = enabled
        ? await authApi.confirmDisableTwoFactor(otp)
        : await authApi.confirmEnableTwoFactor(otp);
      onChange(!enabled);
      setNotice(data.message);
      setStage('idle');
      setOtp('');
      setDevOtp('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'That code was not correct. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SectionCard
      description={enabled
        ? `On. We email a 6-digit code to ${email || 'your address'} every time you sign in.`
        : `Off. Turn it on and we will email a 6-digit code to ${email || 'your address'} every time you sign in.`}
      icon={ShieldCheck}
      title="Two-step verification"
      action={
        <span className="hidden items-center gap-1.5 sm:inline-flex">
          <span className={`h-2 w-2 rounded-full ${enabled ? 'bg-[#8bd17c]' : 'bg-outline'}`} />
          <span className={`text-sm font-bold ${enabled ? 'text-[#2d5a27]' : 'text-on-surface-variant'}`}>
            {enabled ? 'Enabled' : 'Not enabled'}
          </span>
        </span>
      }
    >
      <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold sm:hidden">
        <span className={`h-2 w-2 rounded-full ${enabled ? 'bg-[#8bd17c]' : 'bg-outline'}`} />
        <span className={enabled ? 'text-[#2d5a27]' : 'text-on-surface-variant'}>{enabled ? 'Enabled' : 'Not enabled'}</span>
      </p>

      {stage === 'confirm' ? (
        <div className="mt-4 space-y-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-4">
          <p className="text-sm leading-relaxed text-on-surface-variant">{notice}</p>
          {devOtp && (
            <p className="rounded-lg border border-primary/25 bg-primary-fixed/40 px-3 py-2 font-mono text-xs text-primary">
              No email server configured, so your code is {devOtp}
            </p>
          )}
          <div className="flex justify-center py-1">
            <OtpInput length={6} onChange={setOtp} value={otp} />
          </div>
          <InlineAlert>{error}</InlineAlert>
          <div className="flex flex-col gap-2 min-[440px]:flex-row">
            <button
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-bold text-white transition hover:bg-primary-container disabled:cursor-wait disabled:opacity-60"
              disabled={busy}
              onClick={confirm}
              type="button"
            >
              {busy ? <Spinner className="h-3.5 w-3.5" /> : <Check aria-hidden="true" className="h-4 w-4" />} Confirm code
            </button>
            <button
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-outline-variant/60 bg-white px-3 py-2.5 text-sm font-bold text-on-surface-variant transition hover:bg-surface-container-low disabled:cursor-wait disabled:opacity-60"
              disabled={busy}
              onClick={reset}
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-2">
            {notice && (
              <p className="rounded-xl border border-[#2d5a27]/20 bg-[#d4edda] px-4 py-3 text-sm font-semibold text-[#2d5a27]">{notice}</p>
            )}
            <InlineAlert>{error}</InlineAlert>
          </div>
          <button
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/60 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-surface-container-low disabled:cursor-wait disabled:opacity-60"
            disabled={busy}
            onClick={startToggle}
            type="button"
          >
            {busy ? <Spinner className="h-3.5 w-3.5" /> : <KeyRound aria-hidden="true" className="h-4 w-4" />}
            {enabled ? 'Turn off two-step verification' : 'Turn on two-step verification'}
          </button>
        </>
      )}
    </SectionCard>
  );
}