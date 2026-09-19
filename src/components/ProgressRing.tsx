import { StyleSheet, Text, View } from 'react-native';
import { Colors, Type, Radii } from '@/constants/theme';

/**
 * Progress ring (dependency-free).
 * Track circle with gold border + centered % label.
 */
export function ProgressRing({ pct, size = 64 }: { pct: number; size?: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View style={[styles.track, { width: size, height: size, borderRadius: size / 2 }]} />
      <View
        style={[
          styles.center,
          { width: size - 16, height: size - 16, borderRadius: (size - 16) / 2 },
        ]}>
        <Text style={styles.pct}>{clamped}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    backgroundColor: Colors.trackBg,
    borderWidth: 3,
    borderColor: Colors.goldDeep,
  },
  center: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pct: {
    ...Type.small,
    fontFamily: 'Inter-Bold',
    color: Colors.goldLight,
  },
});