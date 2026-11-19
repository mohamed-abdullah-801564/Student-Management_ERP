import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  Modal,
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
  Megaphone,
  Eye,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { MOCK_SCHEDULE, SchedulePeriod } from '../../src/constants/mockData';
import { AnimatedNumberTicker } from '../../src/components/AnimatedNumberTicker';
import { schoolStore, SubstitutionRecord, SchoolCircular } from '../../src/lib/schoolStore';

export default function TeacherDashboard() {
  const router = useRouter();
  const navigation = useNavigation<any>();

  // Primary Workspace Mode: 'teaching' (My Classes) | 'coordinator' (Coordinator Desk & Duties)
  const [workspaceMode, setWorkspaceMode] = useState<'teaching' | 'coordinator'>('coordinator');

  // Sub-segment inside teaching mode: 'timetable' | 'class8b'
  const [activeSegment, setActiveSegment] = useState<'timetable' | 'class8b'>('timetable');

  // Interactive state for Coordinator Approvals
  const [approvedRequests, setApprovedRequests] = useState<string[]>([]);
  const [substitutions, setSubstitutions] = useState<SubstitutionRecord[]>(schoolStore.getSubstitutions());
  const [facultyPhoto, setFacultyPhoto] = useState<string | null>(schoolStore.getFacultyPhoto());
  const [isCircularModalVisible, setIsCircularModalVisible] = useState(false);
  const [teacherCirculars, setTeacherCirculars] = useState<SchoolCircular[]>(schoolStore.getCirculars('teachers'));
  const [selectedCircularImage, setSelectedCircularImage] = useState<{ url: string; title: string } | null>(null);

  React.useEffect(() => {
    const unsub = schoolStore.subscribe(() => {
      setSubstitutions(schoolStore.getSubstitutions());
      setFacultyPhoto(schoolStore.getFacultyPhoto());
      setTeacherCirculars(schoolStore.getCirculars('teachers'));
    });
    return unsub;
  }, []);

  const p3Sub = substitutions.find((s) => s.id === 'sub-p3');

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

          {/* Faculty / Coordinator Profile Photo */}
          <View style={styles.teacherPhotoWrapper}>
            {facultyPhoto ? (
              <Image
                source={{ uri: facultyPhoto }}
                style={styles.teacherPhotoCircle}
              />
            ) : (
              <View style={styles.teacherPhotoCircle}>
                <Text style={styles.teacherPhotoInitials}>DR</Text>
              </View>
            )}
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
            {/* TODAY'S WING PULSE */}
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

            {/* UNIFIED COORDINATOR OPERATIONS CARD (Clean, Professional, Zero AI Slop) */}
            <View style={[styles.coordinatorOpsCard, SHADOWS.card]}>
              {/* Row 1: Period 3 Substitution Status */}
              <TouchableOpacity
                style={styles.opsCardRow}
                onPress={() => navigateTo('substitute', '/(teacher)/substitute')}
                activeOpacity={0.75}
              >
                <View style={styles.opsRowLeft}>
                  <View
                    style={[
                      styles.opsStatusIconCircle,
                      {
                        backgroundColor:
                          p3Sub?.status === 'allocated' ? '#ECFDF5' : '#FFF1F2',
                      },
                    ]}
                  >
                    {p3Sub?.status === 'allocated' ? (
                      <CheckCircle2 size={16} color="#059669" strokeWidth={2.2} />
                    ) : (
                      <AlertCircle size={16} color="#E11D48" strokeWidth={2.2} />
                    )}
                  </View>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <View style={styles.opsLabelRow}>
                      <Text style={styles.opsItemTitle}>Period 3 Physics Coverage</Text>
                      <View
                        style={[
                          styles.opsStatusBadge,
                          {
                            backgroundColor:
                              p3Sub?.status === 'allocated' ? '#ECFDF5' : '#FFF1F2',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.opsStatusBadgeText,
                            {
                              color:
                                p3Sub?.status === 'allocated' ? '#059669' : '#E11D48',
                            },
                          ]}
                        >
                          {p3Sub?.status === 'allocated' ? 'Allocated ✓' : 'Action Needed'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.opsItemSub}>
                      {p3Sub?.status === 'allocated'
                        ? `Covered by ${p3Sub.assignedFaculty} • Room 302`
                        : 'Mr. Rajesh on Medical Leave • Tap to assign substitute'}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>

              <View style={styles.opsDivider} />

              {/* Row 2: Campus Faculty Meeting */}
              <View style={styles.opsCardRow}>
                <View style={styles.opsRowLeft}>
                  <View
                    style={[
                      styles.opsStatusIconCircle,
                      { backgroundColor: '#EEF2FF' },
                    ]}
                  >
                    <Info size={16} color="#4F46E5" strokeWidth={2.2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.opsLabelRow}>
                      <Text style={styles.opsItemTitle}>Faculty Moderation Brief</Text>
                      <View
                        style={[
                          styles.opsStatusBadge,
                          { backgroundColor: '#EEF2FF' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.opsStatusBadgeText,
                            { color: '#4F46E5' },
                          ]}
                        >
                          3:30 PM Today
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.opsItemSub}>
                      CBSE Pre-Board moderation meeting in AV Room 2
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* CIRCULAR DUTY ACTION BUTTONS (Placed at the Bottom) */}
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

              {/* Button 2: Approvals */}
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

              {/* Button 3: Wing Broadcast Notice */}
              <TouchableOpacity
                style={styles.circleActionItem}
                onPress={() => setIsCircularModalVisible(true)}
                activeOpacity={0.75}
              >
                <View style={[styles.circleButton, { backgroundColor: '#FFFBEB' }]}>
                  <Bell size={22} color="#D97706" strokeWidth={2.2} />
                  {teacherCirculars.filter((c) => c.priority === 'urgent').length > 0 && (
                    <View style={styles.urgentBadgeCount}>
                      <Text style={styles.urgentBadgeCountText}>
                        {teacherCirculars.filter((c) => c.priority === 'urgent').length}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.circleActionLabel}>Wing Notice</Text>
              </TouchableOpacity>
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
                  Class 8-B (In-Charge)
                </Text>
              </TouchableOpacity>
            </View>

            {activeSegment === 'timetable' ? (
              <>
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
                        Unit 3: Laws of Motion & Friction
                      </Text>
                      {p3Sub?.status === 'allocated' && (
                        <View style={{ backgroundColor: '#059669', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 4 }}>
                          <Text style={{ fontSize: 10, fontWeight: '800', color: '#FFFFFF' }}>
                            ✓ Covered by {p3Sub.assignedFaculty}
                          </Text>
                        </View>
                      )}
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

                {/* UPCOMING CLASS PREVIEW (Clean Professional White Card, No Yellow Slop) */}
                <TouchableOpacity
                  style={[styles.cleanScheduleCard, SHADOWS.card]}
                  onPress={() => navigateTo('timetable', '/(teacher)/timetable')}
                  activeOpacity={0.85}
                >
                  <View style={styles.cleanScheduleLeft}>
                    <View style={styles.cleanClockIcon}>
                      <Clock size={16} color={COLORS.brand[600]} strokeWidth={2.2} />
                    </View>
                    <View>
                      <Text style={styles.cleanScheduleTag}>UPCOMING • PERIOD 4</Text>
                      <Text style={styles.cleanScheduleTitle}>
                        Class 9-A Physics • 11:15 AM
                      </Text>
                      <Text style={styles.cleanScheduleSub}>Room 204 • Optics & Ray Diagrams</Text>
                    </View>
                  </View>
                  <ChevronRight size={16} color={COLORS.slate[400]} />
                </TouchableOpacity>

                {/* QUICK ACTIONS FOR TEACHING (Placed AT THE BOTTOM) */}
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
              </>
            ) : (
              /* CLASS 8-B IN-CHARGE HUB */
              <View style={styles.inChargeHubWrapper}>
                <View style={[styles.inChargeCard, SHADOWS.card]}>
                  <View style={styles.inChargeHeader}>
                    <View>
                      <Text style={styles.inChargeTitle}>Grade 8 – Section B</Text>
                      <Text style={styles.inChargeSub}>Form Tutor: Mrs. Deepa R. • Room 204</Text>
                    </View>
                    <View style={styles.inChargeActivePill}>
                      <Text style={styles.inChargeActivePillText}>38 Enrolled</Text>
                    </View>
                  </View>

                  <View style={styles.inChargeStatsRow}>
                    <View style={styles.inChargeStatCol}>
                      <Text style={styles.inChargeStatNum}>36</Text>
                      <Text style={styles.inChargeStatLbl}>Present Today</Text>
                    </View>
                    <View style={styles.inChargeStatDivider} />
                    <View style={styles.inChargeStatCol}>
                      <Text style={[styles.inChargeStatNum, { color: '#DC2626' }]}>2</Text>
                      <Text style={styles.inChargeStatLbl}>Absent</Text>
                    </View>
                    <View style={styles.inChargeStatDivider} />
                    <View style={styles.inChargeStatCol}>
                      <Text style={[styles.inChargeStatNum, { color: '#059669' }]}>94.7%</Text>
                      <Text style={styles.inChargeStatLbl}>Attendance</Text>
                    </View>
                  </View>

                  <View style={styles.inChargeActionsRow}>
                    <TouchableOpacity
                      style={styles.inChargeBtnPrimary}
                      onPress={() => navigateTo('attendance', '/(teacher)/attendance')}
                    >
                      <CalendarCheck size={14} color="#FFFFFF" />
                      <Text style={styles.inChargeBtnPrimaryText}>Take Roll Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.inChargeBtnSecondary}
                      onPress={() => navigateTo('marks', '/(teacher)/marks')}
                    >
                      <Award size={14} color={COLORS.brand[700]} />
                      <Text style={styles.inChargeBtnSecondaryText}>View Gradebook</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* TEACHER CIRCULARS MODAL */}
      <Modal
        visible={isCircularModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCircularModalVisible(false)}
      >
        <View style={styles.tCirModalOverlay}>
          <View style={styles.tCirModalCard}>
            <View style={styles.tCirModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.tCirHeaderIconWrap}>
                  <Megaphone size={20} color={COLORS.brand[600]} />
                </View>
                <View>
                  <Text style={styles.tCirHeaderTitle}>School Circulars & Notices</Text>
                  <Text style={styles.tCirHeaderSub}>Faculty & Institutional Advisories</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setIsCircularModalVisible(false)}
                style={styles.tCirCloseBtn}
              >
                <X size={20} color={COLORS.slate[600]} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ maxHeight: Dimensions.get('window').height * 0.7 }}
              contentContainerStyle={{ padding: 16, gap: 14 }}
              showsVerticalScrollIndicator={false}
            >
              {teacherCirculars.map((cir) => {
                const isUrgent = cir.priority === 'urgent';
                return (
                  <View key={cir.id} style={[styles.tCirItemCard, SHADOWS.card]}>
                    <View style={styles.tCirItemTop}>
                      <View
                        style={[
                          styles.tCirBadge,
                          isUrgent ? styles.tCirBadgeUrgent : styles.tCirBadgeNormal,
                        ]}
                      >
                        <Text
                          style={[
                            styles.tCirBadgeText,
                            isUrgent ? styles.tCirBadgeTextUrgent : styles.tCirBadgeTextNormal,
                          ]}
                        >
                          {isUrgent ? '⚠️ URGENT ADVISORY' : 'FACULTY NOTICE'}
                        </Text>
                      </View>
                      <Text style={styles.tCirMemoText}>{cir.memoNo} • {cir.date}</Text>
                    </View>

                    <Text style={styles.tCirTitle}>{cir.title}</Text>
                    <Text style={styles.tCirBody}>{cir.content}</Text>

                    {cir.attachmentUrl && (
                      <TouchableOpacity
                        style={styles.tCirAttachmentBox}
                        onPress={() =>
                          setSelectedCircularImage({
                            url: cir.attachmentUrl!,
                            title: cir.title,
                          })
                        }
                        activeOpacity={0.85}
                      >
                        <Image
                          source={{ uri: cir.attachmentUrl }}
                          style={styles.tCirAttachmentThumb}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.tCirAttachmentName} numberOfLines={1}>
                            {cir.attachmentName || 'Circular Attachment Document'}
                          </Text>
                          <Text style={styles.tCirAttachmentSub}>
                            Tap to view full announcement photo / map
                          </Text>
                        </View>
                        <Eye size={16} color={COLORS.brand[600]} />
                      </TouchableOpacity>
                    )}

                    <View style={styles.tCirFooter}>
                      <ShieldCheck size={13} color={COLORS.presentText} />
                      <Text style={styles.tCirAuthor}>{cir.author}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* FULL-SIZE ATTACHMENT MODAL */}
      <Modal
        visible={!!selectedCircularImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCircularImage(null)}
      >
        <View style={styles.tCirImageModalOverlay}>
          <View style={styles.tCirImageModalContent}>
            <View style={styles.tCirImageModalHeader}>
              <Text style={styles.tCirImageModalTitle} numberOfLines={1}>
                {selectedCircularImage?.title}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedCircularImage(null)}
                style={styles.tCirImageModalCloseBtn}
              >
                <X size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {selectedCircularImage?.url && (
              <Image
                source={{ uri: selectedCircularImage.url }}
                style={styles.tCirImageModalImage}
                resizeMode="contain"
              />
            )}
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

  // Coordinator Operations Card (Unified, clean)
  coordinatorOpsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    gap: 12,
  },
  opsCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  opsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  opsStatusIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opsLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  opsItemTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  opsStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  opsStatusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  opsItemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  opsDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
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

  // Clean Schedule Card (Replaces Yellow AI Slop)
  cleanScheduleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cleanScheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cleanClockIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  cleanScheduleTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: COLORS.brand[600],
    letterSpacing: 0.5,
  },
  cleanScheduleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[900],
    marginTop: 1,
  },
  cleanScheduleSub: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },

  // In-Charge Hub
  inChargeHubWrapper: {
    marginTop: 4,
  },
  inChargeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  inChargeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  inChargeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  inChargeSub: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 2,
  },
  inChargeActivePill: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  inChargeActivePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  inChargeStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.slate[50],
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 14,
  },
  inChargeStatCol: {
    alignItems: 'center',
  },
  inChargeStatNum: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  inChargeStatLbl: {
    fontSize: 10,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  inChargeStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.slate[200],
  },
  inChargeActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inChargeBtnPrimary: {
    flex: 1,
    backgroundColor: COLORS.brand[600],
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  inChargeBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  inChargeBtnSecondary: {
    flex: 1,
    backgroundColor: COLORS.slate[50],
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  inChargeBtnSecondaryText: {
    color: COLORS.slate[700],
    fontSize: 11,
    fontWeight: '700',
  },

  // Teacher Circular Modal Styles
  tCirModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  tCirModalCard: {
    backgroundColor: COLORS.screenBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    paddingBottom: 24,
  },
  tCirModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[200],
  },
  tCirHeaderIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  tCirHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  tCirHeaderSub: {
    fontSize: 12,
    color: COLORS.slate[500],
    marginTop: 2,
    fontWeight: '500',
  },
  tCirCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  tCirItemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  tCirItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tCirBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tCirBadgeUrgent: {
    backgroundColor: '#FEE2E2',
  },
  tCirBadgeNormal: {
    backgroundColor: '#EEF2FF',
  },
  tCirBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tCirBadgeTextUrgent: {
    color: '#DC2626',
  },
  tCirBadgeTextNormal: {
    color: COLORS.brand[700],
  },
  tCirMemoText: {
    fontSize: 11,
    color: COLORS.slate[500],
    fontWeight: '500',
  },
  tCirTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.slate[900],
    lineHeight: 20,
    marginBottom: 6,
  },
  tCirBody: {
    fontSize: 13,
    color: COLORS.slate[600],
    lineHeight: 19,
    marginBottom: 12,
  },
  tCirAttachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.brand[50],
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.brand[100],
    marginBottom: 12,
  },
  tCirAttachmentThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.slate[200],
  },
  tCirAttachmentName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[900],
  },
  tCirAttachmentSub: {
    fontSize: 11,
    color: COLORS.brand[600],
    marginTop: 2,
  },
  tCirFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[100],
  },
  tCirAuthor: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate[700],
  },
  tCirImageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  tCirImageModalContent: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: COLORS.slate[900],
    borderRadius: 20,
    overflow: 'hidden',
  },
  tCirImageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tCirImageModalTitle: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    marginRight: 12,
  },
  tCirImageModalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tCirImageModalImage: {
    width: '100%',
    height: 380,
    backgroundColor: '#000000',
  },
});
