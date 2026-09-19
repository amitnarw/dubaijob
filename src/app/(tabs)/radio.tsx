import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ConcentricArtwork } from '@/components/podcast/ConcentricArtwork';
import { usePlayer } from '@/context/PlayerContext';

const RADIO_STATIONS = [
  { id: 'radio-1', title: 'ORF Ö1 Live', desc: 'Cultural and scientific broadcasts', theme: 'peach' as const },
  { id: 'radio-2', title: 'Dubai Pulse FM', desc: 'Job updates and global hits', theme: 'teal' as const },
  { id: 'radio-3', title: 'Acoustic Waves', desc: 'Chill ambient beats & stories', theme: 'purple' as const },
];

export default function RadioScreen() {
  const insets = useSafeAreaInsets();
  const { playTrack } = usePlayer();

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 4, paddingBottom: 210 },
        ]}
      >
        <Text style={styles.title}>Radio</Text>
        <Text style={styles.subtitle}>Live internet radio & audio streams</Text>

        {RADIO_STATIONS.map((station) => (
          <Pressable
            key={station.id}
            onPress={() =>
              playTrack({
                id: station.id,
                title: station.title,
                episode: station.desc,
                theme: station.theme,
                badgeText: station.title,
              })
            }
            style={({ pressed }) => [
              styles.stationCard,
              { transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
          >
            <ConcentricArtwork
              size={56}
              theme={station.theme}
              borderRadius={16}
              showSpeakerBadge={true}
            />
            <View style={styles.stationInfo}>
              <Text style={styles.stationTitle}>{station.title}</Text>
              <Text style={styles.stationDesc}>{station.desc}</Text>
            </View>
            <Ionicons name="radio" size={20} color="#9B9BA5" />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#111215',
  },
  scroll: {
    paddingHorizontal: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#8E8E98',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },
  stationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181D',
    borderRadius: 24,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  stationInfo: {
    flex: 1,
    marginLeft: 14,
  },
  stationTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  stationDesc: {
    color: '#8E8E98',
    fontSize: 12,
    marginTop: 2,
  },
});
