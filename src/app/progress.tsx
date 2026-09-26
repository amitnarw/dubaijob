import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';

import { Colors, Radii, Spacing, Type } from '@/constants/theme';
import { Transitions, AnimatedPressableScale } from '@/constants/animations';
import { useLocale } from '@/i18n/LocaleContext';

type TimeRange = 'Weekly' | 'Month' | 'Year';

export default function ProgressScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLocale();
  const [timeRange, setTimeRange] = useState<TimeRange>('Weekly');

  const handleRangeChange = (range: TimeRange) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setTimeRange(range);
  };

  return (
    <View style={styles.root}>
      {/* Top Header */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 16) }]}>
        <AnimatedPressableScale
          onPress={() => router.back()}
          style={styles.iconCircleBtn}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </AnimatedPressableScale>

        <Text style={styles.headerTitle}>Learning Pathway Status</Text>

        <AnimatedPressableScale
          onPress={() => Haptics.selectionAsync()}
          style={styles.iconCircleBtn}
        >
          <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
        </AnimatedPressableScale>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 60 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Metric Cards Row (Exact Reference: screenshot_201620.png) */}
        <Animated.View entering={Transitions.fadeDown(0)} style={styles.metricsRow}>
          {/* Achieved Card (Mint / Sage) */}
          <View style={[styles.metricCard, { backgroundColor: '#D2EBE0' }]}>
            <View style={styles.metricCardTop}>
              <View style={styles.whiteIconCircle}>
                <Ionicons name="checkmark-circle" size={20} color="#2A7D5B" />
              </View>
              <View style={styles.arrowIconCircle}>
                <Ionicons name="arrow-up-outline" size={15} color="#123826" style={{ transform: [{ rotate: '45deg' }] }} />
              </View>
            </View>
            <Text style={[styles.metricLabel, { color: '#2A7D5B' }]}>Achieved</Text>
            <Text style={[styles.metricValue, { color: '#123826' }]}>12</Text>
          </View>

          {/* Final Score Card (Soft Yellow) */}
          <View style={[styles.metricCard, { backgroundColor: '#FDF1BA' }]}>
            <View style={styles.metricCardTop}>
              <View style={styles.whiteIconCircle}>
                <Ionicons name="trophy" size={19} color="#B88F0E" />
              </View>
              <View style={styles.arrowIconCircle}>
                <Ionicons name="arrow-up-outline" size={15} color="#443507" style={{ transform: [{ rotate: '45deg' }] }} />
              </View>
            </View>
            <Text style={[styles.metricLabel, { color: '#8F6E0A' }]}>Final Score</Text>
            <Text style={[styles.metricValue, { color: '#443507' }]}>60</Text>
          </View>
        </Animated.View>

        {/* Time Filter Switcher (Weekly / Month / Year) */}
        <Animated.View entering={Transitions.fadeDown(60)} style={styles.filterSwitcher}>
          {(['Weekly', 'Month', 'Year'] as TimeRange[]).map((r) => {
            const active = timeRange === r;
            return (
              <AnimatedPressableScale
                key={r}
                onPress={() => handleRangeChange(r)}
                style={[styles.filterPill, active && styles.filterPillActive]}
              >
                <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                  {r}
                </Text>
              </AnimatedPressableScale>
            );
          })}
        </Animated.View>

        {/* Large Progress Card with Circular Speedometer Arc (Exact Reference: screenshot_201620.png) */}
        <Animated.View entering={Transitions.fadeDown(120)} style={styles.progressCard}>
          {/* Card Top Row */}
          <View style={styles.progressCardHeader}>
            <View style={styles.progressHeaderLeft}>
              <View style={styles.playIconBadge}>
                <Ionicons name="play" size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.progressHeaderTitle}>Progress</Text>
            </View>
            <AnimatedPressableScale style={styles.optionsBtn}>
              <Ionicons name="ellipsis-horizontal" size={18} color="#221C4E" />
            </AnimatedPressableScale>
          </View>

          {/* Speedometer Gauge Representation */}
          <View style={styles.gaugeContainer}>
            <View style={styles.gaugeArcOuter}>
              {/* Semicircular Arc Track */}
              <View style={styles.gaugeTrackBackground} />
              <View style={styles.gaugeTrackActive} />

              {/* Center Score Display */}
              <View style={styles.gaugeCenter}>
                <Text style={styles.gaugeScore}>200</Text>
                <Text style={styles.gaugeScoreLabel}>Score</Text>
              </View>
            </View>
          </View>

          {/* Breakdown Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <View style={[styles.statDot, { backgroundColor: '#34D399' }]} />
                <Text style={styles.statLabel}>Lessons completed</Text>
              </View>
              <Text style={styles.statValue}>17/25</Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <View style={[styles.statDot, { backgroundColor: '#F97316' }]} />
                <Text style={styles.statLabel}>Quizzes cleared</Text>
              </View>
              <Text style={styles.statValue}>5/6</Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <View style={[styles.statDot, { backgroundColor: '#3B82F6' }]} />
                <Text style={styles.statLabel}>ATS CV Verified</Text>
              </View>
              <Text style={[styles.statValue, { color: '#166534', fontFamily: 'Inter-Bold' }]}>
                100% Passed
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Next Milestone Card */}
        <Animated.View entering={Transitions.fadeDown(180)} style={styles.nextMilestoneCard}>
          <View style={styles.milestoneHeader}>
            <Text style={styles.milestoneOverline}>UP NEXT IN PATHWAY</Text>
            <Text style={styles.milestoneTitle}>Chapter 4: Walk-in Interview Drives</Text>
            <Text style={styles.milestoneSub}>
              Direct recruiter directories, WhatsApp timing rules, and on-ground tactics.
            </Text>
          </View>
          <AnimatedPressableScale
            onPress={() => router.push({ pathname: '/chapter/[id]', params: { id: 'ch-4' } })}
            style={styles.continueBtn}
          >
            <Text style={styles.continueBtnText}>Continue Learning</Text>
            <Ionicons name="arrow-forward" size={17} color="#121212" />
          </AnimatedPressableScale>
        </Animated.View>
      </ScrollView>
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
    paddingBottom: 14,
    backgroundColor: '#121212',
  },
  iconCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    borderRadius: 24,
    padding: 18,
    position: 'relative',
  },
  metricCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  whiteIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  arrowIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    lineHeight: 38,
  },
  filterSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: Radii.pill,
    padding: 4,
    marginBottom: 18,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.pill,
  },
  filterPillActive: {
    backgroundColor: '#FFFFFF',
  },
  filterPillText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: Colors.muted,
  },
  filterPillTextActive: {
    color: '#121212',
  },
  progressCard: {
    backgroundColor: '#DFDBF5',
    borderRadius: 30,
    padding: 22,
    marginBottom: 20,
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#221C4E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressHeaderTitle: {
    fontSize: 17,
    fontFamily: 'Inter-Bold',
    color: '#221C4E',
  },
  optionsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  gaugeArcOuter: {
    width: 200,
    height: 120,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'hidden',
  },
  gaugeTrackBackground: {
    position: 'absolute',
    top: 0,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 16,
    borderColor: '#C7BFE8',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  gaugeTrackActive: {
    position: 'absolute',
    top: 0,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 16,
    borderColor: '#FDF1BA',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  gaugeCenter: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  gaugeScore: {
    fontSize: 34,
    fontFamily: 'Inter-Bold',
    color: '#221C4E',
    letterSpacing: -1,
  },
  gaugeScoreLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#554C87',
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 20,
    padding: 16,
    gap: 12,
    marginTop: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statLabel: {
    fontSize: 13.5,
    fontFamily: 'Inter-Medium',
    color: '#221C4E',
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#221C4E',
  },
  nextMilestoneCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  milestoneHeader: {
    marginBottom: 16,
  },
  milestoneOverline: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#7BC96F',
    letterSpacing: 1,
    marginBottom: 6,
  },
  milestoneTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  milestoneSub: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: Colors.muted,
    lineHeight: 18,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7BC96F',
    borderRadius: Radii.pill,
    height: 50,
  },
  continueBtnText: {
    fontSize: 14.5,
    fontFamily: 'Inter-Bold',
    color: '#121212',
  },
});
