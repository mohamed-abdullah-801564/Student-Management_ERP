import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import {
  CheckCircle2,
  ChevronRight,
  BookOpen,
  ClipboardCheck,
  Award,
  MessageSquare,
  Sparkles,
  X,
  CheckSquare,
  Square,
  Paperclip,
  CalendarCheck,
  Users,
  Clock,
  CreditCard,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import {
  MOCK_PARENT_DIARY,
  MOCK_PARENT_HOMEWORK,
  MOCK_REPORT_CARD,
  ParentHomeworkItem,
} from '../../src/constants/mockData';
import { AnimatedNumberTicker } from '../../src/components/AnimatedNumberTicker';

const CLASS_8B_TEACHERS = [
  {
    id: 't1',
    name: 'Mrs. Deepa R.',
    subject: 'Mathematics',
    designation: 'Senior Faculty • Class 8-B In-Charge',
    initials: 'DR',
    isClassTeacher: true,
  },
  {
    id: 't2',
    name: 'Mr. Anand Kumar',
    subject: 'Physics & Science',
    designation: 'HOD Science • 12 Yrs Exp',
    initials: 'AK',
    isClassTeacher: false,
  },
  {
    id: 't3',
    name: 'Mr. Venkatesh R.',
    subject: 'Social Science & History',
    designation: 'Secondary Faculty • 9 Yrs Exp',
    initials: 'VR',
    isClassTeacher: false,
  },
  {
    id: 't4',
    name: 'Mrs. Preetha V.',
    subject: 'English Core & Lit.',
    designation: 'Senior English Faculty',
    initials: 'PV',
    isClassTeacher: false,
  },
  {
    id: 't5',
    name: 'Dr. S. Raman',
    subject: 'Second Language (Sanskrit/Tamil)',
    designation: 'Department of Languages',
    initials: 'SR',
    isClassTeacher: false,
  },
  {
    id: 't6',
    name: 'Mr. Karthik Raja',
    subject: 'Physical Education & Sports',
    designation: 'Sports Director • Athletics In-Charge',
    initials: 'KR',
    isClassTeacher: false,
  },
];

export default function ParentHomeScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [isDiaryModalVisible, setIsDiaryModalVisible] = useState(false);
  const [isHomeworkModalVisible, setIsHomeworkModalVisible] = useState(false);
  const [isTeachersModalVisible, setIsTeachersModalVisible] = useState(false);
  const [homeworkList, setHomeworkList] = useState<ParentHomeworkItem[]>(MOCK_PARENT_HOMEWORK);

  const toggleHomework = (id: string) => {
    setHomeworkList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

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
        {/* TOP HEADER: GREETING & STUDENT PROFILE PHOTO (No notification icon) */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.greetingTitle}>Good Morning, Mr. Suresh</Text>
            <Text style={styles.greetingSubtitle}>Rahul Suresh • Class 8-B</Text>
          </View>

          {/* Student Profile Photo (From Admission) */}
          <View style={styles.studentPhotoWrapper}>
            <View style={styles.studentPhotoCircle}>
              <Text style={styles.studentPhotoInitials}>RS</Text>
            </View>
            <View style={styles.onlineStatusDot} />
          </View>
        </View>

        {/* CARD 1: TODAY'S ATTENDANCE */}
        <View style={[styles.attendanceCard, SHADOWS.card]}>
          <View style={styles.attendanceLeft}>
            <View style={styles.attendanceIconWrap}>
              <CheckCircle2 size={24} color={COLORS.present} strokeWidth={2.4} />
            </View>
            <View style={styles.attendanceTextWrap}>
              <Text style={styles.attendanceTitle}>
                Class 8-B • Present Today
              </Text>
              <Text style={styles.attendanceTimestamp}>
                Marked by Class In-Charge Mrs. Deepa at 08:42 AM
              </Text>
            </View>
          </View>

          <View style={styles.attendanceRight}>
            <View style={styles.overallPercentBadge}>
              <AnimatedNumberTicker
                value={94.2}
                decimalPlaces={1}
                suffix="%"
                style={styles.overallPercentText}
              />
              <Text style={styles.overallPercentSub}>Overall</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigateTo('attendance', '/(parent)/attendance')}
              style={styles.viewLogLink}
            >
              <Text style={styles.viewLogLinkText}>Log</Text>
              <ChevronRight size={12} color={COLORS.brand[600]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION HEADER: LATEST ASSESSMENT WITH "ALL ASSESSMENTS →" LINK */}
        <View style={styles.assessmentHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Academic Assessment</Text>
            <Text style={styles.sectionSubtitle}>
              Term 1 Report Card • Class 8-B
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigateTo('marks', '/(parent)/marks')}
            activeOpacity={0.8}
            style={styles.allAssessmentsLinkWrap}
          >
            <Text style={styles.allAssessmentsLinkText}>All Assessments →</Text>
          </TouchableOpacity>
        </View>

        {/* CARD 2: LATEST ACADEMIC ASSESSMENT (ROYAL BLUE HERO CARD MATCHING TEACHER HOME) */}
        <View style={[styles.assessmentBlueHeroCard, SHADOWS.soft]}>
          <View style={styles.heroTopHeader}>
            <View style={styles.heroLivePill}>
              <Sparkles size={11} color="#FFFFFF" />
              <Text style={styles.heroLiveText}>
                {MOCK_REPORT_CARD.examName.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.heroTermYearText}>
              AY {MOCK_REPORT_CARD.academicYear}
            </Text>
          </View>

          <Text style={styles.heroAssessmentTitle}>
            Term 1 Periodic Assessment
          </Text>

          {/* 3 Translucent Stats Boxes */}
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>TOTAL SCORE</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <AnimatedNumberTicker
                  value={MOCK_REPORT_CARD.overallScore}
                  style={styles.heroStatValue}
                />
                <Text style={styles.heroStatDenom}>/{MOCK_REPORT_CARD.totalMarks}</Text>
              </View>
            </View>

            <View style={styles.heroStatDivider} />

            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>PERCENTAGE</Text>
              <AnimatedNumberTicker
                value={MOCK_REPORT_CARD.percentage}
                decimalPlaces={1}
                suffix="%"
                style={[styles.heroStatValue, { color: '#34D399' }]}
              />
            </View>

            <View style={styles.heroStatDivider} />

            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>CLASS RANK</Text>
              <Text style={[styles.heroStatValue, { color: '#FBBF24' }]}>
                Rank #{MOCK_REPORT_CARD.classRank}
              </Text>
            </View>
          </View>

          {/* In-Charge Teacher Remark Quote in Frosted Box */}
          <View style={styles.heroQuoteBox}>
            <Text style={styles.heroQuoteHeader}>CLASS IN-CHARGE REMARK</Text>
            <Text style={styles.heroQuoteBody}>
              "{MOCK_REPORT_CARD.inChargeRemark}"
            </Text>
            <Text style={styles.heroQuoteAuthor}>
              — {MOCK_REPORT_CARD.inChargeName}
            </Text>
          </View>

          {/* Solid White CTA Button */}
          <TouchableOpacity
            style={styles.heroWhiteBtn}
            onPress={() => navigateTo('marks', '/(parent)/marks')}
            activeOpacity={0.85}
          >
            <Text style={styles.heroWhiteBtnText}>
              View Detailed Marksheet
            </Text>
            <ChevronRight size={15} color={COLORS.brand[700]} />
          </TouchableOpacity>
        </View>

        {/* SECTION: QUICK ACTIONS (2 BALANCED ROWS OF 4 CIRCULAR BUTTONS) */}
        <View style={styles.quickActionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.quickActionSubtitle}>Essential student & academic services</Text>
        </View>

        {/* ROW 1: ACADEMIC & DAILY LOGS */}
        <View style={styles.circleButtonsRow}>
          {/* Button 1: Attendance */}
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => navigateTo('attendance', '/(parent)/attendance')}
            activeOpacity={0.75}
          >
            <View style={[styles.circleButton, { backgroundColor: '#ECFDF5' }]}>
              <CalendarCheck size={22} color={COLORS.present} strokeWidth={2.2} />
            </View>
            <Text style={styles.circleActionLabel}>Attendance</Text>
          </TouchableOpacity>

          {/* Button 2: Class Diary */}
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => navigateTo('diary', '/(parent)/diary')}
            activeOpacity={0.75}
          >
            <View style={[styles.circleButton, { backgroundColor: '#EEF2FF' }]}>
              <BookOpen size={22} color={COLORS.brand[600]} strokeWidth={2.2} />
            </View>
            <Text style={styles.circleActionLabel}>Diary</Text>
          </TouchableOpacity>

          {/* Button 3: Homework */}
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => navigateTo('homework', '/(parent)/homework')}
            activeOpacity={0.75}
          >
            <View style={[styles.circleButton, { backgroundColor: '#EFF6FF' }]}>
              <ClipboardCheck size={22} color="#2563EB" strokeWidth={2.2} />
              {homeworkList.filter((h) => !h.isCompleted).length > 0 && (
                <View style={styles.circleBadge}>
                  <Text style={styles.circleBadgeText}>
                    {homeworkList.filter((h) => !h.isCompleted).length}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.circleActionLabel}>Homework</Text>
          </TouchableOpacity>

          {/* Button 4: Report Card */}
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => navigateTo('marks', '/(parent)/marks')}
            activeOpacity={0.75}
          >
            <View style={[styles.circleButton, { backgroundColor: '#FAF5FF' }]}>
              <Award size={22} color="#9333EA" strokeWidth={2.2} />
            </View>
            <Text style={styles.circleActionLabel}>Report Card</Text>
          </TouchableOpacity>
        </View>

        {/* ROW 2: FACULTY & TIMETABLE */}
        <View style={[styles.circleButtonsRow, { marginTop: 16 }]}>
          {/* Button 5: Subject Teachers */}
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => navigateTo('teachers', '/(parent)/teachers')}
            activeOpacity={0.75}
          >
            <View style={[styles.circleButton, { backgroundColor: '#F0F9FF' }]}>
              <Users size={22} color="#0284C7" strokeWidth={2.2} />
            </View>
            <Text style={styles.circleActionLabel}>Teachers</Text>
          </TouchableOpacity>

          {/* Button 6: Class In-Charge Chat */}
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => navigateTo('chat', '/(parent)/chat')}
            activeOpacity={0.75}
          >
            <View style={[styles.circleButton, { backgroundColor: '#FEF3C7' }]}>
              <MessageSquare size={22} color="#D97706" strokeWidth={2.2} />
            </View>
            <Text style={styles.circleActionLabel}>In-Charge</Text>
          </TouchableOpacity>

          {/* Button 7: Timetable */}
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => navigateTo('timetable', '/(parent)/timetable')}
            activeOpacity={0.75}
          >
            <View style={[styles.circleButton, { backgroundColor: '#F3E8FF' }]}>
              <Clock size={22} color="#7E22CE" strokeWidth={2.2} />
            </View>
            <Text style={styles.circleActionLabel}>Timetable</Text>
          </TouchableOpacity>

          {/* Button 8: Fee Desk */}
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => navigateTo('fees', '/(parent)/fees')}
            activeOpacity={0.75}
          >
            <View style={[styles.circleButton, { backgroundColor: '#F0FDFA' }]}>
              <CreditCard size={22} color="#0D9488" strokeWidth={2.2} />
              <View style={[styles.circleBadge, { backgroundColor: '#EA580C' }]}>
                <Text style={styles.circleBadgeText}>Due</Text>
              </View>
            </View>
            <Text style={styles.circleActionLabel}>Fee Desk</Text>
          </TouchableOpacity>
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
    paddingTop: 16,
    paddingBottom: 40,
  },

  // Top Header
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.slate[900],
    letterSpacing: -0.3,
  },
  greetingSubtitle: {
    fontSize: 12,
    color: COLORS.slate[500],
    marginTop: 2,
    fontWeight: '600',
  },
  studentPhotoWrapper: {
    position: 'relative',
  },
  studentPhotoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.brand[600],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentPhotoInitials: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  onlineStatusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: COLORS.present,
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  // Attendance Card
  attendanceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.presentBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  attendanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  attendanceIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.presentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendanceTextWrap: {
    flex: 1,
  },
  attendanceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.presentText,
  },
  attendanceTimestamp: {
    fontSize: 12,
    color: COLORS.slate[500],
    marginTop: 2,
  },
  attendanceRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  overallPercentBadge: {
    backgroundColor: COLORS.presentBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignItems: 'center',
  },
  overallPercentText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.presentText,
  },
  overallPercentSub: {
    fontSize: 9,
    color: COLORS.presentText,
    fontWeight: '600',
  },
  viewLogLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewLogLinkText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.brand[600],
  },

  // Assessment Header Row with "All Assessments →" Link
  assessmentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  allAssessmentsLinkWrap: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  allAssessmentsLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[600],
  },

  // Assessment Hero Card (Vibrant Royal Blue matching Teacher Home)
  assessmentBlueHeroCard: {
    backgroundColor: COLORS.brand[600],
    borderRadius: 20,
    padding: 18,
    marginBottom: 26,
  },
  heroTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heroLiveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroTermYearText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  heroAssessmentTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 14,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  heroStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  heroStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heroStatLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  heroStatValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroStatDenom: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  heroQuoteBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  heroQuoteHeader: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  heroQuoteBody: {
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  heroQuoteAuthor: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
    textAlign: 'right',
  },
  heroWhiteBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  heroWhiteBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[700],
  },

  // Quick Actions (No outer card - 4 circular buttons in one row with generous breathing space)
  quickActionHeader: {
    marginTop: 26,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.slate[900],
    letterSpacing: -0.2,
  },
  quickActionSubtitle: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 2,
    fontWeight: '500',
  },
  circleButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
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
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[700],
    textAlign: 'center',
    lineHeight: 16,
  },
  circleBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.absent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  circleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.white,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  modalSubtitle: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },

  // Diary items inside modal
  diaryItemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    marginBottom: 10,
  },
  diaryItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  periodBadge: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  periodBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  periodTimeText: {
    fontSize: 10,
    color: COLORS.slate[500],
  },
  diarySubjectName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  diaryTeacherName: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginBottom: 8,
  },
  topicBox: {
    backgroundColor: COLORS.slate[50],
    padding: 8,
    borderRadius: 8,
  },
  topicLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate[500],
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  topicContentText: {
    fontSize: 13,
    color: COLORS.slate[800],
    lineHeight: 18,
    fontWeight: '500',
  },

  // Homework inside modal
  homeworkCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  homeworkCardCompleted: {
    backgroundColor: COLORS.slate[50],
    opacity: 0.75,
  },
  hwCheckboxWrap: {
    paddingTop: 2,
  },
  hwTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  hwSubjectBadge: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  hwSubjectText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  hwDueDate: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.lateText,
  },
  hwTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[900],
    marginBottom: 2,
  },
  hwInstructionsText: {
    fontSize: 11,
    color: COLORS.slate[600],
    lineHeight: 16,
  },
  attachmentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.brand[50],
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  },
  attachmentPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.brand[700],
  },

  // Faculty Items inside modal
  teacherItemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  teacherAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.brand[200],
  },
  teacherAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  teacherNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  teacherName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  classTeacherBadge: {
    backgroundColor: COLORS.presentBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  classTeacherBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.presentText,
  },
  teacherSubject: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.brand[600],
    marginTop: 1,
  },
  teacherExperience: {
    fontSize: 10,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  teacherChatBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
