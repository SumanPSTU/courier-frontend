import { Camera, Check, Trash2, Upload } from 'lucide-react';
import { InlineAlert, SectionCard, Spinner } from './ProfilePrimitives';
import { authApi } from '../../api/auth';
import useProfileImageUpload, { MAX_PROFILE_IMAGE_MB, PROFILE_IMAGE_TYPES } from '../../hooks/useProfileImageUpload';

export default function ProfilePhotoCard({ hasImage, onUpdated }) {
  const { inputRef, busy, message, error, upload, setError, setMessage } = useProfileImageUpload({
    onUpdated,
    successMessage: 'Your photo has been updated.',
  });

  const remove = async () => {
    setError('');
    setMessage('');
    setBusy(true);
    try {
      const { data } = await authApi.removeProfileImage();
      onUpdated(data.data);
      setMessage('Your photo has been removed.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not remove your photo. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SectionCard description="Riders and our support team use this photo to recognise you at pickup." icon={Camera} title="Profile photo">
      <div className="mt-5 flex flex-col gap-4 min-[520px]:flex-row min-[520px]:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-primary">
            <Upload aria-hidden="true" className="h-5 w-5" />
          </span>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            JPG, PNG, or WebP. Up to {MAX_PROFILE_IMAGE_MB} MB. Uploading a new photo replaces the old one.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row min-[520px]:shrink-0">
          <button
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-outline-variant/60 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-surface-container-low disabled:cursor-wait disabled:opacity-60"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            {busy ? <Spinner className="h-3.5 w-3.5" /> : <Camera aria-hidden="true" className="h-4 w-4" />}
            Choose photo
          </button>
          {hasImage && (
            <button
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-outline-variant/60 bg-white px-4 py-2.5 text-sm font-bold text-error transition hover:bg-error-container/40 disabled:cursor-wait disabled:opacity-60"
              disabled={busy}
              onClick={remove}
              type="button"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" /> Remove
            </button>
          )}
          <input
            accept={PROFILE_IMAGE_TYPES.join(',')}
            className="sr-only"
            onChange={(event) => upload(event.target.files?.[0])}
            ref={inputRef}
            type="file"
          />
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <InlineAlert>{error}</InlineAlert>
        {message && (
          <p className="flex items-center gap-1.5 rounded-xl border border-[#2d5a27]/20 bg-[#d4edda] px-4 py-3 text-sm font-semibold text-[#2d5a27]">
            <Check aria-hidden="true" className="h-4 w-4 shrink-0" /> {message}
          </p>
        )}
      </div>
    </SectionCard>
  );
}
