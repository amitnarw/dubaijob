import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors, Type, Radii } from '@/constants/theme';

import { Springs } from '@/constants/animations';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  dark?: boolean; // dark variant: tonal surface button with gold text
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Primary action: white fill (reference style). dark variant = tonal + gold text. */
export function GoldButton({ title, onPress, disabled, style, dark }: Props) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    scale.value = withSpring(0.96, Springs.snappy);
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1, Springs.bouncy);
  };

  const handlePress = () => {
    if (disabled) return;
    onPress();
  };

  if (dark) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.dark, disabled && styles.disabled, style, anim]}
      >
        <Text style={styles.darkText}>{title}</Text>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.primary, disabled && styles.disabled, style, anim]}
    >
      <Text style={styles.primaryText}>{title}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.card,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryText: {
    ...Type.bodyMedium,
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: Colors.textOn,
  },
  dark: {
    backgroundColor: Colors.elevated,
    borderRadius: Radii.card,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  darkText: {
    ...Type.bodyMedium,
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: Colors.goldLight,
  },
  disabled: {
    opacity: 0.5,
  },
});