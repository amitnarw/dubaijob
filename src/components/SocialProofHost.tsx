import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { GlassToast } from './GlassToast';
import { ToastControl } from '@/services/toastControl';
import {
  TOAST_PLAN,
  nextToast,
  randomInRange,
  resetToastSession,
  type ProofToast,
} from '@/services/socialProofEngine';

/**
 * Mount once inside the tabs layout. Schedules floating purchase-activity
 * toasts; pauses while video/modal/checkout is active (ToastControl.paused).
 * Tap navigates to the proof tab.
 */
export function SocialProofHost() {
  const [toast, setToast] = useState<ProofToast | null>(null);
  const shown = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    resetToastSession();
    shown.current = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const maybeShow = () => {
      if (cancelled) return;
      if (shown.current >= TOAST_PLAN.maxPerSession || ToastControl.paused) {
        timer = setTimeout(maybeShow, 30_000);
        return;
      }
      setToast(nextToast());
      shown.current += 1;
      hideTimer.current = setTimeout(() => setToast(null), TOAST_PLAN.visibleMs);
      timer = setTimeout(maybeShow, randomInRange(TOAST_PLAN.intervalMs.min, TOAST_PLAN.intervalMs.max));
    };

    timer = setTimeout(maybeShow, randomInRange(TOAST_PLAN.firstDelayMs.min, TOAST_PLAN.firstDelayMs.max));
    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  if (!toast) return null;
  return (
    <Pressable onPress={() => router.push('/(tabs)/proof')}>
      <GlassToast toast={toast} />
    </Pressable>
  );
}
