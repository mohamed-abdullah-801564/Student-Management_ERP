import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Calendar,
  Search,
  CheckCheck,
  AlertTriangle,
  Lock,
  ChevronDown,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { MOCK_STUDENTS, StudentItem } from '../../src/constants/mockData';

export default function RapidAttendanceScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [session, setSession] = useState<'morning' | 'afternoon'>('morning');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<StudentItem[]>(MOCK_STUDENTS);

  const handleBack = () => {
    try {
      navigation.navigate('index');
    } catch {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.navigate('/(teacher)' as any);
      }
    }
  };

  // Status Counts
  const totalCount = 38;
  const presentCount = students.filter((s) => s.status === 'P').length;
  const absentCount = students.filter((s) => s.status === 'A').length;
  const lateCount = students.filter((s) => s.status === 'L').length;

  // Toggle student status
  const handleToggle = (id: string, newStatus: 'P' | 'A' | 'L') => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  // Mark All Present Shortcut
  const handleMarkAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: 'P' })));
  };

  // Submit Action
  const handleSubmit = () => {
    Alert.alert(
      'Attendance Submitted',
      `${presentCount} Present, ${absentCount} Absent. Instant push notification sent to parents.`,
      [{ text: 'OK', onPress: handleBack }]
    );
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header & Navigation */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <ChevronLeft size={22} color={COLORS.slate[800]} strokeWidth={2.5} />
          </TouchableOpacity>

          <View>
            <View style={styles.titleRow}>
              <Text style={styles.screenTitle}>Class Attendance</Text>
              <View style={styles.statusDot} />
            </View>
            <Text style={styles.screenSubtitle}>
              Grade 8 – Section B •{' '}
              <Text style={styles.studentCountHighlight}>38 Students</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.dateBadge} activeOpacity={0.8}>
          <Calendar size={13} color={COLORS.brand[600]} strokeWidth={2.2} />
          <Text style={styles.dateBadgeText}>Today, 16 Nov</Text>
          <ChevronDown size={12} color={COLORS.slate[400]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Session Selector */}
        <View style={styles.sessionSelector}>
          <TouchableOpacity
            style={[
              styles.sessionTab,
              session === 'morning' && styles.sessionTabActive,
            ]}
            onPress={() => setSession('morning')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.sessionTabText,
                session === 'morning' && styles.sessionTabTextActive,
              ]}
            >
              Morning Session
            </Text>
            {session === 'morning' && <View style={styles.sessionActiveDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sessionTab,
              session === 'afternoon' && styles.sessionTabActive,
            ]}
            onPress={() => setSession('afternoon')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.sessionTabText,
                session === 'afternoon' && styles.sessionTabTextActive,
              ]}
            >
              Afternoon Session
            </Text>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>Pending</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Live Summary Metric Bar */}
        <View style={[styles.summaryCard, SHADOWS.card]}>
          <View style={styles.summaryGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TOTAL</Text>
              <Text style={styles.statNumber}>{totalCount}</Text>
            </View>

            <View style={[styles.statBox, styles.statBoxPresent]}>
              <View style={styles.statIndicatorRow}>
                <View style={styles.indicatorPresent} />
                <Text style={styles.statLabelPresent}>Present</Text>
              </View>
              <Text style={styles.statNumberPresent}>{presentCount}</Text>
            </View>

            <View style={[styles.statBox, styles.statBoxAbsent]}>
              <View style={styles.statIndicatorRow}>
                <View style={styles.indicatorAbsent} />
                <Text style={styles.statLabelAbsent}>Absent</Text>
              </View>
              <Text style={styles.statNumberAbsent}>{absentCount}</Text>
            </View>
          </View>

          {/* Micro-guide */}
          <View style={styles.microGuideRow}>
            <View style={styles.microGuideLeft}>
              <Text style={styles.bulbIcon}>💡</Text>
              <Text style={styles.microGuideText}>
                All students <Text style={styles.bold}>Present</Text> by default. Tap 'A' to toggle.
              </Text>
            </View>
            <View style={styles.lateCounterBadge}>
              <Text style={styles.lateCounterText}>{lateCount} Late</Text>
            </View>
          </View>
        </View>

        {/* Search & Quick Mark All Action */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Search size={16} color={COLORS.slate[400]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search student or roll no..."
              placeholderTextColor={COLORS.slate[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            style={styles.allPresentButton}
            onPress={handleMarkAllPresent}
            activeOpacity={0.8}
          >
            <CheckCheck size={14} color={COLORS.brand[600]} strokeWidth={2.5} />
            <Text style={styles.allPresentText}>All Present</Text>
          </TouchableOpacity>
        </View>

        {/* Student Roster List */}
        <View style={styles.rosterList}>
          {filteredStudents.map((student) => {
            const isPresent = student.status === 'P';
            const isAbsent = student.status === 'A';
            const isLate = student.status === 'L';

            return (
              <View
                key={student.id}
                style={[
                  styles.studentRow,
                  isAbsent && styles.studentRowAbsent,
                  isLate && styles.studentRowLate,
                ]}
              >
                {/* Left Profile Info */}
                <View style={styles.studentInfoGroup}>
                  <View
                    style={[
                      styles.rollNoBadge,
                      isAbsent && styles.rollNoBadgeAbsent,
                      isLate && styles.rollNoBadgeLate,
                    ]}
                  >
                    <Text
                      style={[
                        styles.rollNoText,
                        isAbsent && styles.rollNoTextAbsent,
                        isLate && styles.rollNoTextLate,
                      ]}
                    >
                      {student.rollNo}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.avatarBox,
                      isAbsent && styles.avatarBoxAbsent,
                      isLate && styles.avatarBoxLate,
                    ]}
                  >
                    <Text
                      style={[
                        styles.avatarText,
                        isAbsent && styles.avatarTextAbsent,
                        isLate && styles.avatarTextLate,
                      ]}
                    >
                      {student.initials}
                    </Text>
                  </View>

                  <View style={styles.nameContainer}>
                    <Text style={styles.studentName} numberOfLines={1}>
                      {student.name}
                    </Text>

                    {student.badgeText && (
                      <View style={styles.badgeWrapper}>
                        <Text
                          style={[
                            styles.studentBadgeText,
                            isAbsent && styles.badgeTextAbsent,
                            isLate && styles.badgeTextLate,
                          ]}
                          numberOfLines={1}
                        >
                          {student.badgeText}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Thumb Segmented Toggle [ P | A | L ] */}
                <View style={styles.toggleGroup}>
                  <TouchableOpacity
                    style={[
                      styles.toggleBtn,
                      isPresent && styles.toggleBtnPresentActive,
                    ]}
                    onPress={() => handleToggle(student.id, 'P')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.toggleBtnText,
                        isPresent && styles.toggleBtnTextActive,
                      ]}
                    >
                      P
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.toggleBtn,
                      isAbsent && styles.toggleBtnAbsentActive,
                    ]}
                    onPress={() => handleToggle(student.id, 'A')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.toggleBtnText,
                        isAbsent && styles.toggleBtnTextActive,
                      ]}
                    >
                      A
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.toggleBtn,
                      isLate && styles.toggleBtnLateActive,
                    ]}
                    onPress={() => handleToggle(student.id, 'L')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.toggleBtnText,
                        isLate && styles.toggleBtnTextActive,
                      ]}
                    >
                      L
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={[styles.floatingFooter, SHADOWS.card]}>
        <View style={styles.alertBanner}>
          <AlertTriangle size={15} color={COLORS.absent} />
          <Text style={styles.alertBannerText}>
            <Text style={styles.bold}>{absentCount} Absentees</Text> trigger instant SMS & Parent Portal alert
          </Text>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.88}
        >
          <Text style={styles.submitButtonText}>
            Submit {session === 'morning' ? 'Morning' : 'Afternoon'} Attendance
          </Text>
          <Lock size={16} color={COLORS.brand[200]} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[200],
    backgroundColor: COLORS.white,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.present,
  },
  screenSubtitle: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  studentCountHighlight: {
    fontWeight: '700',
    color: COLORS.brand[600],
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.slate[100],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    gap: 5,
  },
  dateBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate[700],
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 130,
  },
  sessionSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.slate[200],
    borderRadius: 16,
    padding: 4,
    marginBottom: 12,
  },
  sessionTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  sessionTabActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionIcon: {
    fontSize: 13,
  },
  sessionTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate[600],
  },
  sessionTabTextActive: {
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  sessionActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.brand[600],
  },
  pendingBadge: {
    backgroundColor: COLORS.lateBg,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  pendingBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.lateText,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.slate[50],
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.slate[500],
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.slate[800],
  },
  statBoxPresent: {
    backgroundColor: COLORS.presentBg,
    borderColor: COLORS.presentBorder,
  },
  statIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  indicatorPresent: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.present,
  },
  statLabelPresent: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.presentText,
  },
  statNumberPresent: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.presentText,
  },
  statBoxAbsent: {
    backgroundColor: COLORS.absentBg,
    borderColor: COLORS.absentBorder,
  },
  indicatorAbsent: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.absent,
  },
  statLabelAbsent: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.absentText,
  },
  statNumberAbsent: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.absentText,
  },
  microGuideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[100],
    marginTop: 10,
    paddingTop: 8,
  },
  microGuideLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  bulbIcon: {
    fontSize: 12,
  },
  microGuideText: {
    fontSize: 10,
    color: COLORS.slate[500],
  },
  bold: {
    fontWeight: '700',
  },
  lateCounterBadge: {
    backgroundColor: COLORS.lateBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lateCounterText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.lateText,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.slate[800],
  },
  allPresentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.brand[100],
    gap: 5,
  },
  allPresentText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  rosterList: {
    gap: 8,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  studentRowAbsent: {
    backgroundColor: COLORS.absentBg,
    borderColor: COLORS.absentBorder,
  },
  studentRowLate: {
    backgroundColor: COLORS.lateBg,
    borderColor: COLORS.lateBorder,
  },
  studentInfoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  rollNoBadge: {
    backgroundColor: COLORS.slate[100],
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    minWidth: 32,
    alignItems: 'center',
  },
  rollNoBadgeAbsent: {
    backgroundColor: '#FECDD3',
  },
  rollNoBadgeLate: {
    backgroundColor: '#FDE68A',
  },
  rollNoText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate[500],
  },
  rollNoTextAbsent: {
    color: COLORS.absentText,
  },
  rollNoTextLate: {
    color: COLORS.lateText,
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: COLORS.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  avatarBoxAbsent: {
    backgroundColor: '#FEE2E2',
    borderColor: COLORS.absentBorder,
  },
  avatarBoxLate: {
    backgroundColor: '#FEF3C7',
    borderColor: COLORS.lateBorder,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.slate[700],
  },
  avatarTextAbsent: {
    color: COLORS.absentText,
  },
  avatarTextLate: {
    color: COLORS.lateText,
  },
  nameContainer: {
    flex: 1,
  },
  studentName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  badgeWrapper: {
    marginTop: 2,
  },
  studentBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.presentText,
  },
  badgeTextAbsent: {
    color: COLORS.absentText,
    fontWeight: '700',
  },
  badgeTextLate: {
    color: COLORS.lateText,
    fontWeight: '700',
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: COLORS.slate[100],
    borderRadius: 12,
    padding: 3,
    gap: 2,
  },
  toggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnPresentActive: {
    backgroundColor: COLORS.present,
    shadowColor: COLORS.present,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleBtnAbsentActive: {
    backgroundColor: COLORS.absent,
    shadowColor: COLORS.absent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleBtnLateActive: {
    backgroundColor: COLORS.late,
    shadowColor: COLORS.late,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[500],
  },
  toggleBtnTextActive: {
    color: COLORS.white,
    fontWeight: '900',
  },
  floatingFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[200],
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.absentBg,
    borderWidth: 1,
    borderColor: COLORS.absentBorder,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginBottom: 10,
    gap: 6,
  },
  alertBannerText: {
    fontSize: 11,
    color: COLORS.absentText,
  },
  submitButton: {
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.brand[600],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.brand[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
});
