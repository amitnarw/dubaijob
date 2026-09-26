import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';

import { Colors, Radii, Spacing, Type, ChapterCardThemes } from '@/constants/theme';
import { Springs, Transitions, AnimatedPressableScale } from '@/constants/animations';
import { COURSE_CHAPTERS, chapterTitle } from '@/data/courseChapters';
import { COURSE_VIDEOS, CourseVideo } from '@/data/courseVideos';
import { useLocale } from '@/i18n/LocaleContext';
import { usePurchases } from '@/context/PurchaseContext';
import { usePlayer } from '@/context/PlayerContext';
import { PaymentBottomSheet, PaymentItem } from '@/components/PaymentBottomSheet';

const CHAPTER_THEME_KEYS = ['mint', 'lavender', 'peach', 'iceBlue', 'yellow'] as const;

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lang, t } = useLocale();
  const { entitlements } = usePurchases();
  const { playTrack } = usePlayer();

  const [paymentSheetVisible, setPaymentSheetVisible] = useState(false);
  const [selectedPaymentItem, setSelectedPaymentItem] = useState<PaymentItem | null>(null);

  // Find chapter
  const chapterIndex = COURSE_CHAPTERS.findIndex((c) => c.id === id);
  const chapter = COURSE_CHAPTERS[chapterIndex >= 0 ? chapterIndex : 0];

  // Theme matching
  const themeKey = CHAPTER_THEME_KEYS[chapterIndex % CHAPTER_THEME_KEYS.length] || 'mint';
  const theme = ChapterCardThemes[themeKey];

  // Filter lessons for this chapter
  const lessons = useMemo(() => {
    return COURSE_VIDEOS.filter((v) => v.chapterId === chapter.id);
  }, [chapter.id]);

  const freeCount = lessons.filter((l) => l.freePreview).length;
  const isUnlocked = entitlements.course;

  const handleLessonPress = (lesson: CourseVideo) => {
    if (lesson.freePreview || isUnlocked) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      playTrack({
        id: lesson.id,
        title: lesson.title[lang] ?? lesson.title.en,
        episode: chapterTitle(chapter, lang),
        videoId: lesson.id,
        duration: lesson.duration,
      });
      router.push({ pathname: '/video/[id]', params: { id: lesson.id } });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      setSelectedPaymentItem({
        name: `${chapterTitle(chapter, lang)} - Full Access`,
        price: 126,
        currency: '$',
        description: 'Complete Masterclass & Dubai Placement Kit',
      });
      setPaymentSheetVisible(true);
    }
  };

  const handleUnlockPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setSelectedPaymentItem({
      name: `${chapterTitle(chapter, lang)} - Full Access`,
      price: 126,
      currency: '$',
      description: 'Complete Masterclass & Dubai Placement Kit',
    });
    setPaymentSheetVisible(true);
  };

  return (
    <View style={styles.root}>
      {/* Top Navigation Bar */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 16) }]}>
        <AnimatedPressableScale
          onPress={() => router.back()}
          style={styles.iconCircleBtn}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </AnimatedPressableScale>

        <Text style={styles.navTitle} numberOfLines={1}>
          {chapterTitle(chapter, lang)}
        </Text>

        <AnimatedPressableScale
          onPress={() => Haptics.selectionAsync()}
          style={styles.iconCircleBtn}
        >
          <Ionicons name="share-outline" size={20} color="#FFFFFF" />
        </AnimatedPressableScale>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 130 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card Banner (Exact Reference: screenshot_191152.png & course_details_masterclass.png) */}
        <Animated.View entering={Transitions.fadeDown(0)} style={[styles.heroCard, { backgroundColor: theme.bg }]}>
          {/* Subtle decorative background art element */}
          <View style={styles.heroArtworkShape}>
            <Ionicons name="sparkles" size={120} color="rgba(255, 255, 255, 0.25)" />
          </View>

          <View style={styles.heroContent}>
            <View style={styles.heroHeaderRow}>
              <View style={[styles.tagBadge, { backgroundColor: 'rgba(0, 0, 0, 0.12)' }]}>
                <Text style={[styles.tagBadgeText, { color: theme.text }]}>
                  CHAPTER {chapterIndex + 1} • {theme.tag}
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={13} color="#E8D06A" />
                <Text style={styles.ratingText}>4.9</Text>
              </View>
            </View>

            <Text style={[styles.heroTitle, { color: theme.text }]}>
              {chapterTitle(chapter, lang)}
            </Text>

            <Text style={[styles.heroSub, { color: theme.textMuted }]}>
              {chapter.hindiTitle}
            </Text>

            <Text style={[styles.heroDesc, { color: theme.text }]}>
              {chapter.description}
            </Text>

            {/* Meta chips row */}
            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Ionicons name="time-outline" size={14} color={theme.text} />
                <Text style={[styles.metaChipText, { color: theme.text }]}>
                  {lessons.length * 15} mins
                </Text>
              </View>
              <View style={styles.metaChip}>
                <Ionicons name="book-outline" size={14} color={theme.text} />
                <Text style={[styles.metaChipText, { color: theme.text }]}>
                  {lessons.length} Lessons
                </Text>
              </View>
              {freeCount > 0 && (
                <View style={[styles.metaChip, { backgroundColor: '#F2A28C' }]}>
                  <Ionicons name="flash" size={13} color="#1A1A1A" />
                  <Text style={[styles.metaChipText, { color: '#1A1A1A', fontFamily: 'Inter-Bold' }]}>
                    {freeCount} Free Videos
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Section Header: Course Preview */}
        <Animated.View entering={Transitions.fadeDown(60)} style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>Course Preview</Text>
          <View style={styles.freeBadgePill}>
            <Ionicons name="flash" size={12} color="#D96A38" />
            <Text style={styles.freeBadgePillText}>{freeCount} Free Videos</Text>
          </View>
        </Animated.View>

        {/* Lesson Rows List */}
        {lessons.map((lesson, idx) => {
          const isFree = lesson.freePreview;
          return (
            <Animated.View
              key={lesson.id}
              entering={Transitions.fadeDown(100 + idx * 45)}
            >
              <AnimatedPressableScale
                onPress={() => handleLessonPress(lesson)}
                style={styles.lessonRow}
              >
                {/* Left indicator icon */}
                <View
                  style={[
                    styles.lessonIconBadge,
                    { backgroundColor: isFree ? '#F8C4AE' : '#2A2A2A' },
                  ]}
                >
                  <Ionicons
                    name={isFree ? 'play' : 'lock-closed'}
                    size={16}
                    color={isFree ? '#542112' : Colors.muted}
                  />
                </View>

                {/* Info */}
                <View style={styles.lessonInfo}>
                  <View style={styles.lessonTitleRow}>
                    <Text style={styles.lessonTitle} numberOfLines={1}>
                      {lesson.title[lang] ?? lesson.title.en}
                    </Text>
                    {isFree && (
                      <View style={styles.lessonFreePill}>
                        <Text style={styles.lessonFreePillText}>Free</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.lessonMeta}>
                    {lesson.duration} Minutes • Video + Blueprint
                  </Text>
                </View>

                {/* Right Action Button */}
                <View style={styles.lessonActionBtn}>
                  <Ionicons
                    name={isFree ? 'play-circle' : 'chevron-forward'}
                    size={26}
                    color={isFree ? '#7BC96F' : '#555555'}
                  />
                </View>
              </AnimatedPressableScale>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Floating Bottom Sticky Action Bar (Exact Reference: screenshot_191152.png) */}
      <View
        style={[
          styles.stickyBottomBar,
          { paddingBottom: Math.max(insets.bottom, 14) },
        ]}
      >
        <AnimatedPressableScale
          onPress={handleUnlockPress}
          style={styles.swipeUnlockPill}
        >
          <View style={styles.unlockIconCircle}>
            <Ionicons name="lock-closed" size={16} color="#121212" />
          </View>
          <Text style={styles.unlockText}>Swipe to unlock {'>>>'}</Text>
          <Text style={styles.unlockPrice}>$126</Text>
        </AnimatedPressableScale>
      </View>

      {/* Payment Bottom Sheet */}
      <PaymentBottomSheet
        visible={paymentSheetVisible}
        onClose={() => setPaymentSheetVisible(false)}
        item={selectedPaymentItem}
        onSuccess={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#121212',
    zIndex: 10,
  },
  iconCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  heroCard: {
    borderRadius: 28,
    padding: 22,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 26,
  },
  heroArtworkShape: {
    position: 'absolute',
    right: -15,
    top: -15,
    opacity: 0.6,
  },
  heroContent: {
    zIndex: 1,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  heroTitle: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    marginBottom: 12,
  },
  heroDesc: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    opacity: 0.9,
    marginBottom: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radii.pill,
  },
  metaChipText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  freeBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FBE3D3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  freeBadgePillText: {
    fontSize: 11.5,
    fontFamily: 'Inter-Bold',
    color: '#D96A38',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 14,
  },
  lessonIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    flex: 1,
  },
  lessonFreePill: {
    backgroundColor: '#F8A88E',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lessonFreePillText: {
    fontSize: 10.5,
    fontFamily: 'Inter-Bold',
    color: '#121212',
  },
  lessonMeta: {
    fontSize: 12.5,
    fontFamily: 'Inter-Regular',
    color: Colors.muted,
  },
  lessonActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: 'rgba(18, 18, 18, 0.94)',
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  swipeUnlockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7BC96F',
    borderRadius: Radii.pill,
    height: 56,
    paddingHorizontal: 10,
    shadowColor: '#7BC96F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  unlockIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockText: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#121212',
  },
  unlockPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#121212',
    marginRight: 10,
  },
});
