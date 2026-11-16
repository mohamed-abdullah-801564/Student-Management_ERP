import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { MOCK_SCHEDULE, SchedulePeriod } from '../../src/constants/mockData';

export default function TimetableScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [selectedDay, setSelectedDay] = useState('Mon');

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

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <ChevronLeft size={22} color={COLORS.slate[800]} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Faculty Weekly Timetable</Text>
          <Text style={styles.headerSubtitle}>
            Mrs. Deepa R. • Mathematics & Class 8-B
          </Text>
        </View>
      </View>

      {/* DAY SWITCHER TABS */}
      <View style={styles.dayTabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayTabsContainer}
        >
          {days.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayTab,
                  isSelected && styles.dayTabActive,
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text
                  style={[
                    styles.dayTabText,
                    isSelected && styles.dayTabTextActive,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SUMMARY BAR */}
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            {selectedDay}day Schedule • 6 Periods
          </Text>
          <View style={styles.freePeriodBadge}>
            <Text style={styles.freePeriodText}>1 Free Period (Period 5)</Text>
          </View>
        </View>

        {/* PERIOD TIMELINE LIST */}
        <View style={styles.timelineList}>
          {MOCK_SCHEDULE.map((period) => {
            const isCurrent = period.status === 'current';
            const isDone = period.status === 'done';
            const isSubstitute = period.status === 'substitute';

            return (
              <View
                key={period.id}
                style={[
                  styles.periodCard,
                  isCurrent && styles.periodCardCurrent,
                  isSubstitute && styles.periodCardSubstitute,
                  SHADOWS.card,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.periodPillWrap}>
                    <View
                      style={[
                        styles.periodNumberBadge,
                        isCurrent && styles.badgeCurrent,
                        isSubstitute && styles.badgeSubstitute,
                      ]}
                    >
                      <Text
                        style={[
                          styles.periodNumberText,
                          isCurrent && { color: COLORS.white },
                          isSubstitute && { color: COLORS.lateText },
                        ]}
                      >
                        P{period.periodNo}
                      </Text>
                    </View>
                    <Text style={styles.timeRangeText}>{period.timeRange}</Text>
                  </View>

                  {isCurrent && (
                    <View style={styles.liveIndicator}>
                      <View style={styles.livePulseDot} />
                      <Text style={styles.liveIndicatorText}>NOW</Text>
                    </View>
                  )}

                  {isDone && (
                    <View style={styles.donePill}>
                      <CheckCircle2 size={12} color={COLORS.present} />
                      <Text style={styles.donePillText}>Completed</Text>
                    </View>
                  )}

                  {isSubstitute && (
                    <View style={styles.substitutePill}>
                      <AlertCircle size={12} color={COLORS.lateText} />
                      <Text style={styles.substitutePillText}>
                        Substitute Duty
                      </Text>
                    </View>
                  )}
                </View>

                {/* Details */}
                <View style={styles.cardBody}>
                  <Text style={styles.subjectText}>{period.subject}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.classText}>{period.className}</Text>
                    <Text style={styles.bulletDot}>•</Text>
                    <View style={styles.roomWrap}>
                      <MapPin size={12} color={COLORS.slate[400]} />
                      <Text style={styles.roomText}>{period.roomNo}</Text>
                    </View>
                  </View>

                  {period.description && (
                    <View style={styles.descriptionBox}>
                      <Text style={styles.descriptionText}>
                        {period.description}
                      </Text>
                    </View>
                  )}

                  {period.substituteNote && (
                    <View style={styles.substituteNoteBox}>
                      <Text style={styles.substituteNoteText}>
                        {period.substituteNote}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Quick actions for In-charge / Ongoing class */}
                {isCurrent && (
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.actionPrimaryBtn}
                      onPress={() => router.push('/(teacher)/attendance')}
                    >
                      <Text style={styles.actionPrimaryText}>
                        Take Attendance
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionSecondaryBtn}
                      onPress={() => router.push('/(teacher)/homework')}
                    >
                      <Text style={styles.actionSecondaryText}>
                        Post Homework
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[200],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },

  dayTabsWrapper: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[200],
    paddingVertical: 10,
  },
  dayTabsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dayTab: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.slate[100],
  },
  dayTabActive: {
    backgroundColor: COLORS.brand[600],
  },
  dayTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[700],
  },
  dayTabTextActive: {
    color: COLORS.white,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[800],
  },
  freePeriodBadge: {
    backgroundColor: COLORS.presentBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  freePeriodText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.presentText,
  },

  timelineList: {
    gap: 12,
  },
  periodCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  periodCardCurrent: {
    borderColor: COLORS.brand[600],
    borderWidth: 1.5,
    backgroundColor: '#FAF5FF',
  },
  periodCardSubstitute: {
    borderColor: COLORS.lateBorder,
    borderWidth: 1.5,
    backgroundColor: COLORS.lateBg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  periodPillWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  periodNumberBadge: {
    backgroundColor: COLORS.slate[100],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeCurrent: {
    backgroundColor: COLORS.brand[600],
  },
  badgeSubstitute: {
    backgroundColor: COLORS.lateBorder,
  },
  periodNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate[700],
  },
  timeRangeText: {
    fontSize: 11,
    color: COLORS.slate[500],
    fontWeight: '500',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.brand[600],
  },
  liveIndicatorText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  donePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  donePillText: {
    fontSize: 11,
    color: COLORS.slate[500],
  },
  substitutePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  substitutePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.lateText,
  },

  cardBody: {
    gap: 4,
  },
  subjectText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  classText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.brand[700],
  },
  bulletDot: {
    color: COLORS.slate[400],
  },
  roomWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  roomText: {
    fontSize: 11,
    color: COLORS.slate[500],
  },
  descriptionBox: {
    backgroundColor: COLORS.slate[50],
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  descriptionText: {
    fontSize: 11,
    color: COLORS.slate[700],
  },
  substituteNoteBox: {
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.lateBorder,
  },
  substituteNoteText: {
    fontSize: 11,
    color: COLORS.lateText,
    fontWeight: '600',
  },

  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.brand[100],
  },
  actionPrimaryBtn: {
    flex: 1,
    backgroundColor: COLORS.brand[600],
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionPrimaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  actionSecondaryBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.brand[300],
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionSecondaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
});
