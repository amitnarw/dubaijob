import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurTargetView } from 'expo-blur';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useDerivedValue,
  interpolateColor,
  type SharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { FloatingMiniPlayer } from '@/components/podcast/FloatingMiniPlayer';
import { SocialProofHost } from '@/components/SocialProofHost';
import { Colors } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleContext';
import { noteTabFocus } from '@/services/tabFocus';

import MasterclassesTabScreen from './index';
import PackagesTab from './packages';
import ProofTab from './proof';

// ── Tab items configuration ──────────────────────────────────────────────────
type TabLabelKey = 'tab_course' | 'tab_packages' | 'tab_proof';

interface TabConfig {
  name: string;
  labelKey: TabLabelKey;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  activeSize: number;
  inactiveSize: number;
  activeOffset?: { marginLeft?: number };
}

const TAB_CONFIGS: TabConfig[] = [
  {
    name: 'index',
    labelKey: 'tab_course',
    activeIcon: 'play',
    inactiveIcon: 'play-circle-outline',
    activeSize: 15,
    inactiveSize: 22,
    activeOffset: { marginLeft: 2 },
  },
  {
    name: 'packages',
    labelKey: 'tab_packages',
    activeIcon: 'bag-handle',
    inactiveIcon: 'bag-handle-outline',
    activeSize: 15,
    inactiveSize: 21,
  },
  {
    name: 'proof',
    labelKey: 'tab_proof',
    activeIcon: 'trophy',
    inactiveIcon: 'trophy-outline',
    activeSize: 15,
    inactiveSize: 21,
  },
];

const CIRCLE_SIZE = 28;

// ── Individual Tab Item in Bottom Navbar ────────────────────────────────────
function RealTabBarItem({
  config,
  index,
  scrollX,
  width,
  onPress,
}: {
  config: TabConfig;
  index: number;
  scrollX: SharedValue<number>;
  width: number;
  onPress: () => void;
}) {
  const { t } = useLocale();

  const progress = useDerivedValue(() => {
    'worklet';
    const targetOffset = index * width;
    const distance = Math.abs(scrollX.value - targetOffset);
    return Math.max(0, 1 - distance / width);
  });

  const activeIconStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ scale: 0.85 + 0.15 * progress.value }],
    };
  });

  const inactiveIconStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - progress.value,
      transform: [{ scale: 1 - 0.15 * progress.value }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(progress.value, [0, 1], ['#8E8E98', '#FFFFFF']),
    };
  });

  return (
    <Pressable
      onPress={onPress}
      style={styles.tabButton}
      accessibilityRole="button"
    >
      <View style={styles.iconSlot}>
        <Animated.View style={[styles.iconWrapper, inactiveIconStyle]}>
          <Ionicons
            name={config.inactiveIcon}
            size={config.inactiveSize}
            color="#8E8E98"
          />
        </Animated.View>
        <Animated.View style={[styles.iconWrapper, activeIconStyle]}>
          <Ionicons
            name={config.activeIcon}
            size={config.activeSize}
            color="#000000"
            style={config.activeOffset}
          />
        </Animated.View>
      </View>
      <Animated.Text style={[styles.tabLabel, animatedTextStyle]} numberOfLines={1}>
        {t(config.labelKey)}
      </Animated.Text>
    </Pressable>
  );
}

