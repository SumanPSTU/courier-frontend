import { useSyncExternalStore } from 'react';

export const DESKTOP_LAYOUT_QUERY = '(min-width: 1280px)';

const subscribeToDesktopLayout = (onChange) => {
  const mediaQuery = window.matchMedia(DESKTOP_LAYOUT_QUERY);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
};

const getDesktopLayoutSnapshot = () =>
  typeof window !== 'undefined' && window.matchMedia(DESKTOP_LAYOUT_QUERY).matches;

export function useDesktopLayout() {
  return useSyncExternalStore(subscribeToDesktopLayout, getDesktopLayoutSnapshot, () => false);
}
