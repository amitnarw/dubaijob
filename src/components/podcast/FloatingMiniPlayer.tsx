import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { usePlayer } from '@/context/PlayerContext';
import { ConcentricArtwork } from './ConcentricArtwork';

interface FloatingMiniPlayerProps {
  bottomOffset?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FloatingMiniPlayer: React.FC<FloatingMiniPlayerProps> = ({
  bottomOffset = 80,
}) => {
  const { currentTrack, isPlaying, progress, togglePlay } = usePlayer();
  const playScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  // Gentle pulse animation on artwork when playing
  useEffect(() => {
    if (isPlaying) {
      pulseScale.value = withRepeat(
        withTiming(1.04, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      pulseScale.value = withSpring(1);
    }
  }, [isPlaying]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const playBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playScale.value }],
  }));

  const handleOpenVideo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (currentTrack.videoId) {
      router.push({
        pathname: '/video/[id]',
        params: { id: currentTrack.videoId },
      });
    }
  };

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    playScale.value = withSpring(0.85, { damping: 12, stiffness: 400 });
    setTimeout(() => {
      playScale.value = withSpring(1, { damping: 12, stiffness: 400 });
    }, 70);
    togglePlay();
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(450).springify().damping(16)}
      style={[styles.floatingWrapper, { bottom: bottomOffset }]}
    >
      <Pressable onPress={handleOpenVideo} style={styles.container}>
        {/* Left Artwork with smooth playback pulse */}
        <Animated.View style={pulseStyle}>
          <ConcentricArtwork
            size={46}
            theme={currentTrack.theme}
            borderRadius={14}
            showSpeakerBadge={true}
          />
        </Animated.View>

        {/* Center Track Info & Progress Track */}
        <View style={styles.centerInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {currentTrack.episode}
          </Text>

          {/* Scrubber Progress Bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(100, Math.max(0, progress * 100))}%` },
              ]}
            />
          </View>
        </View>

        {/* Right Play/Pause Button with buttery spring physics */}
        <AnimatedPressable
          onPress={handleToggle}
          hitSlop={10}
          style={[styles.playButton, playBtnStyle]}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={18}
            color="#000000"
            style={isPlaying ? {} : { marginLeft: 2 }}
          />
        </AnimatedPressable>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 99,
  },
  container: {
    height: 66,
    backgroundColor: '#1E1F25',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  centerInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#8E8E98',
    fontSize: 11,
    fontWeight: '400',
    marginTop: 1,
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#32333B',
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  playButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
});
