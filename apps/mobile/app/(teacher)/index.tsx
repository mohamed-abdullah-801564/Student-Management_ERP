import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import {
  Bell,
  CalendarCheck,
  BookOpen,
  Award,
  Clock,
  UserCheck,
  ChevronRight,
  Sparkles,
  MapPin,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { MOCK_SCHEDULE, SchedulePeriod } from '../../src/constants/mockData';

export default function TeacherDashboard() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [activeSegment, setActiveSegment] = useState<'timetable' | 'class8b'>('timetable');

  const navigateTo = (screenName: string, path: string) => {
    try {
      navigation.navigate(screenName);
    } catch {
      try {
        router.navigate(path as any);
      } catch {
        router.push(path as any);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER SECTION (Mrs. Deepa R. • Senior Math Faculty) */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.facultyGreeting}>Good Morning, Mrs. Deepa</Text>
            <View style={styles.badgeRow}>
              <View style={styles.classInChargePill}>
                <Text style={styles.classInChargeText}>Class 8-B In-Charge</Text>
              </View>
              <Text style={styles.bulletSeparator}>•</Text>
              <Text style={styles.departmentText}>Math Faculty</Text>
            </View>
          </View>

          {/* Teacher Profile Photo (Top Right) */}
          <View style={styles.teacherPhotoWrapper}>
            <View style={styles.teacherPhotoCircle}>
              <Text style={styles.teacherPhotoInitials}>DR</Text>
            </View>
            <View style={styles.onlineStatusDot} />
          </View>
        </View>

        {/* WORKSPACE TOGGLE: [ My Timetable ] | [ Class 8-B Hub ] */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeSegment === 'timetable' && styles.segmentBtnActive,
            ]}
            onPress={() => setActiveSegment('timetable')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                activeSegment === 'timetable' && styles.segmentTextActive,
              ]}
            >
              My Timetable (Today)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeSegment === 'class8b' && styles.segmentBtnActive,
            ]}
            onPress={() => setActiveSegment('class8b')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                activeSegment === 'class8b' && styles.segmentTextActive,
              ]}
            >
              Class 8-B (In-Charge)
            </Text>
          </TouchableOpacity>
        </View>

        {/* ONGOING PERIOD HERO CARD (Period 3) */}
        <View style={[styles.heroCard, SHADOWS.soft]}>
          <View style={styles.heroHeader}>
            <View style={styles.heroLivePill}>
              <View style={styles.livePulseDot} />
              <Text style={styles.heroLiveText}>PERIOD 3 ONGOING</Text>
            </View>
            <View style={styles.timeTag}>
              <Clock size={12} color="rgba(255,255,255,0.85)" />
              <Text style={styles.timeTagText}>10:15 - 11:00 AM</Text>
            </View>
          </View>

          <View style={styles.heroBody}>
            <Text style={styles.heroClassTitle}>Class 8-A Mathematics</Text>
            <View style={styles.heroMetaRow}>
              <View style={styles.roomBadge}>
                <MapPin size={11} color="rgba(255,255,255,0.9)" />
                <Text style={styles.roomBadgeText}>Room 204</Text>
              </View>
              <Text style={styles.heroPortionText}>
                Ch 4: Quadratic Equations — Ex 4.2
              </Text>
            </View>
          </View>

          <View style={styles.heroActionsRow}>
            <TouchableOpacity
              style={styles.heroPrimaryBtn}
              onPress={() => navigateTo('attendance', '/(teacher)/attendance')}
              activeOpacity={0.85}
            >
              <CalendarCheck size={15} color={COLORS.brand[700]} />
              <Text style={styles.heroPrimaryBtnText}>Take Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroSecondaryBtn}
              onPress={() => navigateTo('homework', '/(teacher)/homework')}
              activeOpacity={0.85}
            >
              <BookOpen size={15} color="#FFFFFF" />
              <Text style={styles.heroSecondaryBtnText}>Post Homework</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION: QUICK ACTIONS (NO CARD WRAPPER - EXACTLY 4 CIRCULAR BUTTONS IN ONE ROW WITH GENEROUS BREATHING SPACE) */}
        <View style={styles.quickActionsHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.circleButtonsRow}>
          {/* Button 1: Attendance */}
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => navigateTo('attendance', '/(teacher)/attendance')}
            activeOpacity={0.75}
          >
            <View style={[styles.circleButton, { backgroundColor: '#ECFDF5' }]}>
              <CalendarCheck size={22} color={COLORS.present} strokeWidth={2.2} />
            </View>
            <Text style={styles.circleActionLabel}>Attendance</Text>
          </TouchableOpacity>

          {/* Button 2: Homework */}
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => navigateTo('homework', '/(teacher)/homework')}
            activeOpacity={0.75}
          >
            <View style={[styles.circleButton, { backgroundColor: '#EEF2FF' }]}>
              <BookOpen size={22} color={COLORS.brand[600]} strokeWidth={2.2} />
            </View>
            <Text style={styles.circleActionLabel}>Homework</Text>
          </TouchableOpacity>

          {/* Button 3: Enter Marks */}
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => navigateTo('marks', '/(teacher)/marks')}
            activeOpacity={0.75}
          >
            <View style={[styles.circleButton, { backgroundColor: '#FAF5FF' }]}>
              <Award size={22} color="#9333EA" strokeWidth={2.2} />
            </View>
            <Text style={styles.circleActionLabel}>Enter Marks</Text>
          </TouchableOpacity>

          {/* Button 4: Timetable */}
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => navigateTo('timetable', '/(teacher)/timetable')}
            activeOpacity={0.75}
          >
            <View style={[styles.circleButton, { backgroundColor: '#FFFBEB' }]}>
              <Clock size={22} color={COLORS.lateText} strokeWidth={2.2} />
            </View>
            <Text style={styles.circleActionLabel}>Timetable</Text>
          </TouchableOpacity>
        </View>

        {/* CONTEXTUAL SUBSTITUTION NOTICE CARD (Immediate desk access without crowding circular buttons) */}
        <TouchableOpacity
          style={[styles.substituteNoticeCard, SHADOWS.card]}
          onPress={() => navigateTo('substitute', '/(teacher)/substitute')}
          activeOpacity={0.85}
        >
          <View style={styles.substituteNoticeIcon}>
            <UserCheck size={18} color={COLORS.lateText} strokeWidth={2.2} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.substituteNoticeTitle}>Period 5 Substitution Alert</Text>
              <View style={styles.substituteAlertTag}>
                <Text style={styles.substituteAlertTagText}>Assigned</Text>
              </View>
            </View>
            <Text style={styles.substituteNoticeSub}>
              Class 7-A Science (2:15 PM) • Substitute for Mr. Rajesh K.
            </Text>
          </View>
          <ChevronRight size={16} color={COLORS.slate[400]} />
        </TouchableOpacity>

        {/* TODAY'S SCHEDULE TIMELINE (Kept at bottom as requested) */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <Text style={styles.sectionSubtitle}>Monday • 6 Periods Scheduled</Text>
          </View>
          <TouchableOpacity onPress={() => navigateTo('timetable', '/(teacher)/timetable')}>
            <Text style={styles.sectionLink}>Full Week →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scheduleList}>
          {MOCK_SCHEDULE.map((item) => {
            const isDone = item.status === 'done';
            const isCurrent = item.status === 'current';
            const isSubstitute = item.status === 'substitute';

            // Clean Indian School Class naming
            const displayClassName = item.className.replace('Grade ', 'Class ');

            return (
              <View
                key={item.id}
                style={[
                  styles.scheduleItem,
                  isCurrent && styles.scheduleItemCurrent,
                  isSubstitute && styles.scheduleItemSubstitute,
                  SHADOWS.card,
                ]}
              >
                <View style={styles.schedulePeriodBadge}>
                  <Text
                    style={[
                      styles.periodNoText,
                      isCurrent && { color: COLORS.brand[700] },
                    ]}
                  >
                    P{item.periodNo}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.scheduleItemTop}>
                    <Text style={styles.scheduleClassText}>{displayClassName}</Text>
                    <Text style={styles.scheduleTimeText}>{item.timeRange}</Text>
                  </View>

                  <Text style={styles.scheduleSubjectText}>{item.subject}</Text>
                  <Text style={styles.scheduleRoomText}>{item.roomNo}</Text>

                  {item.substituteNote && (
                    <View style={styles.substituteAlertBox}>
                      <AlertCircle size={12} color={COLORS.lateText} />
                      <Text style={styles.substituteAlertText}>
                        {item.substituteNote}
                      </Text>
                    </View>
                  )}
                </View>

                {isDone && (
                  <View style={styles.doneCheck}>
                    <CheckCircle2 size={16} color={COLORS.present} />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },

  // Header Row
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  facultyGreeting: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.slate[900],
    letterSpacing: -0.3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  classInChargePill: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  classInChargeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  bulletSeparator: {
    color: COLORS.slate[300],
    fontSize: 12,
  },
  departmentText: {
    fontSize: 11,
    color: COLORS.slate[500],
    fontWeight: '500',
  },
  teacherPhotoWrapper: {
    position: 'relative',
  },
  teacherPhotoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.brand[600],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teacherPhotoInitials: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  onlineStatusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Segment Container
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.slate[100],
    borderRadius: 14,
    padding: 3,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 11,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate[600],
  },
  segmentTextActive: {
    color: COLORS.brand[700],
    fontWeight: '700',
  },

  // Ongoing Period Hero Card
  heroCard: {
    backgroundColor: COLORS.brand[600],
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  heroLiveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeTagText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  heroBody: {
    marginBottom: 16,
  },
  heroClassTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  roomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roomBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroPortionText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  heroPrimaryBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  heroPrimaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  heroSecondaryBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  heroSecondaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Quick Actions (No Card Wrapper - 4 Circular Buttons in One Row with Generous Breathing Space)
  quickActionsHeader: {
    marginTop: 26,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.slate[900],
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[600],
  },
  circleButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  circleActionItem: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  circleButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  circleActionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate[700],
    textAlign: 'center',
  },

  // Substitute Desk Notice Banner
  substituteNoticeCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  substituteNoticeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  substituteNoticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  substituteAlertTag: {
    backgroundColor: '#FDE68A',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  substituteAlertTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#78350F',
    letterSpacing: 0.5,
  },
  substituteNoticeSub: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  // Today's Schedule List
  scheduleList: {
    gap: 10,
  },
  scheduleItem: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleItemCurrent: {
    borderColor: COLORS.brand[600],
    borderWidth: 1.5,
    backgroundColor: '#FAF5FF',
  },
  scheduleItemSubstitute: {
    borderColor: COLORS.lateBorder,
    backgroundColor: COLORS.lateBg,
  },
  schedulePeriodBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodNoText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.slate[700],
  },
  scheduleItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleClassText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  scheduleTimeText: {
    fontSize: 10,
    color: COLORS.slate[500],
  },
  scheduleSubjectText: {
    fontSize: 12,
    color: COLORS.slate[700],
    marginTop: 1,
  },
  scheduleRoomText: {
    fontSize: 10,
    color: COLORS.slate[400],
  },
  substituteAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.white,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  substituteAlertText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.lateText,
  },
  doneCheck: {
    paddingRight: 4,
  },
});
