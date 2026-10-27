import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { FREE_SUBSCRIPTION_LIMIT, PRO_ENABLED } from "@/constants/pro";
import { purchasePro, restorePurchases } from "@/utils/purchases";
import { getActiveSubscriptions } from "@db/subscriptions";

// Remembers the unlock on this phone. Restore Purchases (Apple ID) brings it
// back on a new phone or after reinstalling.
const PRO_KEY = "pro:unlocked";

type ProContextValue = {
  loaded: boolean;
  isPro: boolean; // always true when PRO_ENABLED is false
  buy: () => Promise<boolean>;
  restore: () => Promise<boolean>;
  canAddSubscription: () => boolean;
  resetForTesting: () => Promise<void>; // development builds only
};

const ProContext = createContext<ProContextValue | null>(null);

export function ProProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PRO_KEY)
      .then((v) => setUnlocked(v === "true"))
      .catch((e) => console.warn("Failed to load Pro state", e))
      .finally(() => setLoaded(true));
  }, []);

  const unlock = useCallback(async () => {
    setUnlocked(true);
    await AsyncStorage.setItem(PRO_KEY, "true").catch((e) =>
      console.warn("Failed to save Pro state", e),
    );
  }, []);

  const buy = useCallback(async () => {
    const ok = await purchasePro();
    if (ok) await unlock();
    return ok;
  }, [unlock]);

  const restore = useCallback(async () => {
    const ok = await restorePurchases();
    if (ok) await unlock();
    return ok;
  }, [unlock]);

  const isPro = !PRO_ENABLED || unlocked;

  // Reads the database directly so it is always current, even from the tab bar
  const canAddSubscription = useCallback(
    () => isPro || getActiveSubscriptions().length < FREE_SUBSCRIPTION_LIMIT,
    [isPro],
  );

  const resetForTesting = useCallback(async () => {
    if (!__DEV__) return;
    setUnlocked(false);
    await AsyncStorage.removeItem(PRO_KEY);
  }, []);

  const value = useMemo(
    () => ({ loaded, isPro, buy, restore, canAddSubscription, resetForTesting }),
    [loaded, isPro, buy, restore, canAddSubscription, resetForTesting],
  );

  return <ProContext.Provider value={value}>{children}</ProContext.Provider>;
}

export function usePro() {
  const ctx = useContext(ProContext);
  if (!ctx) throw new Error("usePro must be used inside ProProvider");
  return ctx;
}
