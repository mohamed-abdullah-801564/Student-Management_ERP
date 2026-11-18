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
  ChevronLeft,
  Clock,
  MapPin,
  Coffee,
  Sun,
  User,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';

interface PeriodItem {
  period: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  isBreak?: boolean;
}

const WEEKLY_SCHEDULE: Record<string, PeriodItem[]> = {
  Mon: [
    { period: 1, time: '08:50 – 09:35 AM', subject: 'Mathematics', teacher: 'Mrs. Deepa R.', room: 'Room 204' },
    { period: 2, time: '09:35 – 10:20 AM', subject: 'Physics & Science', teacher: 'Mr. Anand Kumar', room: 'Science Lab 1' },
    { period: -1, time: '10:20 – 10:35 AM', subject: 'Morning Snack Interval', teacher: 'Campus Grounds', room: 'Courtyard', isBreak: true },
    { period: 3, time: '10:35 – 11:20 AM', subject: 'Social Science', teacher: 'Mr. Venkatesh R.', room: 'Room 204' },
    { period: 4, time: '11:20 – 12:05 PM', subject: 'English Core', teacher: 'Mrs. Preetha V.', room: 'Room 204' },
    { period: -2, time: '12:05 – 12:50 PM', subject: 'Central Lunch Break', teacher: 'Dining Hall', room: 'Cafeteria', isBreak: true },
    { period: 5, time: '12:50 – 01:30 PM', subject: 'Hindi / Tamil (Language II)', teacher: 'Dr. S. Raman', room: 'Room 204' },
    { period: 6, time: '01:30 – 02:10 PM', subject: 'Computer Science & AI', teacher: 'Mr. Suresh Kumar', room: 'Computer Lab 2' },
    { period: 7, time: '02:10 – 02:50 PM', subject: 'Physical Education & Sports', teacher: 'Mr. Karthik Raja', room: 'Sports Complex' },
    { period: 8, time: '02:50 – 03:30 PM', subject: 'Library & Guided Study', teacher: 'Mrs. Deepa R.', room: 'Central Library' },
  ],
  Tue: [
    { period: 1, time: '08:50 – 09:35 AM', subject: 'English Core', teacher: 'Mrs. Preetha V.', room: 'Room 204' },
    { period: 2, time: '09:35 – 10:20 AM', subject: 'Mathematics', teacher: 'Mrs. Deepa R.', room: 'Room 204' },
    { period: -1, time: '10:20 – 10:35 AM', subject: 'Morning Snack Interval', teacher: 'Campus Grounds', room: 'Courtyard', isBreak: true },
    { period: 3, time: '10:35 – 11:20 AM', subject: 'Chemistry Lab', teacher: 'Mr. Anand Kumar', room: 'Chem Lab' },
    { period: 4, time: '11:20 – 12:05 PM', subject: 'History & Civics', teacher: 'Mr. Venkatesh R.', room: 'Room 204' },
    { period: -2, time: '12:05 – 12:50 PM', subject: 'Central Lunch Break', teacher: 'Dining Hall', room: 'Cafeteria', isBreak: true },
    { period: 5, time: '12:50 – 01:30 PM', subject: 'Mathematics Problem Set', teacher: 'Mrs. Deepa R.', room: 'Room 204' },
    { period: 6, time: '01:30 – 02:10 PM', subject: 'Language II', teacher: 'Dr. S. Raman', room: 'Room 204' },
    { period: 7, time: '02:10 – 02:50 PM', subject: 'Art & Cultural Club', teacher: 'Ms. Radhika', room: 'Art Studio' },
    { period: 8, time: '02:50 – 03:30 PM', subject: 'Remedial Physics', teacher: 'Mr. Anand Kumar', room: 'Room 204' },
  ],
  Wed: [
    { period: 1, time: '08:50 – 09:35 AM', subject: 'Biology & Environmental Sci', teacher: 'Mr. Anand Kumar', room: 'Biology Lab' },
    { period: 2, time: '09:35 – 10:20 AM', subject: 'Mathematics', teacher: 'Mrs. Deepa R.', room: 'Room 204' },
    { period: -1, time: '10:20 – 10:35 AM', subject: 'Morning Snack Interval', teacher: 'Campus Grounds', room: 'Courtyard', isBreak: true },
    { period: 3, time: '10:35 – 11:20 AM', subject: 'English Grammar & Speech', teacher: 'Mrs. Preetha V.', room: 'Language Lab' },
    { period: 4, time: '11:20 – 12:05 PM', subject: 'Geography', teacher: 'Mr. Venkatesh R.', room: 'Room 204' },
    { period: -2, time: '12:05 – 12:50 PM', subject: 'Central Lunch Break', teacher: 'Dining Hall', room: 'Cafeteria', isBreak: true },
    { period: 5, time: '12:50 – 01:30 PM', subject: 'Language II', teacher: 'Dr. S. Raman', room: 'Room 204' },
    { period: 6, time: '01:30 – 02:10 PM', subject: 'Robotics & STEM Club', teacher: 'Mr. Suresh Kumar', room: 'Maker Lab' },
    { period: 7, time: '02:10 – 02:50 PM', subject: 'Athletics & Track', teacher: 'Mr. Karthik Raja', room: 'Grounds' },
    { period: 8, time: '02:50 – 03:30 PM', subject: 'Form Tutor Period', teacher: 'Mrs. Deepa R.', room: 'Room 204' },
  ],
  Thu: [
    { period: 1, time: '08:50 – 09:35 AM', subject: 'Mathematics', teacher: 'Mrs. Deepa R.', room: 'Room 204' },
    { period: 2, time: '09:35 – 10:20 AM', subject: 'Physics', teacher: 'Mr. Anand Kumar', room: 'Room 204' },
    { period: -1, time: '10:20 – 10:35 AM', subject: 'Morning Snack Interval', teacher: 'Campus Grounds', room: 'Courtyard', isBreak: true },
    { period: 3, time: '10:35 – 11:20 AM', subject: 'Social Science', teacher: 'Mr. Venkatesh R.', room: 'Room 204' },
    { period: 4, time: '11:20 – 12:05 PM', subject: 'English Lit.', teacher: 'Mrs. Preetha V.', room: 'Room 204' },
    { period: -2, time: '12:05 – 12:50 PM', subject: 'Central Lunch Break', teacher: 'Dining Hall', room: 'Cafeteria', isBreak: true },
    { period: 5, time: '12:50 – 01:30 PM', subject: 'Computer Lab Practical', teacher: 'Mr. Suresh Kumar', room: 'Computer Lab 2' },
    { period: 6, time: '01:30 – 02:10 PM', subject: 'Language II', teacher: 'Dr. S. Raman', room: 'Room 204' },
    { period: 7, time: '02:10 – 02:50 PM', subject: 'Yoga & Wellness', teacher: 'Mr. Karthik Raja', room: 'Auditorium' },
    { period: 8, time: '02:50 – 03:30 PM', subject: 'Self Study / Homework Desk', teacher: 'Mrs. Deepa R.', room: 'Room 204' },
  ],
  Fri: [
    { period: 1, time: '08:50 – 09:35 AM', subject: 'Weekly Assessment / Test', teacher: 'All Faculty', room: 'Room 204' },
    { period: 2, time: '09:35 – 10:20 AM', subject: 'Mathematics', teacher: 'Mrs. Deepa R.', room: 'Room 204' },
    { period: -1, time: '10:20 – 10:35 AM', subject: 'Morning Snack Interval', teacher: 'Campus Grounds', room: 'Courtyard', isBreak: true },
    { period: 3, time: '10:35 – 11:20 AM', subject: 'General Science Quiz', teacher: 'Mr. Anand Kumar', room: 'Room 204' },
    { period: 4, time: '11:20 – 12:05 PM', subject: 'English Drama & Debate', teacher: 'Mrs. Preetha V.', room: 'Room 204' },
    { period: -2, time: '12:05 – 12:50 PM', subject: 'Central Lunch Break', teacher: 'Dining Hall', room: 'Cafeteria', isBreak: true },
    { period: 5, time: '12:50 – 01:30 PM', subject: 'History & Civics', teacher: 'Mr. Venkatesh R.', room: 'Room 204' },
    { period: 6, time: '01:30 – 02:10 PM', subject: 'Language II', teacher: 'Dr. S. Raman', room: 'Room 204' },
    { period: 7, time: '02:10 – 02:50 PM', subject: 'Inter-House Sports League', teacher: 'Mr. Karthik Raja', room: 'Sports Complex' },
    { period: 8, time: '02:50 – 03:30 PM', subject: 'Dispersal & Bus Roll', teacher: 'Transport In-Charge', room: 'Gate 2' },
  ],
};

