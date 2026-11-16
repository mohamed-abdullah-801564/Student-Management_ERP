import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Camera,
  TrendingUp,
  AlertCircle,
  Save,
  Lock,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';

interface StudentGrade {
  id: string;
  rollNo: string;
  name: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  rollText: string;
  note: string;
  score: string;
  badgeText: string;
  badgeType: 'pass' | 'top' | 'retest' | 'pending';
}

const INITIAL_GRADES: StudentGrade[] = [
  {
    id: '1',
    rollNo: '#01',
    name: 'Aakash Raman',
    initials: 'AR',
    avatarBg: COLORS.slate[100],
    avatarColor: COLORS.slate[700],
    rollText: 'Roll: 8B01',
    note: 'Good in Algebra',
    score: '88',
    badgeText: '88% • A',
    badgeType: 'pass',
  },
  {
    id: '2',
    rollNo: '#02',
    name: 'Ananya Sri',
    initials: 'AS',
    avatarBg: '#FFE4E6',
    avatarColor: '#BE123C',
    rollText: 'Roll: 8B02',
    note: 'Neat presentation',
    score: '94',
    badgeText: '94% • A+',
    badgeType: 'pass',
  },
  {
    id: '3',
    rollNo: '#03',
    name: 'Bhuvanesh K',
    initials: 'BK',
    avatarBg: '#FEF3C7',
    avatarColor: '#92400E',
    rollText: 'Roll: 8B03',
    note: 'Class Topper',
    score: '98',
    badgeText: '⭐ Highest (98%)',
    badgeType: 'top',
  },
  {
    id: '4',
    rollNo: '#04',
    name: 'Dinesh Kumar',
    initials: 'DK',
    avatarBg: '#FEE2E2',
    avatarColor: '#991B1B',
    rollText: 'Roll: 8B04',
    note: 'Needs remedial',
    score: '32',
    badgeText: '⚠️ Retest (32%)',
    badgeType: 'retest',
  },
  {
    id: '5',
    rollNo: '#05',
    name: 'Faizan Ahmed',
    initials: 'FA',
    avatarBg: COLORS.slate[100],
    avatarColor: COLORS.slate[700],
    rollText: 'Roll: 8B05',
    note: 'Formulas clear',
    score: '76',
    badgeText: '76% • B+',
    badgeType: 'pass',
  },
  {
    id: '6',
    rollNo: '#06',
    name: 'Harini Venkat',
    initials: 'HV',
    avatarBg: '#FEF3C7',
    avatarColor: '#92400E',
    rollText: 'Roll: 8B06',
    note: 'Accurate graphing',
    score: '85',
    badgeText: '85% • A',
    badgeType: 'pass',
  },
  {
    id: '7',
    rollNo: '#07',
    name: 'Ishaan Verma',
    initials: 'IV',
    avatarBg: COLORS.slate[100],
    avatarColor: COLORS.slate[600],
    rollText: 'Roll: 8B07',
    note: 'Answer sheet awaited',
    score: '',
    badgeText: 'Pending Entry',
    badgeType: 'pending',
  },
];

