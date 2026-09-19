/**
 * Google Sign-In + Firebase session.
 * Dev build only — every entry point degrades to NOT_CONFIGURED
 * (placeholder OAuth ID or Expo Go / missing native module).
 *
 * CRITICAL: @react-native-google-signin/google-signin touches
 * TurboModuleRegistry at MODULE EVALUATION time, so it must NEVER be
 * statically imported — Expo Go has no RNGoogleSignin native module and
 * the import itself throws. Lazy dynamic import + try/catch only.
 */
import type { User as GoogleUser } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID, isGoogleConfigured } from './appConfig';
import { Keys } from '@/data/storageKeys';
import { readJSON, writeJSON } from './storage';
import { isExpoGo } from './env';

export type AuthState =
  | { status: 'signed-out' }
  | { status: 'not-configured' }
  | {
      status: 'signed-in';
      uid: string;
      name: string;
      email: string;
      photo: string | null;
      mock?: boolean;
    };

export interface StoredSession {
  uid: string;
  name: string;
  email: string;
  photo: string | null;
  mock?: boolean;
}

type GoogleSigninModule = typeof import('@react-native-google-signin/google-signin');

let cachedModule: GoogleSigninModule | null = null;
let attempted = false;

/** Load the native module once, or return null (never throws). */
async function loadGoogleSignin(): Promise<GoogleSigninModule | null> {
  if (cachedModule) return cachedModule;
  if (attempted) return null;
  attempted = true;
  if (isExpoGo() || !isGoogleConfigured()) return null;
  try {
    const mod = await import('@react-native-google-signin/google-signin');
    mod.GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
    cachedModule = mod;
    return mod;
  } catch {
    return null;
  }
}

async function firebaseSignIn(idToken: string | null): Promise<string | null> {
  if (!idToken) return null;
  // Expo Go has no native Firebase module — never evaluate the JS wrapper.
  if (isExpoGo()) return null;
  try {
    const authMod = await import('@react-native-firebase/auth');
    const firebaseAppMod = await import('@react-native-firebase/app');
    const app = firebaseAppMod.getApp();
    const auth = authMod.getAuth(app);
    const credential = authMod.GoogleAuthProvider.credential(idToken);
    const cred = await authMod.signInWithCredential(auth, credential);
    return cred.user.uid;
  } catch {
    return null;
  }
}

/** Full sign-in: Google → Firebase exchange → persisted session. */
export async function signInWithGoogle(): Promise<AuthState> {
  const gsi = await loadGoogleSignin();
  // Demo mode: native Google Sign-In unavailable (Expo Go / placeholder
  // config) → mock a successful Google sign-in so the app is fully
  // explorable. Real path automatically takes over once configured.
  if (!gsi) return signInMock();
  try {
    await gsi.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const resp = await gsi.GoogleSignin.signIn();
    if (resp.type !== 'success') return { status: 'signed-out' };
    const g: GoogleUser = resp.data;
    const uid = (await firebaseSignIn(g.idToken)) ?? g.user.id;
    const session: StoredSession = {
      uid,
      name: g.user.name ?? '',
      email: g.user.email,
      photo: g.user.photo ?? null,
    };
    await writeJSON(Keys.auth, session);
    return { status: 'signed-in', ...session };
  } catch {
    return { status: 'signed-out' };
  }
}

/** Demo-mode sign-in: stable mock Google user. Expo Go / unconfigured only. */
export async function signInMock(): Promise<AuthState> {
  const session: StoredSession = {
    uid: 'mock-user',
    name: 'Demo User',
    email: 'demo.user@gmail.com',
    photo: null,
    mock: true,
  };
  await writeJSON(Keys.auth, session);
  return { status: 'signed-in', ...session };
}

export async function restoreSession(): Promise<AuthState> {
  const s = await readJSON<StoredSession | null>(Keys.auth, null);
  if (!s) {
    const gsi = await loadGoogleSignin();
    return gsi ? { status: 'signed-out' } : { status: 'not-configured' };
  }
  return { status: 'signed-in', ...s };
}

export async function signOutEverywhere(): Promise<void> {
  try {
    const gsi = await loadGoogleSignin();
    if (gsi) await gsi.GoogleSignin.signOut();
  } catch {
    // ignore
  }
  // Firebase sign-out: skip entirely in Expo Go (no native module).
  if (!isExpoGo()) {
    try {
      const authMod = await import('@react-native-firebase/auth');
      const firebaseAppMod = await import('@react-native-firebase/app');
      await authMod.signOut(authMod.getAuth(firebaseAppMod.getApp()));
    } catch {
      // ignore
    }
  }
  await writeJSON(Keys.auth, null);
  await writeJSON(Keys.profile, null);
}
