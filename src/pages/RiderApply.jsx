import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, BadgeCheck, Bike, Car, Check, CheckCircle2, Clock3, FileText, Footprints, IdCard, ShieldCheck,
  Truck, Upload, Wallet, X,
} from 'lucide-react';
import { riderApi } from '../api/rider';
import { authApi } from '../api/auth';
import { useAuthContext } from '../context/authContextValue';
import Field from '../components/ui/TextField';
import { formatDateTime } from '../utils/format';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const CV_TYPES = [...IMAGE_TYPES, 'application/pdf'];
const MAX_IMAGE_MB = 5;
const MAX_CV_MB = 8;

const vehicles = [
  { value: 'BIKE', label: 'Motorbike', Icon: Bike, note: 'Fastest in city traffic' },
  { value: 'CAR', label: 'Car', Icon: Car, note: 'Good for bulky parcels' },
  { value: 'VAN', label: 'Van', Icon: Truck, note: 'Multiple parcels per trip' },
  { value: 'FOOT', label: 'On foot', Icon: Footprints, note: 'Walk-up deliveries nearby' },
];

const earnings = [
  { title: 'Paid per delivery', desc: 'You see the delivery amount before you accept it. There is no daily target you have to hit.' },
  { title: 'Cash, collected the same day', desc: 'If you collect cash on delivery, it is counted in your balance the same day.' },
  { title: 'Pick the shifts you want', desc: 'Go online when it suits you, and turn off availability whenever you need to.' },
  { title: 'No joining fee', desc: 'Applying is free. You only need your documents and your own vehicle.' },
];

const initialFiles = { photo: null, cv: null, nidFront: null, nidBack: null, licenceFront: null, licenceBack: null };

// Every item must be filled before the application can be sent.
const TEXT_FIELDS = [
  { name: 'nidNumber', label: 'NID number' },
  { name: 'dateOfBirth', label: 'Date of birth' },
  { name: 'address', label: 'Address' },
];
const TEXT_FIELD_LABELS = Object.fromEntries(TEXT_FIELDS.map(({ name, label }) => [name, label]));
TEXT_FIELD_LABELS.licenseNumber = 'Driving licence number';

