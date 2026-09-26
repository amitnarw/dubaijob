import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Type, Spacing, Radii } from '@/constants/theme';
import { COURSE_VIDEOS } from '@/data/courseVideos';
import { GoldButton } from '@/components/GoldButton';
import { CustomVideoPlayer } from '@/components/CustomVideoPlayer';
import { usePurchases } from '@/context/PurchaseContext';
import { useLocale } from '@/i18n/LocaleContext';
import { markDone } from '@/services/courseService';
import { ToastControl } from '@/services/toastControl';
import { thumbnailUrl } from '@/services/youtubeService';
import { AnimatedPressableScale } from '@/constants/animations';

export default function VideoScreen() {
  const { id, yt, ytTitle } = useLocalSearchParams<{ id: string; yt?: string; ytTitle?: string }>();
  const { entitlements } = usePurchases();
  const { lang, t } = useLocale();

  // Ad-hoc proof video (unlisted YouTube testimonial, not part of the 25 steps)
  const adHocId = typeof yt === 'string' && yt.length > 0 ? yt : null;

  const currentIndex = useMemo(
    () => Math.max(0, COURSE_VIDEOS.findIndex((v) => v.id === id)),
    [id],
  );

  const video = useMemo(() => {
    if (adHocId) {
      const titleText =
        typeof ytTitle === 'string' && ytTitle.length > 0 ? ytTitle : 'Success story';
      return {
        id: adHocId,
        stepNumber: 0,
        title: { en: titleText, hi: titleText, si: titleText, ta: titleText, ur: titleText, bn: titleText },
        hindiTitle: '',
        section: 1 as const,
        sectionTitle: '',
        chapterId: '',
        chapterTitle: '',
        duration: '',
        description: '',
        freePreview: true,
      };
    }
    return COURSE_VIDEOS[currentIndex] ?? COURSE_VIDEOS[0];
  }, [currentIndex, adHocId, ytTitle]);

  const prevVideo = !adHocId && currentIndex > 0 ? COURSE_VIDEOS[currentIndex - 1] : null;
  const nextVideo =
    !adHocId && currentIndex < COURSE_VIDEOS.length - 1
      ? COURSE_VIDEOS[currentIndex + 1]
      : null;

  const locked = !entitlements.course && !video.freePreview;
  const localizedTitle = video.title[lang] ?? video.title.en;

  useEffect(() => {
    ToastControl.paused = true;
    return () => {
      ToastControl.paused = false;
      if (!adHocId) markDone(video.id).catch(() => {});
    };
  }, [video.id, adHocId]);

  return (
    <View style={styles.root}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerKicker}>
            {adHocId
              ? t('proof_section_videos')
              : `Step ${video.stepNumber} of ${COURSE_VIDEOS.length} · ${video.chapterTitle}`}
          </Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {localizedTitle}
          </Text>
        </View>
      </View>

      <CustomVideoPlayer
        videoId={video.id}
        thumbnailUri={thumbnailUrl(video.id)}
        title={localizedTitle}
        stepNumber={video.stepNumber}
        totalSteps={COURSE_VIDEOS.length}
        durationString={video.duration}
        locked={locked}
        onUnlockPress={() =>
          router.push({ pathname: '/checkout/[productId]', params: { productId: 'course_full' } })
        }
        onEnded={() => {
          if (!adHocId) markDone(video.id).catch(() => {});
        }}
        onNextLesson={nextVideo ? () => router.replace(`/video/${nextVideo.id}`) : undefined}
        onPrevLesson={prevVideo ? () => router.replace(`/video/${prevVideo.id}`) : undefined}
        onBack={() => router.back()}
      />

      {/* Lesson Details & CTAs */}
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Step metadata — one quiet line */}
        {!adHocId && (
          <Text style={styles.metaLine}>
            Step {video.stepNumber} · {video.duration} · {video.sectionTitle}
          </Text>
        )}

        <Text style={styles.title}>{localizedTitle}</Text>
        {lang !== 'hi' && !!video.hindiTitle && <Text style={styles.hindiNote}>{video.title.hi}</Text>}
        {!!video.description && <Text style={styles.desc}>{video.description}</Text>}
        {lang !== 'hi' && !adHocId && <Text style={styles.langNote}>{t('course_note_nonhindi')}</Text>}

        {!adHocId &&
          (locked ? (
          <GoldButton
            title={t('video_locked_cta')}
            onPress={() =>
              router.push({ pathname: '/checkout/[productId]', params: { productId: 'course_full' } })
            }
            style={styles.cta}
          />
        ) : (
          <GoldButton
            title={t('course_mark_done')}
            onPress={async () => {
              await markDone(video.id).catch(() => {});
              router.back();
            }}
            style={styles.cta}
          />
          ))}

        {/* Next / Previous Lesson Navigation Strip */}
        {!adHocId && (
        <View style={styles.navRow}>
          {prevVideo ? (
            <AnimatedPressableScale
              scaleTo={0.96}
              onPress={() => router.replace(`/video/${prevVideo.id}`)}
              style={styles.navCard}
            >
              <Ionicons name="arrow-back" size={16} color={Colors.muted} />
              <View style={styles.navCardText}>
                <Text style={styles.navCardSub}>Previous</Text>
                <Text style={styles.navCardTitle} numberOfLines={1}>
                  Step {prevVideo.stepNumber}
                </Text>
              </View>
            </AnimatedPressableScale>
          ) : (
            <View style={styles.navCardPlaceholder} />
          )}

          {nextVideo ? (
            <AnimatedPressableScale
              scaleTo={0.96}
              onPress={() => router.replace(`/video/${nextVideo.id}`)}
              style={[styles.navCard, styles.navCardNext]}
            >
              <View style={[styles.navCardText, { alignItems: 'flex-end' }]}>
                <Text style={styles.navCardSub}>Next Lesson</Text>
                <Text style={styles.navCardTitle} numberOfLines={1}>
                  Step {nextVideo.stepNumber}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color={Colors.muted} />
            </AnimatedPressableScale>
          ) : (
            <View style={styles.navCardPlaceholder} />
          )}
        </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.screen,
    paddingTop: 50,
    paddingBottom: Spacing.md,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerKicker: {
    color: Colors.muted,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.3,
  },
  headerTitle: {
    ...Type.cardTitle,
    color: Colors.text,
    fontSize: 15,
  },
  body: {
    padding: Spacing.screen,
    gap: Spacing.sm,
    paddingBottom: 48,
  },
  metaLine: {
    ...Type.small,
    color: Colors.muted,
    marginTop: 4,
    marginBottom: 4,
  },
  title: {
    ...Type.chapterTitle,
    fontSize: 22,
    color: Colors.text,
    lineHeight: 28,
  },
  hindiNote: {
    ...Type.small,
    color: Colors.muted,
  },
  desc: {
    ...Type.body,
    color: Colors.muted,
    lineHeight: 22,
  },
  langNote: {
    ...Type.caption,
    color: Colors.faint,
    fontStyle: 'italic',
  },
  cta: {
    marginTop: Spacing.md,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
  },
  navCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: Colors.canvas,
  },
  navCardNext: {
    backgroundColor: Colors.canvas,
  },
  navCardPlaceholder: {
    flex: 1,
  },
  navCardText: {
    flex: 1,
  },
  navCardSub: {
    color: Colors.muted,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  navCardTitle: {
    color: Colors.text,
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
});