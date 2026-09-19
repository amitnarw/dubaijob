import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Type, Presets, Radii, Spacing } from '@/constants/theme';
import { GoldButton } from '@/components/GoldButton';
import { TrustStrip } from '@/components/TrustStrip';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/i18n/LocaleContext';
import { EMPTY_PROFILE, loadProfile, saveProfile, type UserProfile } from '@/services/profileService';

function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType = 'default',
  editable = true,
}: {
  label: string;
  value: string;
  onChange: (t: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'phone-pad' | 'email-address' | 'numeric';
  editable?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.faint}
        keyboardType={keyboardType}
        editable={editable}
        style={[styles.input, !editable && styles.inputLocked]}
      />
    </View>
  );
}

export default function LoginScreen() {
  const { auth, signIn } = useAuth();
  const { t } = useLocale();
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signedIn = auth.status === 'signed-in';
  const notConfigured = auth.status === 'not-configured';

  useEffect(() => {
    if (!signedIn || auth.status !== 'signed-in') return;
    setProfileLoading(true);
    loadProfile(auth.uid)
      .then((p) => {
        setProfile({
          ...p,
          name: p.name || auth.name,
          email: p.email || auth.email,
          photo: p.photo || auth.photo,
        });
      })
      .catch(() => {
        setProfile({ ...EMPTY_PROFILE, name: auth.name, email: auth.email, photo: auth.photo });
      })
      .finally(() => setProfileLoading(false));
  }, [signedIn, auth]);

  const doSignIn = async () => {
    setBusy(true);
    setError(null);
    const next = await signIn();
    setBusy(false);
    if (next.status === 'signed-out') setError(t('login_error_cancelled'));
  };

  const set = (k: keyof UserProfile) => (v: string) => setProfile((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (auth.status !== 'signed-in') return;
    if (!profile.name.trim()) {
      setError(t('login_err_name'));
      return;
    }
    if (profile.phone.trim().length < 10) {
      setError(t('login_err_phone'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await saveProfile(auth.uid, profile);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.replace('/(tabs)');
    } catch {
      setError(t('login_err_save'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.hero}>{t('login_hero')}</Text>
        <Text style={styles.sub}>{t('login_sub')}</Text>

        {!signedIn && (
          <View style={styles.ctaBlock}>
            <Pressable onPress={doSignIn} disabled={busy} style={styles.googleBtn}>
              {busy ? (
                <ActivityIndicator color={Colors.textOn} />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color={Colors.textOn} />
                  <Text style={styles.googleText}>{t('login_google')}</Text>
                </>
              )}
            </Pressable>
            {notConfigured && <Text style={styles.demoHint}>{t('login_demo_hint')}</Text>}
            <TrustStrip />
            {error && <Text style={styles.error}>{error}</Text>}
          </View>
        )}

        {signedIn && auth.status === 'signed-in' && (
          <View style={styles.form}>
            {auth.mock && (
              <View style={styles.demoChip}>
                <Ionicons name="flask-outline" size={14} color={Colors.gold} />
                <Text style={styles.demoChipText}>{t('login_demo_chip')}</Text>
              </View>
            )}
            <View style={styles.idRow}>
              {profile.photo || auth.photo ? (
                <Image source={{ uri: profile.photo ?? auth.photo ?? '' }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <Ionicons name="person" size={24} color={Colors.gold} />
                </View>
              )}
              <View style={styles.idMeta}>
                <Text style={styles.idName}>{profile.name || auth.name || 'Your profile'}</Text>
                <Text style={styles.idEmail}>{profile.email || auth.email}</Text>
              </View>
            </View>

            {profileLoading ? (
              <ActivityIndicator color={Colors.gold} style={styles.loader} />
            ) : (
              <>
                <Field label={t('login_field_name')} value={profile.name} onChange={set('name')} placeholder={t('login_ph_name')} />
                <Field label={t('login_field_email')} value={profile.email} onChange={set('email')} placeholder="you@email.com" keyboardType="email-address" editable={false} />
                <Field label={t('login_field_phone')} value={profile.phone} onChange={set('phone')} placeholder={t('login_ph_phone')} keyboardType="phone-pad" />
                <Field label={t('login_field_address')} value={profile.address} onChange={set('address')} placeholder={t('login_ph_address')} />
                <Field label={t('login_field_city')} value={profile.city} onChange={set('city')} placeholder={t('login_ph_city')} />
                <Field label={t('login_field_pin')} value={profile.pin} onChange={set('pin')} placeholder={t('login_ph_pin')} keyboardType="numeric" />
              </>
            )}
            {error && <Text style={styles.error}>{error}</Text>}
            <GoldButton
              title={busy ? t('login_saving') : t('login_save_cta')}
              onPress={save}
              disabled={busy || profileLoading}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  scroll: {
    flexGrow: 1,
    padding: Spacing.screen,
    paddingTop: 72,
    gap: Spacing.md,
  },
  hero: {
    ...Type.heroSerifless,
    fontSize: 44,
    lineHeight: 50,
    color: Colors.text,
  },
  sub: {
    ...Type.body,
    color: Colors.muted,
    marginBottom: Spacing.lg,
  },
  ctaBlock: {
    gap: Spacing.lg,
    marginTop: Spacing.sm,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.pill,
    minHeight: 54,
  },
  googleText: {
    ...Type.bodyMedium,
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.textOn,
  },
  demoHint: {
    ...Type.caption,
    color: Colors.faint,
    textAlign: 'center',
  },
  demoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.goldTint,
    borderRadius: Radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignSelf: 'center',
  },
  demoChipText: {
    ...Type.caption,
    fontFamily: 'Inter-SemiBold',
    color: Colors.goldLight,
  },
  error: {
    ...Type.small,
    color: Colors.danger,
    textAlign: 'center',
  },
  form: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: Spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarFallback: {
    backgroundColor: Colors.trackBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idMeta: {
    flex: 1,
    gap: 2,
  },
  idName: {
    ...Type.bodyMedium,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  idEmail: {
    ...Type.small,
    color: Colors.muted,
  },
  loader: {
    marginVertical: Spacing.xl,
  },
  field: {
    gap: 6,
  },
  label: {
    ...Type.small,
    color: Colors.muted,
  },
  input: {
    ...Presets.input,
  },
  inputLocked: {
    opacity: 0.6,
  },
});