import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { CATEGORY_DETAILS, PodcastItem } from '@/data/podcastData';
import { Colors } from '@/constants/theme';
import { ConcentricArtwork } from '@/components/podcast/ConcentricArtwork';
import { FloatingMiniPlayer } from '@/components/podcast/FloatingMiniPlayer';
import { AnimatedPressableCard } from '@/components/podcast/AnimatedPressableCard';
import { usePlayer } from '@/context/PlayerContext';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { playTrack } = usePlayer();

  const categoryId = typeof id === 'string' ? id.toLowerCase() : 'basics';
  const categoryData = CATEGORY_DETAILS[categoryId] || CATEGORY_DETAILS.basics;

  // 2 columns calculation
  const horizontalPadding = 16;
  const columnGap = 14;
  const cardWidth = (width - horizontalPadding * 2 - columnGap) / 2;

  const handleSelectTrack = (item: PodcastItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    playTrack({
      id: item.id,
      title: item.title,
      episode: item.episode || item.broadcaster || 'Featured Lesson',
      theme: item.theme,
      badgeText: item.badgeText,
      duration: item.duration,
      videoId: item.videoId || item.id,
    });

    if (item.videoId) {
      router.push({
        pathname: '/video/[id]',
        params: { id: item.videoId },
      });
    }
  };

  // Icon mapping from premium Ionicons library
  const getCategoryIcon = () => {
    switch (categoryId) {
      case 'cv':
        return { name: 'document-text' as const, color: '#FF6B6B' };
      case 'visa':
        return { name: 'airplane' as const, color: '#38A3A5' };
      case 'jobhunt':
        return { name: 'briefcase' as const, color: '#D4AF37' };
      case 'attestation':
        return { name: 'shield-checkmark' as const, color: '#9B5DE5' };
      default:
        return { name: 'globe' as const, color: '#4ECDC4' };
    }
  };

  const iconInfo = getCategoryIcon();

  return (
    <View style={styles.root}>
      <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 4,
            paddingBottom: 130 + insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Back Navigation Bar */}
        <Animated.View
          entering={FadeInDown.duration(300).springify()}
          style={styles.navBar}
        >
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              router.back();
            }}
            hitSlop={12}
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
        </Animated.View>

        {/* Hero Header Icon & Title */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(60).springify()}
          style={styles.heroSection}
        >
          <View style={styles.heroIconBadge}>
            <LinearGradient
              colors={['#24202B', '#16141D']}
              style={StyleSheet.absoluteFill}
            />
            <Ionicons name={iconInfo.name} size={30} color={iconInfo.color} />
          </View>

          <Text style={styles.heroTitle}>{categoryData.title}</Text>
          <Text style={styles.heroSubtitle}>{categoryData.subtitle}</Text>
        </Animated.View>

        {/* 2-Column Podcast/Lesson Cards Grid */}
        <View style={styles.gridContainer}>
          {categoryData.episodes.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.duration(400).delay(index * 80).springify()}
              style={{ width: cardWidth }}
            >
              <AnimatedPressableCard
                onPress={() => handleSelectTrack(item)}
                style={styles.gridCard}
                scaleTo={0.95}
              >
                <ConcentricArtwork
                  size={cardWidth}
                  theme={item.theme}
                  badgeText={item.badgeText}
                  borderRadius={20}
                  showSpeakerBadge={true}
                />

                <View style={styles.metaContainer}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemBroadcaster} numberOfLines={1}>
                    {item.duration} · {item.broadcaster || 'DubaiJob'}
                  </Text>
                </View>
              </AnimatedPressableCard>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      </View>

      {/* Persistent Floating Mini-Player docked at the bottom */}
      <FloatingMiniPlayer
        bottomOffset={Math.max(insets.bottom, 16) + 12}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  scrollContent: {
    paddingHorizontal: 16,
    zIndex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  heroIconBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#8E8E98',
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: 28,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 22,
  },
  gridCard: {
    marginBottom: 10,
  },
  metaContainer: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: -0.2,
  },
  itemBroadcaster: {
    color: '#8E8E98',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 3,
  },
});
