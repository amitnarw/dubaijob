import { Keys } from '@/data/storageKeys';
import { OFFER_DURATION_HOURS } from '@/data/offers';
import { readJSON, readString, writeJSON } from './storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SHOW_ON_VISITS = [3, 8];
const CYCLE = 10;

/**
 * Visit-gated discount scheduling.
 * Count visits ONLY on app-foreground Tab-1 focus or cross-tab switch
 * (caller decides — do NOT count returns from video/checkout/account).
 */
export async function recordHomeVisit(): Promise<{ visit: number; cycle: number }> {
  const prev = await readJSON<number>(Keys.homeVisits, 0);
  const visit = prev + 1;
  await writeJSON(Keys.homeVisits, visit);
  return { visit, cycle: Math.ceil(visit / CYCLE) };
}

export function shouldShowModal(visit: number): boolean {
  const inCycle = ((visit - 1) % CYCLE) + 1;
  return SHOW_ON_VISITS.includes(inCycle);
}

/** Deadline = first modal show + duration. Clock-safe remaining ms, clamped ≥ 0. */
export async function getOfferDeadlineMs(): Promise<number | null> {
  const raw = await readString(Keys.offerDeadline);
  if (!raw) return null;
  const deadline = Number(raw);
  if (!Number.isFinite(deadline)) return null;
  return Math.max(0, deadline - Date.now());
}

export async function ensureOfferDeadline(): Promise<number> {
  const existing = await readString(Keys.offerDeadline);
  if (existing && Number.isFinite(Number(existing))) return Number(existing);
  const deadline = Date.now() + OFFER_DURATION_HOURS * 3600 * 1000;
  try {
    await AsyncStorage.setItem(Keys.offerDeadline, String(deadline));
  } catch {
    // ignore
  }
  return deadline;
}

export async function hasUsedExtension(): Promise<boolean> {
  return (await readString(Keys.offerExtended)) === '1';
}

export async function markExtensionUsed(): Promise<void> {
  try {
    await AsyncStorage.setItem(Keys.offerExtended, '1');
  } catch {
    // ignore
  }
}

export function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}
