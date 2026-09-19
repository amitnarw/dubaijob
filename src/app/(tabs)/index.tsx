import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  useWindowDimensions,
  AppState,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Type, Presets, Spacing, Radii } from '@/constants/theme';
import { TOP_PODCASTS, CATEGORIES, AUTHORS, type PodcastItem } from '@/data/podcastData';
import { ConcentricArtwork } from '@/components/podcast/ConcentricArtwork';
import { AnimatedPressableCard } from '@/components/podcast/AnimatedPressableCard';
import { usePlayer } from '@/context/PlayerContext';
import { useAuth } from '@/context/AuthContext';
import { usePurchases } from '@/context/PurchaseContext';
import { useLocale } from '@/i18n/LocaleContext';
import {
  COURSE_VIDEOS,
  COURSE_CHAPTERS,
  chapterTitle,
  TOTAL_LESSONS,
} from '@/data/courseVideos';
import { VideoRow } from '@/components/VideoRow';
import { DiscountModal } from '@/components/DiscountModal';
import { getProgress, progressStats, type ProgressMap } from '@/services/courseService';
import { recordHomeVisit, shouldShowModal } from '@/services/discountService';
import { noteTabFocus } from '@/services/tabFocus';
import { FULL_PRICE_INR, STATS } from '@/data/offers';

