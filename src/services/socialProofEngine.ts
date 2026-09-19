import { PROOF_ACTIONS, PROOF_CITIES, PROOF_NAMES } from '@/data/socialProof';

export interface ProofToast {
  id: string;
  name: string;
  city: string;
  action: string;
  minutesAgo: number;
}

const seen = new Set<string>();
let counter = 0;

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Build a toast; never repeats a name+city combo within the session. */
export function nextToast(): ProofToast {
  let name = rand(PROOF_NAMES);
  let city = rand(PROOF_CITIES);
  let guard = 0;
  while (seen.has(`${name}|${city}`) && guard < 40) {
    name = rand(PROOF_NAMES);
    city = rand(PROOF_CITIES);
    guard += 1;
  }
  seen.add(`${name}|${city}`);
  counter += 1;
  return {
    id: `toast-${Date.now()}-${counter}`,
    name,
    city,
    action: rand(PROOF_ACTIONS),
    minutesAgo: 1 + Math.floor(Math.random() * 28),
  };
}

/** Reset the session-local seen-set (call on cold boot). */
export function resetToastSession(): void {
  seen.clear();
  counter = 0;
}

/** Cadence plan: first delay, then interval range, session cap. */
export const TOAST_PLAN = {
  firstDelayMs: { min: 25_000, max: 40_000 },
  intervalMs: { min: 120_000, max: 240_000 },
  maxPerSession: 3,
  visibleMs: 5000,
} as const;

export function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
