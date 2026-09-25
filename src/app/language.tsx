import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Type, Presets, Spacing } from '@/constants/theme';
import { LANGUAGES, useLocale } from '@/i18n/LocaleContext';

export default function LanguageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lang, setLang, t } = useLocale();
  const [selected, setSelected] = React.useState(lang);

  const pick = (code: typeof selected) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSelected(code);
  };

  const confirm = () => {
    setLang(selected);
    router.back();
  };

  return (
    <View style={styles.root}>
      <View style={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 40 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <Animated.View entering={FadeInDown.duration(350)} style={styles.header}>
          <Text style={styles.title}>{t('lang_title')}</Text>
          <Text style={styles.sub}>{t('lang_sub')}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(350).delay(80)} style={styles.list}>
          {LANGUAGES.map((l) => {
            const active = l.code === selected;
            return (
              <Pressable
                key={l.code}
                onPress={() => pick(l.code)}
                style={[styles.option, active && styles.optionActive]}>
                <Text style={[styles.native, active && { color: Colors.goldLight }]}>
                  {l.nativeName}
                </Text>
                <Text style={styles.english}>{l.englishName}</Text>
                {active && <Ionicons name="checkmark-circle" size={22} color={Colors.gold} />}
              </Pressable>
            );
          })}
        </Animated.View>

        <Text style={styles.note}>{t('lang_note_videos')}</Text>

        <Pressable onPress={confirm} style={styles.cta}>
          <Text style={styles.ctaText}>{t('lang_continue')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  scroll: {
    paddingHorizontal: Spacing.screen,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: Spacing.lg,
  },
  title: {
    ...Type.pageTitle,
    color: Colors.text,
  },
  sub: {
    ...Type.body,
    color: Colors.muted,
    marginTop: Spacing.xs,
  },
  list: {
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  option: {
    ...Presets.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionActive: {
    backgroundColor: Colors.goldTint,
  },
  native: {
    ...Type.cardTitle,
    color: Colors.text,
    flex: 1,
  },
  english: {
    ...Type.caption,
    color: Colors.faint,
    marginRight: Spacing.sm,
  },
  note: {
    ...Type.small,
    color: Colors.faint,
    marginTop: Spacing.section,
    textAlign: 'center',
  },
  cta: {
    ...Presets.primaryBtn,
    marginTop: Spacing.lg,
  },
  ctaText: {
    ...Presets.primaryBtnText,
    fontSize: 15,
  },
});