import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingMiniPlayer } from '@/components/podcast/FloatingMiniPlayer';
import { SocialProofHost } from '@/components/SocialProofHost';
import { Colors } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleContext';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useLocale();

  // On Android, insets.bottom accounts for phone inbuilt navigation buttons
  // (3-button navigation or gesture bar). We ensure clean breathing space!
  const bottomNavPadding = Math.max(insets.bottom, 12);
  const tabHeight = 52 + bottomNavPadding;
  const floatingPlayerOffset = tabHeight + 8;

  return (
    <View style={{ flex: 1, backgroundColor: '#0D0E11' }}>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#6B6C75',
          tabBarStyle: {
            backgroundColor: '#0D0E11',
            borderTopWidth: 0,
            height: tabHeight,
            paddingTop: 6,
            paddingBottom: bottomNavPadding,
            elevation: 0,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontFamily: 'Inter-Medium',
            marginTop: 2,
          },
          sceneStyle: { backgroundColor: Colors.canvas },
        }}
      >
        {/* TAB 1: Course */}
        <Tabs.Screen
          name="index"
          options={{
            title: t('tab_course'),
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <View style={styles.activeCircle}>
                  <Ionicons name="play" size={15} color="#000000" style={{ marginLeft: 2 }} />
                </View>
              ) : (
                <Ionicons name="play-circle-outline" size={22} color={color} />
              ),
          }}
        />

        {/* TAB 2: Packages */}
        <Tabs.Screen
          name="packages"
          options={{
            title: t('tab_packages'),
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <View style={styles.activeCircle}>
                  <Ionicons name="bag-handle" size={15} color="#000000" />
                </View>
              ) : (
                <Ionicons name="bag-handle-outline" size={21} color={color} />
              ),
          }}
        />

        {/* TAB 3: Proof */}
        <Tabs.Screen
          name="proof"
          options={{
            title: t('tab_proof'),
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <View style={styles.activeCircle}>
                  <Ionicons name="trophy" size={15} color="#000000" />
                </View>
              ) : (
                <Ionicons name="trophy-outline" size={21} color={color} />
              ),
          }}
        />
      </Tabs>

      {/* Persistent Floating Mini-Player docked with clean breathing space above tab bar */}
      <FloatingMiniPlayer bottomOffset={floatingPlayerOffset} />

      <SocialProofHost />
    </View>
  );
}

const styles = StyleSheet.create({
  activeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
