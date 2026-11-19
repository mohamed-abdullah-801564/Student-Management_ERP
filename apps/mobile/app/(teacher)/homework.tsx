import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  RefreshCw,
  FileText,
  BookOpen,
  Mic,
  Camera,
  CheckCircle2,
  Calendar,
  X,
  Bell,
  Send,
  Building2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { schoolStore, BLACKBOARD_SAMPLES, BlackboardSnapshot } from '../../src/lib/schoolStore';
import { ParentHomeworkItem } from '../../src/constants/mockData';

export default function PostHomeworkScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [mode, setMode] = useState<'homework' | 'diary'>('homework');
  const [instructions, setInstructions] = useState(
    'Chapter 4: Quadratic Equations — Complete Practice Set 4.2, Problems 1 through 6. Refer to the blackboard formula photo attached below for step-by-step discriminant criteria.'
  );
  const [hasPhoto, setHasPhoto] = useState(true);
  const [selectedSnapshotKey, setSelectedSnapshotKey] = useState<string>('math_quadratic');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedDue, setSelectedDue] = useState<'tomorrow' | 'dayAfter' | 'nextClass' | 'custom'>('tomorrow');
  const [allowParentDone, setAllowParentDone] = useState(true);
  const [sendReminder, setSendReminder] = useState(true);
  const [isDictating, setIsDictating] = useState(false);

  const activeSnapshot = BLACKBOARD_SAMPLES[selectedSnapshotKey] || BLACKBOARD_SAMPLES.math_quadratic;

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

  const handlePublish = () => {
    const dueLabel =
      selectedDue === 'tomorrow'
        ? 'Tomorrow (Period 1)'
        : selectedDue === 'dayAfter'
        ? 'Day After Tomorrow'
        : 'Next Math Period';

    const newHw: ParentHomeworkItem = {
      id: `hw-${Date.now()}`,
      subject: mode === 'homework' ? 'Mathematics' : 'Lesson Diary Topic',
      title: 'Chapter 4: Quadratic Equations',
      instructions: instructions.trim(),
      dueDate: dueLabel,
      isCompleted: false,
      hasAttachment: hasPhoto,
      attachmentName: hasPhoto ? 'blackboard_quadratic_formula.jpg' : undefined,
      teacherName: 'Mrs. Deepa R.',
      assignedDate: 'Today (Just Now)',
    };

    schoolStore.addHomework(newHw);

    Alert.alert(
      'Homework Published ✓',
      'Instant push notification dispatched to all 38 parents of Grade 8-A with attached blackboard chalkboard notes.',
      [{ text: 'OK', onPress: handleBack }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <ChevronLeft size={22} color={COLORS.slate[800]} strokeWidth={2.5} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Create Homework & Notes</Text>
            <Text style={styles.headerSubtitle}>Mrs. Deepa • Greenwood Academy</Text>
          </View>
        </View>

        <View style={styles.draftBadge}>
          <View style={styles.draftDot} />
          <Text style={styles.draftText}>Live Context</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Pre-filled Context Card (No Emoji Slop) */}
        <View style={[styles.contextCard, SHADOWS.card]}>
          <View style={styles.contextTopRow}>
            <View style={styles.syncRow}>
              <RefreshCw size={12} color={COLORS.brand[600]} />
              <Text style={styles.syncText}>Auto-synced with active period</Text>
            </View>
            <View style={styles.liveClassBadge}>
              <Text style={styles.liveClassText}>LIVE CLASS</Text>
            </View>
          </View>

          <View style={styles.contextChipsRow}>
            <View style={styles.chip}>
              <Building2 size={12} color="#4338CA" />
              <Text style={styles.chipText}>Grade 8–A</Text>
            </View>
            <View style={styles.chip}>
              <BookOpen size={12} color="#4338CA" />
              <Text style={styles.chipText}>Mathematics</Text>
            </View>
            <View style={[styles.chip, styles.chipActive]}>
              <Clock size={12} color="#FFFFFF" />
              <Text style={styles.chipTextActive}>Period 3 • Today</Text>
            </View>
          </View>
        </View>

        {/* 3. Segmented Mode Toggle */}
        <View style={styles.modeToggleContainer}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'homework' && styles.modeButtonActive,
            ]}
            onPress={() => setMode('homework')}
            activeOpacity={0.8}
          >
            <FileText
              size={15}
              color={mode === 'homework' ? COLORS.brand[700] : COLORS.slate[500]}
              strokeWidth={2.2}
            />
            <Text
              style={[
                styles.modeButtonText,
                mode === 'homework' && styles.modeButtonTextActive,
              ]}
            >
              Homework Assignment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'diary' && styles.modeButtonActive,
            ]}
            onPress={() => setMode('diary')}
            activeOpacity={0.8}
          >
            <BookOpen
              size={15}
              color={mode === 'diary' ? COLORS.brand[700] : COLORS.slate[500]}
              strokeWidth={2.2}
            />
            <Text
              style={[
                styles.modeButtonText,
                mode === 'diary' && styles.modeButtonTextActive,
              ]}
            >
              Lesson Diary Topic
            </Text>
          </TouchableOpacity>
        </View>

        {/* 4. Text Instructions */}
        <View style={[styles.card, SHADOWS.card]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderLabel}>HOMEWORK INSTRUCTIONS</Text>
            <Text style={styles.cardHeaderHint}>Text & Voice</Text>
          </View>

          <View style={styles.textareaWrapper}>
            <TextInput
              style={styles.textarea}
              multiline
              numberOfLines={4}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="e.g. Chapter 4: Practice Set 4.2..."
              placeholderTextColor={COLORS.slate[400]}
            />
            <TouchableOpacity
              style={[
                styles.micButton,
                isDictating && styles.micButtonActive,
              ]}
              onPress={() => setIsDictating(!isDictating)}
              activeOpacity={0.8}
            >
              <Mic
                size={16}
                color={isDictating ? '#FFFFFF' : COLORS.brand[600]}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.textareaFooter}>
            <View style={styles.aiAssistRow}>
              <Layers size={13} color={COLORS.brand[600]} />
              <Text style={styles.aiAssistText}>NCERT Syllabus Mapped</Text>
            </View>
            <Text style={styles.charCountText}>{instructions.length} chars</Text>
          </View>
        </View>

        {/* 5. Card: Blackboard / Textbook Snaps */}
        <View style={[styles.card, SHADOWS.card]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderLabel}>BLACKBOARD / CHALKBOARD PHOTO</Text>
            {hasPhoto && (
              <View style={styles.photoCountPill}>
                <Text style={styles.photoCountText}>1 Attached</Text>
              </View>
            )}
          </View>

          {/* Camera Trigger Box */}
          <TouchableOpacity
            style={styles.cameraTriggerBox}
            onPress={() => setIsPhotoModalOpen(true)}
            activeOpacity={0.8}
          >
            <View style={styles.cameraIconBox}>
              <Camera size={20} color="#FFFFFF" strokeWidth={2.2} />
            </View>
            <View style={styles.cameraTextGroup}>
              <Text style={styles.cameraTitle}>Capture Blackboard Snapshot</Text>
              <Text style={styles.cameraSubtitle}>
                Snap today's chalkboard notes or diagram for parents
              </Text>
            </View>
            <View style={styles.choosePill}>
              <Text style={styles.choosePillText}>Select</Text>
            </View>
          </TouchableOpacity>

          {/* Attached Photo Preview */}
          {hasPhoto && (
            <View style={styles.attachmentPreview}>
              <View style={styles.attachmentLeft}>
                <View style={styles.thumbnailPlaceholder}>
                  <Camera size={18} color="#4338CA" />
                </View>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.attachmentFileName} numberOfLines={1}>
                    {activeSnapshot.title}
                  </Text>
                  <View style={styles.attachmentMetaRow}>
                    <View style={styles.snapBadge}>
                      <Text style={styles.snapBadgeText}>Room 302 Board</Text>
                    </View>
                    <Text style={styles.fileSizeText}>1.4 MB • Notes Attached</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() => setHasPhoto(false)}
                activeOpacity={0.7}
              >
                <X size={16} color="#64748B" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 6. Card: Due Date Selector */}
        <View style={[styles.card, SHADOWS.card]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderLabel}>SUBMISSION DUE DATE</Text>
            <Text style={styles.cardHeaderRightHighlight}>Period 1 (8:30 AM)</Text>
          </View>

          <View style={styles.dueChipsGrid}>
            <TouchableOpacity
              style={[
                styles.dueChip,
                selectedDue === 'tomorrow' && styles.dueChipActive,
              ]}
              onPress={() => setSelectedDue('tomorrow')}
              activeOpacity={0.8}
            >
              <View>
                <Text
                  style={[
                    styles.dueTitle,
                    selectedDue === 'tomorrow' && styles.dueTitleActive,
                  ]}
                >
                  Tomorrow
                </Text>
                <Text
                  style={[
                    styles.dueSub,
                    selectedDue === 'tomorrow' && styles.dueSubActive,
                  ]}
                >
                  Tue, 17 Nov
                </Text>
              </View>
              <CheckCircle2
                size={16}
                color={selectedDue === 'tomorrow' ? '#FFFFFF' : COLORS.slate[300]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dueChip,
                selectedDue === 'dayAfter' && styles.dueChipActive,
              ]}
              onPress={() => setSelectedDue('dayAfter')}
              activeOpacity={0.8}
            >
              <View>
                <Text
                  style={[
                    styles.dueTitle,
                    selectedDue === 'dayAfter' && styles.dueTitleActive,
                  ]}
                >
                  Day After
                </Text>
                <Text
                  style={[
                    styles.dueSub,
                    selectedDue === 'dayAfter' && styles.dueSubActive,
                  ]}
                >
                  Wed, 18 Nov
                </Text>
              </View>
              <CheckCircle2
                size={16}
                color={selectedDue === 'dayAfter' ? '#FFFFFF' : COLORS.slate[300]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 7. Card: Parent Settings */}
        <View style={[styles.card, SHADOWS.card]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderLabel}>PARENT NOTIFICATION & CONFIRMATION</Text>
            <Text style={styles.cardHeaderHint}>38 Class 8-A Parents</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingTitle}>
                Allow parents to mark as Completed
              </Text>
              <Text style={styles.settingSubtitle}>
                Parents can check off task when child finishes notebook work
              </Text>
            </View>
            <Switch
              value={allowParentDone}
              onValueChange={setAllowParentDone}
              trackColor={{ false: COLORS.slate[200], true: COLORS.brand[600] }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingTitle}>
                Send parent reminder if unacknowledged
              </Text>
              <Text style={styles.settingSubtitle}>
                Sends follow-up push alert 3 hours before morning due time
              </Text>
            </View>
            <Switch
              value={sendReminder}
              onValueChange={setSendReminder}
              trackColor={{ false: COLORS.slate[200], true: COLORS.brand[600] }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Broadcast Info Banner */}
        <View style={styles.broadcastBanner}>
          <Bell size={13} color={COLORS.brand[600]} />
          <Text style={styles.broadcastBannerText}>
            Dispatches instant notification to all 38 Class 8-A parents
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Publish Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.publishButton}
          onPress={handlePublish}
          activeOpacity={0.88}
        >
          <Send size={16} color="#FFFFFF" />
          <Text style={styles.publishButtonText}>Publish to Class 8-A Parents</Text>
        </TouchableOpacity>
      </View>

      {/* 9. MODAL: CHOOSE BLACKBOARD SNAPSHOT */}
      {isPhotoModalOpen && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsPhotoModalOpen(false)}
        >
          <View style={styles.photoModalOverlay}>
            <View style={styles.photoModalSheet}>
              <View style={styles.photoModalHeader}>
                <View>
                  <Text style={styles.photoModalTitle}>Select Blackboard Snapshot</Text>
                  <Text style={styles.photoModalSub}>Room 302 Active Board Work</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsPhotoModalOpen(false)}
                  style={styles.closeBtn}
                >
                  <X size={18} color={COLORS.slate[500]} />
                </TouchableOpacity>
              </View>

              <View style={styles.snapshotList}>
                {Object.entries(BLACKBOARD_SAMPLES).map(([key, snap]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.snapshotOptionCard,
                      selectedSnapshotKey === key && styles.snapshotOptionCardActive,
                    ]}
                    onPress={() => {
                      setSelectedSnapshotKey(key);
                      setHasPhoto(true);
                      setIsPhotoModalOpen(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.chalkIconCircle}>
                      <Camera size={16} color="#FDE047" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.snapshotOptionTitle}>{snap.title}</Text>
                      <Text style={styles.snapshotOptionSub}>
                        {snap.subject} • {snap.period} • {snap.teacher}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.radioCircle,
                        selectedSnapshotKey === key && styles.radioCircleActive,
                      ]}
                    >
                      {selectedSnapshotKey === key && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                ))}
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
    backgroundColor: COLORS.screenBg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[200],
    backgroundColor: COLORS.white,
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
    color: COLORS.slate[900],
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  draftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  draftDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4F46E5',
  },
  draftText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#4338CA',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  contextCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    gap: 10,
  },
  contextTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  syncText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.brand[700],
  },
  liveClassBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveClassText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  contextChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chipActive: {
    backgroundColor: '#4F46E5',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
  },
  chipTextActive: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 3,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  modeButtonText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.slate[600],
  },
  modeButtonTextActive: {
    color: COLORS.brand[700],
    fontWeight: '800',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.slate[500],
    letterSpacing: 0.5,
  },
  cardHeaderHint: {
    fontSize: 11,
    color: COLORS.slate[400],
    fontWeight: '500',
  },
  cardHeaderRightHighlight: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[600],
  },
  photoCountPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  photoCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  textareaWrapper: {
    position: 'relative',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    padding: 10,
  },
  textarea: {
    fontSize: 14,
    color: COLORS.slate[800],
    lineHeight: 22,
    minHeight: 85,
    textAlignVertical: 'top',
  },
  micButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: {
    backgroundColor: COLORS.brand[600],
  },
  textareaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  aiAssistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiAssistText: {
    fontSize: 11,
    color: COLORS.brand[600],
    fontWeight: '700',
  },
  charCountText: {
    fontSize: 10.5,
    color: COLORS.slate[400],
  },
  cameraTriggerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  cameraIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraTextGroup: {
    flex: 1,
  },
  cameraTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  cameraSubtitle: {
    fontSize: 10.5,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  choosePill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  choosePillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#4338CA',
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginTop: 4,
  },
  attachmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  thumbnailPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  attachmentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  snapBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  snapBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#334155',
  },
  fileSizeText: {
    fontSize: 10.5,
    color: '#64748B',
  },
  removePhotoButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  dueChipsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  dueChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dueChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  dueTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[800],
  },
  dueTitleActive: {
    color: '#FFFFFF',
  },
  dueSub: {
    fontSize: 10,
    color: COLORS.slate[500],
    marginTop: 2,
  },
  dueSubActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  settingTextGroup: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[800],
  },
  settingSubtitle: {
    fontSize: 10.5,
    color: COLORS.slate[500],
    marginTop: 2,
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  broadcastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    padding: 10,
    borderRadius: 10,
  },
  broadcastBannerText: {
    fontSize: 11,
    color: '#4338CA',
    fontWeight: '600',
    flex: 1,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 4,
  },
  publishButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  photoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  photoModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 14,
  },
  photoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  photoModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  photoModalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  snapshotList: {
    gap: 10,
  },
  snapshotOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  snapshotOptionCardActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  chalkIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapshotOptionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  snapshotOptionSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#4F46E5',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
  },
});
