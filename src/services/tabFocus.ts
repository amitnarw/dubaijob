/**
 * Cross-tab focus tracker. Course tab counts a "home visit" only when focus
 * arrives from another tab or app foreground — NOT on return from
 * video/checkout/account routes (those leave lastTab unchanged).
 */
let lastTab: string | null = null;

/** Returns true when this focus is a fresh arrival (counts as a visit). */
export function noteTabFocus(name: string): boolean {
  const fresh = lastTab !== name;
  lastTab = name;
  return fresh;
}
