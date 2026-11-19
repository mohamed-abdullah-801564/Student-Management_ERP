import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  Clock,
  User,
  CheckCircle2,
  FileText,
  Building,
  Phone,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { schoolStore, StudentLeaveRequest } from '../../src/lib/schoolStore';

interface ApprovalItem {
  id: string;
  type: 'leave' | 'gate_pass';
  tag: string;
  tagBg: string;
  tagColor: string;
  time: string;
  title: string;
  subtitle: string;
  description: string;
  meta: { label: string; value: string }[];
}

const INITIAL_REQUESTS: ApprovalItem[] = [
  {
    id: 'req_1',
    type: 'leave',
    tag: 'URGENT FACULTY SICK LEAVE',
    tagBg: '#FEE2E2',
    tagColor: '#DC2626',
    time: 'Submitted Today, 7:45 AM',
    title: 'Mr. Anand Kumar',
    subtitle: 'Senior Physics Faculty • Middle & Senior Wing',
    description:
      'Emergency Medical Leave (3 Days: Dec 12 – Dec 14). Admitted for acute viral infection. Substitute allocation requested.',
    meta: [
      { label: 'Periods to Cover', value: '6 Periods (Reallocated ✓)' },
      { label: 'Medical Certificate', value: 'Attached (Apollo Hospital)' },
      { label: 'Leave Balance', value: '11 Casual Leaves Remaining' },
    ],
  },
  {
    id: 'req_2',
    type: 'gate_pass',
    tag: 'STUDENT GATE EXIT PASS',
    tagBg: '#FEF3C7',
    tagColor: '#B45309',
    time: 'Requested for Today, 11:30 AM',
    title: 'Master Harish Kalyan',
    subtitle: 'Class 9 - Section C • Roll #14',
    description:
      'Early departure approved for dental surgery. Father present at main gate with OTP verification verified.',
    meta: [
      { label: 'Escort Parent', value: 'Dr. M. Kalyan (Father)' },
      { label: 'Security OTP', value: '#8492 (Verified at Gate 1)' },
      { label: 'Homeroom Incharge', value: 'Mrs. Deepa R. (Approved)' },
    ],
  },
];

