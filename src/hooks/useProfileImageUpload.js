import { useRef, useState } from 'react';
import { authApi } from '../api/auth';

export const PROFILE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_PROFILE_IMAGE_MB = 5;

export default function useProfileImageUpload({ onUpdated, successMessage = '' }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const upload = async (file) => {
    if (!file) return;
    setError('');
    setMessage('');
    if (!PROFILE_IMAGE_TYPES.includes(file.type)) {
      setError('Your photo must be a JPG, PNG, or WebP file.');
      return;
    }
    if (file.size > MAX_PROFILE_IMAGE_MB * 1024 * 1024) {
      setError(`Your photo must be smaller than ${MAX_PROFILE_IMAGE_MB} MB.`);
      return;
    }

    setBusy(true);
    try {
      const { data } = await authApi.uploadProfileImage(file);
      onUpdated(data.data);
      setMessage(successMessage);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not upload your photo. Please try again.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return { inputRef, busy, error, message, upload, setBusy, setError, setMessage };
}
