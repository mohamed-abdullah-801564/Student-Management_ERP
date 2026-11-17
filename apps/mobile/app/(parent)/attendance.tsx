import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import Svg, { Circle, G } from 'react-native-svg';
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  Plus,
  X,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { AnimatedNumberTicker } from '../../src/components/AnimatedNumberTicker';

const { width } = Dimensions.get('window');

// Calendar dot colors matching Image 5
const PRESENT_COLOR = '#8B5CF6'; // Purple
const ABSENT_COLOR = '#F87171';  // Coral / Red
const LATE_COLOR = '#FBBF24';    // Amber / Yellow
const HOLIDAY_COLOR = '#64748B'; // Muted Slate Gray

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  status: 'present' | 'absent' | 'late' | 'holiday';
}

export default function ParentAttendanceScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();

  const [currentMonth, setCurrentMonth] = useState('July 2026');
  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);
  const [leaveReason, setLeaveReason] = useState('Medical / Fever');
  const [leaveNotes, setLeaveNotes] = useState('');

  const handleBack = () => {
    try {
      navigation.navigate('index');
    } catch {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.navigate('/(parent)' as any);
      }
    }
  };

  // Calendar matrix matching Image 5 (July 2026 layout starting Sunday)
  const calendarDays: CalendarDay[] = [
    // Week 1 (June 27 - July 3)
    { day: 27, isCurrentMonth: false, status: 'holiday' },
    { day: 28, isCurrentMonth: false, status: 'holiday' },
    { day: 29, isCurrentMonth: false, status: 'holiday' },
    { day: 30, isCurrentMonth: false, status: 'holiday' },
    { day: 1, isCurrentMonth: true, status: 'present' },
    { day: 2, isCurrentMonth: true, status: 'present' },
    { day: 3, isCurrentMonth: true, status: 'absent' },

    // Week 2 (July 4 - 10)
    { day: 4, isCurrentMonth: true, status: 'late' },
    { day: 5, isCurrentMonth: true, status: 'holiday' },
    { day: 6, isCurrentMonth: true, status: 'present' },
    { day: 7, isCurrentMonth: true, status: 'present' },
    { day: 8, isCurrentMonth: true, status: 'late' },
    { day: 9, isCurrentMonth: true, status: 'present' },
    { day: 10, isCurrentMonth: true, status: 'present' },

    // Week 3 (July 11 - 17)
    { day: 11, isCurrentMonth: true, status: 'holiday' },
    { day: 12, isCurrentMonth: true, status: 'absent' },
    { day: 13, isCurrentMonth: true, status: 'present' },
    { day: 14, isCurrentMonth: true, status: 'present' },
    { day: 15, isCurrentMonth: true, status: 'present' },
    { day: 16, isCurrentMonth: true, status: 'late' },
    { day: 17, isCurrentMonth: true, status: 'present' },

    // Week 4 (July 18 - 24)
    { day: 18, isCurrentMonth: true, status: 'holiday' },
    { day: 19, isCurrentMonth: true, status: 'absent' },
    { day: 20, isCurrentMonth: true, status: 'present' },
    { day: 21, isCurrentMonth: true, status: 'present' },
    { day: 22, isCurrentMonth: true, status: 'present' },
    { day: 23, isCurrentMonth: true, status: 'present' },
    { day: 24, isCurrentMonth: true, status: 'absent' },

    // Week 5 (July 25 - 31)
    { day: 25, isCurrentMonth: true, status: 'holiday' },
    { day: 26, isCurrentMonth: true, status: 'present' },
    { day: 27, isCurrentMonth: true, status: 'present' },
    { day: 28, isCurrentMonth: true, status: 'present' },
    { day: 29, isCurrentMonth: true, status: 'present' },
    { day: 30, isCurrentMonth: true, status: 'present' },
    { day: 31, isCurrentMonth: true, status: 'present' },
  ];

  // Donut chart geometry
  const chartSize = 130;
  const strokeWidth = 14;
  const radius = (chartSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius; // ~364.4

  // Breakdown percentages: Present 75%, Absent 14%, Late 11%
  const presentStroke = 0.70 * circumference;
  const absentStroke = 0.16 * circumference;
  const lateStroke = 0.14 * circumference;

  const handleApplyLeave = () => {
    if (!leaveNotes.trim()) {
      Alert.alert('Required', 'Please enter a brief note for Class In-Charge Mrs. Deepa R.');
      return;
    }
    setIsLeaveModalVisible(false);
    setLeaveNotes('');
    Alert.alert(
      'Leave Request Submitted',
      'Your request for Rahul Suresh has been routed to Class In-Charge Mrs. Deepa R. You will receive an alert once approved.',
      [{ text: 'OK' }]
    );
  };

  const getDotColor = (status: CalendarDay['status']) => {
    switch (status) {
      case 'present':
        return PRESENT_COLOR;
      case 'absent':
        return ABSENT_COLOR;
      case 'late':
        return LATE_COLOR;
      case 'holiday':
        return HOLIDAY_COLOR;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TOP APP BAR (Image 5 style: Back icon, Title "Attendance", More "..." icon) */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.circleIconBtn}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color={COLORS.slate[800]} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Attendance</Text>

        <TouchableOpacity
          onPress={() => setIsLeaveModalVisible(true)}
          style={styles.circleIconBtn}
          activeOpacity={0.7}
        >
          <MoreHorizontal size={20} color={COLORS.slate[800]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CARD 1: CALENDAR VIEW WITH MONTH SWITCHER & DOTS (Image 5) */}
        <View style={[styles.card, SHADOWS.card]}>
          {/* Month Switcher Header */}
          <View style={styles.monthHeaderRow}>
            <TouchableOpacity
              onPress={() => setCurrentMonth('June 2026')}
              style={styles.monthArrowBtn}
            >
              <ChevronLeft size={18} color={COLORS.slate[600]} />
            </TouchableOpacity>

            <Text style={styles.monthTitleText}>{currentMonth}</Text>

            <TouchableOpacity
              onPress={() => setCurrentMonth('August 2026')}
              style={styles.monthArrowBtn}
            >
              <ChevronRight size={18} color={COLORS.slate[600]} />
            </TouchableOpacity>
          </View>

          {/* Weekday Labels (Sun, Mon, Tue, Wed, Thu, Fri, Sat) */}
          <View style={styles.weekdaysRow}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w, idx) => (
              <Text key={idx} style={styles.weekdayLabel}>
                {w}
              </Text>
            ))}
          </View>

          {/* Calendar Grid with Date Number + Colored Dot */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((item, idx) => (
              <View key={idx} style={styles.dayCell}>
                <Text
                  style={[
                    styles.dayNumberText,
                    !item.isCurrentMonth && styles.dayNumberMuted,
                  ]}
                >
                  {item.day}
                </Text>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getDotColor(item.status) },
                  ]}
                />
              </View>
            ))}
          </View>

          {/* Legend Row under Calendar */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: PRESENT_COLOR }]} />
              <Text style={styles.legendText}>Present</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: ABSENT_COLOR }]} />
              <Text style={styles.legendText}>Absent</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: LATE_COLOR }]} />
              <Text style={styles.legendText}>Late</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: HOLIDAY_COLOR }]} />
              <Text style={styles.legendText}>Holiday</Text>
            </View>
          </View>
        </View>

        {/* CARD 2: DONUT CHART & BREAKDOWN (Image 5) */}
        <View style={[styles.card, SHADOWS.card, styles.donutCardRow]}>
          {/* Circular Donut Chart with 75% in center */}
          <View style={styles.donutWrap}>
            <Svg width={chartSize} height={chartSize}>
              <G rotation="-90" origin={`${chartSize / 2}, ${chartSize / 2}`}>
                {/* Background Ring */}
                <Circle
                  cx={chartSize / 2}
                  cy={chartSize / 2}
                  r={radius}
                  stroke="#F1F5F9"
                  strokeWidth={strokeWidth}
                  fill="none"
                />

                {/* Present Segment (70% - Purple) */}
                <Circle
                  cx={chartSize / 2}
                  cy={chartSize / 2}
                  r={radius}
                  stroke={PRESENT_COLOR}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${presentStroke} ${circumference}`}
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Late Segment (14% - Amber) */}
                <Circle
                  cx={chartSize / 2}
                  cy={chartSize / 2}
                  r={radius}
                  stroke={LATE_COLOR}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${lateStroke} ${circumference}`}
                  strokeDashoffset={-presentStroke}
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Absent Segment (16% - Coral) */}
                <Circle
                  cx={chartSize / 2}
                  cy={chartSize / 2}
                  r={radius}
                  stroke={ABSENT_COLOR}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${absentStroke} ${circumference}`}
                  strokeDashoffset={-(presentStroke + lateStroke)}
                  strokeLinecap="round"
                  fill="none"
                />
              </G>
            </Svg>

            {/* Donut Center Text */}
            <View style={styles.donutCenterContent}>
              <Text style={styles.donutCenterValue}>75%</Text>
              <Text style={styles.donutCenterLabel}>Present</Text>
            </View>
          </View>

          {/* Breakdown Stats on Right */}
          <View style={styles.statsBreakdownList}>
            <View style={styles.statLine}>
              <View style={styles.statLineLeft}>
                <View style={[styles.statLineDot, { backgroundColor: PRESENT_COLOR }]} />
                <Text style={styles.statLineLabel}>Present</Text>
              </View>
              <Text style={styles.statLineValue}>14</Text>
            </View>

            <View style={styles.statLine}>
              <View style={styles.statLineLeft}>
                <View style={[styles.statLineDot, { backgroundColor: ABSENT_COLOR }]} />
                <Text style={styles.statLineLabel}>Absent</Text>
              </View>
              <Text style={styles.statLineValue}>4</Text>
            </View>

            <View style={styles.statLine}>
              <View style={styles.statLineLeft}>
                <View style={[styles.statLineDot, { backgroundColor: LATE_COLOR }]} />
                <Text style={styles.statLineLabel}>Late</Text>
              </View>
              <Text style={styles.statLineValue}>3</Text>
            </View>
          </View>
        </View>

        {/* SECTION 3: ATTENDANCE HISTORY LIST (Image 5) */}
        <View style={styles.historySection}>
          <View style={styles.historySectionHeader}>
            <Text style={styles.historyTitle}>Attendance History</Text>
            <TouchableOpacity
              onPress={() => setIsLeaveModalVisible(true)}
              style={styles.applyLeavePillBtn}
            >
              <Plus size={14} color={COLORS.brand[600]} />
              <Text style={styles.applyLeavePillText}>Apply Leave</Text>
            </TouchableOpacity>
          </View>

          {/* Card 1: July 21, 2026 - Present */}
          <View style={[styles.historyCard, SHADOWS.card]}>
            <View style={styles.historyLeft}>
              <View style={[styles.historyIconBox, { backgroundColor: '#F3E8FF' }]}>
                <CheckCircle2 size={20} color={PRESENT_COLOR} />
              </View>
              <View>
                <Text style={styles.historyDateText}>July 21, 2026</Text>
                <Text style={styles.historyDaySubtext}>Wednesday • 08:35 AM</Text>
              </View>
            </View>

            <View style={[styles.statusPill, { backgroundColor: '#F3E8FF' }]}>
              <Text style={[styles.statusPillText, { color: '#7C3AED' }]}>Present</Text>
            </View>
          </View>

          {/* Card 2: July 12, 2026 - Absent */}
          <View style={[styles.historyCard, SHADOWS.card]}>
            <View style={styles.historyLeft}>
              <View style={[styles.historyIconBox, { backgroundColor: '#FEE2E2' }]}>
                <XCircle size={20} color={ABSENT_COLOR} />
              </View>
              <View>
                <Text style={styles.historyDateText}>July 12, 2026</Text>
                <Text style={styles.historyDaySubtext}>Monday • Unexcused</Text>
              </View>
            </View>

            <View style={[styles.statusPill, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.statusPillText, { color: '#DC2626' }]}>Absent</Text>
            </View>
          </View>

          {/* Card 3: July 08, 2026 - Late */}
          <View style={[styles.historyCard, SHADOWS.card]}>
            <View style={styles.historyLeft}>
              <View style={[styles.historyIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Clock size={20} color={LATE_COLOR} />
              </View>
              <View>
                <Text style={styles.historyDateText}>July 08, 2026</Text>
                <Text style={styles.historyDaySubtext}>Thursday • Arrived 08:52 AM</Text>
              </View>
            </View>

            <View style={[styles.statusPill, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.statusPillText, { color: '#D97706' }]}>Late</Text>
            </View>
          </View>

          {/* Card 4: July 07, 2026 - Present */}
          <View style={[styles.historyCard, SHADOWS.card]}>
            <View style={styles.historyLeft}>
              <View style={[styles.historyIconBox, { backgroundColor: '#F3E8FF' }]}>
                <CheckCircle2 size={20} color={PRESENT_COLOR} />
              </View>
              <View>
                <Text style={styles.historyDateText}>July 07, 2026</Text>
                <Text style={styles.historyDaySubtext}>Wednesday • 08:32 AM</Text>
              </View>
            </View>

            <View style={[styles.statusPill, { backgroundColor: '#F3E8FF' }]}>
              <Text style={[styles.statusPillText, { color: '#7C3AED' }]}>Present</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* LEAVE APPLICATION MODAL */}
      <Modal
        visible={isLeaveModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsLeaveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, SHADOWS.soft]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Submit Leave Request</Text>
                <Text style={styles.modalSubtitle}>Student: Rahul Suresh • Class 8-B</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsLeaveModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color={COLORS.slate[600]} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.inputLabel}>REASON FOR ABSENCE</Text>
              <View style={styles.reasonPickerRow}>
                {['Medical / Fever', 'Family Event', 'Emergency', 'Other'].map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setLeaveReason(r)}
                    style={[
                      styles.reasonChip,
                      leaveReason === r && styles.reasonChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.reasonChipText,
                        leaveReason === r && styles.reasonChipTextActive,
                      ]}
                    >
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.inputLabel, { marginTop: 16 }]}>
                NOTE FOR CLASS IN-CHARGE MRS. DEEPA R.
              </Text>
              <TextInput
                style={styles.textAreaInput}
                multiline
                numberOfLines={3}
                placeholder="Briefly state doctor's consultation or reason for absence..."
                placeholderTextColor={COLORS.slate[400]}
                value={leaveNotes}
                onChangeText={setLeaveNotes}
              />

              <TouchableOpacity
                onPress={handleApplyLeave}
                activeOpacity={0.8}
                style={styles.submitLeaveBtn}
              >
                <Text style={styles.submitLeaveBtnText}>
                  Send Leave Notification
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
    backgroundColor: '#F8F9FD',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  circleIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  // Base Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 16,
  },

  // Month Switcher Row
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 18,
  },
  monthArrowBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  monthTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate[900],
  },

  // Weekdays Row
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  weekdayLabel: {
    width: (width - 76) / 7,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate[400],
  },

  // Calendar Grid
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: (width - 76) / 7,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  dayNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[800],
    marginBottom: 3,
  },
  dayNumberMuted: {
    color: COLORS.slate[300],
  },
  statusDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.5,
  },

  // Legend Row
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 14,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.slate[500],
  },

  // Donut Card Row
  donutCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 22,
  },
  donutWrap: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  donutCenterContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenterValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  donutCenterLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.slate[400],
    marginTop: -2,
  },
  statsBreakdownList: {
    flex: 1,
    paddingLeft: 30,
    gap: 14,
  },
  statLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statLineLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.slate[600],
  },
  statLineValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.slate[900],
  },

  // History Section
  historySection: {
    marginTop: 8,
  },
  historySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  applyLeavePillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  applyLeavePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  historyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDateText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  historyDaySubtext: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    paddingBottom: 38,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.slate[500],
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalForm: {},
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate[400],
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  reasonPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reasonChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  reasonChipActive: {
    backgroundColor: COLORS.brand[600],
  },
  reasonChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[600],
  },
  reasonChipTextActive: {
    color: COLORS.white,
  },
  textAreaInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 13,
    color: COLORS.slate[800],
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitLeaveBtn: {
    backgroundColor: COLORS.brand[600],
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  submitLeaveBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
