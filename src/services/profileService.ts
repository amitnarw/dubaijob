/**
 * User profile: Firestore `users/{uid}` + local AsyncStorage mirror.
 * Firestore failures (offline / unconfigured) never block the app —
 * local cache is the source of truth for rendering.
 */
import { Keys } from '@/data/storageKeys';
import { readJSON, writeJSON } from './storage';
import { isExpoGo } from './env';

export interface UserProfile {
  name: string;
  email: string;
  photo: string | null;
  phone: string;
  address: string;
  city: string;
  pin: string;
  updatedAt: number;
}

export const EMPTY_PROFILE: UserProfile = {
  name: '',
  email: '',
  photo: null,
  phone: '',
  address: '',
  city: '',
  pin: '',
  updatedAt: 0,
};

function firestoreAvailable(): boolean {
  // Expo Go has no native Firebase module — never even require() the JS
  // wrapper there; its evaluation alone throws. Local cache only.
  if (isExpoGo()) return false;
  try {
    const mod = require('@react-native-firebase/app');
    mod.getApp();
    return true;
  } catch {
    return false;
  }
}

export async function loadProfile(uid: string): Promise<UserProfile> {
  const local = await readJSON<UserProfile | null>(Keys.profile, null);
  if (!firestoreAvailable()) return local ?? { ...EMPTY_PROFILE };
  try {
    const fs = await import('@react-native-firebase/firestore');
    const appMod = await import('@react-native-firebase/app');
    const db = fs.getFirestore(appMod.getApp());
    const snap = await fs.getDoc(fs.doc(db, 'users', uid));
    if (snap.exists()) {
      const remote = snap.data() as Partial<UserProfile>;
      const merged: UserProfile = { ...EMPTY_PROFILE, ...local, ...remote };
      await writeJSON(Keys.profile, merged);
      return merged;
    }
  } catch {
    // offline or rules failure → fall through to local
  }
  return local ?? { ...EMPTY_PROFILE };
}

export async function saveProfile(uid: string, profile: UserProfile): Promise<UserProfile> {
  const stamped = { ...profile, updatedAt: Date.now() };
  await writeJSON(Keys.profile, stamped);
  if (!firestoreAvailable()) return stamped;
  try {
    const fs = await import('@react-native-firebase/firestore');
    const appMod = await import('@react-native-firebase/app');
    const db = fs.getFirestore(appMod.getApp());
    await fs.setDoc(fs.doc(db, 'users', uid), stamped, { merge: true });
  } catch {
    // offline → local cache holds it; retried on next save/boot
  }
  return stamped;
}
