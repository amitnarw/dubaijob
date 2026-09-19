/**
 * Placeholder backend config — OWNER MUST FILL.
 * Until real values are set, Google/Firestore features degrade gracefully
 * (auth screen shows "not configured", billing shows "unavailable").
 */
export const GOOGLE_WEB_CLIENT_ID = 'YOUR_GOOGLE_OAUTH_WEB_CLIENT_ID.apps.googleusercontent.com';

export function isGoogleConfigured(): boolean {
  return (
    GOOGLE_WEB_CLIENT_ID.length > 0 &&
    !GOOGLE_WEB_CLIENT_ID.startsWith('YOUR_GOOGLE')
  );
}
