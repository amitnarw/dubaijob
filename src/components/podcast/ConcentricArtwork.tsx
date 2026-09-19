import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export type ConcentricTheme = 'peach' | 'teal' | 'crimson' | 'purple' | 'blue';

interface ConcentricArtworkProps {
  size?: number;
  theme?: ConcentricTheme;
  badgeText?: string;
  showSpeakerBadge?: boolean;
  borderRadius?: number;
  style?: ViewStyle;
}

const THEME_CONFIG: Record<
  ConcentricTheme,
  {
    gradient: [string, string, ...string[]];
    centerColor: string;
    ring1: string;
    ring2: string;
    ring3: string;
  }
> = {
  peach: {
    gradient: ['#FF6F61', '#FF9E7D', '#FFB088'],
    centerColor: '#FFA500',
    ring1: 'rgba(255, 230, 210, 0.45)',
    ring2: 'rgba(255, 120, 80, 0.35)',
    ring3: 'rgba(255, 80, 50, 0.25)',
  },
  teal: {
    gradient: ['#178070', '#2EC4B6', '#5EEAD4'],
    centerColor: '#0F766E',
    ring1: 'rgba(167, 243, 208, 0.45)',
    ring2: 'rgba(46, 196, 182, 0.35)',
    ring3: 'rgba(15, 118, 110, 0.28)',
  },
  crimson: {
    gradient: ['#A4161A', '#E63946', '#FF6B6B'],
    centerColor: '#800F2F',
    ring1: 'rgba(255, 200, 210, 0.45)',
    ring2: 'rgba(230, 57, 70, 0.38)',
    ring3: 'rgba(164, 22, 26, 0.30)',
  },
  purple: {
    gradient: ['#5E2CA5', '#9B5DE5', '#D8B4FE'],
    centerColor: '#4A1D96',
    ring1: 'rgba(233, 213, 255, 0.45)',
    ring2: 'rgba(155, 93, 229, 0.35)',
    ring3: 'rgba(94, 44, 165, 0.28)',
  },
  blue: {
    gradient: ['#1D4ED8', '#3B82F6', '#93C5FD'],
    centerColor: '#1E40AF',
    ring1: 'rgba(219, 234, 254, 0.45)',
    ring2: 'rgba(59, 130, 246, 0.35)',
    ring3: 'rgba(29, 78, 216, 0.28)',
  },
};

export const ConcentricArtwork: React.FC<ConcentricArtworkProps> = ({
  size = 140,
  theme = 'peach',
  badgeText,
  showSpeakerBadge = true,
  borderRadius = 22,
  style,
}) => {
  const config = THEME_CONFIG[theme] || THEME_CONFIG.peach;
  const isMini = size < 70;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={config.gradient}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Concentric rings radiating outward */}
      <View
        style={[
          styles.ring,
          {
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: (size * 1.5) / 2,
            borderColor: config.ring3,
            borderWidth: Math.max(2, size * 0.08),
            top: size * 0.1,
            right: -size * 0.3,
          },
        ]}
      />
      <View
        style={[
          styles.ring,
          {
            width: size * 1.05,
            height: size * 1.05,
            borderRadius: (size * 1.05) / 2,
            borderColor: config.ring2,
            borderWidth: Math.max(3, size * 0.09),
            top: size * 0.25,
            right: -size * 0.15,
          },
        ]}
      />
      <View
        style={[
          styles.ring,
          {
            width: size * 0.65,
            height: size * 0.65,
            borderRadius: (size * 0.65) / 2,
            borderColor: config.ring1,
            borderWidth: Math.max(4, size * 0.1),
            top: size * 0.4,
            right: -size * 0.02,
          },
        ]}
      />
      <View
        style={[
          styles.centerCircle,
          {
            width: size * 0.32,
            height: size * 0.32,
            borderRadius: (size * 0.32) / 2,
            backgroundColor: config.centerColor,
            top: size * 0.52,
            right: size * 0.12,
          },
        ]}
      />

      {/* Top right speaker watermark badge */}
      {showSpeakerBadge && (
        <View
          style={[
            styles.speakerBadge,
            {
              top: isMini ? 4 : 8,
              right: isMini ? 4 : 8,
              padding: isMini ? 2 : 4,
            },
          ]}
        >
          <Ionicons
            name="volume-medium"
            size={isMini ? 10 : 16}
            color="rgba(255, 255, 255, 0.9)"
          />
        </View>
      )}

      {/* Bottom badge overlay text */}
      {badgeText && !isMini && (
        <View style={styles.textBadge}>
          <Text style={styles.badgeLabel} numberOfLines={1}>
            {badgeText}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
  },
  centerCircle: {
    position: 'absolute',
    opacity: 0.85,
  },
  speakerBadge: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.26)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBadge: {
    position: 'absolute',
    bottom: 9,
    left: 9,
    maxWidth: '85%',
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 7,
  },
  badgeLabel: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
