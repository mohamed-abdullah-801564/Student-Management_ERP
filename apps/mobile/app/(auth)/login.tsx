import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Shield, ArrowRight, Lock, User, Eye, EyeOff, ShieldAlert } from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async () => {
    setErrorMessage(null);
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId) {
      setErrorMessage('Please enter your registered email or mobile number.');
      return;
    }
    if (!cleanPass) {
      setErrorMessage('Please enter your secure password.');
      return;
    }

    // Security Check: Super Admin and Principal/Office desks are restricted to Web Portal only
    if (
      cleanId === 'root@antigravity.edu' ||
      cleanId === 'principal@greenwood.edu' ||
      cleanId === 'office@greenwood.edu' ||
      cleanId === 'accounts@greenwood.edu' ||
      cleanId.includes('principal') ||
      cleanId.includes('superadmin') ||
      cleanId.includes('admission')
    ) {
      Alert.alert(
        'Web Portal Required',
        'Executive Principal and Office Desks must access the Greenwood Web Management Portal. This mobile application is strictly for Faculty Teachers and Parents.'
      );
      return;
    }

    setIsLoading(true);

    try {
      // 1. Try Supabase Authentication if it's an email
      let emailToAuth = cleanId;
      if (!cleanId.includes('@')) {
        // If entered as phone number, match known parent or teacher demo phone
        if (cleanId === '9840123456' || cleanId.endsWith('456')) {
          emailToAuth = 'parent@greenwood.edu';
        } else if (cleanId === '9840999888' || cleanId.endsWith('888')) {
          emailToAuth = 'teacher@greenwood.edu';
        } else {
          emailToAuth = `${cleanId}@greenwood.edu`;
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToAuth,
        password: cleanPass,
      });

      if (!error && data?.user) {
        const role = data.user.user_metadata?.role;
        const schoolId = data.user.user_metadata?.school_id;

        // Check if school is inactive in Supabase
        if (schoolId) {
          try {
            const { data: sch } = await supabase
              .from('schools')
              .select('name, current_term')
              .eq('id', schoolId)
              .single();

            if (sch && sch.current_term?.includes('INACTIVE')) {
              setIsLoading(false);
              Alert.alert(
                'School Unavailable',
                `${sch.name || 'Your school'} is temporarily inactive. Please contact your school administration.`
              );
              return;
            }
          } catch (e) {
            console.log('School status check error:', e);
          }
        }

        setIsLoading(false);
        if (role === 'teacher') {
          router.replace('/(teacher)');
          return;
        } else if (role === 'parent') {
          router.replace('/(parent)');
          return;
        } else {
          // If principal/admin tried via auth metadata
          Alert.alert(
            'Web Portal Required',
            'Your role is provisioned for the Web Administrative Portal. Please use a desktop browser.'
          );
          return;
        }
      }

      // 2. Direct Credential Fallback (for provisioned accounts)
      const validMobileAccounts: Record<string, { pass: string; role: 'teacher' | 'parent' }> = {
        'teacher@greenwood.edu': { pass: 'Teacher#2026', role: 'teacher' },
        'deepa.nambiar@greenwood.edu': { pass: 'Teacher#2026', role: 'teacher' },
        'parent@greenwood.edu': { pass: 'Parent#2026', role: 'parent' },
        '9840123456': { pass: 'Parent#2026', role: 'parent' },
        '9840999888': { pass: 'Teacher#2026', role: 'teacher' },
      };

      const matched = validMobileAccounts[cleanId] || validMobileAccounts[emailToAuth];
      if (matched && matched.pass === cleanPass) {
        setIsLoading(false);
        if (matched.role === 'teacher') {
          router.replace('/(teacher)');
        } else {
          router.replace('/(parent)');
        }
        return;
      }

      setIsLoading(false);
      setErrorMessage('Invalid credentials. Please verify your email/phone and password.');
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* BRAND CREST */}
          <View style={styles.brandSection}>
            <View style={[styles.crestBox, SHADOWS.soft]}>
              <Shield size={34} color={COLORS.brand[600]} strokeWidth={2.2} />
            </View>
          </View>

          {/* SIGN IN FORM */}
          <View style={[styles.formCard, SHADOWS.card]}>
            <Text style={styles.formTitle}>Log in</Text>

            {/* ERROR BANNER */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <ShieldAlert size={16} color="#DC2626" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Identifier Input (Email or Phone) */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL OR REGISTERED MOBILE NUMBER</Text>
              <View style={styles.inputWrapper}>
                <User size={18} color={COLORS.slate[400]} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="name@greenwood.edu or 10-digit mobile"
                  placeholderTextColor={COLORS.slate[400]}
                  value={identifier}
                  onChangeText={(val) => {
                    setIdentifier(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.inputLabel}>SECURE PASSWORD / PIN</Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Reset Password',
                      'Please contact the Greenwood Administrative Office or use your registered institutional email to reset your credentials.'
                    )
                  }
                >
                  <Text style={styles.forgotLink}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Lock size={18} color={COLORS.slate[400]} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.slate[400]}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={COLORS.slate[400]} />
                  ) : (
                    <Eye size={18} color={COLORS.slate[400]} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In CTA Button */}
            <TouchableOpacity
              style={[styles.signInButton, SHADOWS.soft, isLoading && styles.buttonDisabled]}
              onPress={handleSignIn}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.signInButtonText}>Log in</Text>
                  <ArrowRight size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
    justifyContent: 'center',
  },

  // Brand Header
  brandSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  crestBox: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    marginBottom: 16,
  },
  schoolName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.slate[900],
    letterSpacing: -0.4,
  },
  schoolSubtitle: {
    fontSize: 13,
    color: COLORS.slate[500],
    marginTop: 4,
    fontWeight: '600',
  },

  // Form Card
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.slate[900],
    letterSpacing: -0.4,
    marginBottom: 20,
  },
  formSubtitle: {
    fontSize: 12,
    color: COLORS.slate[500],
    marginTop: 2,
    marginBottom: 18,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#B91C1C',
    fontWeight: '600',
    flex: 1,
  },

  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate[500],
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotLink: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[600],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.slate[50],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.slate[900],
  },
  eyeBtn: {
    padding: 6,
  },

  signInButton: {
    backgroundColor: COLORS.brand[600],
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },

  securityFooter: {
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[100],
    alignItems: 'center',
  },
  securityNotice: {
    fontSize: 11,
    color: COLORS.slate[400],
    textAlign: 'center',
    fontWeight: '500',
  },
});
