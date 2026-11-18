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
  Calendar,
  BookOpen,
  CheckSquare,
  Square,
  Paperclip,
  CheckCircle2,
  Clock,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { MOCK_PARENT_HOMEWORK, ParentHomeworkItem } from '../../src/constants/mockData';

export default function ParentHomeworkScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [homeworkList, setHomeworkList] = useState<ParentHomeworkItem[]>(MOCK_PARENT_HOMEWORK);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

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
    setHomeworkList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const filteredList = homeworkList.filter((item) => {
    if (filter === 'pending') return !item.isCompleted;
    if (filter === 'completed') return item.isCompleted;
    return true;
  });

  const pendingCount = homeworkList.filter((h) => !h.isCompleted).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <ChevronLeft size={22} color={COLORS.slate[800]} strokeWidth={2.5} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Daily Homework</Text>
          <Text style={styles.headerSub}>Rahul Suresh • Class 8-B</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Tracker Banner */}
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

        {/* Filter Pills */}
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

        {/* Homework Items */}
        <View style={styles.hwList}>
          {filteredList.map((hw) => (
            <TouchableOpacity
              key={hw.id}
              style={[
                styles.hwCard,
                SHADOWS.card,
                hw.isCompleted && styles.hwCardDone,
              ]}
              onPress={() => toggleHomework(hw.id)}
              activeOpacity={0.8}
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

              <View style={styles.hwFooter}>
                <Text style={styles.hwTeacher}>Assigned by {hw.teacherName}</Text>
                {hw.hasAttachment && (
                  <View style={styles.attachmentBadge}>
                    <Paperclip size={11} color={COLORS.brand[600]} />
                    <Text style={styles.attachmentText}>1 Worksheet PDF</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
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
  statusBanner: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statusBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  statusBannerSub: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  filterPillActive: {
    backgroundColor: COLORS.brand[600],
    borderColor: COLORS.brand[600],
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate[600],
  },
  filterPillTextActive: {
    color: COLORS.white,
  },
  hwList: {
    gap: 12,
  },
  hwCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  hwCardDone: {
    opacity: 0.75,
    backgroundColor: '#F8FAFC',
  },
  hwTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  hwSubjectBadge: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  hwSubjectText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 11,
    color: COLORS.slate[500],
    fontWeight: '600',
  },
  hwMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkboxTouch: {
    paddingTop: 1,
  },
  hwTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.slate[900],
    marginBottom: 3,
  },
  hwTitleDone: {
    textDecorationLine: 'line-through',
    color: COLORS.slate[400],
  },
  hwDesc: {
    fontSize: 12,
    color: COLORS.slate[600],
    lineHeight: 17,
  },
  hwFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[100],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hwTeacher: {
    fontSize: 11,
    color: COLORS.slate[400],
    fontWeight: '500',
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  attachmentText: {
    fontSize: 10,
    color: COLORS.brand[700],
    fontWeight: '700',
  },
});
