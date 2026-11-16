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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Shield, ArrowRight, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    if (!identifier.trim()) {
      Alert.alert('Required', 'Please enter your registered email or mobile number.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Required', 'Please enter your password or PIN.');
      return;
    }

    setIsLoading(true);

    // Auto-detect role:
    // Teachers/Staff use faculty email or staff phone (e.g., contains 'teacher', 'deepa', or 'fac')
    const lower = identifier.toLowerCase();
    setTimeout(() => {
      setIsLoading(false);
      if (lower.includes('teacher') || lower.includes('faculty') || lower.includes('deepa') || lower === 'fac') {
        router.replace('/(teacher)');
      } else {
        // Default to Parent Portal
        router.replace('/(parent)');
      }
    }, 400);
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
          {/* BRAND CREST & HEADER */}
          <View style={styles.brandSection}>
            <View style={[styles.crestBox, SHADOWS.soft]}>
              <Shield size={34} color={COLORS.brand[600]} strokeWidth={2.2} />
            </View>

            <Text style={styles.schoolName}>Greenwood Academy</Text>
            <Text style={styles.schoolSubtitle}>
              School Management System
            </Text>
          </View>

          {/* SIGN IN FORM (Single Unified Input) */}
          <View style={[styles.formCard, SHADOWS.card]}>
            <Text style={styles.formTitle}>Sign In</Text>
            <Text style={styles.formSubtitle}>
              Enter your registered email or mobile number
            </Text>

            {/* Identifier Input (Email or Phone) */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL OR MOBILE NUMBER</Text>
              <View style={styles.inputWrapper}>
                <User size={18} color={COLORS.slate[400]} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 9840123456 or name@greenwood.edu"
                  placeholderTextColor={COLORS.slate[400]}
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.inputLabel}>PASSWORD / PIN</Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Reset Password',
                      'Please contact your School Administrative Office or use your registered email to reset your password.'
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
                  onChangeText={setPassword}
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
              style={[styles.signInButton, SHADOWS.soft]}
              onPress={handleSignIn}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              <Text style={styles.signInButtonText}>
                {isLoading ? 'Verifying...' : 'Sign In to Portal'}
              </Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Quick Demo Hint for Testing */}
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>
              Testing Tip: Type <Text style={styles.hintBold}>teacher</Text> to open Faculty Portal, or enter any other text to open Parent Portal.
            </Text>
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
    marginBottom: 32,
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
    fontWeight: '500',
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
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.slate[900],
    letterSpacing: -0.3,
  },
  formSubtitle: {
    fontSize: 12,
    color: COLORS.slate[500],
    marginTop: 2,
    marginBottom: 20,
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
    fontWeight: '600',
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
  signInButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },

  hintContainer: {
    marginTop: 24,
    paddingHorizontal: 8,
  },
  hintText: {
    fontSize: 11,
    color: COLORS.slate[400],
    textAlign: 'center',
    lineHeight: 16,
  },
  hintBold: {
    color: COLORS.brand[600],
    fontWeight: '700',
  },
});
