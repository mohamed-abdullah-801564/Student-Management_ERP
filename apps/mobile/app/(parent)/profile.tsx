import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  User,
  Shield,
  Bell,
  Globe,
  Fingerprint,
  Phone,
  LogOut,
  Building2,
  CheckCircle2,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { MOCK_CHILDREN, StudentChild } from '../../src/constants/mockData';

export default function ParentProfileScreen() {
  const router = useRouter();
  const [selectedChildId, setSelectedChildId] = useState(MOCK_CHILDREN[0].id);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');

  const activeChild =
    MOCK_CHILDREN.find((c) => c.id === selectedChildId) || MOCK_CHILDREN[0];
  const nextChild =
    MOCK_CHILDREN.find((c) => c.id !== selectedChildId) || MOCK_CHILDREN[1];

  const handlePromptSwitchChild = () => {
    Alert.alert(
      'Switch Active Student',
      `Would you like to switch to ${nextChild.name} (${nextChild.className.replace('Grade ', 'Class ')}-${nextChild.section})? Today's attendance, timetable, and homework feed will update to ${nextChild.name.split(' ')[0]}'s class.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Switch to ${nextChild.name.split(' ')[0]}`,
          style: 'default',
          onPress: () => {
            setSelectedChildId(nextChild.id);
            Alert.alert('Student Switched', `Active student updated to ${nextChild.name}.`);
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of Greenwood Academy Parent Portal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* PARENT PROFILE CARD */}
        <View style={[styles.profileCard, SHADOWS.card]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>SK</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.parentName}>Mr. Suresh Kumar</Text>
            <Text style={styles.parentPhone}>+91 98401 23456</Text>
            <View style={styles.verifiedBadge}>
              <Shield size={11} color={COLORS.presentText} />
              <Text style={styles.verifiedBadgeText}>Verified Guardian</Text>
            </View>
          </View>
        </View>

        {/* ACTIVE CHILD PROFILE SECTION (SHOWS ONLY 1 CARD WITH CONFIRMATION SWITCH) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Student</Text>
          <Text style={styles.sectionSub}>Attendance and marks belong to this student</Text>
        </View>

        <View style={[styles.childCard, styles.childCardActive, SHADOWS.card]}>
          <View
            style={[
              styles.childMiniAvatar,
              { backgroundColor: activeChild.avatarColor },
            ]}
          >
            <Text style={styles.childMiniAvatarText}>
              {activeChild.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.childName}>{activeChild.name}</Text>
              <View style={styles.activePill}>
                <CheckCircle2 size={11} color={COLORS.presentText} />
                <Text style={styles.activePillText}>Active</Text>
              </View>
            </View>
            <Text style={styles.childClass}>
              {activeChild.className.replace('Grade ', 'Class ')}-{activeChild.section} • Roll #{activeChild.rollNo}
            </Text>
            <Text style={styles.childAdm}>Adm: {activeChild.admissionNo}</Text>
          </View>

          <TouchableOpacity
            style={styles.switchChildBtn}
            onPress={handlePromptSwitchChild}
            activeOpacity={0.8}
          >
            <Text style={styles.switchChildBtnText}>Switch</Text>
          </TouchableOpacity>
        </View>

        {/* APP PREFERENCES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
        </View>

        <View style={[styles.settingsCard, SHADOWS.card]}>
          {/* Notifications */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconWrap}>
              <Bell size={18} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSub}>
                Morning attendance & school notice alerts
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.slate[300], true: COLORS.brand[600] }}
            />
          </View>

          <View style={styles.divider} />

          {/* Biometrics */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconWrap}>
              <Fingerprint size={18} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Biometric App Lock</Text>
              <Text style={styles.settingSub}>
                Fingerprint or FaceID to open
              </Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: COLORS.slate[300], true: COLORS.brand[600] }}
            />
          </View>

          <View style={styles.divider} />

          {/* Language Selection */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconWrap}>
              <Globe size={18} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Language / மொழி</Text>
              <Text style={styles.settingSub}>English or தமிழ்</Text>
            </View>
            <View style={styles.langToggleBox}>
              <TouchableOpacity
                style={[
                  styles.langBtn,
                  language === 'en' && styles.langBtnActive,
                ]}
                onPress={() => setLanguage('en')}
              >
                <Text
                  style={[
                    styles.langBtnText,
                    language === 'en' && styles.langBtnTextActive,
                  ]}
                >
                  English
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.langBtn,
                  language === 'ta' && styles.langBtnActive,
                ]}
                onPress={() => setLanguage('ta')}
              >
                <Text
                  style={[
                    styles.langBtnText,
                    language === 'ta' && styles.langBtnTextActive,
                  ]}
                >
                  தமிழ்
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* SCHOOL ADMINISTRATION CONTACT (Clean, Official Info) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>School Administration Contact</Text>
        </View>

        <View style={[styles.helpdeskCard, SHADOWS.card]}>
          <View style={styles.helpdeskRow}>
            <View style={styles.schoolIconWrap}>
              <Building2 size={20} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.helpdeskName}>Greenwood Academy</Text>
              <Text style={styles.helpdeskHours}>
                Working Hours: Mon - Sat • 08:00 AM - 04:30 PM
              </Text>
            </View>
          </View>

          <View style={styles.helpdeskContactRow}>
            <Phone size={14} color={COLORS.brand[600]} />
            <Text style={styles.helpdeskPhone}>
              Administrative Office: +91 44 2841 0000
            </Text>
          </View>
        </View>

        {/* LOGOUT BUTTON (No switch faculty button!) */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={18} color={COLORS.absent} />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[200],
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // Profile Card
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.brand[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
  },
  parentName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  parentPhone: {
    fontSize: 12,
    color: COLORS.slate[500],
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.presentBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.presentText,
  },

  // Children Section
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  sectionSub: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  childCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.brand[600],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  childCardActive: {
    borderColor: COLORS.brand[600],
    backgroundColor: COLORS.brand[50],
  },
  childMiniAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  childMiniAvatarText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  childName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  childClass: {
    fontSize: 12,
    color: COLORS.slate[600],
    marginTop: 2,
    fontWeight: '600',
  },
  childAdm: {
    fontSize: 10,
    color: COLORS.slate[400],
    marginTop: 1,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.presentBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.presentText,
  },
  switchChildBtn: {
    backgroundColor: COLORS.brand[600],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  switchChildBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Settings Card
  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  settingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  settingSub: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.slate[100],
    marginVertical: 10,
  },
  langToggleBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.slate[100],
    borderRadius: 10,
    padding: 2,
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  langBtnActive: {
    backgroundColor: COLORS.brand[600],
  },
  langBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.slate[600],
  },
  langBtnTextActive: {
    color: COLORS.white,
  },

  // Helpdesk
  helpdeskCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    marginBottom: 20,
    gap: 10,
  },
  helpdeskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  schoolIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpdeskName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  helpdeskHours: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  helpdeskContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[100],
  },
  helpdeskPhone: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[800],
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.absentBg,
    borderWidth: 1,
    borderColor: COLORS.absentBorder,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.absentText,
  },
});