export default function CoordinatorApprovalsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'leave' | 'gate_pass'>('all');
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [declinedIds, setDeclinedIds] = useState<string[]>([]);
  const [parentLeaveRequests, setParentLeaveRequests] = useState<StudentLeaveRequest[]>(
    schoolStore.getLeaveRequests()
  );

  React.useEffect(() => {
    const unsub = schoolStore.subscribe(() => {
      setParentLeaveRequests([...schoolStore.getLeaveRequests()]);
    });
    return unsub;
  }, []);

  const mappedParentRequests: ApprovalItem[] = parentLeaveRequests.map((req) => ({
    id: req.id,
    type: 'leave',
    tag: req.status === 'approved' ? 'APPROVED STUDENT LEAVE' : 'PARENT STUDENT ABSENCE REQUEST',
    tagBg: req.status === 'approved' ? '#DCFCE7' : '#FEF3C7',
    tagColor: req.status === 'approved' ? '#15803D' : '#B45309',
    time: `Requested: ${req.requestedAt}`,
    title: `${req.studentName} (${req.className})`,
    subtitle: `Guardian: ${req.parentName}`,
    description: req.reason,
    meta: [
      { label: 'Absence Duration', value: req.startDate },
      { label: 'Homeroom Tutor', value: 'Mrs. Deepa R. (Grade 8-B)' },
      {
        label: 'Medical Slip',
        value: req.medicalNoteUrl ? 'Doctor Certificate Attached' : 'Self-declared by Parent',
      },
      {
        label: 'Approval Status',
        value: req.status === 'approved' ? 'Approved & Excused ✓' : 'Pending Homeroom Action',
      },
    ],
  }));

  const allRequests = [...mappedParentRequests, ...INITIAL_REQUESTS];

  const handleApprove = (item: ApprovalItem) => {
    setApprovedIds((prev) => [...prev, item.id]);
    schoolStore.approveLeaveRequest(item.id);
    Alert.alert(
      'Authorization Confirmed',
      `${item.title} has been approved. Excused absence recorded and confirmation dispatched to parent chat.`,
      [{ text: 'OK' }]
    );
  };

  const handleDecline = (item: ApprovalItem) => {
    setDeclinedIds((prev) => [...prev, item.id]);
    Alert.alert('Request Declined', `${item.title} has been declined.`, [
      { text: 'OK' },
    ]);
  };

  const visibleItems = allRequests.filter((item) => {
    if (filter === 'leave') return item.type === 'leave';
    if (filter === 'gate_pass') return item.type === 'gate_pass';
    return true;
  });

  const pendingCount = allRequests.filter(
    (item) => !approvedIds.includes(item.id) && !declinedIds.includes(item.id)
  ).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER BAR */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={COLORS.slate[700]} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Authorizations Desk</Text>
          <Text style={styles.headerSubtitle}>
            Dr. Raman • Academic Coordinator Oversight
          </Text>
        </View>

        {pendingCount > 0 ? (
          <View style={styles.pendingBadgeHeader}>
            <Text style={styles.pendingBadgeHeaderText}>
              {pendingCount} Pending
            </Text>
          </View>
        ) : (
          <View style={styles.clearedBadgeHeader}>
            <Text style={styles.clearedBadgeHeaderText}>All Cleared ✓</Text>
          </View>
        )}
      </View>

      {/* FILTER TABS */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterPill, filter === 'all' && styles.filterPillActive]}
          onPress={() => setFilter('all')}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.filterPillText,
              filter === 'all' && styles.filterPillTextActive,
            ]}
          >
            All Requests ({pendingCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, filter === 'leave' && styles.filterPillActive]}
          onPress={() => setFilter('leave')}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.filterPillText,
              filter === 'leave' && styles.filterPillTextActive,
            ]}
          >
            Faculty Leaves
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterPill,
            filter === 'gate_pass' && styles.filterPillActive,
          ]}
          onPress={() => setFilter('gate_pass')}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.filterPillText,
              filter === 'gate_pass' && styles.filterPillTextActive,
            ]}
          >
            Gate Passes
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {visibleItems.map((item) => {
          const isApproved = approvedIds.includes(item.id);
          const isDeclined = declinedIds.includes(item.id);

          return (
            <View
              key={item.id}
              style={[
                styles.card,
                SHADOWS.card,
                (isApproved || isDeclined) && styles.cardInactive,
              ]}
            >
              {/* TOP TAG ROW */}
              <View style={styles.cardTop}>
                <View style={[styles.typeBadge, { backgroundColor: item.tagBg }]}>
                  <Text style={[styles.typeBadgeText, { color: item.tagColor }]}>
                    {item.tag}
                  </Text>
                </View>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>

              {/* PERSON TITLE */}
              <Text style={styles.personTitle}>{item.title}</Text>
              <Text style={styles.personSubtitle}>{item.subtitle}</Text>

              {/* DESCRIPTION */}
              <Text style={styles.descText}>{item.description}</Text>

              {/* METADATA GRID */}
              <View style={styles.metaBox}>
                {item.meta.map((m, idx) => (
                  <View key={idx} style={styles.metaRow}>
                    <Text style={styles.metaLabel}>{m.label}:</Text>
                    <Text style={styles.metaVal}>{m.value}</Text>
                  </View>
                ))}
              </View>

              {/* ACTION BUTTONS OR STATUS */}
              {!isApproved && !isDeclined ? (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.declineBtn}
                    onPress={() => handleDecline(item)}
                    activeOpacity={0.75}
                  >
                    <X size={15} color="#475569" strokeWidth={2.2} />
                    <Text style={styles.declineBtnText}>Decline</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => handleApprove(item)}
                    activeOpacity={0.8}
                  >
                    <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.approveBtnText}>
                      {item.type === 'leave'
                        ? 'Approve Faculty Leave'
                        : 'Grant Gate Exit Pass'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : isApproved ? (
                <View style={styles.statusPillApproved}>
                  <CheckCircle2 size={16} color="#059669" />
                  <Text style={styles.statusTextApproved}>
                    Authorized & Logged • Security Notified
                  </Text>
                </View>
              ) : (
                <View style={styles.statusPillDeclined}>
                  <X size={16} color="#DC2626" />
                  <Text style={styles.statusTextDeclined}>
                    Declined by Coordinator
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        {/* ALL CLEARED BANNER */}
        {pendingCount === 0 && (
          <View style={[styles.allClearCard, SHADOWS.card]}>
            <View style={styles.allClearIconCircle}>
              <ShieldCheck size={32} color="#059669" strokeWidth={2.2} />
            </View>
            <Text style={styles.allClearTitle}>All Authorizations Cleared</Text>
            <Text style={styles.allClearSubtitle}>
              There are no pending leaves or gate pass requests awaiting coordinator approval.
            </Text>
            <TouchableOpacity
              style={styles.returnBtn}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text style={styles.returnBtnText}>← Return to Coordinator Desk</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
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
  pendingBadgeHeader: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pendingBadgeHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
  },
  clearedBadgeHeader: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  clearedBadgeHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },

  // Filter Tabs
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterPillActive: {
    backgroundColor: '#4F46E5',
  },
  filterPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },

  // Request Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  cardInactive: {
    opacity: 0.85,
    backgroundColor: '#FAFAFA',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  timeText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  personTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  personSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 8,
  },
  descText: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 12,
  },
  metaBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    gap: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  metaVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Actions
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  declineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
  },
  declineBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  approveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 11,
    backgroundColor: '#4F46E5',
  },
  approveBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusPillApproved: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
  },
  statusTextApproved: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  statusPillDeclined: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
  },
  statusTextDeclined: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },

  // All Clear State
  allClearCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  allClearIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  allClearTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  allClearSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  returnBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 11,
  },
  returnBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