export default function ParentTimetableScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'>('Mon');

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

  const schedule = WEEKLY_SCHEDULE[selectedDay] || WEEKLY_SCHEDULE.Mon;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <ChevronLeft size={22} color={COLORS.slate[800]} strokeWidth={2.5} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Class Timetable</Text>
          <Text style={styles.headerSub}>Class 8-B • Greenwood Academy</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Day Selector Tabs */}
        <View style={styles.daySelectorRow}>
          {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const).map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.dayTab,
                selectedDay === d && styles.dayTabActive,
              ]}
              onPress={() => setSelectedDay(d)}
            >
              <Text
                style={[
                  styles.dayTabText,
                  selectedDay === d && styles.dayTabTextActive,
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Schedule List */}
        <View style={styles.periodList}>
          {schedule.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.periodCard,
                SHADOWS.card,
                item.isBreak && styles.periodCardBreak,
              ]}
            >
              <View style={styles.periodLeftCol}>
                <View
                  style={[
                    styles.periodNumberPill,
                    item.isBreak && styles.periodNumberPillBreak,
                  ]}
                >
                  {item.isBreak ? (
                    <Coffee size={14} color="#D97706" />
                  ) : (
                    <Text style={styles.periodNumberText}>P{item.period}</Text>
                  )}
                </View>
                <Text style={styles.periodTime}>{item.time}</Text>
              </View>

              <View style={styles.periodRightCol}>
                <Text style={styles.periodSubject}>{item.subject}</Text>
                <View style={styles.periodMetaRow}>
                  <View style={styles.metaItem}>
                    <User size={12} color={COLORS.slate[400]} />
                    <Text style={styles.metaText}>{item.teacher}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MapPin size={12} color={COLORS.slate[400]} />
                    <Text style={styles.metaText}>{item.room}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[200],
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.slate[900],
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 1,
  },
  scrollContent: {
    padding: 16,
  },
  daySelectorRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.slate[200],
    borderRadius: 14,
    padding: 3,
    marginBottom: 16,
  },
  dayTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 11,
  },
  dayTabActive: {
    backgroundColor: COLORS.white,
  },
  dayTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[500],
  },
  dayTabTextActive: {
    color: COLORS.brand[700],
    fontWeight: '800',
  },
  periodList: {
    gap: 10,
  },
  periodCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  periodCardBreak: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
  },
  periodLeftCol: {
    alignItems: 'center',
    width: 90,
  },
  periodNumberPill: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  periodNumberPillBreak: {
    backgroundColor: '#FEF3C7',
  },
  periodNumberText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.brand[700],
  },
  periodTime: {
    fontSize: 9.5,
    fontWeight: '600',
    color: COLORS.slate[500],
    textAlign: 'center',
  },
  periodRightCol: {
    flex: 1,
  },
  periodSubject: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.slate[900],
    marginBottom: 4,
  },
  periodMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.slate[500],
    fontWeight: '500',
  },
});
