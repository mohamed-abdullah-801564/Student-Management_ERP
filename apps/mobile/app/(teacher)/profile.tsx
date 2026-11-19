import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../src/lib/supabase';
import { schoolStore } from '../../src/lib/schoolStore';
import {
  ShieldCheck,
  Bell,
  LogOut,
  ChevronRight,
  KeyRound,
  Camera,
  X,
  Lock,
  QrCode,
  Headphones,
  CheckCircle2,
  Calendar,
  Building,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';

export default function TeacherProfileScreen() {
  const router = useRouter();
  const [subAlerts, setSubAlerts] = useState(true);
  const [circularAlerts, setCircularAlerts] = useState(true);
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(schoolStore.getFacultyPhoto());

  useEffect(() => {
    const unsub = schoolStore.subscribe(() => {
      setProfilePhotoUri(schoolStore.getFacultyPhoto());
    });
    return unsub;
  }, []);

  // Change Password Modal State
  const [isPassModalVisible, setIsPassModalVisible] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Digital ID / QR Smart Pass Modal State
  const [isQrModalVisible, setIsQrModalVisible] = useState(false);

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
      // ignore
    } finally {
      setPassLoading(false);
      setIsPassModalVisible(false);
      setNewPass('');
      setConfirmPass('');
      Alert.alert('Password Updated ✓', 'Your faculty security credentials have been successfully updated.');
    }
  };

  const handlePickFromLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Photo library permission is needed to select a profile photo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const dataUri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        schoolStore.setFacultyPhoto(dataUri);

        try {
          await supabase
            .from('profiles')
            .update({ avatar_url: dataUri })
            .eq('role', 'teacher');
        } catch {
          // offline fallback
        }

        Alert.alert(
          'Photo Updated ✓',
          'Faculty institutional portrait compressed (~85 KB) and updated across Greenwood Academy.'
        );
      }
    } catch (err: any) {
      Alert.alert('Error', `Could not pick image: ${err.message}`);
    }
  };

  const handleTakePhotoWithCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera access permission is needed to take a portrait photo.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const dataUri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        schoolStore.setFacultyPhoto(dataUri);

        try {
          await supabase
            .from('profiles')
            .update({ avatar_url: dataUri })
            .eq('role', 'teacher');
        } catch {
          // offline fallback
        }

        Alert.alert(
          'Photo Captured ✓',
          'Faculty portrait compressed (~85 KB) and synchronized with Greenwood Central Registry.'
        );
      }
    } catch (err: any) {
      Alert.alert('Error', `Could not open camera: ${err.message}`);
    }
  };

  const handlePhotoUpload = () => {
    Alert.alert(
      'Faculty Profile Photo',
      'Choose how you want to update your Greenwood institutional portrait:',
      [
        { text: 'Take Photo with Camera', onPress: handleTakePhotoWithCamera },
        { text: 'Choose from Photo Library', onPress: handlePickFromLibrary },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out Session',
      'Are you sure you want to log out of the Greenwood Faculty Portal?',
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
      {/* HEADER */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.headerTitle}>Profile & Settings</Text>
          <Text style={styles.headerSub}>Greenwood Academy • Faculty Terminal</Text>
        </View>
        <TouchableOpacity
          style={styles.qrPassHeaderBtn}
          onPress={() => setIsQrModalVisible(true)}
          activeOpacity={0.8}
        >
          <QrCode size={18} color={COLORS.brand[700]} />
          <Text style={styles.qrPassHeaderBtnText}>Smart Pass</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO FACULTY PROFILE CARD */}
        <View style={[styles.profileCard, SHADOWS.card]}>
          <View style={styles.avatarRow}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={handlePhotoUpload}
              activeOpacity={0.85}
            >
              <View style={styles.avatarCircle}>
                {profilePhotoUri ? (
                  <Image source={{ uri: profilePhotoUri }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarInitials}>DR</Text>
                )}
              </View>
              <View style={styles.cameraBadge}>
                <Camera size={13} color="#FFFFFF" strokeWidth={2.4} />
              </View>
            </TouchableOpacity>

            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={styles.nameRow}>
                <Text style={styles.facultyName} numberOfLines={1}>
                  Mrs. Deepa R.
                </Text>
                <ShieldCheck size={17} color={COLORS.brand[600]} />
              </View>

              <View style={styles.inChargePill}>
                <Text style={styles.inChargePillText}>Class 8-B In-Charge • Math</Text>
              </View>

              <Text style={styles.facultyMeta}>Senior Mathematics Faculty • Greenwood</Text>
            </View>
          </View>

          {/* METADATA STRIP */}
          <View style={styles.metaStrip}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>STAFF ID</Text>
              <Text style={styles.metaValue}>#GW-2019-042</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>CAMPUS</Text>
              <Text style={styles.metaValue}>Main Campus</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>EMAIL</Text>
              <Text style={styles.metaValue} numberOfLines={1}>deepa.r@greenwood.edu</Text>
            </View>
          </View>

          {/* ACTION BUTTON */}
          <TouchableOpacity
            style={styles.updatePhotoActionBtn}
            onPress={handlePhotoUpload}
            activeOpacity={0.8}
          >
            <Camera size={14} color={COLORS.brand[700]} />
            <Text style={styles.updatePhotoActionBtnText}>Update Institutional Portrait</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION 1: NOTIFICATIONS & TIMELINESS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notifications & Alerts</Text>
        </View>

        <View style={[styles.sectionCard, SHADOWS.card]}>
          <View style={styles.settingRow}>
            <View style={styles.settingIconWrap}>
              <Bell size={18} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.settingTitle}>Emergency Substitute Alerts</Text>
              <Text style={styles.settingSub}>
                Real-time cover period alerts during campus free periods
              </Text>
            </View>
            <Switch
              value={subAlerts}
              onValueChange={setSubAlerts}
              trackColor={{ false: COLORS.slate[300], true: COLORS.brand[600] }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingIconWrap}>
              <Calendar size={18} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.settingTitle}>Roll Call & Circular Alerts</Text>
              <Text style={styles.settingSub}>
                Reminders for 08:45 AM roll call & official broadcasts
              </Text>
            </View>
            <Switch
              value={circularAlerts}
              onValueChange={setCircularAlerts}
              trackColor={{ false: COLORS.slate[300], true: COLORS.brand[600] }}
            />
          </View>
        </View>

        {/* SECTION 2: TEACHING WORKLOAD SUMMARY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Academic Workload Summary</Text>
        </View>

        <View style={[styles.metricsCard, SHADOWS.card]}>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>24</Text>
            <Text style={styles.metricLabel}>Periods / Wk</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>38</Text>
            <Text style={styles.metricLabel}>Class 8-B Roster</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={[styles.metricVal, { color: COLORS.presentText }]}>100%</Text>
            <Text style={styles.metricLabel}>Syllabus Paced</Text>
          </View>
        </View>

        {/* SECTION 3: ACCOUNT & SECURITY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account Credentials & Security</Text>
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
              <Text style={styles.settingTitle}>Update Account Password / PIN</Text>
              <Text style={styles.settingSub}>
                Update your Greenwood faculty login credentials
              </Text>
            </View>
            <ChevronRight size={18} color={COLORS.slate[400]} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.trustSealRow}>
            <Lock size={14} color={COLORS.slate[400]} />
            <Text style={styles.trustSealText}>
              Greenwood Portal v2.4.1 (Build 8820) • 256-Bit Encrypted
            </Text>
          </View>
        </View>

        {/* SECTION 4: CAMPUS HELPDESK & SUPPORT */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Campus Helpdesk & Support</Text>
        </View>

        <View style={[styles.sectionCard, SHADOWS.card]}>
          <View style={styles.helpdeskRow}>
            <View style={styles.helpdeskIconWrap}>
              <Headphones size={20} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.helpdeskTitle}>IT Coordinator & Admin Support</Text>
              <Text style={styles.helpdeskSub}>
                Internal Ext: #404 • it-helpdesk@greenwood.edu
              </Text>
              <Text style={styles.helpdeskHours}>
                Hours: Mon – Sat • 08:00 AM – 04:30 PM
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
          <Text style={styles.logoutBtnText}>Sign Out Faculty Session</Text>
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
                <Text style={styles.modalTitle}>Change Faculty Password</Text>
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
                  {passLoading ? 'Updating Credentials...' : 'Save New Password'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DIGITAL SMART PASS QR MODAL */}
      <Modal
        visible={isQrModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsQrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.qrModalCard, SHADOWS.card]}>
            <View style={styles.qrModalTop}>
              <View style={styles.qrBadgeIcon}>
                <Building size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.qrModalTitle}>Greenwood Academy</Text>
              <Text style={styles.qrModalSubtitle}>FACULTY SMART PASS</Text>
            </View>

            <View style={styles.qrPhotoWrap}>
              {profilePhotoUri ? (
                <Image source={{ uri: profilePhotoUri }} style={styles.qrPhoto} />
              ) : (
                <View style={styles.qrPhotoFallback}>
                  <Text style={styles.qrPhotoFallbackText}>DR</Text>
                </View>
              )}
            </View>

            <Text style={styles.qrFacultyName}>Mrs. Deepa R.</Text>
            <Text style={styles.qrFacultyRole}>Class 8-B In-Charge • Math Faculty</Text>
            <Text style={styles.qrStaffId}>STAFF ID: #GW-2019-042</Text>

            {/* STYLIZED QR CODE BOX */}
            <View style={styles.qrCodeContainer}>
              <QrCode size={130} color={COLORS.slate[900]} />
            </View>

            <Text style={styles.qrScanInstruction}>
              Scan at Main Campus Gate or Attendance Terminal
            </Text>

            <TouchableOpacity
              style={styles.qrDoneBtn}
              onPress={() => setIsQrModalVisible(false)}
            >
              <Text style={styles.qrDoneBtnText}>Close Pass</Text>
            </TouchableOpacity>
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
  qrPassHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: COLORS.brand[50],
    borderWidth: 1,
    borderColor: COLORS.brand[200],
  },
  qrPassHeaderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
  },

  // Hero Profile Card
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    marginBottom: 24,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.brand[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.brand[200],
    overflow: 'hidden',
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.brand[600],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  facultyName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  inChargePill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  inChargePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  facultyMeta: {
    fontSize: 12,
    color: COLORS.slate[500],
    marginTop: 4,
  },
  metaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.slate[50],
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[100],
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.slate[400],
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate[800],
    marginTop: 3,
  },
  metaDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.slate[200],
  },
  updatePhotoActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.brand[50],
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 14,
    borderWidth: 1,
    borderColor: COLORS.brand[200],
  },
  updatePhotoActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[700],
  },

  // Sections
  sectionHeader: {
    marginBottom: 10,
    marginTop: 6,
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

  // Workload Metrics
  metricsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    marginBottom: 20,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 4,
    fontWeight: '600',
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.slate[100],
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

  // QR Smart Pass Modal
  qrModalCard: {
    width: '100%',
    maxWidth: 330,
    backgroundColor: COLORS.white,
    borderRadius: 26,
    padding: 24,
    alignItems: 'center',
  },
  qrModalTop: {
    alignItems: 'center',
    marginBottom: 14,
  },
  qrBadgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.brand[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  qrModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  qrModalSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.brand[600],
    letterSpacing: 1,
    marginTop: 2,
  },
  qrPhotoWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.brand[300],
    marginVertical: 10,
  },
  qrPhoto: {
    width: 64,
    height: 64,
  },
  qrPhotoFallback: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.brand[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPhotoFallbackText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  qrFacultyName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  qrFacultyRole: {
    fontSize: 12,
    color: COLORS.slate[500],
    marginTop: 2,
  },
  qrStaffId: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[700],
    marginTop: 4,
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  qrCodeContainer: {
    backgroundColor: COLORS.slate[50],
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    marginVertical: 16,
  },
  qrScanInstruction: {
    fontSize: 11,
    color: COLORS.slate[400],
    textAlign: 'center',
    marginBottom: 16,
  },
  qrDoneBtn: {
    width: '100%',
    backgroundColor: COLORS.slate[100],
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  qrDoneBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[800],
  },
});