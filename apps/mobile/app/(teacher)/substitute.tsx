import React, { useState } from 'react';
import {
  View,
  Text,
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
  AlertTriangle,
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Send,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';

export default function SubstituteAllocationScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'teaching' | 'duties'>('duties');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('karthik');
  const [isAssigned, setIsAssigned] = useState(false);

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

  const handleConfirm = () => {
    setIsAssigned(true);
    Alert.alert(
      'Substitute Assigned! ⚡',
      'Mr. Karthik Raja has been notified via instant push alert. Grade 9-B timetable updated.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <ChevronLeft size={20} color={COLORS.slate[700]} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={styles.headerTitleCenter}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>Coordinator Desk</Text>
            <View style={styles.liveGreenDot} />
          </View>
          <Text style={styles.headerSubtitle}>
            Daily Substitute Allocation • Mon, 16 Nov
          </Text>
        </View>

        <TouchableOpacity style={styles.historyButton} activeOpacity={0.8}>
          <Calendar size={17} color={COLORS.brand[600]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Segmented Role Navigation */}
        <View style={styles.navControl}>
          <TouchableOpacity
            style={[
              styles.navTab,
              activeTab === 'teaching' && styles.navTabActive,
            ]}
            onPress={() => setActiveTab('teaching')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.navTabText,
                activeTab === 'teaching' && styles.navTabTextActive,
              ]}
            >
              My Teaching (3)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navTab,
              activeTab === 'duties' && styles.navTabActive,
            ]}
            onPress={() => setActiveTab('duties')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.navTabText,
                activeTab === 'duties' && styles.navTabTextActive,
              ]}
            >
              Coordinator Duties
            </Text>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>Active</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Alert Hero Banner: Unplanned Absences */}
        <View style={styles.urgentBanner}>
          <View style={styles.urgentHeaderRow}>
            <View style={styles.urgentTitleRow}>
              <View style={styles.warningIconSquare}>
                <Text style={styles.warningEmoji}>⚠️</Text>
              </View>
              <Text style={styles.urgentBannerTitle}>2 Faculty Unplanned Absences</Text>
            </View>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>4 Pending</Text>
            </View>
          </View>

          {/* Row 1: Mr Rajesh */}
          <View style={styles.absenceItemRow}>
            <View>
              <Text style={styles.absentName}>Mr. Rajesh S.</Text>
              <Text style={styles.absentSub}>Science Dept • 4 Periods Affected</Text>
            </View>
            <View style={styles.unassignedBadge}>
              <Text style={styles.unassignedBadgeText}>2 Unassigned</Text>
            </View>
          </View>

          {/* Row 2: Mrs Kavitha */}
          <View style={styles.absenceItemRow}>
            <View>
              <Text style={styles.absentName}>Mrs. Kavitha Nair</Text>
              <Text style={styles.absentSub}>English Dept • 3 Periods Affected</Text>
            </View>
            <View style={styles.unassignedBadgeAmber}>
              <Text style={styles.unassignedBadgeAmberText}>1 Unassigned</Text>
            </View>
          </View>

          {/* Progress Meter */}
          <View style={styles.meterRow}>
            <View style={styles.meterTextGroup}>
              <View style={styles.greenMeterDot} />
              <Text style={styles.meterStatusText}>3 of 7 Reallocated</Text>
            </View>
            <View style={styles.meterProgressBarTrack}>
              <View style={styles.meterProgressBarFill} />
            </View>
          </View>
        </View>

        {/* Critical Allocation Needed Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.pulsingRedDot} />
            <Text style={styles.sectionTitle}>Critical Allocation Needed</Text>
          </View>
          <View style={styles.urgentPeriodTag}>
            <Text style={styles.urgentPeriodTagText}>Urgent • Period 3</Text>
          </View>
        </View>

        {/* Main Focus Card */}
        <View style={[styles.focusCard, SHADOWS.card]}>
          <View style={styles.focusCardTop}>
            <View>
              <View style={styles.periodBadgeRow}>
                <View style={styles.periodNumberPill}>
                  <Text style={styles.periodNumberText}>Period 3</Text>
                </View>
                <Text style={styles.periodTimeText}>10:15 – 11:00 AM</Text>
              </View>
              <Text style={styles.focusClassName}>Grade 9 – B</Text>
              <Text style={styles.focusSubject}>Physics / General Science • Room 302</Text>
            </View>

            <View style={styles.focusRight}>
              <View style={styles.needsSubPill}>
                <View style={styles.subPillDot} />
                <Text style={styles.needsSubPillText}>Needs Substitute</Text>
              </View>
              <Text style={styles.absenceReason}>Absence: Mr. Rajesh (Medical)</Text>
            </View>
          </View>

          {/* Smart Faculty Match Box */}
          <View style={styles.matchBox}>
            <View style={styles.matchBoxHeader}>
              <View style={styles.matchHeaderLeft}>
                <Scale size={14} color={COLORS.brand[600]} />
                <Text style={styles.matchBoxTitle}>SMART FACULTY MATCHING</Text>
              </View>
              <Text style={styles.availableCount}>2 Teachers Available</Text>
            </View>

            {/* Recommendation 1: Mr. Karthik Raja (Highlighted) */}
            <TouchableOpacity
              style={[
                styles.recCardHighlighted,
                selectedTeacher === 'karthik' && styles.recCardSelected,
              ]}
              onPress={() => setSelectedTeacher('karthik')}
              activeOpacity={0.88}
            >
              <View style={styles.topBadge}>
                <Text style={styles.topBadgeText}>★ TOP RECOMMENDED</Text>
              </View>

              <View style={styles.recCardContent}>
                <View style={styles.avatarCircleKR}>
                  <Text style={styles.avatarTextKR}>KR</Text>
                  <View style={styles.onlineDot} />
                </View>

                <View style={styles.recDetails}>
                  <Text style={styles.recName}>Mr. Karthik Raja</Text>
                  <Text style={styles.recDept}>Physics & Chemistry Dept</Text>

                  <View style={styles.recTagsRow}>
                    <View style={styles.freePeriodPill}>
                      <Text style={styles.freePeriodText}>Free Period 3</Text>
                    </View>
                    <View style={styles.loadPill}>
                      <Text style={styles.loadPillText}>Today: 2/6 Periods</Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.assignButton}
                onPress={handleConfirm}
                activeOpacity={0.85}
              >
                <Text style={styles.assignButtonText}>
                  {isAssigned ? 'Assigned Successfully ✓' : 'Assign Substitute'}
                </Text>
                {!isAssigned && <ArrowRight size={14} color="#FFFFFF" />}
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Recommendation 2: Mrs. Shalini Raman */}
            <View style={styles.recCardSecondary}>
              <View style={styles.recLeft}>
                <View style={styles.avatarCircleSR}>
                  <Text style={styles.avatarTextSR}>SR</Text>
                </View>
                <View>
                  <Text style={styles.secondaryName}>Mrs. Shalini Raman</Text>
                  <Text style={styles.secondarySub}>Math Dept • Load: 4/6 periods</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.secondaryAssignButton}
                onPress={() => {
                  setSelectedTeacher('shalini');
                  Alert.alert('Selected', 'Assigned Mrs. Shalini Raman.');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryAssignText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Covered Today Section */}
        <View style={styles.coveredSection}>
          <View style={styles.coveredHeader}>
            <View style={styles.coveredTitleRow}>
              <Text style={styles.coveredTitle}>Covered Today</Text>
              <View style={styles.coveredCountPill}>
                <Text style={styles.coveredCountText}>3 / 7</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewLogText}>View Log →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.coveredList}>
            {/* Item 1 */}
            <View style={[styles.coveredItem, SHADOWS.card]}>
              <View style={styles.coveredItemLeft}>
                <View style={styles.checkIconBox}>
                  <CheckCircle2 size={16} color={COLORS.present} />
                </View>
                <View>
                  <View style={styles.coveredPeriodRow}>
                    <Text style={styles.coveredPeriod}>Period 1</Text>
                    <Text style={styles.coveredClass}>• Grade 8-A Maths</Text>
                  </View>
                  <Text style={styles.coveredTeacher}>
                    Covered by <Text style={styles.bold}>Mrs. Deepa</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.verifiedPill}>
                <Text style={styles.verifiedPillText}>Verified</Text>
              </View>
            </View>

            {/* Item 2 */}
            <View style={[styles.coveredItem, SHADOWS.card]}>
              <View style={styles.coveredItemLeft}>
                <View style={styles.checkIconBox}>
                  <CheckCircle2 size={16} color={COLORS.present} />
                </View>
                <View>
                  <View style={styles.coveredPeriodRow}>
                    <Text style={styles.coveredPeriod}>Period 2</Text>
                    <Text style={styles.coveredClass}>• Grade 10-C English</Text>
                  </View>
                  <Text style={styles.coveredTeacher}>
                    Covered by <Text style={styles.bold}>Mr. Anand Verma</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.verifiedPill}>
                <Text style={styles.verifiedPillText}>Verified</Text>
              </View>
            </View>

            {/* Item 3 */}
            <View style={[styles.coveredItem, SHADOWS.card]}>
              <View style={styles.coveredItemLeft}>
                <View style={styles.checkIconBox}>
                  <CheckCircle2 size={16} color={COLORS.present} />
                </View>
                <View>
                  <View style={styles.coveredPeriodRow}>
                    <Text style={styles.coveredPeriod}>Period 2</Text>
                    <Text style={styles.coveredClass}>• Grade 7-B Science</Text>
                  </View>
                  <Text style={styles.coveredTeacher}>
                    Covered by <Text style={styles.bold}>Ms. Radhika</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.verifiedPill}>
                <Text style={styles.verifiedPillText}>Verified</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Bottom Sheet */}
      <View style={[styles.bottomSheet, SHADOWS.nav]}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetTopRow}>
          <View>
            <View style={styles.dispatchStatusRow}>
              <View style={styles.dispatchBlueDot} />
              <Text style={styles.dispatchLabel}>READY TO DISPATCH</Text>
            </View>
            <Text style={styles.sheetTitle}>Assign Mr. Karthik Raja?</Text>
            <Text style={styles.sheetSubtitle}>
              Grade 9-B • Period 3 (10:15 AM – 11:00 AM)
            </Text>
          </View>

          <View style={styles.targetClassPill}>
            <Text style={styles.targetClassPillText}>9B</Text>
          </View>
        </View>

        <View style={styles.alertNoticeBox}>
          <Zap size={14} color={COLORS.late} />
          <Text style={styles.alertNoticeText}>
            Instant push notification & SMS will be dispatched to{' '}
            <Text style={styles.bold}>Mr. Karthik</Text>. Central timetable and Grade 9-B display will auto-sync.
          </Text>
        </View>

        <View style={styles.sheetActionRow}>
          <TouchableOpacity style={styles.changeButton} activeOpacity={0.8}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmDispatchButton}
            onPress={handleConfirm}
            activeOpacity={0.88}
          >
            <Text style={styles.confirmDispatchText}>Confirm & Dispatch</Text>
            <Send size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  header: {
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
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCenter: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  liveGreenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.present,
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  historyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 160,
    gap: 14,
  },
  navControl: {
    flexDirection: 'row',
    backgroundColor: COLORS.slate[200],
    borderRadius: 16,
    padding: 4,
  },
  navTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  navTabActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  navTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate[600],
  },
  navTabTextActive: {
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  activePill: {
    backgroundColor: COLORS.brand[100],
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  urgentBanner: {
    backgroundColor: '#FFF4F2',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FECDD3',
    gap: 10,
  },
  urgentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
    paddingBottom: 8,
  },
  urgentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  warningIconSquare: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningEmoji: {
    fontSize: 12,
  },
  urgentBannerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E11D48',
    letterSpacing: 0.3,
  },
  pendingBadge: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pendingBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#BE123C',
  },
  absenceItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  absentName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[800],
  },
  absentSub: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  unassignedBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  unassignedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E11D48',
  },
  unassignedBadgeAmber: {
    backgroundColor: COLORS.lateBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lateBorder,
  },
  unassignedBadgeAmberText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.lateText,
  },
  meterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  meterTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenMeterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.present,
  },
  meterStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.slate[600],
  },
  meterProgressBarTrack: {
    width: 120,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.slate[200],
    overflow: 'hidden',
  },
  meterProgressBarFill: {
    width: '43%',
    height: '100%',
    backgroundColor: COLORS.brand[600],
    borderRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulsingRedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.absent,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  urgentPeriodTag: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  urgentPeriodTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  focusCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    gap: 12,
  },
  focusCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[100],
    paddingBottom: 12,
  },
  periodBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  periodNumberPill: {
    backgroundColor: COLORS.slate[900],
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  periodNumberText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
  },
  periodTimeText: {
    fontSize: 11,
    color: COLORS.slate[500],
  },
  focusClassName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.slate[900],
    marginTop: 4,
  },
  focusSubject: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.brand[600],
    marginTop: 1,
  },
  focusRight: {
    alignItems: 'flex-end',
  },
  needsSubPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.absentBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.absentBorder,
    gap: 5,
  },
  subPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.absent,
  },
  needsSubPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.absentText,
  },
  absenceReason: {
    fontSize: 10,
    color: COLORS.slate[400],
    marginTop: 4,
  },
  matchBox: {
    backgroundColor: COLORS.brand[50],
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.brand[100],
    gap: 10,
  },
  matchBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.brand[100],
    paddingBottom: 8,
  },
  matchHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  matchBoxTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.brand[700],
    letterSpacing: 0.5,
  },
  availableCount: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brand[600],
  },
  recCardHighlighted: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: COLORS.brand[500],
    position: 'relative',
    marginTop: 4,
  },
  recCardSelected: {
    borderColor: COLORS.brand[600],
  },
  topBadge: {
    position: 'absolute',
    top: -10,
    right: 12,
    backgroundColor: COLORS.brand[600],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  topBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.white,
  },
  recCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  avatarCircleKR: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brand[600],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarTextKR: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.white,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.present,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  recDetails: {
    flex: 1,
  },
  recName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  recDept: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  recTagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  freePeriodPill: {
    backgroundColor: COLORS.presentBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  freePeriodText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.presentText,
  },
  loadPill: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  loadPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  assignButton: {
    backgroundColor: COLORS.brand[600],
    borderRadius: 12,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  assignButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  recCardSecondary: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarCircleSR: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  avatarTextSR: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate[600],
  },
  secondaryName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[800],
  },
  secondarySub: {
    fontSize: 10,
    color: COLORS.slate[400],
  },
  secondaryAssignButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate[300],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  secondaryAssignText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate[700],
  },
  coveredSection: {
    gap: 10,
  },
  coveredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coveredTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coveredTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.slate[800],
  },
  coveredCountPill: {
    backgroundColor: COLORS.presentBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  coveredCountText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.presentText,
  },
  viewLogText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[600],
  },
  coveredList: {
    gap: 8,
  },
  coveredItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  coveredItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.presentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coveredPeriodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coveredPeriod: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  coveredClass: {
    fontSize: 11,
    color: COLORS.slate[500],
  },
  coveredTeacher: {
    fontSize: 11,
    color: COLORS.slate[600],
    marginTop: 1,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  verifiedPill: {
    backgroundColor: COLORS.presentBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.presentText,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[200],
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 22,
    gap: 10,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.slate[300],
    alignSelf: 'center',
    marginBottom: 4,
  },
  sheetTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dispatchStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dispatchBlueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.brand[600],
  },
  dispatchLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.brand[600],
    letterSpacing: 0.5,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.slate[900],
    marginTop: 2,
  },
  sheetSubtitle: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  targetClassPill: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: COLORS.brand[50],
    borderWidth: 1,
    borderColor: COLORS.brand[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetClassPillText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.brand[700],
  },
  alertNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.slate[50],
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    gap: 6,
  },
  alertNoticeText: {
    fontSize: 10,
    color: COLORS.slate[600],
    lineHeight: 14,
    flex: 1,
  },
  sheetActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  changeButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[300],
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[700],
  },
  confirmDispatchButton: {
    flex: 2,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.brand[600],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: COLORS.brand[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmDispatchText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.white,
  },
});
