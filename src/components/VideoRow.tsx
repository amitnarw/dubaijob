import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Type, Spacing, Radii } from '@/constants/theme';
import { type CourseVideo } from '@/data/courseVideos';
import { useLocale } from '@/i18n/LocaleContext';
import { AnimatedPressableScale, Transitions, Springs } from '@/constants/animations';

interface Props {
  video: CourseVideo;
  index: number;
  locked: boolean;
  done: boolean;
  onPress: () => void;
}

export function VideoRow({ video, index, locked, done, onPress }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { lang, t } = useLocale();
  const localizedTitle = video.title[lang] ?? video.title.en;

  const chevronRotation = useSharedValue(0);

  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    chevronRotation.value = withSpring(next ? 180 : 0, Springs.snappy);
  };

  const chevronAnim = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  return (
    <Animated.View layout={Transitions.layout} style={styles.card}>
      <AnimatedPressableScale onPress={onPress} scaleTo={0.98} style={styles.main}>
        <View style={styles.meta}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {localizedTitle}
            </Text>
            {video.freePreview && (
              <View style={styles.freePill}>
                <Text style={styles.freeText}>{t('podcast_free')}</Text>
              </View>
            )}
          </View>
          <Text style={styles.duration} numberOfLines={1}>
            {video.duration} Minutes
          </Text>
        </View>
        <View style={styles.playCircle}>
          {done && !locked ? (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          ) : locked ? (
            <Ionicons name="lock-closed" size={14} color="#FFFFFF" />
          ) : (
            <Ionicons name="play" size={16} color="#FFFFFF" style={styles.playIcon} />
          )}
        </View>
      </AnimatedPressableScale>
      <Pressable onPress={toggleExpand} style={styles.moreBtn} hitSlop={8}>
        <Text style={styles.moreText}>{expanded ? t('podcast_show_less') : t('podcast_show_more')}</Text>
        <Animated.View style={chevronAnim}>
          <Ionicons name="chevron-down" size={14} color={Colors.accent} />
        </Animated.View>
      </Pressable>
      {expanded && (
        <Animated.View
          entering={Transitions.fadeDown(0)}
          exiting={Transitions.fadeOut(120)}
          style={styles.expandedBox}
        >
          <Text style={styles.desc}>{video.description}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  meta: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    ...Type.body,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    flex: 1,
  },
  freePill: {
    backgroundColor: Colors.peach,
    borderRadius: Radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  freeText: {
    ...Type.micro,
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: Colors.textOn,
  },
  duration: {
    ...Type.small,
    color: Colors.muted,
  },
  playCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    marginLeft: 2,
  },
  moreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: Spacing.sm,
    paddingLeft: 2,
  },
  moreText: {
    ...Type.caption,
    fontFamily: 'Inter-SemiBold',
    color: Colors.accent,
  },
  expandedBox: {
    paddingTop: 6,
  },
  desc: {
    ...Type.caption,
    lineHeight: 18,
    color: Colors.muted,
  },
});