export default function MasterclassesTabScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { playTrack } = usePlayer();
  const { auth } = useAuth();
  const { entitlements } = usePurchases();
  const { t, lang } = useLocale();

  const [selectedSection, setSelectedSection] = useState<0 | 1 | 2>(0);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    'ch-1': true,
    'ch-2': true,
    'ch-3': true,
    'ch-4': true,
    'ch-5': true,
  });
  const [progress, setProgress] = useState<ProgressMap>({});
  const [modalVisible, setModalVisible] = useState(false);
  const modalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const topCardWidth = width * 0.84;
  const stats = progressStats(progress);

  const checkVisit = useCallback(() => {
    if (!noteTabFocus('index')) return;
    recordHomeVisit()
      .then(({ visit }) => {
        if (shouldShowModal(visit)) {
          if (modalTimer.current) clearTimeout(modalTimer.current);
          modalTimer.current = setTimeout(() => setModalVisible(true), 1500);
        }
      })
      .catch(() => {});
  }, []);

  useFocusEffect(checkVisit);

  useEffect(() => {
    getProgress().then(setProgress).catch(() => {});
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') checkVisit();
    });
    return () => sub.remove();
  }, [checkVisit]);

  useEffect(() => {
    return () => {
      if (modalTimer.current) clearTimeout(modalTimer.current);
    };
  }, []);

  const toggleChapter = (chapterId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setExpandedChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  const handleSelectPodcast = (item: PodcastItem) => {
    playTrack({
      id: item.id,
      title: item.title,
      episode: item.episode || item.show || 'Lesson',
      theme: item.theme,
      badgeText: item.badgeText,
      duration: item.duration,
      videoId: item.videoId || item.id,
    });
    if (item.videoId) {
      router.push({ pathname: '/video/[id]', params: { id: item.videoId } });
    }
  };

  const openVideo = (id: string) => {
    router.push({ pathname: '/video/[id]', params: { id } });
  };

  const visibleChapters = COURSE_CHAPTERS.filter((ch) => {
    if (selectedSection === 0) return true;
    return ch.section === selectedSection;
  });

  const name = auth.status === 'signed-in' ? auth.name.split(' ')[0] : 'there';

  return (
    <View style={styles.root}>
      <View style={styles.ambientTopGlow} pointerEvents="none">
        <LinearGradient
          colors={[Colors.ambientWarm, Colors.ambientCool, 'transparent']}
          start={{ x: 0.8, y: 0 }}
          end={{ x: 0.2, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 4, paddingBottom: 220 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.headerRow}>
          <Text style={styles.pageTitle}>{t('podcast_title')}</Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              router.push('/account');
            }}
            hitSlop={8}
            style={styles.avatarBtn}>
            {auth.status === 'signed-in' && auth.photo ? (
              <Image source={{ uri: auth.photo }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle-outline" size={32} color={Colors.muted} />
            )}
          </Pressable>
        </Animated.View>

        {/* Progress strip (real data) */}
        <Animated.View entering={FadeInDown.duration(400).delay(40)} style={styles.progressRow}>
          <Ionicons name="trending-up" size={14} color={Colors.gold} />
          <Text style={styles.progressText}>
            {t('course_progress_done', {
              done: stats.done,
              total: stats.total,
              pct: stats.pct,
            })}
          </Text>
        </Animated.View>

        {/* Top Masterclasses carousel */}
        <Animated.View
          entering={FadeInDown.duration(450).delay(80).springify()}
          style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('podcast_top')}</Text>
        </Animated.View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={topCardWidth + 14}
          decelerationRate="fast"
          contentContainerStyle={styles.topPodcastsContainer}>
          {TOP_PODCASTS.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInRight.duration(450).delay(index * 90).springify()}>
              <AnimatedPressableCard
                onPress={() => handleSelectPodcast(item)}
                style={[styles.topCard, { width: topCardWidth }]}
                scaleTo={0.97}>
                <View style={styles.topCardContent}>
                  <Text style={styles.topCardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.topCardShow} numberOfLines={1}>
                    {item.show}
                  </Text>
                  <Text style={styles.topCardMeta} numberOfLines={1}>
                    {item.meta}
                  </Text>
                </View>
                <ConcentricArtwork
                  size={96}
                  theme={item.theme}
                  badgeText={item.badgeText}
                  borderRadius={20}
                  showSpeakerBadge={true}
                />
              </AnimatedPressableCard>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Chapters tiles */}
        <Animated.View
          entering={FadeInDown.duration(450).delay(150).springify()}
          style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('podcast_chapters')}</Text>
        </Animated.View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}>
          {CATEGORIES.map((cat, index) => (
            <Animated.View
              key={cat.id}
              entering={FadeInRight.duration(450).delay(index * 70).springify()}>
              <AnimatedPressableCard
                onPress={() => router.push({ pathname: '/category/[id]', params: { id: cat.id } })}
                style={styles.categoryCard}
                scaleTo={0.93}>
                <View
                  style={[
                    styles.categoryIconWrap,
                    { backgroundColor: `${cat.accentColor}1A`, borderColor: `${cat.accentColor}33` },
                  ]}>
                  <Ionicons name={cat.iconName} size={22} color={cat.accentColor} />
                </View>
                <Text style={styles.categoryName} numberOfLines={1}>
                  {cat.title}
                </Text>
                <Text style={styles.categoryCount} numberOfLines={1}>
                  {cat.count}
                </Text>
              </AnimatedPressableCard>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Mentors */}
        <Animated.View
          entering={FadeInDown.duration(450).delay(200).springify()}
          style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('podcast_mentors')}</Text>
        </Animated.View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.authorsContainer}>
          {(AUTHORS || []).map((author, index) => (
            <Animated.View
              key={author.id}
              entering={FadeInRight.duration(400).delay(index * 60).springify()}
              style={styles.authorCard}>
              <Image source={{ uri: author.image }} style={styles.authorImage} />
              <Text style={styles.authorName} numberOfLines={1}>
                {author.name}
              </Text>
              <Text style={styles.authorRole} numberOfLines={1}>
                {author.role}
              </Text>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Curriculum */}
        <View style={styles.courseHeaderSection}>
          <View style={styles.courseHeaderRow}>
            <View style={styles.courseHeaderMeta}>
              <Text style={styles.courseMainTitle}>{t('podcast_curriculum')}</Text>
              <Text style={styles.courseMainSub}>
                {t('podcast_curriculum_sub', { steps: TOTAL_LESSONS, sections: 2, chapters: COURSE_CHAPTERS.length })}
              </Text>
            </View>
            <View style={styles.stepsBadge}>
              <Text style={styles.stepsBadgeText}>{t('podcast_lessons_badge', { n: TOTAL_LESSONS })}</Text>
            </View>
          </View>

          {/* Section filter pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillContainer}>
            {([0, 1, 2] as const).map((sec) => {
              const active = selectedSection === sec;
              const label =
                sec === 0
                  ? t('podcast_filter_all', { n: TOTAL_LESSONS })
                  : sec === 1
                    ? t('podcast_filter_s1', { n: 10 })
                    : t('podcast_filter_s2', { n: 15 });
              return (
                <Pressable
                  key={sec}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    setSelectedSection(sec);
                  }}
                  style={[styles.filterPill, active && styles.filterPillActive]}>
                  <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Chapters accordion */}
          <View style={styles.chaptersList}>
            {visibleChapters.map((chapter) => {
              const chapterLessons = COURSE_VIDEOS.filter((v) => v.chapterId === chapter.id);
              const isExpanded = !!expandedChapters[chapter.id];
              return (
                <Animated.View
                  key={chapter.id}
                  layout={Layout.springify().damping(18)}
                  style={styles.chapterCard}>
                  <Pressable onPress={() => toggleChapter(chapter.id)} style={styles.chapterHeader}>
                    <View style={styles.chapterMeta}>
                      <View style={styles.chapterTagRow}>
                        <View style={styles.chapterTag}>
                          <Text style={styles.chapterTagText}>
                            {t('podcast_steps_range', { range: chapter.stepRange })}
                          </Text>
                        </View>
                        <Text style={styles.chapterSectionText}>
                          {t('podcast_section_n', { n: chapter.section })}
                        </Text>
                      </View>
                      <Text style={styles.chapterTitle}>{chapterTitle(chapter, lang)}</Text>
                      <Text style={styles.chapterHindi}>{chapter.hindiTitle}</Text>
                      <Text style={styles.chapterDesc}>{chapter.description}</Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up-circle' : 'chevron-down-circle'}
                      size={24}
                      color={isExpanded ? Colors.gold : Colors.muted}
                    />
                  </Pressable>

                  {isExpanded && (
                    <Animated.View
                      entering={FadeInDown.duration(300).springify()}
                      style={styles.chapterLessonsWrap}>
                      {chapterLessons.map((v) => (
                        <VideoRow
                          key={v.id}
                          video={v}
                          index={v.stepNumber - 1}
                          locked={!entitlements.course && !v.freePreview}
                          done={!!progress[v.id]}
                          onPress={() => openVideo(v.id)}
                        />
                      ))}
                    </Animated.View>
                  )}
                </Animated.View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Unlock bar (commerce) */}
      {!entitlements.course && (
        <View style={[styles.unlockBar, { bottom: insets.bottom + 92 }]}>
          <View style={styles.unlockMeta}>
            <Text style={styles.unlockPrice}>₹{FULL_PRICE_INR.toLocaleString('en-IN')}</Text>
            <Text style={styles.unlockSub} numberOfLines={1}>
              {t('unlock_bar_sub', {
                rating: STATS.rating,
                reviews: `${(STATS.reviewCount / 1000).toFixed(1)}k`,
                price: `₹${FULL_PRICE_INR.toLocaleString('en-IN')}`,
              })}
            </Text>
          </View>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/checkout/[productId]',
                params: { productId: 'course_full' },
              })
            }
            style={styles.unlockBtn}>
            <Text style={styles.unlockBtnText}>{t('unlock_cta', { n: TOTAL_LESSONS })}</Text>
          </Pressable>
        </View>
      )}

      {/* Limited-time discount modal */}
      <DiscountModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onClaim={() => {
          setModalVisible(false);
          router.push({ pathname: '/checkout/[productId]', params: { productId: 'course_full' } });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  ambientTopGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    zIndex: 0,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  pageTitle: {
    ...Type.pageTitle,
    color: Colors.text,
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  progressText: {
    ...Type.small,
    color: Colors.goldLight,
  },
  sectionHeaderRow: {
    marginTop: Spacing.lg,
    marginBottom: 10,
  },
  sectionTitle: {
    ...Type.sectionLabel,
    color: Colors.muted,
  },
  topPodcastsContainer: {
    paddingRight: Spacing.screen,
    gap: 14,
  },
  topCard: {
    ...Presets.card,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topCardContent: {
    flex: 1,
    marginRight: Spacing.md,
    justifyContent: 'space-between',
  },
  topCardTitle: {
    ...Type.cardTitle,
    color: Colors.text,
  },
  topCardShow: {
    ...Type.small,
    color: Colors.muted,
    marginTop: 6,
  },
  topCardMeta: {
    ...Type.caption,
    color: Colors.faint,
    marginTop: 10,
  },
  categoriesContainer: {
    paddingRight: Spacing.screen,
    gap: Spacing.md,
  },
  categoryCard: {
    ...Presets.tile,
    width: 88,
    height: 92,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  categoryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 1,
  },
  categoryName: {
    ...Type.micro,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  categoryCount: {
    ...Type.caption,
    fontSize: 10,
    color: Colors.faint,
    marginTop: 2,
  },
  authorsContainer: {
    paddingRight: Spacing.screen,
    gap: Spacing.lg,
  },
  authorCard: {
    alignItems: 'center',
    width: 78,
  },
  authorImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: Colors.hairlineStrong,
  },
  authorName: {
    ...Type.micro,
    color: Colors.text,
    textAlign: 'center',
  },
  authorRole: {
    ...Type.caption,
    fontSize: 10,
    color: Colors.faint,
    textAlign: 'center',
    marginTop: 1,
  },
  courseHeaderSection: {
    marginTop: Spacing.section,
  },
  courseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: Spacing.sm,
  },
  courseHeaderMeta: {
    flex: 1,
  },
  courseMainTitle: {
    ...Type.chapterTitle,
    fontSize: 20,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  courseMainSub: {
    ...Type.small,
    color: Colors.muted,
    marginTop: 2,
  },
  stepsBadge: {
    backgroundColor: Colors.goldTint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  stepsBadgeText: {
    ...Type.caption,
    fontFamily: 'Inter-Bold',
    color: Colors.goldLight,
  },
  filterPillContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  filterPill: {
    ...Presets.pill,
  },
  filterPillActive: {
    ...Presets.pillActive,
  },
  filterPillText: {
    ...Type.small,
    color: Colors.muted,
  },
  filterPillTextActive: {
    ...Type.small,
    fontFamily: 'Inter-Bold',
    color: Colors.textOn,
  },
  chaptersList: {
    gap: Spacing.lg,
  },
  chapterCard: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radii.card,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.hairline,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  chapterMeta: {
    flex: 1,
    marginRight: 10,
  },
  chapterTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  chapterTag: {
    backgroundColor: Colors.goldTint,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radii.sm,
  },
  chapterTagText: {
    ...Type.caption,
    fontFamily: 'Inter-Bold',
    color: Colors.goldLight,
  },
  chapterSectionText: {
    ...Type.caption,
    color: Colors.faint,
  },
  chapterTitle: {
    ...Type.chapterTitle,
    color: Colors.text,
    marginTop: 2,
  },
  chapterHindi: {
    ...Type.small,
    color: Colors.gold,
    marginTop: 1,
  },
  chapterDesc: {
    ...Type.caption,
    fontSize: 11.5,
    lineHeight: 16,
    color: Colors.muted,
    marginTop: 4,
  },
  chapterLessonsWrap: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.hairline,
    paddingTop: Spacing.md,
  },
  unlockBar: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(30,31,37,0.97)',
    borderRadius: Radii.card,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.hairline,
  },
  unlockMeta: {
    flex: 1,
    paddingLeft: 4,
  },
  unlockPrice: {
    ...Type.price,
    color: Colors.goldLight,
  },
  unlockSub: {
    ...Type.caption,
    color: Colors.muted,
  },
  unlockBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.card,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockBtnText: {
    ...Presets.primaryBtnText,
    fontSize: 13,
  },
});