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
  Calendar,
  LogOut,
  ChevronRight,
  BookOpen,
  Award,
  Users,
  Briefcase,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';

export default function TeacherProfileScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of Greenwood Faculty Portal?',
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
        <Text style={styles.headerTitle}>Faculty Profile & Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FACULTY PROFILE CARD */}
        <View style={[styles.profileCard, SHADOWS.card]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>DR</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.facultyName}>Mrs. Deepa R.</Text>
              <View style={styles.inChargeBadge}>
                <Text style={styles.inChargeBadgeText}>Class 8-B In-Charge</Text>
              </View>
            </View>
            <Text style={styles.facultyDesignation}>
              Senior Mathematics Faculty • Greenwood Academy
            </Text>
            <Text style={styles.facultyMeta}>
              ID: FAC-2019-042 • deepa.r@greenwood.edu
            </Text>
          </View>
        </View>

        {/* WORKLOAD & MENTORING METRICS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weekly Teaching Load</Text>
        </View>

        <View style={[styles.metricsGridCard, SHADOWS.card]}>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>24</Text>
            <Text style={styles.metricLabel}>Periods / Week</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>42</Text>
            <Text style={styles.metricLabel}>Students in 8-B</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={[styles.metricVal, { color: COLORS.presentText }]}>
              99.2%
            </Text>
            <Text style={styles.metricLabel}>On-Time Attendance</Text>
          </View>
        </View>

        {/* ASSIGNED CLASSES & SUBJECTS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assigned Academic Duties</Text>
        </View>

        <View style={styles.dutyList}>
          <View style={[styles.dutyCard, SHADOWS.card]}>
            <View style={styles.dutyIconWrap}>
              <Users size={18} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dutyTitle}>Grade 8 - Section B</Text>
              <Text style={styles.dutySub}>
                Class In-Charge • Form Tutor & Daily Attendance
              </Text>
            </View>
            <View style={styles.dutyTag}>
              <Text style={styles.dutyTagText}>42 Students</Text>
            </View>
          </View>

          <View style={[styles.dutyCard, SHADOWS.card]}>
            <View style={styles.dutyIconWrap}>
              <BookOpen size={18} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dutyTitle}>Mathematics (Grades 7, 8 & 9)</Text>
              <Text style={styles.dutySub}>
                Algebra, Quadratic Equations, Euclidean Geometry
              </Text>
            </View>
            <View style={styles.dutyTag}>
              <Text style={styles.dutyTagText}>3 Sections</Text>
            </View>
          </View>
        </View>

        {/* APP PREFERENCES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
        </View>

        <View style={[styles.settingsCard, SHADOWS.card]}>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Bell size={18} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Substitute & Urgent Alerts</Text>
              <Text style={styles.settingSub}>
                Sound notifications for substitution duty allocations
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: COLORS.slate[300], true: COLORS.brand[600] }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Fingerprint size={18} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Biometric Faculty Lock</Text>
              <Text style={styles.settingSub}>
                Protect marksheet editing with biometric check
              </Text>
            </View>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: COLORS.slate[300], true: COLORS.brand[600] }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Globe size={18} color={COLORS.brand[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Interface Language</Text>
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

        {/* SWITCH PORTAL / LOGOUT */}
        <TouchableOpacity
          style={[styles.switchRoleCard, SHADOWS.card]}
          onPress={() => router.replace('/(parent)')}
          activeOpacity={0.8}
        >
          <Briefcase size={18} color={COLORS.brand[600]} />
          <Text style={styles.switchRoleText}>Switch to Parent Mode</Text>
          <ChevronRight size={16} color={COLORS.slate[400]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={18} color={COLORS.absent} />
          <Text style={styles.logoutBtnText}>Sign Out Faculty Session</Text>
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
    fontWeight: '700',
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  facultyName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  inChargeBadge: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  inChargeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  facultyDesignation: {
    fontSize: 12,
    color: COLORS.slate[600],
    marginTop: 2,
  },
  facultyMeta: {
    fontSize: 11,
    color: COLORS.slate[400],
    marginTop: 2,
  },

  // Metrics
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate[800],
  },
  metricsGridCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.slate[200],
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.slate[500],
    marginTop: 2,
  },

  // Duty List
  dutyList: {
    gap: 10,
    marginBottom: 20,
  },
  dutyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dutyIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  dutyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  dutySub: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  dutyTag: {
    backgroundColor: COLORS.slate[100],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  dutyTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.slate[700],
  },

  // Settings
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
  settingIcon: {
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

  // Switch Role & Logout
  switchRoleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.brand[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  switchRoleText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brand[700],
    flex: 1,
    marginLeft: 8,
  },
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
