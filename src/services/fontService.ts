/**
 * Font loading — Inter variable font (bundled asset).
 * Splash-gated with 5s timeout fallback: if loading fails, the app still
 * boots (system sans takes over) — never hangs on splash.
 */
import * as Font from 'expo-font';

export const FONT_REGULAR = 'Inter-Regular';
export const FONT_MEDIUM = 'Inter-Medium';
export const FONT_SEMIBOLD = 'Inter-SemiBold';
export const FONT_BOLD = 'Inter-Bold';

let loaded = false;

export async function loadAppFonts(): Promise<void> {
  if (loaded) return;
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, 5000));
  const load = Font.loadAsync({
    // Inter variable font: one file, registered under 4 family names with
    // distinct weights so RN picks the right weight per style.
    [FONT_REGULAR]: require('@/assets/fonts/Inter-Variable.ttf'),
    [FONT_MEDIUM]: require('@/assets/fonts/Inter-Variable.ttf'),
    [FONT_SEMIBOLD]: require('@/assets/fonts/Inter-Variable.ttf'),
    [FONT_BOLD]: require('@/assets/fonts/Inter-Variable.ttf'),
  });
  try {
    await Promise.race([load, timeout]);
    loaded = true;
  } catch {
    // fall back to system font; app must never hang on splash
  }
}

/** UI font family — Inter with system fallback baked into usage sites. */
export const UI_FONT = FONT_REGULAR;