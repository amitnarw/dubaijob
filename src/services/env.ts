import Constants from 'expo-constants';

/**
 * True when running inside Expo Go.
 * Expo Go's native binary contains NO third-party native modules
 * (google-signin, expo-iap, react-native-firebase). Their JS wrappers throw
 * at module EVALUATION time, so callers must check this BEFORE calling
 * import()/require() on them — try/catch alone is not reliable.
 */
export function isExpoGo(): boolean {
  try {
    return Constants.appOwnership === 'expo';
  } catch {
    return false;
  }
}
