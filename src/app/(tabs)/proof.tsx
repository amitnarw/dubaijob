import { useCallback } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Type, Radii, Spacing } from '@/constants/theme';
import { HERO_STORY, REVIEWS, SUCCESS_IMAGES, TIMELINE } from '@/data/reviews';
import { STATS } from '@/data/offers';
import { GoldButton } from '@/components/GoldButton';
import { ReviewCard } from '@/components/ReviewCard';
import { StatBand } from '@/components/StatBand';
import { useLocale } from '@/i18n/LocaleContext';
import { noteTabFocus } from '@/services/tabFocus';

const W = Dimensions.get('window').width;

export default function ProofTab() {
  const { t } = useLocale();

  useFocusEffect(
    useCallback(() => {
      noteTabFocus('proof');
    }, []),
  );

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.hero}>{t('proof_hero')}</Text>

        <StatBand
          stats={[
            { value: `${STATS.students.toLocaleString('en-IN')}+`, label: t('proof_students') },
            { value: `${STATS.rating}★`, label: `${t('proof_rating')} · ${STATS.reviewCount.toLocaleString('en-IN')} ${t('proof_reviews_suffix')}` },
            { value: `${STATS.years}+`, label: t('proof_years') },
          ]}
        />

        <Text style={styles.section}>{t('proof_section_reviews')}</Text>
        {REVIEWS.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}

        <Text style={styles.section}>{t('proof_section_moments')}</Text>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gallery}>
          {SUCCESS_IMAGES.map((s) => (
            <View key={s.id} style={styles.slide}>
              {s.image ? (
                <Image source={{ uri: s.image }} style={styles.slideImg} />
              ) : (
                <View style={[styles.slideImg, styles.slideFallback]}>
                  <Ionicons name="image-outline" size={40} color={Colors.gold} />
                </View>
              )}
              <Text style={styles.caption}>{s.caption}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.section}>{t('proof_section_journey')}</Text>
        <View style={styles.timeline}>
          {TIMELINE.map((ev) => (
            <View key={ev.year} style={styles.event}>
              <View style={styles.dotCol}>
                <View style={styles.dot} />
                <View style={styles.line} />
              </View>
              <View style={styles.eventBody}>
                <Text style={styles.year}>{ev.year}</Text>
                <Text style={styles.eventTitle}>{ev.title}</Text>
                <Text style={styles.eventDetail}>{ev.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.heroStory}>
          <Ionicons name="trophy" size={28} color={Colors.gold} />
          <Text style={styles.heroResult}>{HERO_STORY.result}</Text>
          <Text style={styles.heroRole}>
            {HERO_STORY.name} · {HERO_STORY.city} → {HERO_STORY.role}
          </Text>
          <Text style={styles.heroText}>{HERO_STORY.text}</Text>
          <GoldButton title={t('proof_cta')} onPress={() => router.push('/(tabs)')} style={styles.heroCta} />
        </View>
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
  section: {
    ...Type.chapterTitle,
    fontSize: 20,
    color: Colors.text,
    marginTop: Spacing.section,
    marginBottom: Spacing.md,
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
  caption: {
    ...Type.small,
    color: Colors.muted,
  },
  timeline: {
    marginTop: 4,
  },
  event: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dotCol: {
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gold,
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.trackBg,
    marginVertical: 4,
    minHeight: 24,
  },
  eventBody: {
    paddingBottom: Spacing.xl,
    flex: 1,
  },
  year: {
    ...Type.small,
    fontFamily: 'Inter-Bold',
    color: Colors.gold,
  },
  eventTitle: {
    ...Type.bodyMedium,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginTop: 2,
  },
  eventDetail: {
    ...Type.small,
    color: Colors.muted,
    marginTop: 2,
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
  heroCta: {
    width: '100%',
    marginTop: Spacing.md,
  },
});