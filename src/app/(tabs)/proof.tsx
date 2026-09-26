import { useCallback } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Type, Radii, Spacing } from '@/constants/theme';
import { HERO_STORY, PROOF_VIDEOS, REVIEWS, SUCCESS_IMAGES } from '@/data/reviews';
import { STATS } from '@/data/offers';
import { GoldButton } from '@/components/GoldButton';
import { ReviewCard } from '@/components/ReviewCard';
import { useLocale } from '@/i18n/LocaleContext';
import { noteTabFocus } from '@/services/tabFocus';
import { thumbnailUrl } from '@/services/youtubeService';
import { AnimatedPressableCard } from '@/components/podcast/AnimatedPressableCard';

import Animated from 'react-native-reanimated';
import { Transitions } from '@/constants/animations';

const W = Dimensions.get('window').width;
const VIDEO_CARD_W = Math.min(260, W * 0.68);

export default function ProofTab() {
  const { t } = useLocale();

  useFocusEffect(
    useCallback(() => {
      noteTabFocus('proof');
    }, []),
  );

  const filledVideos = PROOF_VIDEOS.filter((v) => !!v.youtubeId);

  const openProofVideo = (youtubeId: string, caption: string) => {
    router.push({
      pathname: '/video/[id]',
      params: { id: youtubeId, yt: youtubeId, ytTitle: caption },
    });
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={Transitions.fadeDown(0)}>
          <Text style={styles.hero}>{t('proof_hero')}</Text>
        </Animated.View>

        <Animated.View entering={Transitions.fadeDown(60)} style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{STATS.students.toLocaleString('en-IN')}+</Text>
            <Text style={styles.statLabel}>{t('proof_students')}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{STATS.rating}★</Text>
            <Text style={styles.statLabel}>
              {t('proof_rating')} · {STATS.reviewCount.toLocaleString('en-IN')} {t('proof_reviews_suffix')}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{STATS.years}+</Text>
            <Text style={styles.statLabel}>{t('proof_years')}</Text>
          </View>
        </Animated.View>

        {filledVideos.length > 0 && (
          <>
            <Animated.View entering={Transitions.fadeDown(80)}>
              <Text style={styles.section}>{t('proof_section_videos')}</Text>
            </Animated.View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.videoRow}>
              {filledVideos.map((v, index) => (
                <Animated.View
                  key={v.id}
                  entering={Transitions.fadeRight(index * 70)}
                  style={styles.videoCard}>
                  <AnimatedPressableCard
                    onPress={() => openProofVideo(v.youtubeId as string, v.caption)}
                    scaleTo={0.95}>
                    <Image
                      source={{ uri: thumbnailUrl(v.youtubeId as string) }}
                      style={styles.videoThumb}
                    />
                    <View style={styles.videoPlay} pointerEvents="none">
                      <Ionicons name="play" size={22} color={Colors.textOn} style={styles.playIcon} />
                    </View>
                  </AnimatedPressableCard>
                  <Text style={styles.caption} numberOfLines={2}>
                    {v.caption}
                  </Text>
                </Animated.View>
              ))}
            </ScrollView>
          </>
        )}

        <Animated.View entering={Transitions.fadeDown(100)}>
          <Text style={styles.section}>{t('proof_section_reviews')}</Text>
        </Animated.View>
        {REVIEWS.slice(0, 3).map((r, index) => (
          <Animated.View key={r.id} entering={Transitions.fadeDown(index * 60)}>
            <ReviewCard review={r} />
          </Animated.View>
        ))}

        <Animated.View entering={Transitions.fadeDown(140)} style={styles.heroStory}>
          <Ionicons name="trophy" size={28} color={Colors.gold} />
          <Text style={styles.heroResult}>{HERO_STORY.result}</Text>
          <Text style={styles.heroRole}>
            {HERO_STORY.name} · {HERO_STORY.city} → {HERO_STORY.role}
          </Text>
          <Text style={styles.heroText}>{HERO_STORY.text}</Text>
          {HERO_STORY.youtubeId && (
            <Pressable
              onPress={() =>
                openProofVideo(
                  HERO_STORY.youtubeId as string,
                  t('proof_watch_story', { name: HERO_STORY.name }),
                )
              }
              hitSlop={8}
              style={styles.watchRow}>
              <Ionicons name="play-circle" size={18} color={Colors.goldLight} />
              <Text style={styles.watchText}>
                {t('proof_watch_story', { name: HERO_STORY.name })}
              </Text>
            </Pressable>
          )}
          <GoldButton title={t('proof_cta')} onPress={() => router.push('/(tabs)')} style={styles.heroCta} />
        </Animated.View>

        <Animated.View entering={Transitions.fadeDown(160)}>
          <Text style={styles.section}>{t('proof_section_moments')}</Text>
        </Animated.View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gallery}>
          {SUCCESS_IMAGES.map((s, index) => (
            <Animated.View key={s.id} entering={Transitions.fadeRight(index * 70)} style={styles.slide}>
              {s.image ? (
                <Image source={{ uri: s.image }} style={styles.slideImg} />
              ) : (
                <View style={[styles.slideImg, styles.slideFallback]}>
                  <Ionicons name="image-outline" size={40} color={Colors.gold} />
                </View>
              )}
              <Text style={styles.caption}>{s.caption}</Text>
            </Animated.View>
          ))}
        </ScrollView>
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  scroll: {
    padding: Spacing.screen,
    paddingTop: 56,
  },
  hero: {
    ...Type.heroSerifless,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.sm,
  },
  stat: {
    flex: 1,
    gap: 4,
  },
  statValue: {
    ...Type.chapterTitle,
    color: Colors.text,
  },
  statLabel: {
    ...Type.small,
    color: Colors.muted,
  },
  section: {
    ...Type.chapterTitle,
    fontSize: 20,
    color: Colors.text,
    marginTop: Spacing.section,
    marginBottom: Spacing.md,
  },
  videoRow: {
    gap: Spacing.md,
    paddingRight: Spacing.screen,
  },
  videoCard: {
    width: VIDEO_CARD_W,
    gap: Spacing.sm,
  },
  videoThumb: {
    width: VIDEO_CARD_W,
    height: VIDEO_CARD_W * 0.5625,
    borderRadius: Radii.card,
    backgroundColor: Colors.surface,
  },
  videoPlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    backgroundColor: Colors.text,
    borderRadius: 999,
    padding: 12,
    marginLeft: 2,
    overflow: 'hidden',
  },
  caption: {
    ...Type.small,
    color: Colors.muted,
  },
  gallery: {
    gap: Spacing.md,
  },
  slide: {
    width: W - Spacing.screen * 2,
    gap: Spacing.sm,
  },
  slideImg: {
    width: '100%',
    height: 220,
    borderRadius: Radii.card,
  },
  slideFallback: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStory: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: 22,
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  heroResult: {
    ...Type.price,
    fontSize: 32,
    color: Colors.goldLight,
  },
  heroRole: {
    ...Type.small,
    color: Colors.muted,
    textAlign: 'center',
  },
  heroText: {
    ...Type.body,
    color: Colors.text,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 4,
  },
  watchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  watchText: {
    ...Type.small,
    fontFamily: 'Inter-Bold',
    color: Colors.goldLight,
  },
  heroCta: {
    width: '100%',
    marginTop: Spacing.md,
  },
});
