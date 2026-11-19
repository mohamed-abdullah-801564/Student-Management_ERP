import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  Calendar,
  BookOpen,
  CheckSquare,
  Square,
  Paperclip,
  CheckCircle2,
  Clock,
  Camera,
  X,
  Sparkles,
  Download,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { ParentHomeworkItem } from '../../src/constants/mockData';
import { schoolStore, BLACKBOARD_SAMPLES, BlackboardSnapshot } from '../../src/lib/schoolStore';

export default function ParentHomeworkScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [homeworkList, setHomeworkList] = useState<ParentHomeworkItem[]>(schoolStore.getHomework());
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [activeBlackboardModal, setActiveBlackboardModal] = useState<BlackboardSnapshot | null>(null);

  useEffect(() => {
    const unsubscribe = schoolStore.subscribe(() => {
      setHomeworkList(schoolStore.getHomework());
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
        router.navigate('/(parent)' as any);
      }
    }
  };

  const toggleHomework = (id: string) => {
    schoolStore.toggleHomework(id);
  };

  const openBlackboardNotes = (hw: ParentHomeworkItem) => {
    if (hw.subject.toLowerCase().includes('math') || hw.title.toLowerCase().includes('4.2') || hw.title.toLowerCase().includes('quadratic')) {
      setActiveBlackboardModal(BLACKBOARD_SAMPLES.math_quadratic);
    } else {
      setActiveBlackboardModal(BLACKBOARD_SAMPLES.science_optics);
    }
  };

  const filteredList = homeworkList.filter((item) => {
    if (filter === 'pending') return !item.isCompleted;
    if (filter === 'completed') return item.isCompleted;
    return true;
  });

  const pendingCount = homeworkList.filter((h) => !h.isCompleted).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <ChevronLeft size={22} color={COLORS.slate[800]} strokeWidth={2.5} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Daily Homework & Notes</Text>
          <Text style={styles.headerSub}>Rahul Suresh • Class 8-B • Greenwood Academy</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Status Tracker Banner */}
        <View style={[styles.statusBanner, SHADOWS.card]}>
          <View>
            <Text style={styles.statusBannerTitle}>
              {pendingCount === 0 ? 'All Tasks Completed! 🎉' : `${pendingCount} Tasks Remaining Today`}
            </Text>
            <Text style={styles.statusBannerSub}>
              Tap checkbox once child finishes the assignment
            </Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>
              {homeworkList.length - pendingCount}/{homeworkList.length} Done
            </Text>
          </View>
        </View>

        {/* 3. Filter Pills */}
        <View style={styles.filterRow}>
          {[
            { id: 'all', label: `All (${homeworkList.length})` },
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'completed', label: `Completed (${homeworkList.length - pendingCount})` },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.filterPill,
                filter === item.id && styles.filterPillActive,
              ]}
              onPress={() => setFilter(item.id as any)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filter === item.id && styles.filterPillTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. Homework Items */}
        <View style={styles.hwList}>
          {filteredList.map((hw) => (
            <View
              key={hw.id}
              style={[
                styles.hwCard,
                SHADOWS.card,
                hw.isCompleted && styles.hwCardDone,
              ]}
            >
              <View style={styles.hwTopRow}>
                <View style={styles.hwSubjectBadge}>
                  <Text style={styles.hwSubjectText}>{hw.subject}</Text>
                </View>
                <View style={styles.dueRow}>
                  <Clock size={12} color={COLORS.slate[400]} />
                  <Text style={styles.dueDateText}>Due: {hw.dueDate}</Text>
                </View>
              </View>

              <View style={styles.hwMainRow}>
                <TouchableOpacity
                  onPress={() => toggleHomework(hw.id)}
                  style={styles.checkboxTouch}
                  activeOpacity={0.7}
                >
                  {hw.isCompleted ? (
                    <CheckSquare size={22} color="#059669" />
                  ) : (
                    <Square size={22} color={COLORS.slate[300]} />
                  )}
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.hwTitle,
                      hw.isCompleted && styles.hwTitleDone,
                    ]}
                  >
                    {hw.title}
                  </Text>
                  <Text style={styles.hwDesc}>{hw.instructions}</Text>
                </View>
              </View>

              {/* BLACKBOARD PHOTO SNAP CALLOUT BUTTON */}
              {hw.hasAttachment && (
                <TouchableOpacity
                  style={styles.blackboardSnapBox}
                  onPress={() => openBlackboardNotes(hw)}
                  activeOpacity={0.8}
                >
                  <View style={styles.blackboardThumb}>
                    <Camera size={16} color="#4338CA" />
                  </View>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.blackboardSnapTitle} numberOfLines={1}>
                      Blackboard Notes Attached
                    </Text>
                    <Text style={styles.blackboardSnapSub} numberOfLines={1}>
                      Captured by {hw.teacherName} • Tap to view board
                    </Text>
                  </View>
                  <View style={styles.viewNotesPill}>
                    <Text style={styles.viewNotesPillText}>View Notes →</Text>
                  </View>
                </TouchableOpacity>
              )}

              <View style={styles.hwFooter}>
                <Text style={styles.hwTeacher}>Assigned by {hw.teacherName}</Text>
                {hw.hasAttachment ? (
                  <View style={styles.attachmentBadge}>
                    <Paperclip size={11} color={COLORS.brand[600]} />
                    <Text style={styles.attachmentText}>
                      {hw.attachmentName || 'Chalkboard Snap'}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.assignedDateText}>Assigned: {hw.assignedDate}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 5. BLACKBOARD CHALKBOARD VIEWER MODAL */}
      {activeBlackboardModal && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setActiveBlackboardModal(null)}
        >
          <View style={styles.chalkModalOverlay}>
            <View style={styles.chalkBoardContainer}>
              {/* Blackboard Wooden Frame Header */}
              <View style={styles.chalkHeader}>
                <View style={styles.chalkHeaderLeft}>
                  <View style={styles.chalkDot} />
                  <div>
                    <Text style={styles.chalkHeaderTitle}>
                      {activeBlackboardModal.title}
                    </Text>
                    <Text style={styles.chalkHeaderSub}>
                      {activeBlackboardModal.subject} • {activeBlackboardModal.grade} • {activeBlackboardModal.period}
                    </Text>
                  </div>
                </View>
                <TouchableOpacity
                  onPress={() => setActiveBlackboardModal(null)}
                  style={styles.chalkCloseBtn}
                >
                  <X size={18} color="#E2E8F0" />
                </TouchableOpacity>
              </View>

              {/* Blackboard Slate Surface */}
              <ScrollView style={styles.slateSurface} showsVerticalScrollIndicator={false}>
                {/* Board Teacher Chalk Watermark */}
                <View style={styles.chalkMetaBanner}>
                  <Text style={styles.chalkTeacherWatermark}>
                    TEACHER'S BLACKBOARD TRANSCRIPTION • {activeBlackboardModal.teacher.toUpperCase()}
                  </Text>
                </View>

                {/* Key Formulas Section */}
                {activeBlackboardModal.keyFormulas && (
                  <View style={styles.formulaBox}>
                    <Text style={styles.formulaBoxTitle}>KEY FORMULAS / CRITERIA:</Text>
                    {activeBlackboardModal.keyFormulas.map((f, i) => (
                      <Text key={i} style={styles.formulaText}>
                        • {f}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Chalk Written Points */}
                <View style={styles.chalkNotesContainer}>
                  <Text style={styles.chalkNotesTitle}>BOARD SUMMARY & STEPS:</Text>
                  {activeBlackboardModal.notes.map((note, index) => (
                    <View key={index} style={styles.chalkBulletRow}>
                      <Text style={styles.chalkBullet}>›</Text>
                      <Text style={styles.chalkNoteText}>{note}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* Wooden Chalk Ledge Footer */}
              <View style={styles.chalkLedge}>
                <View style={styles.chalkSticksRow}>
                  <View style={[styles.chalkStick, { backgroundColor: '#FFFFFF' }]} />
                  <View style={[styles.chalkStick, { backgroundColor: '#FDE047' }]} />
                  <View style={[styles.chalkStick, { backgroundColor: '#93C5FD' }]} />
                </View>
                <TouchableOpacity
                  style={styles.doneExamBtn}
                  onPress={() => setActiveBlackboardModal(null)}
                  activeOpacity={0.85}
                >
                  <CheckCircle2 size={15} color="#FFFFFF" />
                  <Text style={styles.doneExamBtnText}>Close Notes</Text>
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
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusBannerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4338CA',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  filterPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  hwList: {
    gap: 12,
  },
  hwCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  hwCardDone: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.85,
  },
  hwTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hwSubjectBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  hwSubjectText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4338CA',
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  hwMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkboxTouch: {
    paddingTop: 2,
  },
  hwTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 19,
  },
  hwTitleDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  hwDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
    lineHeight: 17,
  },
  blackboardSnapBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  blackboardThumb: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  blackboardSnapTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#312E81',
  },
  viewNotesPill: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  viewNotesPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  blackboardSnapSub: {
    fontSize: 10.5,
    color: '#6366F1',
    marginTop: 2,
  },
  hwFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  hwTeacher: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  attachmentText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#4338CA',
  },
  assignedDateText: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  chalkModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    padding: 16,
  },
  chalkBoardContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#78350F',
    overflow: 'hidden',
    maxHeight: '85%',
  },
  chalkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  chalkHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chalkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FDE047',
  },
  chalkHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  chalkHeaderSub: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 1,
  },
  chalkCloseBtn: {
    padding: 4,
  },
  slateSurface: {
    padding: 16,
    backgroundColor: '#1E293B',
  },
  chalkMetaBanner: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    marginBottom: 12,
  },
  chalkTeacherWatermark: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
  },
  formulaBox: {
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FDE047',
    marginBottom: 14,
    gap: 4,
  },
  formulaBoxTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FDE047',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  formulaText: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  chalkNotesContainer: {
    gap: 8,
    marginBottom: 16,
  },
  chalkNotesTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  chalkBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  chalkBullet: {
    color: '#FDE047',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
  },
  chalkNoteText: {
    fontSize: 12.5,
    color: '#E2E8F0',
    lineHeight: 18,
    flex: 1,
  },
  chalkLedge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#78350F',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chalkSticksRow: {
    flexDirection: 'row',
    gap: 6,
  },
  chalkStick: {
    width: 24,
    height: 7,
    borderRadius: 3,
  },
  doneExamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  doneExamBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
