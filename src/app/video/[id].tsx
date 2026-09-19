import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Type, Presets, Spacing } from '@/constants/theme';
import { COURSE_VIDEOS } from '@/data/courseVideos';
import { GoldButton } from '@/components/GoldButton';
import { usePurchases } from '@/context/PurchaseContext';
import { useLocale } from '@/i18n/LocaleContext';
import { markDone } from '@/services/courseService';
import { ToastControl } from '@/services/toastControl';
import { embedHtml, thumbnailUrl, watchUrl } from '@/services/youtubeService';

export default function VideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entitlements } = usePurchases();
  const { lang, t } = useLocale();
  const [ready, setReady] = useState(false);

  const video = useMemo(
    () => COURSE_VIDEOS.find((v) => v.id === id) ?? COURSE_VIDEOS[0],
    [id],
  );
  const locked = !entitlements.course && !video.freePreview;
  const html = useMemo(() => embedHtml(video.id), [video.id]);
  const localizedTitle = video.title[lang] ?? video.title.en;

  useEffect(() => {
    ToastControl.paused = true;
    return () => {
      ToastControl.paused = false;
      markDone(video.id).catch(() => {});
    };
  }, [video.id]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {localizedTitle}
        </Text>
      </View>

      <View style={styles.player}>
        {!ready && (
          <Image source={{ uri: thumbnailUrl(video.id) }} style={styles.cover} />
        )}
        <WebView
          source={{ html }}
          style={styles.web}
          allowsFullscreenVideo
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
          onLoadEnd={() => setReady(true)}
        />
        {!ready && (
          <View style={styles.loader}>
            <ActivityIndicator color={Colors.gold} size="large" />
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.kicker}>{video.duration}</Text>
        <Text style={styles.title}>{localizedTitle}</Text>
        {lang !== 'hi' && (
          <Text style={styles.hindiNote}>{video.title.hi}</Text>
        )}
        <Text style={styles.desc}>{video.description}</Text>
        {lang !== 'hi' && <Text style={styles.langNote}>{t('course_note_nonhindi')}</Text>}
        {locked ? (
          <GoldButton
            title={t('video_locked_cta')}
            onPress={() =>
              router.push({ pathname: '/checkout/[productId]', params: { productId: 'course_full' } })
            }
            style={styles.cta}
          />
        ) : (
          <GoldButton
            title={t('course_mark_done')}
            onPress={async () => {
              await markDone(video.id).catch(() => {});
              router.back();
            }}
            style={styles.cta}
          />
        )}
        <Pressable
          onPress={() => Linking.openURL(watchUrl(video.id)).catch(() => {})}
          style={styles.ytBtn}>
          <Ionicons name="logo-youtube" size={16} color={Colors.muted} />
          <Text style={styles.ytText}>{t('video_trouble')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.screen,
    paddingTop: 52,
    paddingBottom: Spacing.md,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Type.cardTitle,
    color: Colors.text,
    flex: 1,
  },
  player: {
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  web: {
    flex: 1,
    backgroundColor: '#000',
  },
  cover: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  body: {
    padding: Spacing.screen,
    gap: Spacing.sm,
  },
  kicker: {
    ...Type.small,
    color: Colors.gold,
  },
  title: {
    ...Type.chapterTitle,
    fontSize: 24,
    color: Colors.text,
  },
  hindiNote: {
    ...Type.small,
    color: Colors.gold,
  },
  desc: {
    ...Type.body,
    color: Colors.muted,
    lineHeight: 24,
  },
  langNote: {
    ...Type.caption,
    color: Colors.faint,
    fontStyle: 'italic',
  },
  cta: {
    marginTop: Spacing.md,
  },
  ytBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.md,
    padding: Spacing.md,
  },
  ytText: {
    ...Type.small,
    color: Colors.muted,
  },
});