import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingMiniPlayer } from '@/components/podcast/FloatingMiniPlayer';
import { SocialProofHost } from '@/components/SocialProofHost';
import { Colors } from '@/constants/theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  // On Android, insets.bottom accounts for phone inbuilt navigation buttons
  // (3-button navigation or gesture bar). We ensure clean breathing space!
  const bottomNavPadding = Math.max(insets.bottom, 14);
  const tabHeight = 58 + bottomNavPadding;
  const floatingPlayerOffset = tabHeight + 12;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.canvas }}>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.text,
          tabBarInactiveTintColor: Colors.faintest,
          tabBarStyle: {
            backgroundColor: Colors.canvas,
            borderTopWidth: 0,
            height: tabHeight,
            paddingTop: 8,
            paddingBottom: bottomNavPadding,
            elevation: 0,
          },
          tabBarLabelStyle: {
            fontSize: 10.5,
            fontWeight: '600',
            marginTop: -2,
          },
          sceneStyle: { backgroundColor: Colors.canvas },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="radio"
          options={{
            title: 'Radio',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="radio-outline" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Podcast',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="mic-circle" size={25} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search-outline" size={22} color={color} />
            ),
          }}
        />

        {/* Hidden from tab bar, but accessible via router.push */}
        <Tabs.Screen
          name="packages"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="proof"
          options={{
            href: null,
          }}
        />
      </Tabs>

      {/* Persistent Floating Mini-Player docked with clean breathing space above tab bar */}
      <FloatingMiniPlayer bottomOffset={floatingPlayerOffset} />

      <SocialProofHost />
    </View>
  );
}