// ── Real Swipeable Tabs Layout ──────────────────────────────────────────────
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const segments = useSegments();

  const bottomNavPadding = Math.max(insets.bottom, 20);
  const tabHeight = 50 + bottomNavPadding;
  const floatingPlayerOffset = tabHeight + 8;
  const tabWidth = width / TAB_CONFIGS.length;

  const scrollRef = useRef<Animated.ScrollView>(null);
  const blurTargetRef = useRef<View | null>(null);
  const scrollX = useSharedValue(0);
  const [activeTab, setActiveTab] = useState(0);
  const activeTabRef = useRef(0);

  // Sync scroll position with real-time finger gestures
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Indicator X follows continuous finger scroll in real-time
  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const pageProgress = scrollX.value / width;
    const currentX = pageProgress * tabWidth + (tabWidth - CIRCLE_SIZE) / 2;
    return {
      transform: [{ translateX: currentX }],
    };
  });

  // Handle snapping/settling on a page after user swipes
  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const nextTab = Math.round(offsetX / width);
      const clampedTab = Math.max(0, Math.min(TAB_CONFIGS.length - 1, nextTab));

      if (clampedTab !== activeTabRef.current) {
        activeTabRef.current = clampedTab;
        setActiveTab(clampedTab);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

        if (clampedTab === 0) {
          noteTabFocus('course');
        } else if (clampedTab === 1) {
          noteTabFocus('packages');
        } else if (clampedTab === 2) {
          noteTabFocus('proof');
        }
      }
    },
    [width]
  );

  // Handle external navigation requests (e.g. router.push('/(tabs)/proof'))
  useEffect(() => {
    const targetRoute = segments[1];
    let targetIndex = 0;
    if (targetRoute === 'proof') targetIndex = 2;
    else if (targetRoute === 'packages') targetIndex = 1;

    if (targetIndex !== activeTabRef.current) {
      activeTabRef.current = targetIndex;
      setActiveTab(targetIndex);
      scrollRef.current?.scrollTo({ x: targetIndex * width, animated: true });
    }
  }, [segments, width]);

  // Tab bar press handler
  const handleTabPress = useCallback(
    (index: number) => {
      if (index === activeTabRef.current) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      activeTabRef.current = index;
      setActiveTab(index);
      scrollRef.current?.scrollTo({ x: index * width, animated: true });

      if (index === 0) {
        noteTabFocus('course');
      } else if (index === 1) {
        noteTabFocus('packages');
      } else if (index === 2) {
        noteTabFocus('proof');
      }
    },
    [width]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.canvas }}>
      {/* Real Interactive Horizontal Pager with 1:1 finger swipe tracking */}
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          bounces={false}
          overScrollMode="never"
          style={{ flex: 1 }}
        >
          <View style={{ width, flex: 1 }}>
            <MasterclassesTabScreen />
          </View>
          <View style={{ width, flex: 1 }}>
            <PackagesTab />
          </View>
          <View style={{ width, flex: 1 }}>
            <ProofTab />
          </View>
        </Animated.ScrollView>
      </BlurTargetView>

      {/* Upward gradient fade: soft edge above the bottom navigation bar */}
      <LinearGradient
        pointerEvents="none"
        colors={[
          'rgba(0, 0, 0, 0)',
          'rgba(0, 0, 0, 0.65)',
          '#000000',
        ]}
        locations={[0, 0.5, 1]}
        style={[styles.upwardGradient, { bottom: tabHeight }]}
      />

      {/* Persistent Floating Mini-Player docked with real background blur */}
      <FloatingMiniPlayer
        bottomOffset={floatingPlayerOffset}
        blurTarget={blurTargetRef}
      />

      <SocialProofHost />

      {/* Custom Bottom Navbar with indicator that moves seamlessly with swiping */}
      <View
        style={[
          styles.tabBarContainer,
          {
            height: tabHeight,
            paddingBottom: bottomNavPadding,
          },
        ]}
      >
        {/* Real-time sliding white circle that tracks your finger swiping */}
        <Animated.View style={[styles.slidingCircle, animatedIndicatorStyle]} />

        {/* Tab buttons */}
        <View style={styles.tabRow}>
          {TAB_CONFIGS.map((config, index) => (
            <RealTabBarItem
              key={config.name}
              config={config}
              index={index}
              scrollX={scrollX}
              width={width}
              onPress={() => handleTabPress(index)}
            />
          ))}
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#000000',
    borderTopWidth: 0,
    elevation: 0,
    position: 'relative',
    justifyContent: 'flex-start',
  },
  tabRow: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 3,
  },
  iconSlot: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
  },
  slidingCircle: {
    position: 'absolute',
    top: 3,
    left: 0,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#FFFFFF',
    zIndex: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
  upwardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 36,
  },
});
