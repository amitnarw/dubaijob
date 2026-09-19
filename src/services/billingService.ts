/**
 * REAL Google Play Billing via expo-iap. ALL products non-consumable.
 * State machine: purchased → grant+acknowledge | pending → wait |
 * replay → acknowledge-only. Boot recovery acknowledges leftovers
 * (3-day auto-refund rule).
 *
 * CRITICAL: expo-iap is a native module absent from Expo Go — it must NEVER
 * be statically imported (module evaluation would throw). Lazy dynamic
 * import + try/catch only. Dead in Expo Go by design → "unavailable".
 */
import type { Product, Purchase } from 'expo-iap';
import { PRODUCT_COURSE_FULL } from '@/data/offers';
import { PACKAGES } from '@/data/packages';
import { Keys } from '@/data/storageKeys';
import { readJSON, writeJSON } from './storage';
import { isExpoGo } from './env';

export const ALL_SKUS = [PRODUCT_COURSE_FULL, ...PACKAGES.map((p) => p.productId)];
const PACKAGE_SKUS = new Set(PACKAGES.map((p) => p.productId));

export interface Entitlements {
  course: boolean;
  packages: Record<string, boolean>;
}

const EMPTY_ENTITLEMENTS: Entitlements = { course: false, packages: {} };
const MAX_TOKENS = 200;

type IapModule = typeof import('expo-iap');

let iap: IapModule | null = null;
let attempted = false;

/** Connect once; returns false in Expo Go / on any native failure (never throws). */
async function ensureConnection(): Promise<boolean> {
  if (iap) return true;
  if (attempted) return false;
  attempted = true;
  if (isExpoGo()) return false;
  try {
    iap = await import('expo-iap');
    await iap.initConnection();
    return true;
  } catch {
    iap = null;
    return false;
  }
}

async function processedTokens(): Promise<string[]> {
  return readJSON<string[]>(Keys.playTokens, []);
}

async function recordToken(token: string): Promise<void> {
  const prev = await processedTokens();
  if (prev.includes(token)) return;
  await writeJSON(Keys.playTokens, [...prev, token].slice(-MAX_TOKENS));
}

export async function getEntitlements(): Promise<Entitlements> {
  return readJSON<Entitlements>(Keys.entitlements, EMPTY_ENTITLEMENTS);
}

async function grantSku(sku: string): Promise<Entitlements> {
  const prev = await getEntitlements();
  const next: Entitlements =
    sku === PRODUCT_COURSE_FULL
      ? { ...prev, course: true }
      : { ...prev, packages: { ...prev.packages, [sku]: true } };
  await writeJSON(Keys.entitlements, next);
  return next;
}

/** Handle one purchase per the state machine. Returns new entitlements or null. */
export async function handlePurchase(p: Purchase): Promise<Entitlements | null> {
  if (!iap) return null;
  const token = p.purchaseToken ?? null;
  if (p.purchaseState !== 'purchased' || !token) return null; // pending/unknown → wait
  const seen = await processedTokens();
  try {
    await iap.finishTransaction({ purchase: p, isConsumable: false });
  } catch {
    return null; // acknowledge failed → listener/boot will retry
  }
  if (seen.includes(token)) return getEntitlements(); // replay: ack only
  await recordToken(token);
  if (p.productId === PRODUCT_COURSE_FULL || PACKAGE_SKUS.has(p.productId)) {
    return grantSku(p.productId);
  }
  return getEntitlements();
}

export type BillingEvent =
  | { kind: 'granted'; entitlements: Entitlements }
  | { kind: 'pending' }
  | { kind: 'error'; message: string };

/** Attach store listeners once (root layout). Returns cleanup. No-op in Expo Go. */
export function attachBillingListeners(onEvent: (e: BillingEvent) => void): () => void {
  ensureConnection()
    .then((ok) => {
      if (!ok || !iap) return;
      const sub1 = iap.purchaseUpdatedListener(async (p) => {
        if (p.purchaseState === 'pending') {
          onEvent({ kind: 'pending' });
          return;
        }
        const ent = await handlePurchase(p);
        if (ent) onEvent({ kind: 'granted', entitlements: ent });
      });
      const sub2 = iap.purchaseErrorListener((err) => {
        onEvent({ kind: 'error', message: err.message || 'Purchase failed' });
      });
      detachFns.push(() => sub1.remove(), () => sub2.remove());
    })
    .catch(() => {});
  return () => {
    const fns = detachFns.splice(0);
    for (const fn of fns) {
      try {
        fn();
      } catch {
        // ignore
      }
    }
  };
}

const detachFns: Array<() => void> = [];

export interface Storefront {
  available: boolean;
  products: Product[];
  bySku: Record<string, Product>;
}

export async function loadStorefront(): Promise<Storefront> {
  const ok = await ensureConnection();
  if (!ok || !iap) return { available: false, products: [], bySku: {} };
  try {
    const products = (await iap.fetchProducts({ skus: ALL_SKUS, type: 'in-app' })) as Product[];
    const bySku: Record<string, Product> = {};
    for (const p of products) bySku[p.id] = p;
    return { available: true, products, bySku };
  } catch {
    return { available: false, products: [], bySku: {} };
  }
}

export async function buySku(sku: string): Promise<void> {
  const ok = await ensureConnection();
  if (!ok || !iap) throw new Error('Billing unavailable');
  await iap.requestPurchase({ request: { google: { skus: [sku] } }, type: 'in-app' });
}

/**
 * Restore: reconcile entitlements with Play-owned purchases, acknowledge
 * leftovers (3-day rule), revoke refunded SKUs. Manual button + boot call.
 */
export async function restorePurchases(): Promise<Entitlements> {
  const ok = await ensureConnection();
  if (!ok || !iap) return getEntitlements();
  let owned: Purchase[] = [];
  try {
    owned = (await iap.getAvailablePurchases()) as Purchase[];
  } catch {
    return getEntitlements();
  }
  const next: Entitlements = { course: false, packages: {} };
  for (const p of owned) {
    if (p.purchaseState !== 'purchased' || !p.purchaseToken) continue;
    try {
      await iap.finishTransaction({ purchase: p, isConsumable: false });
    } catch {
      // keep going; next restore retries
    }
    await recordToken(p.purchaseToken);
    if (p.productId === PRODUCT_COURSE_FULL) next.course = true;
    else if (PACKAGE_SKUS.has(p.productId)) next.packages[p.productId] = true;
  }
  await writeJSON(Keys.entitlements, next);
  return next;
}

export function isBillingSupported(): boolean {
  return iap !== null;
}