export default function RiderApply() {
  const { auth, user, updateUser } = useAuthContext();
  const [form, setForm] = useState({ name: '', email: '', phone: '', vehicleType: 'BIKE', licenseNumber: '', nidNumber: '', dateOfBirth: '', address: '' });
  const [files, setFiles] = useState(initialFiles);
  const [fileErrors, setFileErrors] = useState({});
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sendingNow, setSendingNow] = useState(false);
  const [requirements, setRequirements] = useState(null);
  const [requirementsError, setRequirementsError] = useState('');
  const [profileResolved, setProfileResolved] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [application, setApplication] = useState(null);
  const [applicationResolved, setApplicationResolved] = useState(false);
  const [applicationError, setApplicationError] = useState('');
  const [statusRetry, setStatusRetry] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    if (!auth) {
      return () => { active = false; };
    }
    authApi.getProfile()
      .then(({ data }) => {
        if (!active) return;
        setProfileError('');
        const profile = data.data || {};
        updateUser(profile);
        setForm((current) => ({
          ...current,
          name: profile.name || user?.name || '',
          email: profile.email || user?.email || '',
          phone: profile.phone || user?.phone || '',
          address: profile.address || current.address || '',
        }));
      })
      .catch((requestError) => {
        if (!active) return;
        setProfileError(requestError.response?.data?.message || 'Could not load your account profile. Please sign in again.');
      })
      .finally(() => { if (active) setProfileResolved(true); });
    return () => { active = false; };
  }, [auth, updateUser, user?.email, user?.name, user?.phone]);

  useEffect(() => {
    let active = true;
    if (!auth) {
      return () => { active = false; };
    }
    riderApi.getMyApplicationStatus()
      .then(({ data }) => {
        if (!active) return;
        setApplicationError('');
        setApplication(data.data || null);
      })
      .catch((requestError) => {
        if (active) setApplicationError(requestError.response?.data?.message || 'Could not verify your application status.');
      })
      .finally(() => { if (active) setApplicationResolved(true); });
    return () => { active = false; };
  }, [auth, statusRetry]);

  useEffect(() => {
    let active = true;
    riderApi.getApplyRequirements(form.vehicleType)
      .then(({ data }) => { if (active) setRequirements(data.data); })
      .catch(() => { if (active) setRequirementsError('Could not load the current application requirements. Please retry.'); });
    return () => { active = false; };
  }, [form.vehicleType]);

  const needsLicence = requirements?.documents?.some((field) => field.startsWith('licence')) ?? false;

  const requiredFiles = requirements?.documents || [];
  const requiredTexts = (requirements?.requiredFields || []).map((name) => ({ name, label: TEXT_FIELD_LABELS[name] || name }));

  const missingTexts = requiredTexts.filter(({ name }) => !String(form[name] || '').trim());
  const missingFiles = requiredFiles.filter((field) => !files[field]);
  const totalSteps = requiredTexts.length + requiredFiles.length;
  const doneSteps = totalSteps - missingTexts.length - missingFiles.length;
  const complete = Boolean(requirements) && missingTexts.length === 0 && missingFiles.length === 0;
  const percent = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
  };

  // On-foot delivery needs no licence, so drop the uploads if the applicant switches to it.
  const chooseVehicle = (value) => {
    setRequirements(null);
    setRequirementsError('');
    setForm((current) => ({ ...current, vehicleType: value }));
  };

  const setFile = (field, file) => {
    setFileErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    setFiles((current) => {
      const next = { ...current };
      if (file) next[field] = file;
      else delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!requirements) {
      setError(requirementsError || 'Wait for the application requirements to load before submitting.');
      return;
    }

    if (missingTexts.length > 0) {
      setError(`Complete the required fields: ${missingTexts.map(({ label }) => label).join(', ')}.`);
      document.querySelector(`[name="${missingTexts[0].name}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const problems = {};
    for (const field of missingFiles) problems[field] = `${FIELD_LABELS[field]} is required.`;
    if (Object.keys(problems).length > 0) {
      setFileErrors(problems);
      const firstMissing = Object.keys(problems)[0];
      document.getElementById(`upload-${firstMissing}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const payload = new FormData();
    payload.append('vehicleType', form.vehicleType);
    payload.append('licenseNumber', form.licenseNumber.trim());
    payload.append('nidNumber', form.nidNumber.trim());
    payload.append('dateOfBirth', form.dateOfBirth);
    payload.append('address', form.address.trim());
    for (const [field, file] of Object.entries(files)) {
      if (file) payload.append(field, file);
    }

    setSending(true);
    setSendingNow(true);
    try {
      await riderApi.apply(payload);
      setSubmitted(true);
    } catch (requestError) {
      const response = requestError.response?.data;
      const validationDetails = Array.isArray(response?.errors)
        ? response.errors.map(({ field, message }) => `${field ? `${field}: ` : ''}${message}`).join(' ')
        : '';
      setError([response?.message || 'We could not send your application. Please try again.', validationDetails]
        .filter(Boolean)
        .join(' '));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSending(false);
      setSendingNow(false);
    }
  };

  if (!auth) return <RiderApplyAccessRequired />;
  if (!profileResolved || !applicationResolved) return <main className="grid min-h-[55vh] place-items-center bg-surface px-4"><p className="text-sm font-semibold text-on-surface-variant">Checking your account and application status…</p></main>;
  if (applicationError) return <RiderApplicationStatusError message={applicationError} onRetry={() => {
    setApplicationError('');
    setApplicationResolved(false);
    setStatusRetry((current) => current + 1);
  }} />;
  if (application) return <RiderApplicationStatus application={application} />;
  if (user?.role && user.role !== 'CUSTOMER') return <RiderApplyUnavailable role={user.role} />;
  if (submitted) return <RiderApplySubmitted name={form.name} />;

  return (
    <main className="w-full bg-surface px-4 py-6 sm:px-6 sm:py-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-xl border border-primary/20 bg-primary-fixed/40 px-4 py-3 text-sm leading-6 text-on-surface"><strong>Applying with your customer account.</strong> Your account stays a customer account while the application is pending. If an administrator approves it, this same account becomes a rider account.</div>
        {profileError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{profileError}</p>}
        {requirementsError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{requirementsError}</p>}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          <RiderApplyForm
            chooseVehicle={chooseVehicle}
            complete={complete}
            doneSteps={doneSteps}
            error={error}
            fileErrors={fileErrors}
            files={files}
            form={form}
            handleSubmit={handleSubmit}
            missingFiles={missingFiles}
            missingTexts={missingTexts}
            needsLicence={needsLicence}
            percent={percent}
            requiredFiles={requiredFiles}
            sending={sending}
            sendingNow={sendingNow}
            setFile={setFile}
            totalSteps={totalSteps}
            update={update}
          />

          <RiderApplySummary requirements={requirements} />
        </div>
      </div>
    </main>
  );
}

const FIELD_LABELS = {
  photo: 'Your photo',
  cv: 'Your CV',
  nidFront: 'NID front',
  nidBack: 'NID back',
  licenceFront: 'Licence front',
  licenceBack: 'Licence back',
};

function RiderApplyAccessRequired() {
  return <main className="grid min-h-[60vh] place-items-center bg-surface px-4 py-10"><section className="w-full max-w-lg rounded-3xl border border-outline-variant/50 bg-surface-container-lowest p-6 text-center shadow-sm sm:p-9"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-fixed text-primary"><ShieldCheck className="h-6 w-6"/></span><h1 className="mt-4 font-syne text-2xl font-extrabold text-on-surface">Create your customer account first</h1><p className="mt-2 text-sm leading-6 text-on-surface-variant">Rider applications are attached to your registered customer account. Sign in or register, then return here to submit your documents.</p><div className="mt-6 flex flex-col justify-center gap-3 min-[420px]:flex-row"><Link className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary-container" to="/registration?next=%2Fapply-as-rider">Register</Link><Link className="inline-flex min-h-11 items-center justify-center rounded-xl border border-outline-variant px-5 text-sm font-bold text-on-surface hover:bg-surface" to="/login?next=%2Fapply-as-rider">Sign in</Link></div></section></main>;
}

function RiderApplyUnavailable({ role }) {
  const alreadyRider = role === 'RIDER';
  return <main className="grid min-h-[60vh] place-items-center bg-surface px-4 py-10"><section className="w-full max-w-lg rounded-3xl border border-outline-variant/50 bg-surface-container-lowest p-6 text-center shadow-sm sm:p-9"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-fixed text-primary"><ShieldCheck className="h-6 w-6"/></span><h1 className="mt-4 font-syne text-2xl font-extrabold text-on-surface">{alreadyRider ? 'This account is already a rider' : 'This account cannot apply as a rider'}</h1><p className="mt-2 text-sm leading-6 text-on-surface-variant">{alreadyRider ? 'Use your rider account to continue.' : 'Only registered customer accounts can submit rider applications.'}</p><Link className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-outline-variant px-5 text-sm font-bold text-on-surface hover:bg-surface" to="/profile">Go to account</Link></section></main>;
}

function RiderApplicationStatus({ application }) {
  const isPending = application.approvalStatus === 'PENDING';
  const isApproved = application.approvalStatus === 'APPROVED';
  const Icon = isPending ? Clock3 : isApproved ? BadgeCheck : AlertTriangle;
  const tone = isPending
    ? 'border-amber-200 bg-amber-50 text-amber-950'
    : isApproved
      ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
      : 'border-red-200 bg-red-50 text-red-950';
  const heading = isPending ? 'Your application is under review' : isApproved ? 'Your application is approved' : 'Your application was not approved';
  const description = isPending
    ? 'An administrator is reviewing your details and documents. Your account remains a customer account until approval.'
    : isApproved
      ? 'Your registered account has been changed to the rider role. Sign in to the rider portal with the same email and password.'
      : 'Your customer account remains active. Review the note below or contact support if you need help.';

  return <main className="grid min-h-[60vh] place-items-center bg-surface px-4 py-10"><section className={`w-full max-w-2xl rounded-3xl border bg-white p-6 shadow-sm sm:p-9 ${tone}`}><div className="flex flex-col items-center text-center"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80"><Icon className="h-7 w-7"/></span><p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[.18em]">Rider application · {displayLabel(application.approvalStatus)}</p><h1 className="mt-2 font-syne text-2xl font-extrabold sm:text-3xl">{heading}</h1><p className="mt-3 max-w-lg text-sm leading-6 opacity-80">{description}</p></div><div className="mt-6 grid gap-3 rounded-2xl border border-black/5 bg-white/75 p-4 sm:grid-cols-2"><StatusDetail title="Vehicle" value={displayLabel(application.vehicleType)}/><StatusDetail title="Submitted" value={formatDateTime(application.createdAt)}/><StatusDetail title="Last updated" value={formatDateTime(application.updatedAt)}/></div>{application.rejectionReason && <div className="mt-4 rounded-xl border border-red-200 bg-white/80 p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-red-800">Administrator note</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-red-950">{application.rejectionReason}</p></div>}<div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary-container" to="/profile">Go to your account</Link>{isApproved && <Link className="inline-flex min-h-11 items-center justify-center rounded-xl border border-current/20 px-5 text-sm font-bold hover:bg-white/60" to="/login">Sign in again</Link>}</div></section></main>;
}

function displayLabel(value = '') {
  return String(value).toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function StatusDetail({ title, value }) {
  return <div><p className="text-[9px] font-bold uppercase tracking-wide opacity-65">{title}</p><p className="mt-1 text-xs font-semibold">{value || '—'}</p></div>;
}

function RiderApplicationStatusError({ message, onRetry }) {
  return <main className="grid min-h-[55vh] place-items-center bg-surface px-4 py-10"><section className="w-full max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-red-950"><h1 className="font-syne text-xl font-extrabold">Couldn’t check application status</h1><p className="mt-2 text-sm leading-6">{message}</p><button className="mt-4 min-h-10 rounded-xl bg-red-900 px-4 text-sm font-bold text-white hover:bg-red-800" onClick={onRetry} type="button">Try again</button></section></main>;
}

function RiderApplySubmitted({ name }) {
  return <main className="grid min-h-[60vh] place-items-center bg-surface px-4 py-10"><section className="w-full max-w-xl rounded-3xl border border-emerald-200 bg-white p-6 text-center shadow-sm sm:p-9"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><CheckCircle2 className="h-6 w-6"/></span><p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[.18em] text-emerald-700">Application received</p><h1 className="mt-2 font-syne text-2xl font-extrabold text-on-surface">Thanks{name ? `, ${name}` : ''}. Your application is under review.</h1><p className="mt-3 text-sm leading-6 text-on-surface-variant">Your customer account remains active while the application is pending. If an administrator approves you, this same account will change to the rider role.</p><Link className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary-container" to="/profile">Return to your account</Link></section></main>;
}

function FileField({ accept, error, field, hint, onSelect, preview = true, value }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState('');

  const previewUrl = useMemo(() => {
    if (!value || !preview || !value.type.startsWith('image/')) return '';
    return URL.createObjectURL(value);
  }, [value, preview]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const clear = () => {
    setLocalError('');
    onSelect(field, null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFile = (file) => {
    if (!file) return;
    const problem = validateFileFor(field, file);
    setLocalError(problem || '');
    onSelect(field, problem ? null : file);
    if (problem && inputRef.current) inputRef.current.value = '';
  };

  const shownError = localError || error;

  return (
    <div className="min-w-0">
      <span className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
        {FIELD_LABELS[field]} <span className="text-error">*</span>
      </span>
      <div
        className={`relative min-w-0 rounded-xl border-2 border-dashed transition ${shownError ? 'border-error/60 bg-error-container/20' : dragging ? 'border-primary bg-primary-fixed/30' : value ? 'border-primary/50 bg-primary-fixed/20' : 'border-outline-variant/60 bg-surface hover:border-primary/50'}`}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); handleFile(event.dataTransfer.files?.[0]); }}
      >
        <input
          accept={accept}
          className="sr-only"
          id={`upload-${field}`}
          onChange={(event) => handleFile(event.target.files?.[0])}
          ref={inputRef}
          type="file"
        />
        {value ? (
          <div className="flex items-center gap-3 p-2.5">
            {previewUrl ? (
              <img alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" src={previewUrl} />
            ) : (
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white/70 text-primary">
                {field === 'cv' ? <FileText aria-hidden="true" className="h-6 w-6" /> : <Upload aria-hidden="true" className="h-6 w-6" />}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-on-surface">{value.name}</p>
              <p className="text-[11px] text-on-surface-variant">{formatBytes(value.size)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button aria-label={`Change ${FIELD_LABELS[field]}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant/60 bg-white text-on-surface-variant transition hover:bg-surface-container-low" onClick={() => inputRef.current?.click()} type="button">
                <Upload aria-hidden="true" className="h-4 w-4" />
              </button>
              <button aria-label={`Remove ${FIELD_LABELS[field]}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant/60 bg-white text-error transition hover:bg-error-container/40" onClick={clear} type="button">
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <button className="flex w-full flex-col items-center gap-1.5 px-3 py-6 text-center" onClick={() => inputRef.current?.click()} type="button">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary">
              {field === 'cv' ? <FileText aria-hidden="true" className="h-5 w-5" /> : <Upload aria-hidden="true" className="h-5 w-5" />}
            </span>
            <span className="text-sm font-semibold text-on-surface">Tap to upload</span>
            <span className="text-[11px] text-on-surface-variant">{hint}</span>
          </button>
        )}
      </div>
      {shownError && <p aria-live="polite" className="mt-1.5 text-xs font-medium text-error">{shownError}</p>}
    </div>
  );
}

function validateFileFor(field, file) {
  const allowed = field === 'cv' ? CV_TYPES : IMAGE_TYPES;
  const maxMb = field === 'cv' ? MAX_CV_MB : MAX_IMAGE_MB;
  if (!allowed.includes(file.type)) {
    return `${FIELD_LABELS[field]} must be ${field === 'cv' ? 'a PDF, JPG, PNG, or WebP' : 'a JPG, PNG, or WebP'}.`;
  }
  if (file.size > maxMb * 1024 * 1024) return `${FIELD_LABELS[field]} must be smaller than ${maxMb} MB.`;
  return null;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function RiderApplyForm({ chooseVehicle, complete, doneSteps, error, fileErrors, files, form, handleSubmit, missingFiles, missingTexts, needsLicence, percent, requiredFiles, sending, sendingNow, setFile, totalSteps, update }) {
  return (
<section className="lg:col-span-3">
            <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-4 shadow-sm sm:p-6 lg:p-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-fixed px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> Rider application
              </span>
              <h1 className="mt-3 text-balance font-syne text-2xl font-extrabold leading-tight tracking-tight text-on-surface sm:text-3xl lg:text-4xl">
                Ride with us and get paid for every delivery
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant sm:text-base">
                Your application will be attached to the customer account shown below. After admin review, approval changes that same account into a rider account.
              </p>

              <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-xl border border-outline-variant/50 bg-surface p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Application completeness</p>
                    <p className={`font-sans text-sm font-bold ${complete ? 'text-[#2d5a27]' : 'text-on-surface'}`}>{percent}%</p>
                  </div>
                  <div aria-hidden="true" className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-container">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${complete ? 'bg-[#8bd17c]' : 'bg-primary'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-2 font-sans text-xs leading-relaxed text-on-surface-variant">
                    {complete
                      ? 'Everything is filled in. You can send your application now.'
                      : `Fill in every field and upload all ${requiredFiles.length} documents to send your application. ${totalSteps - doneSteps} left.`}
                  </p>
                  {!complete && (
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {[...missingTexts.map((f) => f.label), ...missingFiles.map((f) => FIELD_LABELS[f])].map((label) => (
                        <li className="rounded-full border border-outline-variant/50 bg-surface-container-low px-2.5 py-1 font-sans text-[11px] text-on-surface-variant" key={label}>{label}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <fieldset className="min-w-0">
                  <legend className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">1. About you</legend>
                  <div className="mb-4 rounded-xl border border-outline-variant/50 bg-surface p-4"><p className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">Registered customer account</p><p className="mt-2 text-sm font-bold text-on-surface">{form.name || 'Your account name'}</p><p className="mt-0.5 break-all text-xs text-on-surface-variant">{form.email || 'Email unavailable'}{form.phone ? ` · ${form.phone}` : ''}</p></div>
                  <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
                    <Field label="NID number" name="nidNumber" onChange={update} placeholder="10 digit NID number" required value={form.nidNumber} />
                    <Field label="Date of birth" max={new Date().toISOString().slice(0, 10)} name="dateOfBirth" onChange={update} required type="date" value={form.dateOfBirth} />
                    <Field autoComplete="street-address" label="Home address" name="address" onChange={update} placeholder="House, road, area, district" required value={form.address} />
                  </div>
                </fieldset>

                <fieldset className="min-w-0">
                  <legend className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">2. Your vehicle</legend>
                  <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                    {vehicles.map(({ value, label, note, Icon }) => {
                      const active = form.vehicleType === value;
                      return (
                        <label
                          className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-3 transition ${active ? 'border-primary bg-primary-fixed/40 ring-2 ring-primary/20' : 'border-outline-variant/60 bg-surface hover:border-primary/40'}`}
                          key={value}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <Icon aria-hidden="true" className={`h-5 w-5 shrink-0 ${active ? 'text-primary' : 'text-on-surface-variant'}`} />
                            <input checked={active} className="h-4 w-4 shrink-0 accent-primary" name="vehicleType" onChange={() => chooseVehicle(value)} type="radio" value={value} />
                          </span>
                          <span className="text-sm font-bold text-on-surface">{label}</span>
                          <span className="text-[11px] leading-snug text-on-surface-variant">{note}</span>
                        </label>
                      );
                    })}
                  </div>
                  {needsLicence && (
                    <div className="mt-4 min-w-0">
                      <Field label="Driving licence number" name="licenseNumber" onChange={update} placeholder="Your licence number" required value={form.licenseNumber} />
                    </div>
                  )}
                </fieldset>

                <fieldset className="min-w-0">
                  <legend className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">3. Your photo and CV</legend>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FileField
                      accept={IMAGE_TYPES.join(',')}
                      error={fileErrors.photo}
                      field="photo"
                      hint={`JPG, PNG or WebP · max ${MAX_IMAGE_MB} MB`}
                      onSelect={setFile}
                      value={files.photo}
                    />
                    <FileField
                      accept={CV_TYPES.join(',')}
                      error={fileErrors.cv}
                      field="cv"
                      hint={`PDF, JPG, PNG or WebP · max ${MAX_CV_MB} MB`}
                      onSelect={setFile}
                      preview={false}
                      value={files.cv}
                    />
                  </div>
                </fieldset>

                <fieldset className="min-w-0">
                  <legend className="mb-2.5 flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    4. National ID
                    <span className="font-sans text-[10px] font-medium normal-case tracking-normal text-on-surface-variant">Front and back of your NID card</span>
                  </legend>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FileField accept={IMAGE_TYPES.join(',')} error={fileErrors.nidFront} field="nidFront" hint={`Front side · max ${MAX_IMAGE_MB} MB`} onSelect={setFile} value={files.nidFront} />
                    <FileField accept={IMAGE_TYPES.join(',')} error={fileErrors.nidBack} field="nidBack" hint={`Back side · max ${MAX_IMAGE_MB} MB`} onSelect={setFile} value={files.nidBack} />
                  </div>
                </fieldset>

                <fieldset className="min-w-0">
                  <legend className="mb-2.5 flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    5. Driving licence
                    <span className="font-sans text-[10px] font-medium normal-case tracking-normal text-on-surface-variant">
                      {needsLicence ? 'Front and back of your licence' : 'Not needed for on-foot delivery'}
                    </span>
                  </legend>
                  {needsLicence ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FileField accept={IMAGE_TYPES.join(',')} error={fileErrors.licenceFront} field="licenceFront" hint={`Front side · max ${MAX_IMAGE_MB} MB`} onSelect={setFile} value={files.licenceFront} />
                      <FileField accept={IMAGE_TYPES.join(',')} error={fileErrors.licenceBack} field="licenceBack" hint={`Back side · max ${MAX_IMAGE_MB} MB`} onSelect={setFile} value={files.licenceBack} />
                    </div>
                  ) : (
                    <p className="rounded-xl border border-outline-variant/50 bg-surface p-4 text-sm text-on-surface-variant">
                      You chose on-foot delivery, so no driving licence is needed. Choose motorbike, car, or van if you
                      will be riding and need to add your licence.
                    </p>
                  )}
                </fieldset>

                {error && <p aria-live="polite" className="rounded-xl border border-error/20 bg-error-container/50 px-4 py-3 text-sm text-on-error-container">{error}</p>}

                <div className="flex flex-col-reverse gap-3 border-t border-outline-variant/30 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-relaxed text-on-surface-variant">
                    {sendingNow ? 'Your files are uploading. Keep this page open.' : complete ? 'Your documents are only used to review this application.' : 'The send button unlocks at 100%.'}
                  </p>
                  <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-container disabled:cursor-not-allowed disabled:bg-surface-container-high disabled:text-on-surface-variant disabled:shadow-none sm:w-auto" disabled={sending || !complete} type="submit">
                    {sending ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Uploading…</> : <><Check aria-hidden="true" className="h-4 w-4" /> Send application</>}
                  </button>
                </div>
              </form>
            </div>
          </section>
  );
}

function RiderApplySummary({ requirements }) {
  const requirementList = requirements
    ? [
      ...requirements.requiredFields.map((field) => TEXT_FIELD_LABELS[field] || field),
      ...requirements.documents.map((field) => FIELD_LABELS[field] || field),
    ]
    : [];
  return (
<aside className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-4 shadow-sm sm:p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-fixed text-secondary shadow-sm"><Wallet aria-hidden="true" className="h-5 w-5" /></span>
              <h2 className="mt-4 font-syne text-lg font-bold text-on-surface">What you earn</h2>
              <p className="mt-1 text-sm text-on-surface-variant">Simple rules, nothing hidden.</p>
              <ul className="mt-4 space-y-3.5">
                {earnings.map((item) => (
                  <li className="flex items-start gap-2.5" key={item.title}>
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-on-surface">{item.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-on-surface-variant">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-4 shadow-sm sm:p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-primary shadow-sm"><IdCard aria-hidden="true" className="h-5 w-5" /></span>
              <h2 className="mt-4 font-syne text-lg font-bold text-on-surface">What you need to upload</h2>
              <ul className="mt-3 space-y-2.5">
                {requirementList.map((item) => (
                  <li className="flex items-start gap-2.5" key={item}>
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm leading-relaxed text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
              {!requirements && <p className="mt-3 text-xs text-on-surface-variant">Loading the current document list…</p>}
              <p className="mt-4 text-xs leading-relaxed text-on-surface-variant">
                Make sure every photo is sharp and all four corners are visible, otherwise we cannot verify it.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/15 bg-linear-to-br from-surface-container-low to-[#f7e4d2] p-4 sm:p-6">
              <h2 className="font-syne text-lg font-bold text-on-surface">Already applied?</h2>
              <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                Your customer account remains usable while an administrator reviews your application. Approval changes this account to a rider account.
              </p>
              <Link className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary hover:text-primary-container" to="/profile">
                Open your account
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </aside>
  );
}
