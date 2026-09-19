import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  attachBillingListeners,
  buySku,
  getEntitlements,
  loadStorefront,
  restorePurchases,
  type Entitlements,
  type Storefront,
} from '@/services/billingService';

interface PurchaseContextValue {
  entitlements: Entitlements;
  storefront: Storefront;
  storefrontLoading: boolean;
  lastEvent: string | null;
  refresh: () => Promise<void>;
  buy: (sku: string) => Promise<void>;
  restore: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextValue>({
  entitlements: { course: false, packages: {} },
  storefront: { available: false, products: [], bySku: {} },
  storefrontLoading: true,
  lastEvent: null,
  refresh: async () => {},
  buy: async () => {},
  restore: async () => {},
});

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [entitlements, setEntitlements] = useState<Entitlements>({ course: false, packages: {} });
  const [storefront, setStorefront] = useState<Storefront>({ available: false, products: [], bySku: {} });
  const [storefrontLoading, setStorefrontLoading] = useState(true);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [ent, sf] = await Promise.all([getEntitlements(), loadStorefront()]);
      setEntitlements(ent);
      setStorefront(sf);
    } catch {
      // billing unavailable — keep defaults
    } finally {
      setStorefrontLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // boot recovery: reconcile + acknowledge leftovers
    restorePurchases().then(setEntitlements).catch(() => {});
    const detach = attachBillingListeners((e) => {
      if (e.kind === 'granted') {
        setEntitlements(e.entitlements);
        setLastEvent('granted');
      } else if (e.kind === 'pending') {
        setLastEvent('pending');
      } else {
        setLastEvent(e.message);
      }
    });
    return detach;
  }, [refresh]);

  const buy = useCallback(async (sku: string) => {
    await buySku(sku);
  }, []);

  const restore = useCallback(async () => {
    const ent = await restorePurchases();
    setEntitlements(ent);
  }, []);

  const value = useMemo(
    () => ({ entitlements, storefront, storefrontLoading, lastEvent, refresh, buy, restore }),
    [entitlements, storefront, storefrontLoading, lastEvent, refresh, buy, restore],
  );
  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>;
}

export function usePurchases(): PurchaseContextValue {
  return useContext(PurchaseContext);
}
