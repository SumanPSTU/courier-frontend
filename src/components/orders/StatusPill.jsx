import { getStatusMeta } from '../../utils/orderStatus';

export default function StatusPill({ status, size = 'md' }) {
  const meta = getStatusMeta(status);
  const Icon = meta.icon;
  const sizes = {
    sm: 'max-w-full truncate px-2 py-0.5 text-[10px] gap-1',
    md: 'max-w-full truncate px-2.5 py-1 text-[11px] gap-1.5',
    lg: 'max-w-full truncate px-3 py-1.5 text-[11px] gap-1.5 sm:px-3.5 sm:text-xs sm:gap-2',
  };
  const iconSizes = { sm: 'h-3 w-3', md: 'h-3.5 w-3.5', lg: 'h-3.5 w-3.5 sm:h-4 sm:w-4' };

  return (
    <span
      className={`inline-flex min-w-0 items-center rounded-full border font-bold uppercase tracking-wide ${meta.chip} ${sizes[size]}`}
    >
      <Icon className={`${iconSizes[size]} shrink-0`} />
      <span className="truncate">{meta.short}</span>
    </span>
  );
}
