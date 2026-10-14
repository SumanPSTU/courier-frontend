export default function NotificationBell({
  active, className = '', expanded, onClick, onFocus, onMouseEnter, onMouseLeave,
  setElement, unreadCount,
}) {
  const classes = `relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors sm:h-10 sm:w-10 ${
    active
      ? 'border-primary bg-primary text-white'
      : 'border-outline-variant bg-surface-container-low text-primary hover:bg-surface-container'
  } ${className}`;

  return (
    <button
      aria-controls="notification-panel"
      aria-expanded={expanded}
      aria-haspopup="dialog"
      aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
      className={classes}
      onClick={onClick}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={setElement}
      title="Notifications"
      type="button"
    >
      <span aria-hidden="true" className="material-symbols-outlined text-lg sm:text-xl">notifications</span>
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[9px] font-bold leading-none text-white ring-2 ring-[#fff9f5]">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}
