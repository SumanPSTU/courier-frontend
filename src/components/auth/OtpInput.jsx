import { useRef } from 'react';

const EMPTY = Array.from({ length: 6 }, () => '');

export default function OtpInput({
  value,
  onChange,
  onComplete,
  disabled = false,
  length = 6,
  hasError = false,
  id = 'otpInput',
}) {
  const refs = useRef([]);
  // Digits are kept positionally so editing one box never reorders the others.
  const cells = value.split('').concat(EMPTY).slice(0, length);

  const emit = (next) => {
    const joined = next.join('');
    onChange(joined);
    return joined;
  };

  const focusAt = (index) => {
    const node = refs.current[index];
    if (node) {
      node.focus();
      node.select?.();
    }
  };

  const handleChange = (index, raw) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    if (!digit) return;

    const next = [...cells];
    next[index] = digit;
    const joined = emit(next);

    const nextIndex = index + 1;
    if (nextIndex < length && next[nextIndex] === '') {
      focusAt(nextIndex);
    } else if (joined.length === length) {
      onComplete?.(joined);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      const next = [...cells];
      if (cells[index] !== '') {
        next[index] = '';
        emit(next);
      } else if (event.key === 'Backspace' && index > 0) {
        next[index - 1] = '';
        emit(next);
        focusAt(index - 1);
      }
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusAt(index - 1);
    }
    if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault();
      focusAt(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    const next = EMPTY.slice(0, length);
    for (let i = 0; i < pasted.length; i += 1) next[i] = pasted[i];
    const joined = emit(next);

    if (joined.length === length) {
      onComplete?.(joined);
    } else {
      focusAt(pasted.length);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2.5" onPaste={handlePaste}>
      {cells.map((digit, index) => {
        const filled = digit !== '';
        return (
          <input
            aria-label={`Digit ${index + 1} of ${length}`}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            className={`h-12 w-full min-w-0 rounded-lg border-2 bg-surface text-center font-mono text-base font-bold text-on-surface outline-none transition sm:h-14 sm:rounded-xl sm:text-xl ${
              hasError
                ? 'border-error bg-error-container/40 focus:shadow-[0_0_0_3px_rgba(186,26,26,0.2)]'
                : filled
                  ? 'border-primary bg-surface-container-lowest focus:shadow-[0_0_0_3px_rgba(137,77,13,0.25)]'
                  : 'border-outline-variant/50 bg-surface focus:border-primary focus:bg-surface-container-lowest focus:shadow-[0_0_0_3px_rgba(137,77,13,0.15)]'
            } disabled:cursor-not-allowed disabled:opacity-60`}
            disabled={disabled}
            id={index === 0 ? id : undefined}
            inputMode="numeric"
            key={index}
            maxLength={1}
            onChange={(event) => handleChange(index, event.target.value)}
            onFocus={(event) => event.target.select()}
            onKeyDown={(event) => handleKeyDown(index, event)}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="text"
            value={digit}
          />
        );
      })}
    </div>
  );
}
