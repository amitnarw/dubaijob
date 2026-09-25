import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '@/constants/theme';
import { loadAppFonts } from '@/services/fontService';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PurchaseProvider } from '@/context/PurchaseContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { LocaleProvider } from '@/i18n/LocaleContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Gate() {
  const { auth, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadAppFonts()
      .catch(() => {})
      .finally(() => {
        SplashScreen.hideAsync().catch(() => {});
      });
  }, []);

  useEffect(() => {
    if (loading) return;
    const inLogin = segments[0] === 'login';
    if (auth.status === 'signed-in' && inLogin) {
      router.replace('/(tabs)');
    } else if (auth.status !== 'signed-in' && !inLogin) {
      router.replace('/login');
    }
  }, [auth.status, loading, segments, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.canvas },
        animation: 'fade',
      }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="language"
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="video/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="checkout/[productId]" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="success" />
      <Stack.Screen
        name="account"
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LocaleProvider>
        <AuthProvider>
          <PurchaseProvider>
            <PlayerProvider>
              <StatusBar style="light" />
              <Gate />
            </PlayerProvider>
          </PurchaseProvider>
        </AuthProvider>
      </LocaleProvider>
    </GestureHandlerRootView>
  );
}
