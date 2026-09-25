import React from 'react';
import { Pressable, StyleProp, ViewStyle, PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  LinearTransition,
  FadeInDown,
  FadeInUp,
  FadeInRight,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

/**
 * Super buttery smooth physics spring tokens.
 * Calibrated specifically for 60Hz and 120Hz high-refresh displays.
 */
export const Springs = {
  // Snappy: instant response for buttons, icons, pills, micro-actions
  snappy: {
    damping: 18,
    stiffness: 350,
    mass: 0.6,
  },
  // Bouncy: energetic pop for badges, active states, indicators
  bouncy: {
    damping: 13,
    stiffness: 240,
    mass: 0.65,
  },
  // Silky: fluid smooth for cards, modals, page drawers, accordions
  silky: {
    damping: 22,
    stiffness: 200,
    mass: 0.8,
  },
  // Gentle: soft ambient breathing or floating transitions
  gentle: {
    damping: 28,
    stiffness: 130,
    mass: 1.0,
  },
} as const;

/**
 * Standard Butter-Smooth Entrance & Layout Transitions
 */
export const Transitions = {
  // Organic springified layout transition for expanding/collapsing items
  layout: LinearTransition.springify().damping(22).stiffness(220),

  // Fluid entrance animations with physical spring overshoot
  fadeDown: (delay = 0) =>
    FadeInDown.duration(380).delay(delay).springify().damping(19).stiffness(220),

  fadeUp: (delay = 0) =>
    FadeInUp.duration(380).delay(delay).springify().damping(19).stiffness(220),

  fadeRight: (delay = 0) =>
    FadeInRight.duration(380).delay(delay).springify().damping(19).stiffness(220),

  fadeIn: (duration = 200) => FadeIn.duration(duration),
  fadeOut: (duration = 160) => FadeOut.duration(duration),
};

interface AnimatedPressableScaleProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  haptic?: boolean;
  hapticStyle?: Haptics.ImpactFeedbackStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Universal tactile pressable that applies silky physics-based compression
 * on pressIn and elastic rebound on pressOut.
 */
export const AnimatedPressableScale: React.FC<AnimatedPressableScaleProps> = ({
  children,
  style,
  scaleTo = 0.96,
  haptic = true,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  onPressIn,
  onPressOut,
  ...rest
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    scale.value = withSpring(scaleTo, Springs.snappy);
    if (haptic) {
      Haptics.impactAsync(hapticStyle).catch(() => {});
    }
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, Springs.bouncy);
    onPressOut?.(e);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
};
