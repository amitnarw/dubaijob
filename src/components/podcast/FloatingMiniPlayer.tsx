import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, {
  FadeInUp,
  FadeOutDown,
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
import { Colors } from '@/constants/theme';

interface FloatingMiniPlayerProps {
  bottomOffset?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FloatingMiniPlayer: React.FC<FloatingMiniPlayerProps> = ({
  bottomOffset = 80,
}) => {
  const { currentTrack, isPlaying, isVisible, progress, togglePlay, closePlayer } = usePlayer();
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
  }, [isPlaying, pulseScale]);

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

  const handleToggle = (e: any) => {
    e.stopPropagation?.();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    playScale.value = withSpring(0.85, { damping: 14, stiffness: 400 });
    setTimeout(() => {
      playScale.value = withSpring(1, { damping: 14, stiffness: 400 });
    }, 70);
    togglePlay();
  };

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    closePlayer();
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutDown.duration(200)}
      style={[styles.floatingWrapper, { bottom: bottomOffset }]}
    >
      <Pressable
        onPress={handleOpenVideo}
        onLongPress={handleDismiss}
        style={styles.container}
      >
        <View
          style={styles.inner}
        >
          {/* Left Artwork Thumbnail (bigger, rounded) with speaker badge */}
          <Animated.View style={pulseStyle}>
            <ConcentricArtwork
              size={44}
              theme={currentTrack.theme || 'blue'}
              borderRadius={10}
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

          {/* Right Play/Pause Button: Large white circular button */}
          <AnimatedPressable
            onPress={handleToggle}
            hitSlop={8}
            style={[styles.playButton, playBtnStyle]}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={20}
              color="#000000"
              style={isPlaying ? {} : { marginLeft: 2 }}
            />
          </AnimatedPressable>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 99,
  },
  container: {
    height: 64,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.elevated,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  centerInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#8E8E98',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
