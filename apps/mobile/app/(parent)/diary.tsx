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
  Clock,
  MapPin,
  User,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { MOCK_PARENT_DIARY } from '../../src/constants/mockData';

export default function ParentDiaryScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();

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

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <ChevronLeft size={22} color={COLORS.slate[800]} strokeWidth={2.5} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Student Digital Diary</Text>
          <Text style={styles.headerSub}>Rahul Suresh • Class 8-B</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.entriesList}>
          {MOCK_PARENT_DIARY.map((period) => (
            <View key={period.id} style={[styles.entryCard, SHADOWS.card]}>
              <View style={styles.entryHeader}>
                <View style={styles.periodBadge}>
                  <Text style={styles.periodBadgeText}>Period {period.periodNo}</Text>
                </View>
                <View style={styles.timeRow}>
                  <Clock size={12} color={COLORS.slate[400]} />
                  <Text style={styles.periodTime}>{period.timing}</Text>
                </View>
              </View>

              <Text style={styles.entryTitle}>{period.subject}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <User size={12} color={COLORS.slate[400]} />
                  <Text style={styles.metaText}>{period.teacher}</Text>
                </View>
                <View style={styles.metaItem}>
                  <MapPin size={12} color={COLORS.slate[400]} />
                  <Text style={styles.metaText}>{period.room}</Text>
                </View>
              </View>

              <View style={styles.topicBox}>
                <Text style={styles.topicLabel}>TOPIC TAUGHT TODAY</Text>
                <Text style={styles.topicContent}>{period.topicTaught}</Text>
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
  entriesList: {
    gap: 12,
  },
  entryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  periodBadge: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  periodBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  periodTime: {
    fontSize: 11,
    color: COLORS.slate[500],
    fontWeight: '600',
  },
  entryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.slate[900],
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
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
  topicBox: {
    backgroundColor: COLORS.slate[50],
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  topicLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: COLORS.slate[400],
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  topicContent: {
    fontSize: 12,
    color: COLORS.slate[800],
    lineHeight: 17,
  },
});
