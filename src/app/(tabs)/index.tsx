import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

import { AnimatedPressableScale, Transitions } from '@/constants/animations';
import { Colors, Type, Presets, Spacing, Radii, ChapterCardThemes } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { usePurchases } from '@/context/PurchaseContext';
import { useLocale } from '@/i18n/LocaleContext';
import { COURSE_CHAPTERS, chapterTitle, CourseChapter } from '@/data/courseChapters';
import { COURSE_VIDEOS } from '@/data/courseVideos';
import { noteTabFocus } from '@/services/tabFocus';

const CHAPTER_THEME_KEYS = ['mint', 'lavender', 'peach', 'iceBlue', 'yellow'] as const;

const CHAPTER_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'ch-1': 'laptop-outline',
  'ch-2': 'document-text-outline',
  'ch-3': 'airplane-outline',
  'ch-4': 'briefcase-outline',
  'ch-5': 'shield-checkmark-outline',
};

const CHAPTER_DURATIONS: Record<string, string> = {
  'ch-1': '1.2 hrs',
  'ch-2': '2.8 hrs',
  'ch-3': '1.8 hrs',
  'ch-4': '1.5 hrs',
  'ch-5': '1.4 hrs',
};

export default function MasterclassesTabScreen() {
  const insets = useSafeAreaInsets();
  const { auth } = useAuth();
  const { entitlements } = usePurchases();
  const { t, lang } = useLocale();

  useFocusEffect(
    useCallback(() => {
      noteTabFocus('course');
    }, []),
  );

  const chapters = COURSE_CHAPTERS;

  const userName = auth.status === 'signed-in' && auth.name ? auth.name.split(' ')[0] : 'Arjun';

  return (
    <View style={styles.root}>
      {/* Small seamless atmospheric glow in top-right corner with 0 hard edges */}
      <View style={styles.glowContainer} pointerEvents="none">
        <LinearGradient
          colors={[
            'rgba(245, 185, 125, 0.20)',
            'rgba(240, 180, 115, 0.10)',
            'rgba(235, 175, 110, 0.03)',
            'rgba(18, 18, 18, 0)',
          ]}
          locations={[0, 0.35, 0.7, 1]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.seamlessGlow}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 20),
            paddingBottom: insets.bottom + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Row: Hello & Demo in the same horizontal div */}
        <Animated.View entering={Transitions.fadeDown(0)} style={styles.headerRow}>
          <View style={styles.greetingRow}>
            <Text style={styles.greetingHello}>Hello, </Text>
            <Text style={styles.greetingNameBold}>{userName}</Text>
          </View>

          {/* User Profile Avatar - clean circular illustration without border or dot */}
          <AnimatedPressableScale
            onPress={() => router.push('/account')}
            style={styles.avatarButton}
          >
            <Image
              source={require('../../../assets/images/user_avatar.jpg')}
              style={styles.avatarImg}
            />
          </AnimatedPressableScale>
        </Animated.View>

        {/* Headline matching Image 1 */}
        <Animated.View entering={Transitions.fadeDown(40)} style={styles.headlineContainer}>
          <Text style={styles.headline}>Let’s Learn New{'\n'}Stuff!</Text>
        </Animated.View>

        {/* Compact Progress Pill: No left icon, no border, with circular progress ring around right arrow */}
        <Animated.View entering={Transitions.fadeDown(80)} style={styles.progressPillWrapper}>
          <AnimatedPressableScale
            onPress={() => router.push('/progress')}
            style={styles.progressPill}
          >
            <View style={styles.progressPillLeft}>
              <Text style={styles.progressBigText}>Progress</Text>
              <View style={styles.progressDivider} />
              <Text style={styles.progressSubText}>12 Achieved • 200 Score</Text>
            </View>

            {/* Circular progress ring around the arrow */}
            <View style={styles.pillRingOuter}>
              <View style={styles.pillArrowInner}>
                <Ionicons name="arrow-forward" size={14} color="#121212" />
              </View>
            </View>
          </AnimatedPressableScale>
        </Animated.View>

        {/* Vertical List of Chapter Cards (Exact Reference: image_png.png & home_chapters_progress.png) */}
        <View style={styles.chaptersList}>
          {chapters.map((chapter, idx) => {
            const actualIndex = COURSE_CHAPTERS.findIndex((c) => c.id === chapter.id);
            const themeKey = CHAPTER_THEME_KEYS[actualIndex % CHAPTER_THEME_KEYS.length];
            const theme = ChapterCardThemes[themeKey];
            const iconName = CHAPTER_ICONS[chapter.id] || 'book-outline';
            const duration = CHAPTER_DURATIONS[chapter.id] || '1.5 hrs';
            const lessonsCount = COURSE_VIDEOS.filter((v) => v.chapterId === chapter.id).length;

            return (
              <Animated.View
                key={chapter.id}
                entering={Transitions.fadeDown(160 + idx * 60)}
              >
                <AnimatedPressableScale
                  onPress={() => router.push({ pathname: '/chapter/[id]', params: { id: chapter.id } })}
                  style={[styles.chapterCard, { backgroundColor: theme.bg }]}
                >
                  {/* Card Top Row: White Circle Icon + Duration Chip */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardIconCircle}>
                      <Ionicons name={iconName} size={21} color={theme.accent} />
                    </View>
                    <View style={styles.durationChip}>
                      <Ionicons name="time-outline" size={13} color="#2A2A2A" />
                      <Text style={styles.durationChipText}>{duration}</Text>
                    </View>
                  </View>

                  {/* Overline & Titles */}
                  <Text style={[styles.chapterOverline, { color: theme.accent }]}>
                    CHAPTER {actualIndex + 1} • {theme.tag}
                  </Text>
                  <Text style={[styles.chapterTitle, { color: theme.text }]}>
                    {chapterTitle(chapter, lang)}
                  </Text>
                  <Text style={[styles.chapterDesc, { color: theme.textMuted }]} numberOfLines={2}>
                    {chapter.description}
                  </Text>

                  {/* Card Bottom Row: Progress info + Circular Action Button with Ring */}
                  <View style={styles.cardBottomRow}>
                    <View style={styles.lessonsCountWrap}>
                      <View style={[styles.statusDot, { backgroundColor: theme.accent }]} />
                      <Text style={[styles.lessonsCountText, { color: theme.text }]}>
                        {lessonsCount} Lessons • {actualIndex === 0 ? '2 Free' : 'Step ' + chapter.stepRange}
                      </Text>
                    </View>

                    {/* Circular Button with Progress Ring (Exact Reference: image_png.png) */}
                    <View style={[styles.actionRingOuter, { borderColor: theme.ring }]}>
                      <View style={styles.actionCircleInner}>
                        <Ionicons name="arrow-forward" size={16} color="#121212" />
                      </View>
                    </View>
                  </View>
                </AnimatedPressableScale>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  glowContainer: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 190,
    height: 190,
    borderRadius: 95,
    overflow: 'hidden',
    zIndex: 0,
  },
  seamlessGlow: {
    width: '100%',
    height: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  greetingHello: {
    fontSize: 22,
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    color: '#E0E0E0',
  },
  greetingNameBold: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  avatarButton: {
    overflow: 'hidden',
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  headlineContainer: {
    marginTop: 18,
    marginBottom: 16,
  },
  headline: {
    fontSize: 34,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  progressPillWrapper: {
    marginBottom: 22,
  },
  progressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    borderRadius: Radii.pill,
    paddingVertical: 7,
    paddingLeft: 18,
    paddingRight: 7,
    borderWidth: 0,
  },
  progressPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBigText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  progressDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#383838',
  },
  progressSubText: {
    fontSize: 12.5,
    fontFamily: 'Inter-Medium',
    color: '#A0A0A0',
  },
  pillRingOuter: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#7BC96F',
    borderRightColor: 'rgba(123, 201, 111, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillArrowInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7BC96F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chaptersList: {
    gap: 18,
  },
  chapterCard: {
    borderRadius: 28,
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  durationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
  },
  durationChipText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2A2A2A',
  },
  chapterOverline: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  chapterTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    lineHeight: 26,
    marginBottom: 8,
  },
  chapterDesc: {
    fontSize: 13.5,
    fontFamily: 'Inter-Regular',
    lineHeight: 19,
    marginBottom: 18,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonsCountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  lessonsCountText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  actionRingOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCircleInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});
