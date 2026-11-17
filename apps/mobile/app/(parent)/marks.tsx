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
import { useRouter, useNavigation } from 'expo-router';
import {
  ArrowLeft,
  Award,
  Sparkles,
  Download,
  Share2,
  TrendingUp,
  FileText,
  CheckCircle2,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { MOCK_REPORT_CARD } from '../../src/constants/mockData';
import { AnimatedNumberTicker } from '../../src/components/AnimatedNumberTicker';

export default function ParentMarksScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [selectedTerm, setSelectedTerm] = useState('term1');

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

  const terms = [
    { id: 'term1', name: 'Term 1 Assessment', active: true },
    { id: 'midterm', name: 'Monthly Test 1', active: false },
    { id: 'halfyearly', name: 'Half Yearly (Upcoming)', active: false },
  ];

  const handleDownload = () => {
    Alert.alert(
      'Download Marksheet',
      'Digital signed marksheet PDF for Term 1 (Rahul Suresh, Grade 8-B) generated with Greenwood Academy digital seal.',
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
          <Text style={styles.headerTitle}>Academic Report Card</Text>
          <Text style={styles.headerSubtitle}>Rahul Suresh • Grade 8-B</Text>
        </View>
        <TouchableOpacity
          onPress={handleDownload}
          style={styles.downloadHeaderBtn}
        >
          <Download size={18} color={COLORS.brand[600]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TERM SELECTOR CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.termSelectorRow}
        >
          {terms.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.termChip,
                selectedTerm === t.id && styles.termChipActive,
              ]}
              onPress={() => setSelectedTerm(t.id)}
            >
              <Text
                style={[
                  styles.termChipText,
                  selectedTerm === t.id && styles.termChipTextActive,
                ]}
              >
                {t.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* OVERALL SUMMARY HERO CARD */}
        <View style={[styles.summaryHeroCard, SHADOWS.card]}>
          <View style={styles.summaryTop}>
            <View style={styles.examBadge}>
              <Sparkles size={12} color="#F59E0B" />
              <Text style={styles.examBadgeText}>
                {MOCK_REPORT_CARD.examName.toUpperCase()}
              </Text>
            </View>
            <View style={styles.passedPill}>
              <CheckCircle2 size={12} color={COLORS.presentText} />
              <Text style={styles.passedPillText}>Passed with Distinction</Text>
            </View>
          </View>

          <View style={styles.heroMetricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>SCORE</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <AnimatedNumberTicker
                  value={MOCK_REPORT_CARD.overallScore}
                  style={styles.metricValue}
                />
                <Text style={styles.metricTotal}>/{MOCK_REPORT_CARD.totalMarks}</Text>
              </View>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>PERCENTAGE</Text>
              <AnimatedNumberTicker
                value={MOCK_REPORT_CARD.percentage}
                decimalPlaces={1}
                suffix="%"
                style={[styles.metricValue, { color: '#10B981' }]}
              />
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>SECTION RANK</Text>
              <Text style={[styles.metricValue, { color: '#F59E0B' }]}>
                #{MOCK_REPORT_CARD.classRank}
                <Text style={styles.metricTotal}>
                  /{MOCK_REPORT_CARD.totalStudents}
                </Text>
              </Text>
            </View>
          </View>

          {/* In-Charge Remark */}
          <View style={styles.remarkBox}>
            <Text style={styles.remarkHeading}>CLASS TEACHER REMARK</Text>
            <Text style={styles.remarkText}>"{MOCK_REPORT_CARD.inChargeRemark}"</Text>
            <Text style={styles.remarkSignature}>
              — {MOCK_REPORT_CARD.inChargeName}
            </Text>
          </View>
        </View>

        {/* SECTION TITLE */}
        <View style={styles.subjectSectionHeader}>
          <Text style={styles.subjectSectionTitle}>Subject-wise Breakdown</Text>
          <Text style={styles.subjectSectionSub}>
            5 Subjects Evaluated • Out of 100 Each
          </Text>
        </View>

        {/* SUBJECT CARDS */}
        <View style={styles.subjectListContainer}>
          {MOCK_REPORT_CARD.subjectBreakdown.map((subject, index) => {
            const percentage = Math.round(
              (subject.marksObtained / subject.maxMarks) * 100
            );

            return (
              <View
                key={index}
                style={[styles.subjectCard, SHADOWS.card]}
              >
                <View style={styles.subjectCardHeader}>
                  <View>
                    <Text style={styles.subjectName}>{subject.subject}</Text>
                    <Text style={styles.subjectRemarks}>{subject.remarks}</Text>
                  </View>
                  <View style={styles.scoreWrap}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                      <AnimatedNumberTicker
                        value={subject.marksObtained}
                        style={styles.subjectScore}
                      />
                      <Text style={styles.subjectMax}>/{subject.maxMarks}</Text>
                    </View>
                    <View style={styles.gradeBadge}>
                      <Text style={styles.gradeBadgeText}>{subject.grade}</Text>
                    </View>
                  </View>
                </View>

                {/* Progress bar comparing student vs highest */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${percentage}%`,
                          backgroundColor:
                            percentage >= 90
                              ? COLORS.present
                              : percentage >= 75
                              ? COLORS.brand[600]
                              : COLORS.late,
                        },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.subjectFooterRow}>
                  <Text style={styles.highestScoreText}>
                    Class Highest: {subject.highestInClass}/100
                  </Text>
                  <AnimatedNumberTicker
                    value={percentage}
                    suffix="% Marks"
                    style={styles.statusPercentText}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* DOWNLOAD ACTION CARD */}
        <TouchableOpacity
          style={[styles.downloadCtaCard, SHADOWS.card]}
          onPress={handleDownload}
          activeOpacity={0.8}
        >
          <View style={styles.downloadIconWrap}>
            <FileText size={22} color={COLORS.brand[600]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.downloadTitle}>
              Official Signed Marksheet PDF
            </Text>
            <Text style={styles.downloadSub}>
              Includes Greenwood Academy seal and digital signature
            </Text>
          </View>
          <Download size={18} color={COLORS.brand[600]} />
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
  downloadHeaderBtn: {
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
  termSelectorRow: {
    gap: 8,
    marginBottom: 16,
  },
  termChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  termChipActive: {
    backgroundColor: COLORS.brand[600],
    borderColor: COLORS.brand[600],
  },
  termChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate[700],
  },
  termChipTextActive: {
    color: COLORS.white,
  },

  // Summary Hero Card
  summaryHeroCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    marginBottom: 20,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  examBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.lateBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  examBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.lateText,
    letterSpacing: 0.5,
  },
  passedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.presentBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  passedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.presentText,
  },
  heroMetricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.slate[50],
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.slate[200],
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.slate[500],
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  metricTotal: {
    fontSize: 11,
    color: COLORS.slate[500],
    fontWeight: '500',
  },
  remarkBox: {
    backgroundColor: COLORS.brand[50],
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.brand[600],
  },
  remarkHeading: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.brand[800],
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  remarkText: {
    fontSize: 12,
    color: COLORS.slate[700],
    lineHeight: 18,
    fontStyle: 'italic',
  },
  remarkSignature: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.brand[700],
    marginTop: 6,
    textAlign: 'right',
  },

  // Subject Section
  subjectSectionHeader: {
    marginBottom: 10,
  },
  subjectSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  subjectSectionSub: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  subjectListContainer: {
    gap: 10,
    marginBottom: 20,
  },
  subjectCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  subjectCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  subjectRemarks: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 2,
  },
  scoreWrap: {
    alignItems: 'flex-end',
    gap: 4,
  },
  subjectScore: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  subjectMax: {
    fontSize: 11,
    color: COLORS.slate[500],
  },
  gradeBadge: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gradeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.slate[100],
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  subjectFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  highestScoreText: {
    fontSize: 11,
    color: COLORS.slate[500],
  },
  statusPercentText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate[700],
  },

  // Download Card
  downloadCtaCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.brand[200],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  downloadIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  downloadSub: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
});
