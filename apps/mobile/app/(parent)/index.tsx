import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
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
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import {
  MOCK_PARENT_DIARY,
  MOCK_PARENT_HOMEWORK,
  MOCK_REPORT_CARD,
  ParentHomeworkItem,
} from '../../src/constants/mockData';

export default function ParentHomeScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [isDiaryModalVisible, setIsDiaryModalVisible] = useState(false);
  const [isHomeworkModalVisible, setIsHomeworkModalVisible] = useState(false);
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
              <Text style={styles.overallPercentText}>94.2%</Text>
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
              <Text style={styles.heroStatValue}>
                {MOCK_REPORT_CARD.overallScore}
                <Text style={styles.heroStatDenom}>/{MOCK_REPORT_CARD.totalMarks}</Text>
              </Text>
            </View>

            <View style={styles.heroStatDivider} />

            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>PERCENTAGE</Text>
              <Text style={[styles.heroStatValue, { color: '#34D399' }]}>
                {MOCK_REPORT_CARD.percentage}%
              </Text>
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

        {/* SECTION: QUICK ACTIONS (NO CARD WRAPPER - ONLY 4 CIRCULAR BUTTONS IN ONE ROW) */}
        <View style={styles.quickActionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.circleButtonsRow}>
          {/* Button 1: Class Diary */}
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => setIsDiaryModalVisible(true)}
            activeOpacity={0.75}
          >
            <View style={[styles.circleButton, { backgroundColor: '#EEF2FF' }]}>
              <BookOpen size={22} color={COLORS.brand[600]} strokeWidth={2.2} />
            </View>
            <Text style={styles.circleActionLabel}>Diary</Text>
          </TouchableOpacity>

          {/* Button 2: Homework */}
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => setIsHomeworkModalVisible(true)}
            activeOpacity={0.75}
          >
            <View style={[styles.circleButton, { backgroundColor: '#ECFDF5' }]}>
              <ClipboardCheck size={22} color={COLORS.present} strokeWidth={2.2} />
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

          {/* Button 3: Report Card */}
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

          {/* Button 4: Class In-Charge Chat */}
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => navigateTo('chat', '/(parent)/chat')}
            activeOpacity={0.75}
          >
            <View style={[styles.circleButton, { backgroundColor: '#EFF6FF' }]}>
              <MessageSquare size={22} color="#2563EB" strokeWidth={2.2} />
            </View>
            <Text style={styles.circleActionLabel}>In-Charge</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* TODAY'S CLASS DIARY MODAL (Clean React Native Views - No <div>) */}
      <Modal
        visible={isDiaryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsDiaryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, SHADOWS.soft]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Today's Class Diary</Text>
                <Text style={styles.modalSubtitle}>Class 8-B • 4 Periods Completed</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsDiaryModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color={COLORS.slate[600]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              {MOCK_PARENT_DIARY.map((period) => (
                <View key={period.id} style={[styles.diaryItemCard, SHADOWS.card]}>
                  <View style={styles.diaryItemTop}>
                    <View style={styles.periodBadge}>
                      <Text style={styles.periodBadgeText}>Period {period.periodNo}</Text>
                    </View>
                    <Text style={styles.periodTimeText}>{period.timing}</Text>
                  </View>
                  <Text style={styles.diarySubjectName}>{period.subject}</Text>
                  <Text style={styles.diaryTeacherName}>
                    By {period.teacher} • {period.room}
                  </Text>
                  <View style={styles.topicBox}>
                    <Text style={styles.topicLabel}>TOPIC COVERED</Text>
                    <Text style={styles.topicContentText}>{period.topicTaught}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* HOMEWORK CHECKLIST MODAL (Clean React Native Views - No <div>) */}
      <Modal
        visible={isHomeworkModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsHomeworkModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, SHADOWS.soft]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Verified Homework Tasks</Text>
                <Text style={styles.modalSubtitle}>Class 8-B • Tap to mark as completed</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsHomeworkModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color={COLORS.slate[600]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 440 }} showsVerticalScrollIndicator={false}>
              {homeworkList.map((hw) => (
                <TouchableOpacity
                  key={hw.id}
                  style={[
                    styles.homeworkCard,
                    hw.isCompleted && styles.homeworkCardCompleted,
                    SHADOWS.card,
                  ]}
                  onPress={() => toggleHomework(hw.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.hwCheckboxWrap}>
                    {hw.isCompleted ? (
                      <CheckSquare size={22} color={COLORS.present} />
                    ) : (
                      <Square size={22} color={COLORS.slate[400]} />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.hwTopRow}>
                      <View style={styles.hwSubjectBadge}>
                        <Text style={styles.hwSubjectText}>{hw.subject}</Text>
                      </View>
                      <Text style={styles.hwDueDate}>Due: {hw.dueDate}</Text>
                    </View>

                    <Text style={styles.hwTitleText}>{hw.title}</Text>
                    <Text style={styles.hwInstructionsText}>{hw.instructions}</Text>

                    {hw.hasAttachment && (
                      <View style={styles.attachmentPill}>
                        <Paperclip size={12} color={COLORS.brand[600]} />
                        <Text style={styles.attachmentPillText}>
                          Blackboard Photo Attached
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.presentText,
  },
  attendanceTimestamp: {
    fontSize: 11,
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
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate[700],
    textAlign: 'center',
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
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.slate[400],
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  topicContentText: {
    fontSize: 11,
    color: COLORS.slate[700],
    lineHeight: 15,
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
});
