import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Type, Presets, Spacing, Radii } from '@/constants/theme';
import { type CourseVideo } from '@/data/courseVideos';
import { useLocale } from '@/i18n/LocaleContext';
import { thumbnailUrl } from '@/services/youtubeService';

interface Props {
  video: CourseVideo;
  index: number;
  locked: boolean;
  done: boolean;
  onPress: () => void;
}

export function VideoRow({ video, index, locked, done, onPress }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const { lang, t } = useLocale();
  const localizedTitle = video.title[lang] ?? video.title.en;

  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={styles.main}>
        <View style={styles.thumbWrap}>
          {thumbFailed ? (
            <View style={[styles.thumb, styles.thumbFallback]}>
              <Ionicons name="play-circle" size={30} color={Colors.gold} />
            </View>
          ) : (
            <Image
              source={{ uri: thumbnailUrl(video.id) }}
              style={styles.thumb}
              onError={() => setThumbFailed(true)}
            />
          )}
          {locked && (
            <View style={styles.lockVeil}>
              <Ionicons name="lock-closed" size={20} color={Colors.goldLight} />
            </View>
          )}
          {done && !locked && (
            <View style={styles.doneBadge}>
              <Ionicons name="checkmark" size={12} color={Colors.textOn} />
            </View>
          )}
        </View>
        <View style={styles.meta}>
          <View style={styles.kickerRow}>
            <Text style={styles.kicker}>
              Step {video.stepNumber || index + 1} · {video.duration}
            </Text>
            {video.freePreview && (
              <View style={styles.freeBadge}>
                <Text style={styles.freeText}>{t('podcast_free').toUpperCase()}</Text>
              </View>
            )}
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {localizedTitle}
          </Text>
          <Text style={styles.hindiSubtitle} numberOfLines={1}>
            {video.hindiTitle}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.faint} />
      </Pressable>
      <Pressable onPress={() => setExpanded((e) => !e)} style={styles.moreBtn} hitSlop={8}>
        <Text style={styles.moreText}>{expanded ? t('podcast_show_less') : t('podcast_show_more')}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={Colors.gold} />
      </Pressable>
      {expanded && (
        <View style={styles.expandedBox}>
          <Text style={styles.desc}>{video.description}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  thumbWrap: {
    width: 112,
    height: 70,
  },
  thumb: {
    width: 112,
    height: 70,
    borderRadius: Radii.sm,
    backgroundColor: Colors.trackBg,
  },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockVeil: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: Radii.sm,
    backgroundColor: 'rgba(10,10,12,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBadge: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  kicker: {
    ...Type.caption,
    color: Colors.gold,
  },
  freeBadge: {
    backgroundColor: Colors.goldTint,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  freeText: {
    ...Type.micro,
    fontSize: 9,
    color: Colors.goldLight,
  },
  title: {
    ...Type.small,
    fontFamily: 'Inter-SemiBold',
    fontSize: 13.5,
    color: Colors.text,
  },
  hindiSubtitle: {
    ...Type.caption,
    color: Colors.faint,
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
    color: Colors.goldLight,
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