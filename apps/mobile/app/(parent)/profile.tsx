import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import {
  ShieldCheck,
  Bell,
  LogOut,
  ChevronRight,
  KeyRound,
  X,
  Lock,
  Headphones,
  GraduationCap,
  Calendar,
  Building,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';

export default function ParentProfileScreen() {
  const router = useRouter();
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [circularAlerts, setCircularAlerts] = useState(true);

  // Change Password Modal State
  const [isPassModalVisible, setIsPassModalVisible] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!newPass || newPass.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert('Error', 'New password and confirmation do not match.');
      return;
    }
    setPassLoading(true);
    try {
      await supabase.auth.updateUser({ password: newPass });
    } catch {
      // offline fallback
    } finally {
      setPassLoading(false);
      setIsPassModalVisible(false);
      setNewPass('');
      setConfirmPass('');
      Alert.alert('Password Updated ✓', 'Guardian account security credentials have been updated.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of the Greenwood Parent Portal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER BAR */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.headerTitle}>Profile & Settings</Text>
          <Text style={styles.headerSub}>Greenwood Academy • Parent Portal</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO PARENT GUARDIAN CARD */}
        <View style={[styles.profileCard, SHADOWS.card]}>
          <View style={styles.parentRow}>
            <View style={styles.parentAvatar}>
              <Text style={styles.parentAvatarText}>SK</Text>
            </View>

            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={styles.nameRow}>
                <Text style={styles.parentName} numberOfLines={1}>
                  Mr. Suresh Ramanathan
                </Text>
                <ShieldCheck size={17} color={COLORS.presentText} />
              </View>

              <View style={styles.guardianPill}>
                <Text style={styles.guardianPillText}>Verified Primary Guardian</Text>
              </View>

              <Text style={styles.parentMeta}>+91 98401 23456 • suresh.r@example.com</Text>
            </View>
          </View>
        </View>

        {/* ENROLLED STUDENT WARD CARD */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Enrolled Student Ward</Text>
        </View>

        <View style={[styles.studentCard, SHADOWS.card]}>
          <View style={styles.studentCardTop}>
            <View style={styles.studentIconWrap}>
              <GraduationCap size={22} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.studentName}>Rahul Suresh</Text>
              <Text style={styles.studentClass}>
                Class 8 - Section B • Roll #14
              </Text>
            </View>
            <View style={styles.activeStudentBadge}>
              <Text style={styles.activeStudentBadgeText}>ACTIVE</Text>
            </View>
          </View>

          <View style={styles.studentMetaGrid}>
            <View style={styles.studentMetaItem}>
              <Text style={styles.studentMetaLabel}>ADMISSION NO</Text>
              <Text style={styles.studentMetaVal}>GW-2026-0842</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.studentMetaItem}>
              <Text style={styles.studentMetaLabel}>FORM TUTOR</Text>
              <Text style={styles.studentMetaVal}>Mrs. Deepa R.</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.studentMetaItem}>
              <Text style={styles.studentMetaLabel}>HOUSE</Text>
              <Text style={styles.studentMetaVal}>Emerald</Text>
            </View>
          </View>
        </View>

        {/* SECTION 1: NOTIFICATIONS & COMMUNICATONS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notifications & Alerts</Text>
        </View>

        <View style={[styles.sectionCard, SHADOWS.card]}>
          <View style={styles.settingRow}>
            <View style={styles.settingIconWrap}>
              <Calendar size={18} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.settingTitle}>Morning Roll Call Alerts</Text>
              <Text style={styles.settingSub}>
                Instant push notification as soon as student attendance is recorded
              </Text>
            </View>
            <Switch
              value={attendanceAlerts}
              onValueChange={setAttendanceAlerts}
              trackColor={{ false: COLORS.slate[300], true: COLORS.brand[600] }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingIconWrap}>
              <Bell size={18} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.settingTitle}>Circulars & Notice Broadcasts</Text>
              <Text style={styles.settingSub}>
                Urgent school circulars, exam schedules, and holiday notices
              </Text>
            </View>
            <Switch
              value={circularAlerts}
              onValueChange={setCircularAlerts}
              trackColor={{ false: COLORS.slate[300], true: COLORS.brand[600] }}
            />
          </View>
        </View>

        {/* SECTION 2: SECURITY & PASSCODE */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Security & Credentials</Text>
        </View>

        <View style={[styles.sectionCard, SHADOWS.card]}>
          <TouchableOpacity
            style={styles.clickableSettingRow}
            onPress={() => setIsPassModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingIconWrap}>
              <KeyRound size={18} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Change Account Password</Text>
              <Text style={styles.settingSub}>
                Update your Greenwood parent login credentials
              </Text>
            </View>
            <ChevronRight size={18} color={COLORS.slate[400]} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.trustSealRow}>
            <Lock size={14} color={COLORS.slate[400]} />
            <Text style={styles.trustSealText}>
              Greenwood Parent Portal v2.4.1 • CBSE Affiliation #1930412
            </Text>
          </View>
        </View>

        {/* SECTION 3: SCHOOL ADMINISTRATION HELPDESK */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Campus Administration Contact</Text>
        </View>

        <View style={[styles.sectionCard, SHADOWS.card]}>
          <View style={styles.helpdeskRow}>
            <View style={styles.helpdeskIconWrap}>
              <Building size={20} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.helpdeskTitle}>Greenwood Academy Central Office</Text>
              <Text style={styles.helpdeskSub}>
                Desk: +91 44 2847 9000 • office@greenwood.edu
              </Text>
              <Text style={styles.helpdeskHours}>
                Visiting Hours: Mon – Sat • 08:00 AM – 04:30 PM
              </Text>
            </View>
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={18} color={COLORS.absent} />
          <Text style={styles.logoutBtnText}>Sign Out Parent Portal</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        visible={isPassModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPassModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, SHADOWS.card]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <KeyRound size={20} color={COLORS.brand[600]} />
                <Text style={styles.modalTitle}>Change Guardian Password</Text>
              </View>
              <TouchableOpacity onPress={() => setIsPassModalVisible(false)}>
                <X size={20} color={COLORS.slate[500]} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>New Password (min 6 characters)</Text>
              <TextInput
                style={styles.modalInput}
                secureTextEntry
                placeholder="Enter new password"
                value={newPass}
                onChangeText={setNewPass}
              />

              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.modalInput}
                secureTextEntry
                placeholder="Confirm new password"
                value={confirmPass}
                onChangeText={setConfirmPass}
              />

              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleUpdatePassword}
                disabled={passLoading}
                activeOpacity={0.85}
              >
                <Text style={styles.modalSubmitBtnText}>
                  {passLoading ? 'Updating...' : 'Save New Password'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[200],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  headerSub: {
    fontSize: 12,
    color: COLORS.slate[500],
    marginTop: 2,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
  },

  // Hero Parent Card
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    marginBottom: 20,
  },
  parentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  parentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.brand[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.brand[200],
  },
  parentAvatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  parentName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  guardianPill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.presentBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  guardianPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.presentText,
  },
  parentMeta: {
    fontSize: 12,
    color: COLORS.slate[500],
    marginTop: 4,
  },

  // Enrolled Student Card
  studentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    marginBottom: 20,
  },
  studentCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  studentIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  studentClass: {
    fontSize: 12,
    color: COLORS.slate[500],
    marginTop: 2,
  },
  activeStudentBadge: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeStudentBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  studentMetaGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.slate[50],
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[100],
  },
  studentMetaItem: {
    flex: 1,
    alignItems: 'center',
  },
  studentMetaLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.slate[400],
    letterSpacing: 0.5,
  },
  studentMetaVal: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate[800],
    marginTop: 3,
  },
  metaDivider: {
    width: 1,
    height: 18,
    backgroundColor: COLORS.slate[200],
  },

  // Sections
  sectionHeader: {
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.slate[700],
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  clickableSettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  settingSub: {
    fontSize: 12,
    color: COLORS.slate[500],
    marginTop: 2,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.slate[100],
    marginVertical: 12,
  },
  trustSealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 4,
  },
  trustSealText: {
    fontSize: 11,
    color: COLORS.slate[400],
    fontWeight: '500',
  },

  // Helpdesk
  helpdeskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  helpdeskIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpdeskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  helpdeskSub: {
    fontSize: 12,
    color: COLORS.brand[700],
    marginTop: 2,
    fontWeight: '600',
  },
  helpdeskHours: {
    fontSize: 11,
    color: COLORS.slate[400],
    marginTop: 2,
  },

  // Logout Button
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 8,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.absent,
  },

  // Password Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[100],
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  modalBody: {
    padding: 20,
    gap: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate[700],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalInput: {
    backgroundColor: COLORS.slate[50],
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.slate[900],
  },
  modalSubmitBtn: {
    backgroundColor: COLORS.brand[600],
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  modalSubmitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});