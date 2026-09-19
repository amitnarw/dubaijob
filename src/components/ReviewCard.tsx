import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Type, Radii, Spacing } from '@/constants/theme';
import type { Review } from '@/data/reviews';

function Stars({ n }: { n: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons key={i} name={i <= n ? 'star' : 'star-outline'} size={14} color={Colors.gold} />
      ))}
    </View>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        {review.photo ? (
          <Image source={{ uri: review.photo }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.initial}>{review.name.slice(0, 1)}</Text>
          </View>
        )}
        <View style={styles.meta}>
          <Text style={styles.name}>{review.name}</Text>
          <Text style={styles.city}>{review.city}</Text>
        </View>
        <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
      </View>
      <Text style={styles.outcomeText}>{review.outcome}</Text>
      <Stars n={review.stars} />
      <Text style={styles.text}>{review.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarFallback: {
    backgroundColor: Colors.trackBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    ...Type.chapterTitle,
    fontSize: 18,
    color: Colors.goldLight,
  },
  meta: {
    flex: 1,
  },
  name: {
    ...Type.bodyMedium,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  city: {
    ...Type.small,
    color: Colors.muted,
  },
  outcomeText: {
    ...Type.small,
    color: Colors.goldLight,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  text: {
    ...Type.body,
    color: Colors.muted,
    lineHeight: 23,
  },
});