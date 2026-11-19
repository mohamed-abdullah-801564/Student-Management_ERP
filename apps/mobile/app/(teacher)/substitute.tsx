import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
  Building2,
  ArrowRight,
  Shield,
  AlertCircle,
  X,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { schoolStore, SubstitutionRecord } from '../../src/lib/schoolStore';

export default function SubstituteAllocationScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState<'pending' | 'allocated'>('pending');
  const [substitutions, setSubstitutions] = useState<SubstitutionRecord[]>(schoolStore.getSubstitutions());
  const [selectedSubForConfirm, setSelectedSubForConfirm] = useState<{
    sub: SubstitutionRecord;
    teacherName: string;
    teacherDept: string;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = schoolStore.subscribe(() => {
      setSubstitutions(schoolStore.getSubstitutions());
    });
    return unsubscribe;
  }, []);

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

  const handleConfirmAssignment = () => {
    if (!selectedSubForConfirm) return;
    const { sub, teacherName } = selectedSubForConfirm;

    schoolStore.assignSubstitute(sub.id, teacherName);
    setSelectedSubForConfirm(null);

    Alert.alert(
      'Substitute Allocated ✓',
      `${teacherName} has been assigned to ${sub.gradeSection} (${sub.period} - ${sub.subject}). Notification dispatched to faculty.`,
      [{ text: 'OK' }]
    );
  };

  const pendingList = substitutions.filter((s) => s.status === 'pending');
  const allocatedList = substitutions.filter((s) => s.status === 'allocated');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. INSTITUTIONAL TOP BAR */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color={COLORS.slate[800]} strokeWidth={2.5} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Faculty Substitution Desk</Text>
            <Text style={styles.headerSubtitle}>
              Greenwood Academy • Coordinator Terminal
            </Text>
          </View>
        </View>

        <View style={styles.dateTag}>
          <Calendar size={13} color={COLORS.slate[600]} />
          <Text style={styles.dateTagText}>Today • 16 Nov</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. OPERATIONAL SUMMARY KPI BAR */}
        <View style={[styles.kpiContainer, SHADOWS.card]}>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiValuePending}>{pendingList.length}</Text>
            <Text style={styles.kpiLabel}>Pending Allocation</Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpiItem}>
            <Text style={styles.kpiValueAllocated}>{allocatedList.length}</Text>
            <Text style={styles.kpiLabel}>Covered Today</Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpiItem}>
            <Text style={styles.kpiValueTotal}>2</Text>
            <Text style={styles.kpiLabel}>Faculty on Leave</Text>
          </View>
        </View>

        {/* 3. SEGMENTED TABS */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'pending' && styles.tabBtnActive]}
            onPress={() => setActiveTab('pending')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'pending' && styles.tabTextActive,
              ]}
            >
              Action Required ({pendingList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'allocated' && styles.tabBtnActive]}
            onPress={() => setActiveTab('allocated')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'allocated' && styles.tabTextActive,
              ]}
            >
              Covered Schedule ({allocatedList.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* 4. TAB 1: PENDING SUBSTITUTION REQUESTS */}
        {activeTab === 'pending' && (
          <View style={styles.listSection}>
            {pendingList.length === 0 ? (
              <View style={[styles.emptyCard, SHADOWS.card]}>
                <CheckCircle2 size={32} color="#059669" />
                <Text style={styles.emptyTitle}>All Periods Covered</Text>
                <Text style={styles.emptySub}>
                  There are no pending unassigned substitutions for today.
                </Text>
              </View>
            ) : (
              pendingList.map((sub) => (
                <View key={sub.id} style={[styles.subCard, SHADOWS.card]}>
                  {/* Card Header */}
                  <View style={styles.subCardHeader}>
                    <View style={styles.periodPill}>
                      <Clock size={12} color="#4338CA" />
                      <Text style={styles.periodPillText}>{sub.period}</Text>
                    </View>
                    <Text style={styles.timeSlotText}>{sub.timeSlot}</Text>
                    <View style={styles.urgentBadge}>
                      <Text style={styles.urgentBadgeText}>Unallocated</Text>
                    </View>
                  </View>

                  {/* Class & Subject Details */}
                  <View style={styles.classInfoRow}>
                    <View style={styles.classInfoLeft}>
                      <Text style={styles.gradeTitle}>{sub.gradeSection}</Text>
                      <Text style={styles.subjectText} numberOfLines={1}>
                        {sub.subject} • {sub.room}
                      </Text>
                    </View>
                    <View style={styles.absentFacultyBox}>
                      <Text style={styles.absentLabel}>Absent Faculty</Text>
                      <Text style={styles.absentFacultyName} numberOfLines={1}>{sub.absentFaculty}</Text>
                      <Text style={styles.leaveReasonText} numberOfLines={1}>{sub.leaveReason}</Text>
                    </View>
                  </View>

                  {/* Available Faculty Matching Table */}
                  <View style={styles.facultyMatchingBox}>
                    <Text style={styles.matchingHeader}>
                      FREE FACULTY AVAILABLE DURING {sub.period.toUpperCase()}
                    </Text>

                    {/* Faculty Option 1 */}
                    <View style={styles.facultyRow}>
                      <View style={styles.facultyMeta}>
                        <View style={styles.facultyAvatar}>
                          <Text style={styles.facultyAvatarText}>KR</Text>
                        </View>
                        <View style={styles.facultyInfo}>
                          <Text style={styles.facultyName} numberOfLines={1}>Mr. Karthik Raja</Text>
                          <Text style={styles.facultySub} numberOfLines={1}>
                            Physics Dept • Free {sub.period} • Load: 2/6
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.assignPrimaryBtn}
                        onPress={() =>
                          setSelectedSubForConfirm({
                            sub,
                            teacherName: 'Mr. Karthik Raja',
                            teacherDept: 'Physics Dept',
                          })
                        }
                        activeOpacity={0.8}
                      >
                        <Text style={styles.assignPrimaryText}>Assign</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Faculty Option 2 */}
                    <View style={styles.facultyRow}>
                      <View style={styles.facultyMeta}>
                        <View style={styles.facultyAvatarMuted}>
                          <Text style={styles.facultyAvatarTextMuted}>SR</Text>
                        </View>
                        <View style={styles.facultyInfo}>
                          <Text style={styles.facultyName} numberOfLines={1}>Mrs. Shalini Raman</Text>
                          <Text style={styles.facultySub} numberOfLines={1}>
                            Math Dept • Free {sub.period} • Load: 4/6
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.assignSecondaryBtn}
                        onPress={() =>
                          setSelectedSubForConfirm({
                            sub,
                            teacherName: 'Mrs. Shalini Raman',
                            teacherDept: 'Math Dept',
                          })
                        }
                        activeOpacity={0.8}
                      >
                        <Text style={styles.assignSecondaryText}>Assign</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* 5. TAB 2: ALLOCATED COVERED SCHEDULE */}
        {activeTab === 'allocated' && (
          <View style={styles.listSection}>
            {allocatedList.map((sub) => (
              <View key={sub.id} style={[styles.coveredCard, SHADOWS.card]}>
                <View style={styles.coveredHeader}>
                  <View style={styles.periodPillAllocated}>
                    <CheckCircle2 size={12} color="#059669" />
                    <Text style={styles.periodPillAllocatedText}>{sub.period}</Text>
                  </View>
                  <Text style={styles.timeSlotText}>{sub.timeSlot}</Text>
                  <View style={styles.confirmedBadge}>
                    <Text style={styles.confirmedBadgeText}>Covered ✓</Text>
                  </View>
                </View>

                <View style={styles.coveredBody}>
                  <Text style={styles.gradeTitle}>{sub.gradeSection}</Text>
                  <Text style={styles.subjectText}>
                    {sub.subject} • {sub.room}
                  </Text>

                  <View style={styles.allocationSummaryBox}>
                    <View style={styles.allocCol}>
                      <Text style={styles.allocColLabel}>Original Faculty</Text>
                      <Text style={styles.allocColName}>{sub.absentFaculty}</Text>
                      <Text style={styles.allocColSub}>{sub.leaveReason}</Text>
                    </View>
                    <View style={styles.allocArrowCol}>
                      <ArrowRight size={14} color={COLORS.slate[400]} />
                    </View>
                    <View style={styles.allocCol}>
                      <Text style={styles.allocColLabel}>Assigned Substitute</Text>
                      <Text style={styles.allocColNameAssigned}>
                        {sub.assignedFaculty}
                      </Text>
                      <Text style={styles.allocColSub}>
                        Confirmed • {sub.assignedAt || 'Today'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 6. CONFIRMATION SHEET MODAL */}
      {selectedSubForConfirm && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedSubForConfirm(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <div>
                  <Text style={styles.modalTitle}>Confirm Substitute Assignment</Text>
                  <Text style={styles.modalSub}>
                    Greenwood Academy Official Dispatch
                  </Text>
                </div>
                <TouchableOpacity
                  onPress={() => setSelectedSubForConfirm(null)}
                  style={styles.closeBtn}
                >
                  <X size={18} color={COLORS.slate[500]} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalDetailsBox}>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Class & Period:</Text>
                  <Text style={styles.modalValue}>
                    {selectedSubForConfirm.sub.gradeSection} • {selectedSubForConfirm.sub.period} ({selectedSubForConfirm.sub.timeSlot})
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Subject & Room:</Text>
                  <Text style={styles.modalValue}>
                    {selectedSubForConfirm.sub.subject} • {selectedSubForConfirm.sub.room}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Absent Teacher:</Text>
                  <Text style={styles.modalValue}>
                    {selectedSubForConfirm.sub.absentFaculty}
                  </Text>
                </View>
                <View style={[styles.modalRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.modalLabel}>Assigned Substitute:</Text>
                  <Text style={styles.modalValueBold}>
                    {selectedSubForConfirm.teacherName} ({selectedSubForConfirm.teacherDept})
                  </Text>
                </View>
              </View>

              <View style={styles.noticeBox}>
                <Shield size={14} color="#059669" />
                <Text style={styles.noticeText}>
                  An immediate notification will be dispatched to {selectedSubForConfirm.teacherName}'s mobile app and the daily timetable will reflect this coverage.
                </Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setSelectedSubForConfirm(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmBtn}
                  onPress={handleConfirmAssignment}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalConfirmText}>Confirm & Dispatch</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  dateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  dateTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  kpiContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  kpiItem: {
    flex: 1,
    alignItems: 'center',
  },
  kpiValuePending: {
    fontSize: 20,
    fontWeight: '900',
    color: '#E11D48',
  },
  kpiValueAllocated: {
    fontSize: 20,
    fontWeight: '900',
    color: '#059669',
  },
  kpiValueTotal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4338CA',
  },
  kpiLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  kpiDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  listSection: {
    gap: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  subCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 12,
  },
  subCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  periodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  periodPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4338CA',
  },
  timeSlotText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  urgentBadge: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urgentBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E11D48',
    textTransform: 'uppercase',
  },
  classInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  classInfoLeft: {
    flex: 1,
    marginRight: 10,
  },
  gradeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  subjectText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    fontWeight: '500',
  },
  absentFacultyBox: {
    alignItems: 'flex-end',
    maxWidth: '50%',
    flexShrink: 1,
  },
  absentLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  absentFacultyName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
    textAlign: 'right',
  },
  leaveReasonText: {
    fontSize: 10,
    color: '#E11D48',
    fontWeight: '600',
    textAlign: 'right',
  },
  facultyInfo: {
    flex: 1,
    marginRight: 6,
  },
  facultyMatchingBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    gap: 8,
  },
  matchingHeader: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  facultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  facultyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  facultyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facultyAvatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4338CA',
  },
  facultyAvatarMuted: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facultyAvatarTextMuted: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  facultyName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  facultySub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  assignPrimaryBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  assignPrimaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  assignSecondaryBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  assignSecondaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  coveredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 10,
  },
  coveredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  periodPillAllocated: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  periodPillAllocatedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  confirmedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  confirmedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    textTransform: 'uppercase',
  },
  coveredBody: {
    gap: 8,
  },
  allocationSummaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  allocCol: {
    flex: 1,
  },
  allocArrowCol: {
    paddingHorizontal: 8,
  },
  allocColLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  allocColName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 1,
  },
  allocColNameAssigned: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
    marginTop: 1,
  },
  allocColSub: {
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  modalDetailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalLabel: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  modalValue: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalValueBold: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4338CA',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
  },
  noticeText: {
    fontSize: 11,
    color: '#065F46',
    flex: 1,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  modalConfirmBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