export default function TeacherMarksEntryScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [entryMode, setEntryMode] = useState<'digital' | 'snap'>('digital');
  const [grades, setGrades] = useState<StudentGrade[]>(INITIAL_GRADES);

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

  const handleScoreChange = (id: string, text: string) => {
    setGrades((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const num = parseInt(text, 10);
        let badgeText = 'Pending Entry';
        let badgeType: 'pass' | 'top' | 'retest' | 'pending' = 'pending';

        if (!isNaN(num)) {
          if (num >= 98) {
            badgeText = `⭐ Highest (${num}%)`;
            badgeType = 'top';
          } else if (num >= 35) {
            badgeText = `${num}% • Pass`;
            badgeType = 'pass';
          } else {
            badgeText = `⚠️ Retest (${num}%)`;
            badgeType = 'retest';
          }
        }
        return { ...g, score: text, badgeText, badgeType };
      })
    );
  };

  const handleSubmit = () => {
    Alert.alert(
      'Marks Submitted for Approval',
      'Unit Test 1 marks for Grade 8-B sent to Coordinator & Principal for review.',
      [{ text: 'OK', onPress: handleBack }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation Header */}
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
            <View style={styles.titleRow}>
              <Text style={styles.headerTitle}>Enter Marks</Text>
              <View style={styles.autoSavedBadge}>
                <View style={styles.greenPulseDot} />
                <Text style={styles.autoSavedText}>Auto-saved</Text>
              </View>
            </View>
            <Text style={styles.headerSubtitle}>
              Grade 8 – Section B •{' '}
              <Text style={styles.subjectHighlight}>Mathematics</Text> • UT-1
            </Text>
          </View>
        </View>

        <View style={styles.maxScoreBadge}>
          <Text style={styles.maxScoreLabel}>MAX SCORE</Text>
          <Text style={styles.maxScoreValue}>100</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Entry Mode Switcher Card */}
        <View style={[styles.modeCard, SHADOWS.card]}>
          <View style={styles.segmentedToggle}>
            <TouchableOpacity
              style={[
                styles.modeTab,
                entryMode === 'digital' && styles.modeTabActive,
              ]}
              onPress={() => setEntryMode('digital')}
              activeOpacity={0.8}
            >
              <Text style={styles.modeIcon}>✍️</Text>
              <Text
                style={[
                  styles.modeTabText,
                  entryMode === 'digital' && styles.modeTabTextActive,
                ]}
              >
                Direct Digital Entry
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeTab,
                entryMode === 'snap' && styles.modeTabActive,
              ]}
              onPress={() => setEntryMode('snap')}
              activeOpacity={0.8}
            >
              <Text style={styles.modeIcon}>📷</Text>
              <Text
                style={[
                  styles.modeTabText,
                  entryMode === 'snap' && styles.modeTabTextActive,
                ]}
              >
                Snap Marksheet
              </Text>
            </TouchableOpacity>
          </View>

          {/* AI Marksheet Scanner Sub-card */}
          <View style={styles.ocrScannerBox}>
            <View style={styles.ocrLeft}>
              <View style={styles.ocrIconBox}>
                <Camera size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.ocrTitle}>Snap Paper Marksheet</Text>
                <Text style={styles.ocrSubtitle}>AI reads handwritten scores</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => Alert.alert('Camera', 'Paper Marksheet scanner opened.')}
              activeOpacity={0.8}
            >
              <Text style={styles.scanButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Statistical Summary Bar */}
        <View style={[styles.statsCard, SHADOWS.card]}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsHeaderTitle}>CLASS PERFORMANCE INSIGHTS</Text>
            <View style={styles.liveStatsPill}>
              <Text style={styles.liveStatsPillText}>Live Stats</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            {/* Metric 1: Average */}
            <View style={styles.statCell}>
              <Text style={styles.statCellLabel}>Class Avg</Text>
              <Text style={styles.statCellNumber}>78.4%</Text>
              <Text style={styles.trendUp}>▲ +3.2%</Text>
            </View>

            {/* Metric 2: Passed */}
            <View style={[styles.statCell, styles.statCellGreen]}>
              <Text style={styles.statCellLabelGreen}>Passed</Text>
              <Text style={styles.statCellNumberGreen}>34</Text>
              <Text style={styles.subtextGreen}>of 36 graded</Text>
            </View>

            {/* Metric 3: Needs Retest */}
            <View style={[styles.statCell, styles.statCellRed]}>
              <Text style={styles.statCellLabelRed}>Needs Retest</Text>
              <Text style={styles.statCellNumberRed}>2</Text>
              <Text style={styles.subtextRed}>&lt; 35 marks</Text>
            </View>

            {/* Metric 4: Top Score */}
            <View style={[styles.statCell, styles.statCellAmber]}>
              <Text style={styles.statCellLabelAmber}>Top Mark</Text>
              <Text style={styles.statCellNumberAmber}>98/100</Text>
              <Text style={styles.subtextAmber} numberOfLines={1}>
                ⭐ Bhuvanesh
              </Text>
            </View>
          </View>
        </View>

        {/* Grade Scale Notice */}
        <View style={styles.scaleNotice}>
          <View style={styles.scaleNoticeLeft}>
            <AlertCircle size={14} color={COLORS.brand[600]} />
            <Text style={styles.scaleNoticeText}>
              Passing Mark: <Text style={styles.bold}>35 / 100</Text>
            </Text>
          </View>
          <View style={styles.gradedProgressBadge}>
            <Text style={styles.gradedProgressText}>36 of 38 Graded (2 Pending)</Text>
          </View>
        </View>

        {/* Student Marks Roster */}
        <View style={styles.rosterList}>
          {grades.map((item) => {
            const isTop = item.badgeType === 'top';
            const isRetest = item.badgeType === 'retest';
            const isPending = item.badgeType === 'pending';

            return (
              <View
                key={item.id}
                style={[
                  styles.gradeRow,
                  isTop && styles.gradeRowTop,
                  isRetest && styles.gradeRowRetest,
                  isPending && styles.gradeRowPending,
                ]}
              >
                {/* Profile info */}
                <View style={styles.gradeProfileGroup}>
                  <View style={styles.rollBadge}>
                    <Text style={styles.rollText}>{item.rollNo}</Text>
                  </View>

                  <View style={[styles.avatarSquare, { backgroundColor: item.avatarBg }]}>
                    <Text style={[styles.avatarSquareText, { color: item.avatarColor }]}>
                      {item.initials}
                    </Text>
                  </View>

                  <View style={styles.nameBlock}>
                    <View style={styles.studentNameRow}>
                      <Text style={styles.studentName}>{item.name}</Text>
                      {isTop && <Text style={styles.starIcon}>⭐</Text>}
                    </View>
                    <View style={styles.metaRow}>
                      <Text style={styles.rollMetaText}>{item.rollText}</Text>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.noteMetaText}>{item.note}</Text>
                    </View>
                  </View>
                </View>

                {/* Score Input & Result Pill */}
                <View style={styles.scoreInputGroup}>
                  <View style={styles.inputBoxRow}>
                    <TextInput
                      style={[
                        styles.scoreInput,
                        isRetest && styles.scoreInputRetest,
                        isTop && styles.scoreInputTop,
                        isPending && styles.scoreInputPending,
                      ]}
                      keyboardType="numeric"
                      maxLength={3}
                      value={item.score}
                      onChangeText={(t) => handleScoreChange(item.id, t)}
                      placeholder="--"
                      placeholderTextColor={COLORS.slate[400]}
                    />
                    <Text style={styles.maxDividerText}>/100</Text>
                  </View>

                  <View
                    style={[
                      styles.gradeResultBadge,
                      item.badgeType === 'pass' && styles.gradeResultPass,
                      isTop && styles.gradeResultTop,
                      isRetest && styles.gradeResultRetest,
                      isPending && styles.gradeResultPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.gradeResultText,
                        item.badgeType === 'pass' && styles.gradeResultTextPass,
                        isTop && styles.gradeResultTextTop,
                        isRetest && styles.gradeResultTextRetest,
                        isPending && styles.gradeResultTextPending,
                      ]}
                    >
                      {item.badgeText}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={[styles.bottomBar, SHADOWS.card]}>
        <View style={styles.statusStrip}>
          <View style={styles.statusStripLeft}>
            <View style={styles.greenDot} />
            <Text style={styles.statusStripText}>
              <Text style={styles.bold}>36</Text> Graded •{' '}
              <Text style={styles.amberText}>2 Pending</Text>
            </Text>
          </View>
          <Text style={styles.passRateText}>
            Pass Rate: <Text style={styles.passRateHighlight}>94.4%</Text>
          </Text>
        </View>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.saveDraftButton}
            onPress={() => Alert.alert('Draft Saved', 'Marks draft saved.')}
            activeOpacity={0.8}
          >
            <Save size={15} color={COLORS.slate[600]} />
            <Text style={styles.saveDraftText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitApprovalButton}
            onPress={handleSubmit}
            activeOpacity={0.88}
          >
            <Text style={styles.submitApprovalText}>Submit for Approval</Text>
            <Lock size={15} color={COLORS.brand[200]} />
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  autoSavedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.presentBg,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  greenPulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.present,
  },
  autoSavedText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.presentText,
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  subjectHighlight: {
    fontWeight: '700',
    color: COLORS.brand[600],
  },
  maxScoreBadge: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.brand[100],
    alignItems: 'flex-end',
  },
  maxScoreLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.brand[500],
    letterSpacing: 0.5,
  },
  maxScoreValue: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.brand[700],
    lineHeight: 18,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
    gap: 12,
  },
  modeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    gap: 8,
  },
  segmentedToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.slate[100],
    borderRadius: 12,
    padding: 3,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 5,
  },
  modeTabActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  modeIcon: {
    fontSize: 12,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate[500],
  },
  modeTabTextActive: {
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  ocrScannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.brand[50],
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.brand[200],
    borderStyle: 'dashed',
  },
  ocrLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ocrIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.brand[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  ocrTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  ocrSubtitle: {
    fontSize: 10,
    color: COLORS.slate[500],
  },
  scanButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.brand[200],
  },
  scanButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    gap: 10,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[100],
    paddingBottom: 6,
  },
  statsHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate[400],
    letterSpacing: 0.6,
  },
  liveStatsPill: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  liveStatsPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.brand[600],
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  statCell: {
    flex: 1,
    backgroundColor: COLORS.slate[50],
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  statCellLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.slate[500],
  },
  statCellNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.slate[900],
    marginTop: 2,
  },
  trendUp: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.present,
    marginTop: 1,
  },
  statCellGreen: {
    backgroundColor: COLORS.presentBg,
    borderColor: COLORS.presentBorder,
  },
  statCellLabelGreen: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.presentText,
  },
  statCellNumberGreen: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.presentText,
    marginTop: 2,
  },
  subtextGreen: {
    fontSize: 8.5,
    color: COLORS.presentText,
  },
  statCellRed: {
    backgroundColor: COLORS.absentBg,
    borderColor: COLORS.absentBorder,
  },
  statCellLabelRed: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.absentText,
  },
  statCellNumberRed: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.absentText,
    marginTop: 2,
  },
  subtextRed: {
    fontSize: 8.5,
    color: COLORS.absentText,
  },
  statCellAmber: {
    backgroundColor: COLORS.lateBg,
    borderColor: COLORS.lateBorder,
  },
  statCellLabelAmber: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.lateText,
  },
  statCellNumberAmber: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.lateText,
    marginTop: 2,
  },
  subtextAmber: {
    fontSize: 8.5,
    fontWeight: '600',
    color: COLORS.lateText,
  },
  scaleNotice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.brand[50],
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: COLORS.brand[100],
  },
  scaleNoticeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  scaleNoticeText: {
    fontSize: 11,
    color: COLORS.slate[700],
  },
  bold: {
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  gradedProgressBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.brand[200],
  },
  gradedProgressText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  rosterList: {
    gap: 8,
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  gradeRowTop: {
    backgroundColor: '#FEFDF5',
    borderColor: '#FDE68A',
  },
  gradeRowRetest: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FECACA',
  },
  gradeRowPending: {
    backgroundColor: '#FEFAF0',
    borderColor: '#FDE68A',
    borderStyle: 'dashed',
  },
  gradeProfileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  rollBadge: {
    backgroundColor: COLORS.slate[100],
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 6,
    minWidth: 28,
    alignItems: 'center',
  },
  rollText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate[500],
  },
  avatarSquare: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSquareText: {
    fontSize: 12,
    fontWeight: '800',
  },
  nameBlock: {
    flex: 1,
  },
  studentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  studentName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  starIcon: {
    fontSize: 11,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  rollMetaText: {
    fontSize: 10,
    color: COLORS.slate[400],
  },
  metaDot: {
    fontSize: 8,
    color: COLORS.slate[300],
  },
  noteMetaText: {
    fontSize: 10,
    color: COLORS.slate[500],
    fontStyle: 'italic',
  },
  scoreInputGroup: {
    alignItems: 'flex-end',
    gap: 2,
  },
  inputBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  scoreInput: {
    width: 44,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.slate[50],
    borderWidth: 1,
    borderColor: COLORS.slate[300],
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.slate[900],
    padding: 0,
  },
  scoreInputTop: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    color: '#92400E',
  },
  scoreInputRetest: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    color: '#991B1B',
  },
  scoreInputPending: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
  },
  maxDividerText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.slate[400],
  },
  gradeResultBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  gradeResultPass: {
    backgroundColor: COLORS.presentBg,
  },
  gradeResultTop: {
    backgroundColor: '#FEF3C7',
  },
  gradeResultRetest: {
    backgroundColor: '#FEE2E2',
  },
  gradeResultPending: {
    backgroundColor: '#FEF3C7',
  },
  gradeResultText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  gradeResultTextPass: {
    color: COLORS.presentText,
  },
  gradeResultTextTop: {
    color: '#92400E',
  },
  gradeResultTextRetest: {
    color: '#991B1B',
  },
  gradeResultTextPending: {
    color: '#92400E',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[200],
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 22,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    gap: 8,
  },
  statusStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  statusStripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.present,
  },
  statusStripText: {
    fontSize: 11,
    color: COLORS.slate[600],
  },
  amberText: {
    color: COLORS.late,
    fontWeight: '700',
  },
  passRateText: {
    fontSize: 11,
    color: COLORS.slate[500],
  },
  passRateHighlight: {
    fontWeight: '800',
    color: COLORS.presentText,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saveDraftButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    backgroundColor: COLORS.slate[50],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveDraftText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[700],
  },
  submitApprovalButton: {
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
  submitApprovalText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.white,
  },
});
