import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
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
  ShieldCheck,
  Users,
  AlertTriangle,
  FileText,
  Check,
  X,
  Plus,
  Info,
  ArrowRight,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { MOCK_SCHEDULE, SchedulePeriod } from '../../src/constants/mockData';
import { AnimatedNumberTicker } from '../../src/components/AnimatedNumberTicker';

export default function TeacherDashboard() {
  const router = useRouter();
  const navigation = useNavigation<any>();

  // Primary Workspace Mode: 'teaching' (My Classes) | 'coordinator' (Coordinator Desk & Duties)
  const [workspaceMode, setWorkspaceMode] = useState<'teaching' | 'coordinator'>('coordinator');

  // Sub-segment inside teaching mode: 'timetable' | 'class8b'
  const [activeSegment, setActiveSegment] = useState<'timetable' | 'class8b'>('timetable');

  // Interactive state for Coordinator Approvals
  const [approvedRequests, setApprovedRequests] = useState<string[]>([]);

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

  const handleApprove = (id: string, name: string) => {
    setApprovedRequests((prev) => [...prev, id]);
    Alert.alert(
      'Coordinator Authorization Granted',
      `${name} has been digitally approved. Notification dispatched to Front Gate & Records Desk.`,
      [{ text: 'OK' }]
    );
  };

  const handleDecline = (id: string, name: string) => {
    setApprovedRequests((prev) => [...prev, id]);
    Alert.alert('Request Declined', `${name} has been declined.`, [{ text: 'OK' }]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER SECTION */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.facultyGreeting}>Good Morning, Dr. Raman</Text>
            <View style={styles.badgeRow}>
              <View style={styles.coordinatorPill}>
                <ShieldCheck size={11} color={COLORS.brand[700]} />
                <Text style={styles.coordinatorText}>Academic Coordinator</Text>
              </View>
              <Text style={styles.bulletSeparator}>•</Text>
              <Text style={styles.departmentText}>Senior Physics Faculty</Text>
            </View>
          </View>

          {/* Coordinator Profile Photo */}
          <View style={styles.teacherPhotoWrapper}>
            <View style={styles.teacherPhotoCircle}>
              <Text style={styles.teacherPhotoInitials}>SR</Text>
            </View>
            <View style={styles.onlineStatusDot} />
          </View>
        </View>

        {/* TOP DUAL WORKSPACE SWITCHER (Minimal & Spacious with High-Affordance Active Pills) */}
        <View style={styles.topDualSwitcher}>
          <TouchableOpacity
            style={[
              styles.topDualBtn,
              workspaceMode === 'coordinator' && styles.topDualBtnActive,
            ]}
            onPress={() => setWorkspaceMode('coordinator')}
            activeOpacity={0.8}
          >
            <ShieldCheck
              size={15}
              color={workspaceMode === 'coordinator' ? '#4F46E5' : COLORS.slate[500]}
              strokeWidth={2.2}
            />
            <Text
              style={[
                styles.topDualBtnText,
                workspaceMode === 'coordinator' && styles.topDualBtnTextActive,
              ]}
            >
              Coordinator Desk
            </Text>
            {approvedRequests.length < 2 && (
              <View style={styles.urgentBadgeCount}>
                <Text style={styles.urgentBadgeCountText}>
                  {2 - approvedRequests.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.topDualBtn,
              workspaceMode === 'teaching' && styles.topDualBtnActive,
            ]}
            onPress={() => setWorkspaceMode('teaching')}
            activeOpacity={0.8}
          >
            <BookOpen
              size={15}
              color={workspaceMode === 'teaching' ? '#4F46E5' : COLORS.slate[500]}
              strokeWidth={2.2}
            />
            <Text
              style={[
                styles.topDualBtnText,
                workspaceMode === 'teaching' && styles.topDualBtnTextActive,
              ]}
            >
              My Teaching
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================= */}
        {/* VIEW 1: COORDINATOR DESK (OPERATIONAL DUTIES ON MOBILE)  */}
        {/* ========================================================= */}
        {workspaceMode === 'coordinator' && (
          <View style={styles.coordinatorViewWrapper}>
            {/* TODAY'S WING PULSE (MINIMAL AIRY METRICS CARD WITH ANIMATED NUMBER TICKER) */}
            <View style={[styles.pulseCard, SHADOWS.card]}>
              <View style={styles.pulseCardHeader}>
                <Text style={styles.pulseCardTitle}>TODAY'S WING PULSE • 32 SECTIONS</Text>
                <View style={styles.pulseLiveBadge}>
                  <View style={styles.pulseLiveDot} />
                  <Text style={styles.pulseLiveText}>Live</Text>
                </View>
              </View>

              <View style={styles.pulseMetricsRow}>
                {/* Metric 1: Period Coverage */}
                <View style={styles.pulseCol}>
                  <View style={styles.pulseValRow}>
                    <AnimatedNumberTicker
                      value={100}
                      suffix="%"
                      duration={1000}
                      style={styles.pulseNumber}
                    />
                  </View>
                  <Text style={styles.pulseColLabel}>Period Coverage</Text>
                </View>

                <View style={styles.pulseDivider} />

                {/* Metric 2: Faculty On Duty */}
                <View style={styles.pulseCol}>
                  <View style={styles.pulseValRow}>
                    <AnimatedNumberTicker
                      value={64}
                      duration={1000}
                      style={styles.pulseNumber}
                    />
                    <Text style={styles.pulseNumberTotal}>/68</Text>
                  </View>
                  <Text style={styles.pulseColLabel}>Faculty On Duty</Text>
                </View>

                <View style={styles.pulseDivider} />

                {/* Metric 3: Wing Attendance */}
                <View style={styles.pulseCol}>
                  <View style={styles.pulseValRow}>
                    <AnimatedNumberTicker
                      value={96.2}
                      decimalPlaces={1}
                      suffix="%"
                      duration={1000}
                      style={[styles.pulseNumber, { color: '#059669' }]}
                    />
                  </View>
                  <Text style={styles.pulseColLabel}>Wing Attendance</Text>
                </View>
              </View>
            </View>

            {/* 4 CIRCULAR DUTY ACTION BUTTONS */}
            <View style={styles.quickActionsHeader}>
              <Text style={styles.sectionTitle}>Coordinator Action Desk</Text>
            </View>

            <View style={styles.circleButtonsRow}>
              {/* Button 1: Substitute Allocator */}
              <TouchableOpacity
                style={styles.circleActionItem}
                onPress={() => navigateTo('substitute', '/(teacher)/substitute')}
                activeOpacity={0.75}
              >
                <View style={[styles.circleButton, { backgroundColor: '#EEF2FF' }]}>
                  <UserCheck size={22} color={COLORS.brand[600]} strokeWidth={2.2} />
                </View>
                <Text style={styles.circleActionLabel}>Substitute</Text>
              </TouchableOpacity>

              {/* Button 2: Floor Rounds */}
              <TouchableOpacity
                style={styles.circleActionItem}
                onPress={() => {
                  Alert.alert(
                    'Corridor Floor Rounds Logged',
                    'Period 3 rounds complete for Senior Wing (Class 9 - 12). All classrooms orderly.',
                    [{ text: 'OK' }]
                  );
                }}
                activeOpacity={0.75}
              >
                <View style={[styles.circleButton, { backgroundColor: '#ECFDF5' }]}>
                  <MapPin size={22} color="#059669" strokeWidth={2.2} />
                </View>
                <Text style={styles.circleActionLabel}>Floor Rounds</Text>
              </TouchableOpacity>

              {/* Button 3: Approvals */}
              <TouchableOpacity
                style={styles.circleActionItem}
                onPress={() => navigateTo('approvals', '/(teacher)/approvals')}
                activeOpacity={0.75}
              >
                <View style={[styles.circleButton, { backgroundColor: '#FEF2F2' }]}>
                  <AlertTriangle size={22} color="#DC2626" strokeWidth={2.2} />
                  {approvedRequests.length < 2 && (
                    <View style={styles.circleBadge}>
                      <Text style={styles.circleBadgeText}>
                        {2 - approvedRequests.length}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.circleActionLabel}>Approvals</Text>
              </TouchableOpacity>

              {/* Button 4: Wing Notice */}
              <TouchableOpacity
                style={styles.circleActionItem}
                onPress={() => {
                  Alert.alert(
                    'Broadcast Wing Circular',
                    'Notification drafted for all Middle & Senior School Faculty.',
                    [{ text: 'Close' }]
                  );
                }}
                activeOpacity={0.75}
              >
                <View style={[styles.circleButton, { backgroundColor: '#FFFBEB' }]}>
                  <Bell size={22} color="#D97706" strokeWidth={2.2} />
                </View>
                <Text style={styles.circleActionLabel}>Wing Notice</Text>
              </TouchableOpacity>
            </View>

            {/* CAMPUS NOTE TICKER BANNER */}
            <View style={styles.campusNoteBanner}>
              <Info size={18} color="#4F46E5" strokeWidth={2.2} />
              <Text style={styles.campusNoteText}>
                CBSE Pre-Board moderation meeting scheduled for 3:30 PM in AV Room 2.
              </Text>
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: TEACHING VIEW (PERSONAL CLASSES & TIMETABLE)       */}
        {/* ========================================================= */}
        {workspaceMode === 'teaching' && (
          <View style={styles.teachingViewWrapper}>
            {/* SUB-SEGMENT TOGGLE: [ My Timetable ] | [ Class 8-B Hub ] */}
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
                  Class 11-A (In-Charge)
                </Text>
              </TouchableOpacity>
            </View>

            {/* ONGOING PERIOD HERO CARD (Period 3 Physics) */}
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
                <Text style={styles.heroClassTitle}>Class 11-A Physics</Text>
                <View style={styles.heroMetaRow}>
                  <View style={styles.roomBadge}>
                    <MapPin size={11} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.roomBadgeText}>Physics Lab Block 102</Text>
                  </View>
                  <Text style={styles.heroPortionText}>
                    Unit 3: Laws of Motion & Friction Vectors
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
                  <Text style={styles.heroPrimaryBtnText}>Take Roll Attendance</Text>
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

            {/* QUICK ACTIONS FOR TEACHING */}
            <View style={styles.quickActionsHeader}>
              <Text style={styles.sectionTitle}>Teaching Quick Actions</Text>
            </View>

            <View style={styles.circleButtonsRow}>
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

            {/* CONTEXTUAL SUBSTITUTION NOTICE */}
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
                  <Text style={styles.substituteNoticeTitle}>Period 4 Substitute Covered</Text>
                  <View style={styles.substituteAlertTag}>
                    <Text style={styles.substituteAlertTagText}>Assigned</Text>
                  </View>
                </View>
                <Text style={styles.substituteNoticeSub}>
                  Class 9-A Physics covered by Mrs. Deepa R.
                </Text>
              </View>
              <ChevronRight size={16} color={COLORS.slate[400]} />
            </TouchableOpacity>

            {/* NEXT UP CLASS PREVIEW CARD (Clean, Minimal & High-Affordance) */}
            <TouchableOpacity
              style={[styles.nextUpCard, SHADOWS.card]}
              onPress={() => navigateTo('timetable', '/(teacher)/timetable')}
              activeOpacity={0.85}
            >
              <View style={styles.nextUpLeft}>
                <View style={styles.nextUpIconCircle}>
                  <Clock size={16} color={COLORS.brand[600]} strokeWidth={2.2} />
                </View>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.nextUpLabel}>UPCOMING PERIOD 4</Text>
                    <Text style={styles.nextUpTime}>11:15 - 12:00 PM</Text>
                  </View>
                  <Text style={styles.nextUpClassTitle}>
                    Class 9-A Physics • Room 204
                  </Text>
                </View>
              </View>

              <View style={styles.nextUpRight}>
                <Text style={styles.nextUpLinkText}>Full Timetable</Text>
                <ChevronRight size={14} color={COLORS.brand[600]} />
              </View>
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
    marginBottom: 14,
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
  coordinatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  coordinatorText: {
    fontSize: 10,
    fontWeight: '800',
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

  // TOP DUAL WORKSPACE SWITCHER (Minimal & Spacious with High-Affordance Active Pills)
  topDualSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginTop: 8,
    marginBottom: 18,
    gap: 6,
  },
  topDualBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 11,
    gap: 7,
  },
  topDualBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  topDualBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  topDualBtnTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  urgentBadgeCount: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10,
    marginLeft: 2,
  },
  urgentBadgeCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  // Coordinator View Styles
  coordinatorViewWrapper: {},

  // Today's Wing Pulse Card (Light & Airy Minimal Card with Animated Number Ticker)
  pulseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 18,
  },
  pulseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  pulseCardTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  pulseLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pulseLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  pulseLiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  pulseMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pulseCol: {
    flex: 1,
    alignItems: 'center',
  },
  pulseValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pulseNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  pulseNumberTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginLeft: 1,
  },
  pulseColLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  pulseDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#F1F5F9',
  },

  // Authorizations (Stitch Style)
  pendingHeaderBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  pendingHeaderBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },
  requiresActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
  },
  stitchAuthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 12,
  },
  stitchAuthTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  urgentLeaveBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  urgentLeaveBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  gatePassBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gatePassBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  stitchAuthTime: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  stitchAuthNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  stitchAuthName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  stitchAuthBullet: {
    fontSize: 12,
    color: '#94A3B8',
  },
  stitchAuthRole: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  stitchAuthDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  stitchAuthActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stitchDeclineBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stitchDeclineText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  stitchApproveBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
  },
  stitchApproveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stitchPrimaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
  },
  stitchPrimaryActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  clearedItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 12,
  },
  clearedItemText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },

  // Substitutions Feed (Stitch Style)
  assignFreeFacultyLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  stitchSubList: {
    gap: 8,
    marginBottom: 14,
  },
  stitchSubRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stitchPeriodPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  stitchPeriodText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4338CA',
  },
  stitchSubTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  stitchSubDetail: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  stitchStatusPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stitchStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },

  // Campus Note Ticker Banner
  campusNoteBanner: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  campusNoteText: {
    fontSize: 11.5,
    color: '#166534',
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },

  // Coordinator Card
  coordinatorCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 16,
  },
  coordinatorCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  coordinatorCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  coordinatorCardSub: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  manageSubPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: COLORS.brand[50],
  },
  manageSubPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[700],
  },

  // Wing Attendance Grid
  wingAttendanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wingAttCard: {
    width: (Dimensions.get('window').width - 74) / 2,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  wingAttHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wingAttGrade: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[800],
  },
  wingAttPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.brand[600],
  },
  wingAttSub: {
    fontSize: 10,
    color: COLORS.slate[500],
    marginTop: 3,
  },

  // Teaching View Styles
  teachingViewWrapper: {},
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

  // Quick Actions (4 Circular Buttons in One Row)
  quickActionsHeader: {
    marginTop: 8,
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
    marginBottom: 18,
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
    position: 'relative',
  },
  circleBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  circleBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
  },
  circleActionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[700],
    textAlign: 'center',
    lineHeight: 16,
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

  // Next Up Class Preview Card (Minimal Teacher View)
  nextUpCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextUpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  nextUpIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextUpLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: COLORS.brand[700],
    letterSpacing: 0.5,
  },
  nextUpTime: {
    fontSize: 10,
    color: COLORS.slate[400],
    fontWeight: '500',
  },
  nextUpClassTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[900],
    marginTop: 2,
  },
  nextUpRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  nextUpLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
});
