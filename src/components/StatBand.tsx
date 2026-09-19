import { StyleSheet, Text, View } from 'react-native';
import { Colors, Type, Radii, Spacing } from '@/constants/theme';

export function StatBand({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <View style={styles.band}>
      {stats.map((s) => (
        <View key={s.label} style={styles.cell}>
          <Text style={styles.value}>{s.value}</Text>
          <Text style={styles.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.lg + 8,
    padding: 18,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  value: {
    ...Type.chapterTitle,
    fontSize: 24,
    color: Colors.goldLight,
  },
  label: {
    ...Type.caption,
    color: Colors.muted,
    textAlign: 'center',
  },
});