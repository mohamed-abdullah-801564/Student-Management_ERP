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
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  RefreshCw,
  FileText,
  BookOpen,
  Mic,
  Sparkles,
  Camera,
  CheckCircle2,
  Calendar,
  X,
  Bell,
  Send,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';

export default function PostHomeworkScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [mode, setMode] = useState<'homework' | 'diary'>('homework');
  const [instructions, setInstructions] = useState(
    'Chapter 4: Quadratic Equations — Complete Practice Set 4.2, Problems 1 through 6. Refer to the blackboard formula photo attached below for step-by-step discriminant criteria.'
  );
  const [hasPhoto, setHasPhoto] = useState(true);
  const [selectedDue, setSelectedDue] = useState<'tomorrow' | 'dayAfter' | 'nextClass' | 'custom'>('tomorrow');
  const [allowParentDone, setAllowParentDone] = useState(true);
  const [sendReminder, setSendReminder] = useState(true);
  const [isDictating, setIsDictating] = useState(false);

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
    Alert.alert(
      'Homework Published! 🚀',
      'Instant push notification sent to all 38 parents of Grade 8-A.',
      [{ text: 'OK', onPress: handleBack }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
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
          <Text style={styles.draftText}>Draft Saved</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pre-filled Context Pill Card */}
        <View style={[styles.contextCard, SHADOWS.card]}>
          <View style={styles.contextTopRow}>
            <View style={styles.syncRow}>
              <RefreshCw size={13} color={COLORS.brand[600]} />
              <Text style={styles.syncText}>Auto-synced with active period</Text>
            </View>
            <View style={styles.liveClassBadge}>
              <Text style={styles.liveClassText}>LIVE CLASS</Text>
            </View>
          </View>

          <View style={styles.contextChipsRow}>
            <View style={styles.chip}>
              <Text style={styles.chipEmoji}>🏫</Text>
              <Text style={styles.chipText}>Grade 8–A</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipEmoji}>📐</Text>
              <Text style={styles.chipText}>Mathematics</Text>
            </View>
            <View style={[styles.chip, styles.chipActive]}>
              <Text style={styles.chipEmoji}>⏱️</Text>
              <Text style={styles.chipTextActive}>Period 3 • Today</Text>
            </View>
          </View>
        </View>

        {/* Segmented Mode Toggle */}
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

        {/* Card: Text Instructions */}
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
            <TouchableOpacity style={styles.aiAssistRow} activeOpacity={0.7}>
              <Sparkles size={13} color={COLORS.brand[600]} />
              <Text style={styles.aiAssistText}>Make instructions student-friendly</Text>
            </TouchableOpacity>
            <Text style={styles.charCountText}>{instructions.length} chars</Text>
          </View>
        </View>

        {/* Card: Blackboard / Textbook Snaps */}
        <View style={[styles.card, SHADOWS.card]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderLabel}>BLACKBOARD / TEXTBOOK SNAPS</Text>
            {hasPhoto && (
              <View style={styles.photoCountPill}>
                <Text style={styles.photoCountText}>1 Attached</Text>
              </View>
            )}
          </View>

          {/* Camera Trigger Box */}
          <TouchableOpacity
            style={styles.cameraTriggerBox}
            onPress={() => setHasPhoto(true)}
            activeOpacity={0.8}
          >
            <View style={styles.cameraIconBox}>
              <Camera size={20} color="#FFFFFF" strokeWidth={2.2} />
            </View>
            <View style={styles.cameraTextGroup}>
              <Text style={styles.cameraTitle}>Snap Photo from Camera</Text>
              <Text style={styles.cameraSubtitle}>Capture blackboard work or textbook page</Text>
            </View>
            <View style={styles.choosePill}>
              <Text style={styles.choosePillText}>Choose</Text>
            </View>
          </TouchableOpacity>

          {/* Attached Photo Preview */}
          {hasPhoto && (
            <View style={styles.attachmentPreview}>
              <View style={styles.attachmentLeft}>
                <View style={styles.thumbnailPlaceholder}>
                  <Text style={styles.thumbnailLabel}>📐 CH-4</Text>
                </View>
                <View>
                  <Text style={styles.attachmentFileName} numberOfLines={1}>
                    blackboard_quadratic_formula.jpg
                  </Text>
                  <View style={styles.attachmentMetaRow}>
                    <View style={styles.snapBadge}>
                      <Text style={styles.snapBadgeText}>Blackboard Snap</Text>
                    </View>
                    <Text style={styles.fileSizeText}>1.4 MB</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() => setHasPhoto(false)}
                activeOpacity={0.7}
              >
                <X size={15} color={COLORS.slate[500]} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Card: Due Date Selector */}
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
              {selectedDue === 'tomorrow' && (
                <CheckCircle2 size={16} color="#FFFFFF" />
              )}
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
              {selectedDue === 'dayAfter' && (
                <CheckCircle2 size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dueChip,
                selectedDue === 'nextClass' && styles.dueChipActive,
              ]}
              onPress={() => setSelectedDue('nextClass')}
              activeOpacity={0.8}
            >
              <View>
                <Text
                  style={[
                    styles.dueTitle,
                    selectedDue === 'nextClass' && styles.dueTitleActive,
                  ]}
                >
                  Next Maths Class
                </Text>
                <Text
                  style={[
                    styles.dueSub,
                    selectedDue === 'nextClass' && styles.dueSubActive,
                  ]}
                >
                  Thursday, 19 Nov
                </Text>
              </View>
              {selectedDue === 'nextClass' && (
                <CheckCircle2 size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dueChip,
                selectedDue === 'custom' && styles.dueChipActive,
              ]}
              onPress={() => setSelectedDue('custom')}
              activeOpacity={0.8}
            >
              <View>
                <Text
                  style={[
                    styles.dueTitle,
                    selectedDue === 'custom' && styles.dueTitleActive,
                  ]}
                >
                  Custom Date
                </Text>
                <Text
                  style={[
                    styles.dueSub,
                    selectedDue === 'custom' && styles.dueSubActive,
                  ]}
                >
                  Pick calendar
                </Text>
              </View>
              <Calendar
                size={16}
                color={selectedDue === 'custom' ? '#FFFFFF' : COLORS.slate[400]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card: Parent & Student Settings */}
        <View style={[styles.card, SHADOWS.card]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderLabel}>PARENT & STUDENT SETTINGS</Text>
            <Text style={styles.cardHeaderHint}>Grade 8–A (38 Enrolled)</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingTitle}>
                Allow parents to mark as Done / Acknowledged
              </Text>
              <Text style={styles.settingSubtitle}>
                Sends immediate push notification & SMS summary to all 38 parents
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
                Send student reminder 2 hours before due date
              </Text>
              <Text style={styles.settingSubtitle}>
                Alerts students who haven't turned in notebook work
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
            Will publish instantly to Grade 8–A Student & Parent Portals
          </Text>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          style={styles.publishButton}
          onPress={handlePublish}
          activeOpacity={0.88}
        >
          <Text style={styles.publishButtonText}>Publish to Parents & Class</Text>
          <Send size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  draftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.presentBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.presentBorder,
    gap: 5,
  },
  draftDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.present,
  },
  draftText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.presentText,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 14,
  },
  contextCard: {
    backgroundColor: COLORS.brand[50],
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.brand[100],
  },
  contextTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  syncText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[900],
  },
  liveClassBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  liveClassText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.brand[600],
    letterSpacing: 0.5,
  },
  contextChipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  chipActive: {
    borderWidth: 1,
    borderColor: COLORS.brand[200],
  },
  chipEmoji: {
    fontSize: 11,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.slate[800],
  },
  chipTextActive: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  modeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.slate[200],
    borderRadius: 16,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  modeButtonActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate[600],
  },
  modeButtonTextActive: {
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate[500],
    letterSpacing: 0.6,
  },
  cardHeaderHint: {
    fontSize: 11,
    color: COLORS.slate[400],
  },
  cardHeaderRightHighlight: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[600],
  },
  textareaWrapper: {
    position: 'relative',
  },
  textarea: {
    backgroundColor: COLORS.slate[50],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    padding: 12,
    paddingRight: 44,
    fontSize: 13,
    color: COLORS.slate[800],
    minHeight: 90,
    textAlignVertical: 'top',
    lineHeight: 18,
  },
  micButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: {
    backgroundColor: COLORS.absent,
  },
  textareaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiAssistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  aiAssistText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[600],
  },
  charCountText: {
    fontSize: 10,
    color: COLORS.slate[400],
  },
  photoCountPill: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  photoCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brand[600],
  },
  cameraTriggerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.brand[50],
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.brand[100],
  },
  cameraIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.brand[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraTextGroup: {
    flex: 1,
    marginLeft: 12,
  },
  cameraTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  cameraSubtitle: {
    fontSize: 10,
    color: COLORS.slate[500],
    marginTop: 2,
  },
  choosePill: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.brand[100],
  },
  choosePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[600],
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.slate[50],
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  attachmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  thumbnailPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.brand[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.white,
  },
  attachmentFileName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[800],
  },
  attachmentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  snapBadge: {
    backgroundColor: COLORS.brand[100],
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  snapBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  fileSizeText: {
    fontSize: 10,
    color: COLORS.slate[400],
  },
  removePhotoButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  dueChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dueChip: {
    width: '48%',
    backgroundColor: COLORS.slate[50],
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dueChipActive: {
    backgroundColor: COLORS.brand[600],
    borderColor: COLORS.brand[600],
  },
  dueTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[800],
  },
  dueTitleActive: {
    color: COLORS.white,
  },
  dueSub: {
    fontSize: 10,
    color: COLORS.slate[500],
    marginTop: 2,
  },
  dueSubActive: {
    color: COLORS.brand[100],
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
    fontSize: 10,
    color: COLORS.slate[500],
    marginTop: 2,
    lineHeight: 14,
  },
  settingDivider: {
    height: 1,
    backgroundColor: COLORS.slate[100],
  },
  broadcastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brand[50],
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.brand[100],
    gap: 6,
  },
  broadcastBannerText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.brand[800],
  },
  publishButton: {
    height: 50,
    borderRadius: 16,
    backgroundColor: COLORS.brand[600],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.brand[600],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  publishButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
});
