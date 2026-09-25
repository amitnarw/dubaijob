import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Type, Presets, Radii, Spacing } from '@/constants/theme';
import { GoldButton } from '@/components/GoldButton';
import { useAuth } from '@/context/AuthContext';
import { usePurchases } from '@/context/PurchaseContext';
import { useLocale } from '@/i18n/LocaleContext';
import { EMPTY_PROFILE, loadProfile, saveProfile, type UserProfile } from '@/services/profileService';
import { PACKAGES } from '@/data/packages';

/**
 * Account sheet (from podcast-tab avatar): edit profile, owned products,
 * Restore Purchases, language switch, Sign out. NOT a tab.
 */
export default function AccountScreen() {
  const { auth, signOut } = useAuth();
  const { entitlements, restore } = usePurchases();
  const { t, lang, setLang } = useLocale();
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (auth.status !== 'signed-in') {
      setLoading(false);
      return;
    }
    loadProfile(auth.uid)
      .then(setProfile)
      .catch(() => setProfile({ ...EMPTY_PROFILE, name: auth.name, email: auth.email }))
      .finally(() => setLoading(false));
  }, [auth]);

  if (auth.status !== 'signed-in') {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>{t('account_not_signed_in')}</Text>
        <GoldButton title={t('account_goto_login')} onPress={() => router.replace('/login')} />
      </View>
    );
  }

  const set = (k: keyof UserProfile) => (v: string) => setProfile((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (auth.status !== 'signed-in') return;
    setSaving(true);
    setMsg(null);
    try {
      await saveProfile(auth.uid, profile);
      setMsg(t('account_saved'));
    } catch {
      setMsg(t('account_save_fail'));
    } finally {
      setSaving(false);
    }
  };

  const doRestore = async () => {
    setRestoring(true);
    setMsg(null);
    try {
      await restore();
      setMsg(t('account_restore_ok'));
    } catch {
      setMsg(t('account_restore_fail'));
    } finally {
      setRestoring(false);
    }
  };

  const doSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const ownedPackages = PACKAGES.filter((p) => entitlements.packages[p.productId]);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.head}>
          <Text style={styles.title}>{t('account_title')}</Text>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.close}>
            <Ionicons name="close" size={22} color={Colors.text} />
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.gold} style={styles.loader} />
        ) : (
          <>
            <Text style={styles.section}>{t('account_section_profile')}</Text>
            {(['name', 'phone', 'address', 'city', 'pin'] as const).map((k) => (
              <View key={k} style={styles.field}>
                <Text style={styles.label}>{k.toUpperCase()}</Text>
                <TextInput
                  value={profile[k] as string}
                  onChangeText={set(k)}
                  style={styles.input}
                  placeholderTextColor={Colors.faint}
                  keyboardType={k === 'phone' || k === 'pin' ? 'phone-pad' : 'default'}
                />
              </View>
            ))}
            <GoldButton title={saving ? t('login_saving') : t('login_save_cta')} onPress={save} disabled={saving} />

            <Text style={styles.section}>{t('home_language')}</Text>
            <View style={styles.langRow}>
              {(['en', 'hi', 'si', 'ta', 'ur', 'bn'] as const).map((code) => {
                const active = lang === code;
                return (
                  <Pressable
                    key={code}
                    onPress={() => setLang(code)}
                    style={[styles.langChip, active && styles.langChipActive]}>
                    <Text style={[styles.langChipText, active && styles.langChipTextActive]}>
                      {code === 'en' ? 'EN' : code === 'hi' ? 'हिं' : code === 'si' ? 'සිං' : code === 'ta' ? 'தமி' : code === 'ur' ? 'اردو' : 'বাং'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.section}>{t('account_section_purchases')}</Text>
            <View style={styles.card}>
              <Row icon="play-circle" text="Dubai Job Master Course" owned={entitlements.course} />
              {ownedPackages.map((p) => (
                <Row key={p.productId} icon="bag-handle" text={p.name} owned />
              ))}
              {!entitlements.course && ownedPackages.length === 0 && (
                <Text style={styles.empty}>{t('account_none')}</Text>
              )}
            </View>
            <GoldButton
              title={restoring ? t('account_restoring') : t('account_restore')}
              dark
              onPress={doRestore}
              disabled={restoring}
            />

            {msg && <Text style={styles.msg}>{msg}</Text>}

            <Pressable onPress={doSignOut} style={styles.signout}>
              <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
              <Text style={styles.signoutText}>{t('account_signout')}</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Row({ icon, text, owned }: { icon: 'play-circle' | 'bag-handle'; text: string; owned: boolean }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={Colors.gold} />
      <Text style={styles.rowText}>{text}</Text>
      {owned && <Ionicons name="checkmark-circle" size={18} color={Colors.success} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  scroll: {
    padding: Spacing.screen,
    paddingTop: 52,
    gap: Spacing.sm + 2,
    paddingBottom: 48,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...Type.pageTitle,
    color: Colors.text,
  },
  close: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginTop: 40,
  },
  section: {
    ...Type.chapterTitle,
    fontSize: 20,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  field: {
    gap: 6,
  },
  label: {
    ...Type.caption,
    fontFamily: 'Inter-SemiBold',
    color: Colors.muted,
    letterSpacing: 1,
  },
  input: {
    ...Presets.input,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowText: {
    ...Type.body,
    color: Colors.text,
    flex: 1,
  },
  empty: {
    ...Type.small,
    color: Colors.faint,
  },
  msg: {
    ...Type.small,
    color: Colors.goldLight,
    textAlign: 'center',
  },
  signout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  signoutText: {
    ...Type.bodyMedium,
    fontFamily: 'Inter-Bold',
    color: Colors.danger,
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  langChip: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  langChipActive: {
    backgroundColor: '#FFFFFF',
  },
  langChipText: {
    ...Type.small,
    color: Colors.muted,
  },
  langChipTextActive: {
    ...Type.small,
    fontFamily: 'Inter-Bold',
    color: Colors.textOn,
  },
});