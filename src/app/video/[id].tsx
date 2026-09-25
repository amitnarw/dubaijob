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
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entitlements } = usePurchases();
  const { lang, t } = useLocale();

  const currentIndex = useMemo(
    () => Math.max(0, COURSE_VIDEOS.findIndex((v) => v.id === id)),
    [id],
  );

  const video = useMemo(
    () => COURSE_VIDEOS[currentIndex] ?? COURSE_VIDEOS[0],
    [currentIndex],
  );

  const prevVideo = currentIndex > 0 ? COURSE_VIDEOS[currentIndex - 1] : null;
  const nextVideo = currentIndex < COURSE_VIDEOS.length - 1 ? COURSE_VIDEOS[currentIndex + 1] : null;

  const locked = !entitlements.course && !video.freePreview;
  const localizedTitle = video.title[lang] ?? video.title.en;

  useEffect(() => {
    ToastControl.paused = true;
    return () => {
      ToastControl.paused = false;
      markDone(video.id).catch(() => {});
    };
  }, [video.id]);

  return (
    <View style={styles.root}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerKicker}>
            Step {video.stepNumber} of {COURSE_VIDEOS.length} · {video.chapterTitle}
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
        onEnded={() => markDone(video.id).catch(() => {})}
        onNextLesson={nextVideo ? () => router.replace(`/video/${nextVideo.id}`) : undefined}
        onPrevLesson={prevVideo ? () => router.replace(`/video/${prevVideo.id}`) : undefined}
        onBack={() => router.back()}
      />

      {/* Lesson Details & CTAs */}
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Step metadata pill */}
        <View style={styles.metaRow}>
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>Step {video.stepNumber}</Text>
          </View>
          <Text style={styles.durationPill}>{video.duration}</Text>
          <Text style={styles.sectionPill} numberOfLines={1}>
            {video.sectionTitle}
          </Text>
        </View>

        <Text style={styles.title}>{localizedTitle}</Text>
        {lang !== 'hi' && <Text style={styles.hindiNote}>{video.title.hi}</Text>}
        <Text style={styles.desc}>{video.description}</Text>
        {lang !== 'hi' && <Text style={styles.langNote}>{t('course_note_nonhindi')}</Text>}

        {locked ? (
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
        )}

        {/* Next / Previous Lesson Navigation Strip */}
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
                <Text style={[styles.navCardSub, { color: Colors.gold }]}>Next Lesson</Text>
                <Text style={styles.navCardTitle} numberOfLines={1}>
                  Step {nextVideo.stepNumber}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color={Colors.gold} />
            </AnimatedPressableScale>
          ) : (
            <View style={styles.navCardPlaceholder} />
          )}
        </View>
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
    color: Colors.gold,
    fontSize: 10.5,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  stepPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(230, 184, 0, 0.15)',
  },
  stepPillText: {
    color: Colors.gold,
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  durationPill: {
    color: Colors.muted,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  sectionPill: {
    color: Colors.faint,
    fontSize: 11.5,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  title: {
    ...Type.chapterTitle,
    fontSize: 22,
    color: Colors.text,
    lineHeight: 28,
  },
  hindiNote: {
    ...Type.small,
    color: Colors.gold,
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
    padding: 12,
    borderRadius: Radii.md,
    backgroundColor: Colors.elevated,
  },
  navCardNext: {
    backgroundColor: 'rgba(230, 184, 0, 0.05)',
  },
  navCardPlaceholder: {
    flex: 1,
  },
  navCardText: {
    flex: 1,
  },
  navCardSub: {
    color: Colors.faint,
    fontSize: 10.5,
    fontFamily: 'Inter-Medium',
  },
  navCardTitle: {
    color: Colors.text,
    fontSize: 12.5,
    fontFamily: 'Inter-SemiBold',
  },
});