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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar as CalendarIcon,
  Plus,
  Paperclip,
  X,
  Clock,
  ShieldCheck,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';

interface AttendanceDay {
  date: number;
  dayName: string;
  status: 'P' | 'A' | 'L' | 'H'; // Present, Absent, Leave, Holiday
}

export default function ParentAttendanceScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
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

  // Mock days for September 2026 (1 to 30)
  const days: AttendanceDay[] = [
    { date: 1, dayName: 'Tue', status: 'P' },
    { date: 2, dayName: 'Wed', status: 'P' },
    { date: 3, dayName: 'Thu', status: 'P' },
    { date: 4, dayName: 'Fri', status: 'L' },
    { date: 5, dayName: 'Sat', status: 'H' },
    { date: 6, dayName: 'Sun', status: 'H' },
    { date: 7, dayName: 'Mon', status: 'P' },
    { date: 8, dayName: 'Tue', status: 'P' },
    { date: 9, dayName: 'Wed', status: 'P' },
    { date: 10, dayName: 'Thu', status: 'A' },
    { date: 11, dayName: 'Fri', status: 'P' },
    { date: 12, dayName: 'Sat', status: 'H' },
    { date: 13, dayName: 'Sun', status: 'H' },
    { date: 14, dayName: 'Mon', status: 'P' },
  ];

  const handleApplyLeave = () => {
    if (!leaveNotes.trim()) {
      Alert.alert('Required', 'Please enter a brief note for the Class In-Charge.');
      return;
    }
    setIsLeaveModalVisible(false);
    setLeaveNotes('');
    Alert.alert(
      'Leave Request Submitted',
      'Your request has been routed to Class In-Charge Mrs. Deepa R. You will receive an in-app confirmation once acknowledged.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
        >
          <ArrowLeft size={20} color={COLORS.slate[800]} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Attendance Record</Text>
          <Text style={styles.headerSubtitle}>Rahul Suresh • Class 8-B</Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsLeaveModalVisible(true)}
          style={styles.applyLeaveHeaderBtn}
        >
          <Plus size={18} color={COLORS.brand[600]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* BIG KPI CARDS */}
        <View style={[styles.kpiContainer, SHADOWS.card]}>
          <View style={styles.kpiMainRow}>
            <View>
              <Text style={styles.kpiMainLabel}>CURRENT ATTENDANCE RATE</Text>
              <Text style={styles.kpiMainValue}>94.2%</Text>
              <Text style={styles.kpiMainStatus}>
                Above 75% CBSE Board Eligibility Threshold
              </Text>
            </View>
            <View style={styles.shieldWrap}>
              <ShieldCheck size={36} color={COLORS.present} />
            </View>
          </View>

          <View style={styles.kpiBreakdownRow}>
            <View style={styles.kpiMiniBox}>
              <Text style={[styles.kpiMiniVal, { color: COLORS.presentText }]}>
                48
              </Text>
              <Text style={styles.kpiMiniLabel}>Days Present</Text>
            </View>
            <View style={styles.kpiMiniBox}>
              <Text style={[styles.kpiMiniVal, { color: COLORS.absentText }]}>
                3
              </Text>
              <Text style={styles.kpiMiniLabel}>Days Absent</Text>
            </View>
            <View style={styles.kpiMiniBox}>
              <Text style={[styles.kpiMiniVal, { color: COLORS.lateText }]}>
                1
              </Text>
              <Text style={styles.kpiMiniLabel}>Approved Leave</Text>
            </View>
            <View style={styles.kpiMiniBox}>
              <Text style={[styles.kpiMiniVal, { color: COLORS.slate[700] }]}>
                52
              </Text>
              <Text style={styles.kpiMiniLabel}>Total Working</Text>
            </View>
          </View>
        </View>

        {/* CALENDAR HEATMAP / GRID (September 2026) */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>September 2026 Calendar</Text>
            <Text style={styles.sectionSub}>Daily presence verification</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.present }]} />
              <Text style={styles.legendText}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.absent }]} />
              <Text style={styles.legendText}>Absent</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.late }]} />
              <Text style={styles.legendText}>Leave</Text>
            </View>
          </View>
        </View>

        <View style={[styles.calendarGridCard, SHADOWS.card]}>
          <View style={styles.calendarGrid}>
            {days.map((item) => {
              const isPresent = item.status === 'P';
              const isAbsent = item.status === 'A';
              const isLeave = item.status === 'L';
              const isHoliday = item.status === 'H';

              return (
                <View
                  key={item.date}
                  style={[
                    styles.dayCell,
                    isPresent && styles.dayCellPresent,
                    isAbsent && styles.dayCellAbsent,
                    isLeave && styles.dayCellLeave,
                    isHoliday && styles.dayCellHoliday,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      isPresent && { color: COLORS.presentText },
                      isAbsent && { color: COLORS.absentText },
                      isLeave && { color: COLORS.lateText },
                      isHoliday && { color: COLORS.slate[400] },
                    ]}
                  >
                    {item.date}
                  </Text>
                  <Text
                    style={[
                      styles.dayStatusLetter,
                      isPresent && { color: COLORS.presentText },
                      isAbsent && { color: COLORS.absentText },
                      isLeave && { color: COLORS.lateText },
                      isHoliday && { color: COLORS.slate[400] },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* RECENT ATTENDANCE AUDIT LOG */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Attendance Activity</Text>
          <Text style={styles.sectionSub}>Timestamped records</Text>
        </View>

        <View style={styles.activityList}>
          <View style={[styles.activityItem, SHADOWS.card]}>
            <View style={styles.actIconPresent}>
              <CheckCircle2 size={18} color={COLORS.presentText} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.actTopRow}>
                <Text style={styles.actDate}>Today, 14 September 2026</Text>
                <View style={styles.presentBadge}>
                  <Text style={styles.presentBadgeText}>PRESENT</Text>
                </View>
              </View>
              <Text style={styles.actDetails}>
                Recorded at 08:42 AM by Class In-Charge Mrs. Deepa R.
              </Text>
            </View>
          </View>

          <View style={[styles.activityItem, SHADOWS.card]}>
            <View style={styles.actIconAbsent}>
              <XCircle size={18} color={COLORS.absentText} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.actTopRow}>
                <Text style={styles.actDate}>Thursday, 10 September 2026</Text>
                <View style={styles.absentBadge}>
                  <Text style={styles.absentBadgeText}>ABSENT</Text>
                </View>
              </View>
              <Text style={styles.actDetails}>
                SMS & App Notification delivered to +91 98401 23456 at 09:05 AM
              </Text>
            </View>
          </View>

          <View style={[styles.activityItem, SHADOWS.card]}>
            <View style={styles.actIconLeave}>
              <AlertTriangle size={18} color={COLORS.lateText} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.actTopRow}>
                <Text style={styles.actDate}>Friday, 04 September 2026</Text>
                <View style={styles.leaveBadge}>
                  <Text style={styles.leaveBadgeText}>APPROVED LEAVE</Text>
                </View>
              </View>
              <Text style={styles.actDetails}>
                Medical intimation approved by Principal Dr. M. Jayakumar
              </Text>
            </View>
          </View>
        </View>

        {/* APPLY FOR LEAVE BUTTON */}
        <TouchableOpacity
          style={[styles.applyLeaveCta, SHADOWS.soft]}
          onPress={() => setIsLeaveModalVisible(true)}
          activeOpacity={0.8}
        >
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.applyLeaveCtaText}>
            Apply for Leave / Upload Medical Note
          </Text>
        </TouchableOpacity>
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
              <Text style={styles.modalTitle}>Submit Leave Intimation</Text>
              <TouchableOpacity
                onPress={() => setIsLeaveModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color={COLORS.slate[600]} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>REASON FOR ABSENCE</Text>
            <View style={styles.reasonRow}>
              {['Medical / Fever', 'Family Event', 'Other'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.reasonChip,
                    leaveReason === r && styles.reasonChipActive,
                  ]}
                  onPress={() => setLeaveReason(r)}
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

            <Text style={styles.inputLabel}>LEAVE DATES</Text>
            <View style={styles.datePickerSim}>
              <CalendarIcon size={16} color={COLORS.brand[600]} />
              <Text style={styles.datePickerText}>
                Tomorrow: 15 Sep 2026 (1 Day)
              </Text>
            </View>

            <Text style={styles.inputLabel}>REASON DETAILS & NOTE</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="E.g., Rahul has slight viral fever and doctor advised rest."
              placeholderTextColor={COLORS.slate[400]}
              multiline
              numberOfLines={3}
              value={leaveNotes}
              onChangeText={setLeaveNotes}
            />

            <TouchableOpacity
              style={styles.uploadAttachBtn}
              onPress={() =>
                Alert.alert(
                  'Attachment',
                  'Doctor prescription / medical slip attached.'
                )
              }
            >
              <Paperclip size={16} color={COLORS.brand[600]} />
              <Text style={styles.uploadAttachText}>
                Attach Doctor Note / Medical Slip (Optional)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitLeaveBtn}
              onPress={handleApplyLeave}
            >
              <Text style={styles.submitLeaveBtnText}>Submit to Class Teacher</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[200],
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.slate[900],
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.slate[500],
    textAlign: 'center',
    marginTop: 1,
  },
  applyLeaveHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },

  // KPI Container
  kpiContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    marginBottom: 20,
  },
  kpiMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  kpiMainLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.slate[500],
    letterSpacing: 0.5,
  },
  kpiMainValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.presentText,
    marginTop: 2,
  },
  kpiMainStatus: {
    fontSize: 11,
    color: COLORS.slate[600],
    marginTop: 4,
  },
  shieldWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.presentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[100],
    paddingTop: 12,
  },
  kpiMiniBox: {
    flex: 1,
    backgroundColor: COLORS.slate[50],
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  kpiMiniVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  kpiMiniLabel: {
    fontSize: 9,
    color: COLORS.slate[500],
    marginTop: 2,
    textAlign: 'center',
  },

  // Calendar Heatmap
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  sectionSub: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: COLORS.slate[600],
  },
  calendarGridCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    marginBottom: 20,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayCell: {
    width: '12.5%',
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.slate[50],
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  dayCellPresent: {
    backgroundColor: COLORS.presentBg,
    borderColor: COLORS.presentBorder,
  },
  dayCellAbsent: {
    backgroundColor: COLORS.absentBg,
    borderColor: COLORS.absentBorder,
  },
  dayCellLeave: {
    backgroundColor: COLORS.lateBg,
    borderColor: COLORS.lateBorder,
  },
  dayCellHoliday: {
    backgroundColor: COLORS.slate[100],
    borderColor: COLORS.slate[200],
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: '700',
  },
  dayStatusLetter: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: 1,
  },

  // Activity list
  activityList: {
    gap: 10,
    marginBottom: 24,
  },
  activityItem: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actIconPresent: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.presentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actIconAbsent: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.absentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actIconLeave: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lateBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  actDate: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  presentBadge: {
    backgroundColor: COLORS.presentBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  presentBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.presentText,
  },
  absentBadge: {
    backgroundColor: COLORS.absentBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  absentBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.absentText,
  },
  leaveBadge: {
    backgroundColor: COLORS.lateBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  leaveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.lateText,
  },
  actDetails: {
    fontSize: 11,
    color: COLORS.slate[500],
  },

  // CTA
  applyLeaveCta: {
    backgroundColor: COLORS.brand[600],
    borderRadius: 16,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  applyLeaveCtaText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },

  // Modal
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
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  modalCloseBtn: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate[500],
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 10,
  },
  reasonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  reasonChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.slate[100],
    alignItems: 'center',
  },
  reasonChipActive: {
    backgroundColor: COLORS.brand[600],
  },
  reasonChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.slate[700],
  },
  reasonChipTextActive: {
    color: COLORS.white,
  },
  datePickerSim: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.brand[50],
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.brand[100],
  },
  datePickerText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.brand[900],
  },
  notesInput: {
    backgroundColor: COLORS.slate[50],
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: COLORS.slate[900],
    textAlignVertical: 'top',
    height: 80,
  },
  uploadAttachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.slate[100],
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    justifyContent: 'center',
  },
  uploadAttachText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.brand[700],
  },
  submitLeaveBtn: {
    backgroundColor: COLORS.brand[600],
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  submitLeaveBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
