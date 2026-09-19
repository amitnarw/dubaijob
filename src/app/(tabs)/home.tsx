import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 4, paddingBottom: 210 },
        ]}
      >
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>Welcome to DubaiJob Media & Career Stream</Text>

        <View style={styles.bannerCard}>
          <Ionicons name="sparkles" size={28} color="#D4AF37" />
          <Text style={styles.bannerTitle}>Featured Masterclasses</Text>
          <Text style={styles.bannerText}>
            Listen to daily career roadmaps, interview guides, and lifestyle podcasts.
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)')}
            style={styles.actionBtn}
          >
            <Text style={styles.actionBtnText}>Explore Podcasts</Text>
          </Pressable>
        </View>

        <View style={styles.linkRow}>
          <Pressable
            onPress={() => router.push('/packages')}
            style={styles.linkCard}
          >
            <Ionicons name="bag-handle" size={22} color="#D4AF37" />
            <Text style={styles.linkTitle}>Packages</Text>
            <Text style={styles.linkSub}>Career kits & services</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/proof')}
            style={styles.linkCard}
          >
            <Ionicons name="star" size={22} color="#D4AF37" />
            <Text style={styles.linkTitle}>Success Proof</Text>
            <Text style={styles.linkSub}>Student placements</Text>
          </Pressable>
        </View>
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
  bannerCard: {
    backgroundColor: '#18181D',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
  },
  bannerText: {
    color: '#8E8E98',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  actionBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
  },
  actionBtnText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 13,
  },
  linkRow: {
    flexDirection: 'row',
    gap: 12,
  },
  linkCard: {
    flex: 1,
    backgroundColor: '#16171D',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  linkTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },
  linkSub: {
    color: '#8E8E98',
    fontSize: 11,
    marginTop: 4,
  },
});
