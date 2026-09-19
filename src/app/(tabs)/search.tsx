import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TOP_PODCASTS } from '@/data/podcastData';
import { ConcentricArtwork } from '@/components/podcast/ConcentricArtwork';
import { usePlayer } from '@/context/PlayerContext';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const { playTrack } = usePlayer();

  const filtered = TOP_PODCASTS.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.show?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 4, paddingBottom: 210 },
        ]}
      >
        <Text style={styles.title}>Search</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#8E8E98" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search podcasts, shows, topics..."
            placeholderTextColor="#707078"
            style={styles.input}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#8E8E98" />
            </Pressable>
          )}
        </View>

        <Text style={styles.sectionTitle}>
          {query ? 'Search Results' : 'Recommended Shows'}
        </Text>

        {filtered.map((item) => (
          <Pressable
            key={item.id}
            onPress={() =>
              playTrack({
                id: item.id,
                title: item.title,
                episode: item.show || 'Recommended',
                theme: item.theme,
                badgeText: item.badgeText,
              })
            }
            style={({ pressed }) => [
              styles.itemRow,
              { transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
          >
            <ConcentricArtwork
              size={50}
              theme={item.theme}
              borderRadius={14}
              showSpeakerBadge={true}
            />
            <View style={styles.itemMeta}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemShow} numberOfLines={1}>
                {item.show}
              </Text>
            </View>
            <Ionicons name="play-circle" size={24} color="#FFFFFF" />
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
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181D',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#8E8E98',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 14,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181D',
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  itemMeta: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  itemShow: {
    color: '#8E8E98',
    fontSize: 12,
    marginTop: 2,
  },
});
