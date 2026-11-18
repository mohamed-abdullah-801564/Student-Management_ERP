import React from 'react';
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
  ChevronLeft,
  MessageSquare,
  Phone,
  ShieldCheck,
  BookOpen,
  Award,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';

interface TeacherFaculty {
  id: string;
  name: string;
  subject: string;
  designation: string;
  initials: string;
  isClassTeacher: boolean;
  email: string;
}

const CLASS_8B_FACULTY: TeacherFaculty[] = [
  {
    id: 't1',
    name: 'Mrs. Deepa R.',
    subject: 'Mathematics',
    designation: 'Senior Faculty • Class 8-B In-Charge',
    initials: 'DR',
    isClassTeacher: true,
    email: 'deepa.r@greenwood.edu',
  },
  {
    id: 't2',
    name: 'Mr. Anand Kumar',
    subject: 'Physics & General Science',
    designation: 'HOD Science Department • 12 Yrs Exp',
    initials: 'AK',
    isClassTeacher: false,
    email: 'anand.k@greenwood.edu',
  },
  {
    id: 't3',
    name: 'Mr. Venkatesh R.',
    subject: 'Social Science & History',
    designation: 'Secondary Faculty • 9 Yrs Exp',
    initials: 'VR',
    isClassTeacher: false,
    email: 'venkatesh.r@greenwood.edu',
  },
  {
    id: 't4',
    name: 'Mrs. Preetha V.',
    subject: 'English Core & Literature',
    designation: 'Senior English Faculty',
    initials: 'PV',
    isClassTeacher: false,
    email: 'preetha.v@greenwood.edu',
  },
  {
    id: 't5',
    name: 'Dr. S. Raman',
    subject: 'Second Language (Sanskrit / Tamil)',
    designation: 'Department of Languages & Indian Culture',
    initials: 'SR',
    isClassTeacher: false,
    email: 'raman.s@greenwood.edu',
  },
  {
    id: 't6',
    name: 'Mr. Karthik Raja',
    subject: 'Physical Education & Athletics',
    designation: 'Sports Director • Athletics In-Charge',
    initials: 'KR',
    isClassTeacher: false,
    email: 'karthik.r@greenwood.edu',
  },
];

export default function ParentTeachersScreen() {
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

  const handleMessage = (teacher: TeacherFaculty) => {
    try {
      navigation.navigate('chat');
    } catch {
      router.push('/(parent)/chat' as any);
    }
  };

  const handleCall = (teacher: TeacherFaculty) => {
    Alert.alert(
      'Faculty Communication Hours',
      `${teacher.name} is available for parent inquiries on weekdays between 03:45 PM and 04:30 PM via school extension or appointment.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <ChevronLeft size={22} color={COLORS.slate[800]} strokeWidth={2.5} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Class Faculty Directory</Text>
          <Text style={styles.headerSub}>Grade 8 – Section B Teachers</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.facultyList}>
          {CLASS_8B_FACULTY.map((faculty) => (
            <View
              key={faculty.id}
              style={[
                styles.facultyCard,
                SHADOWS.card,
                faculty.isClassTeacher && styles.facultyCardClassTeacher,
              ]}
            >
              <View style={styles.cardTopRow}>
                {/* Avatar with Initials */}
                <View
                  style={[
                    styles.avatarBox,
                    faculty.isClassTeacher && styles.avatarBoxClassTeacher,
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarText,
                      faculty.isClassTeacher && styles.avatarTextClassTeacher,
                    ]}
                  >
                    {faculty.initials}
                  </Text>
                </View>

                <View style={styles.facultyInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.facultyName}>{faculty.name}</Text>
                    {faculty.isClassTeacher && (
                      <View style={styles.classTeacherPill}>
                        <ShieldCheck size={11} color="#059669" />
                        <Text style={styles.classTeacherPillText}>Class In-Charge</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.facultySubject}>{faculty.subject}</Text>
                  <Text style={styles.facultyDesignation}>{faculty.designation}</Text>
                </View>
              </View>

              <View style={styles.cardActionsRow}>
                <TouchableOpacity
                  style={styles.messageBtn}
                  onPress={() => handleMessage(faculty)}
                  activeOpacity={0.8}
                >
                  <MessageSquare size={14} color="#FFFFFF" />
                  <Text style={styles.messageBtnText}>Message Teacher</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => handleCall(faculty)}
                  activeOpacity={0.8}
                >
                  <Phone size={14} color={COLORS.slate[700]} />
                  <Text style={styles.callBtnText}>Office Hours</Text>
                </TouchableOpacity>
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
  facultyList: {
    gap: 12,
  },
  facultyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
  },
  facultyCardClassTeacher: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.brand[100],
  },
  avatarBoxClassTeacher: {
    backgroundColor: '#DCFCE7',
    borderColor: '#BBF7D0',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  avatarTextClassTeacher: {
    color: '#166534',
  },
  facultyInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  facultyName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  classTeacherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  classTeacherPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#166534',
  },
  facultySubject: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[700],
    marginTop: 2,
  },
  facultyDesignation: {
    fontSize: 11,
    color: COLORS.slate[500],
    marginTop: 2,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[100],
  },
  messageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.brand[600],
    paddingVertical: 9,
    borderRadius: 10,
  },
  messageBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    paddingVertical: 9,
    borderRadius: 10,
  },
  callBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[700],
  },
});
