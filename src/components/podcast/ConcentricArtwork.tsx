import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArtworkThemes, type ArtworkThemeName } from '@/constants/theme';

export type ConcentricTheme = ArtworkThemeName;

interface ConcentricArtworkProps {
  size?: number;
  theme?: ConcentricTheme;
  badgeText?: string;
  showSpeakerBadge?: boolean;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Shine card — colored gradient square with a soft light band sweeping from
 * the top-left edge. No rings, no illustrations (see design.md).
 */
export const ConcentricArtwork: React.FC<ConcentricArtworkProps> = ({
  size = 140,
  theme = 'green',
  badgeText,
  borderRadius,
  style,
}) => {
  const config = ArtworkThemes[theme] ?? ArtworkThemes.green;
  const radius = borderRadius ?? Math.round(size * 0.22);
  const isMini = size < 70;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[config.gradient[0], config.gradient[1], config.gradient[2]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Light shine band from the top-left edge */}
      <LinearGradient
        colors={[config.shine, config.gradient[0], config.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.75, y: 0.75 }}
        style={styles.shine}
      />

      {/* Bottom-left overlay label */}
      {badgeText && !isMini && (
        <Text style={styles.overlayLabel} numberOfLines={1}>
          {badgeText}
        </Text>
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
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '85%',
    height: '55%',
    borderBottomRightRadius: 999,
  },
  overlayLabel: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    color: '#1A1A1A',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.2,
  },
});
