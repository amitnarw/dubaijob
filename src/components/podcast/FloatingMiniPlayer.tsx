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
        withTiming(1.03, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
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
    playScale.value = withSpring(0.85, { damping: 14, stiffness: 400 });
    setTimeout(() => {
      playScale.value = withSpring(1, { damping: 14, stiffness: 400 });
    }, 70);
    togglePlay();
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(350)}
      style={[styles.floatingWrapper, { bottom: bottomOffset }]}
    >
      <Pressable onPress={handleOpenVideo} style={styles.container}>
        {/* Left Artwork Thumbnail with subtle speaker badge */}
        <Animated.View style={pulseStyle}>
          <ConcentricArtwork
            size={44}
            theme={currentTrack.theme || 'blue'}
            borderRadius={12}
            showSpeakerBadge={true}
          />
        </Animated.View>

        {/* Center Track Info & Slim Progress Bar */}
        <View style={styles.centerInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {currentTrack.episode}
          </Text>

          {/* Scrubber Progress Bar directly below subtitle */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(100, Math.max(5, progress * 100))}%` },
              ]}
            />
          </View>
        </View>

        {/* Right Play/Pause Button: Pure white circle with pitch black icon */}
        <AnimatedPressable
          onPress={handleToggle}
          hitSlop={8}
          style={[styles.playButton, playBtnStyle]}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={16}
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
    left: 14,
    right: 14,
    zIndex: 99,
  },
  container: {
    height: 62,
    backgroundColor: '#1D1E24',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  centerInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: '#8E8E98',
    fontSize: 11.5,
    fontFamily: 'Inter-Regular',
    marginTop: 1,
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#35363F',
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
