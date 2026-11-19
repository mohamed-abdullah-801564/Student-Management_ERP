import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  Send,
  Lock,
  Paperclip,
  CheckCheck,
  Shield,
  PhoneOff,
  Calendar,
  FileText,
  Camera,
  X,
  CheckCircle2,
  Clock,
  PlusCircle,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { ChatMessage } from '../../src/constants/mockData';
import { schoolStore, StudentLeaveRequest } from '../../src/lib/schoolStore';

export default function ParentChatScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const scrollViewRef = useRef<any>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(schoolStore.getChatMessages());
  const [facultyPhoto, setFacultyPhoto] = useState<string | null>(schoolStore.getFacultyPhoto());
  const [inputText, setInputText] = useState('');

  // Formal Leave Request Modal State
  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);
  const [leaveDaysOption, setLeaveDaysOption] = useState<'today' | 'tomorrow' | 'twodays'>('today');
  const [leaveReason, setLeaveReason] = useState('Mild viral fever & headache. Physician advised 1 day bed rest.');
  const [medicalSlipUri, setMedicalSlipUri] = useState<string | null>(null);

  useEffect(() => {
    const unsub = schoolStore.subscribe(() => {
      setMessages([...schoolStore.getChatMessages()]);
      setFacultyPhoto(schoolStore.getFacultyPhoto());
    });
    return unsub;
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

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: 'parent',
      senderName: 'Mr. Suresh',
      text: text.trim(),
      timestamp: 'Just now',
      isRead: true,
    };

    schoolStore.addChatMessage(newMessage);
    if (!textToSend) setInputText('');
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handlePickMedicalSlip = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Photo gallery permission is required to attach doctor slip.');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.5,
      });
      if (!res.canceled && res.assets && res.assets[0]) {
        setMedicalSlipUri(res.assets[0].uri);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleSubmitLeaveRequest = () => {
    if (!leaveReason.trim()) {
      Alert.alert('Incomplete Form', 'Please provide a reason for the leave request.');
      return;
    }

    const dateStr =
      leaveDaysOption === 'today'
        ? 'Today (16 Nov 2026)'
        : leaveDaysOption === 'tomorrow'
        ? 'Tomorrow (17 Nov 2026)'
        : '16 Nov – 17 Nov 2026 (2 Days)';

    const newReq: StudentLeaveRequest = {
      id: `leave_${Date.now()}`,
      studentName: 'Rahul Suresh',
      className: 'Class 8-B',
      parentName: 'Mr. Suresh Ramanathan',
      reason: leaveReason.trim(),
      startDate: dateStr,
      endDate: dateStr,
      medicalNoteUrl: medicalSlipUri || undefined,
      status: 'pending',
      requestedAt: 'Just now',
    };

    schoolStore.addLeaveRequest(newReq);
    setIsLeaveModalVisible(false);
    setMedicalSlipUri(null);

    Alert.alert(
      'Leave Request Dispatched ✓',
      'Sent to Class Teacher Mrs. Deepa R. and recorded in Greenwood Attendance Desk.',
      [{ text: 'OK' }]
    );
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color={COLORS.slate[800]} />
          </TouchableOpacity>
          <View style={styles.teacherAvatar}>
            {facultyPhoto ? (
              <Image
                source={{ uri: facultyPhoto }}
                style={{ width: 38, height: 38, borderRadius: 19 }}
              />
            ) : (
              <Text style={styles.teacherAvatarText}>MD</Text>
            )}
            <View style={styles.onlineDot} />
          </View>
          <View>
            <Text style={styles.teacherName}>Mrs. Deepa R.</Text>
            <Text style={styles.teacherRole}>
              Class In-Charge • Grade 8-B
            </Text>
          </View>
        </View>

        <View style={styles.maskedPill}>
          <PhoneOff size={12} color={COLORS.brand[700]} />
          <Text style={styles.maskedPillText}>Masked</Text>
        </View>
      </View>

      {/* PRIVACY BANNER */}
      <View style={styles.privacyBanner}>
        <Lock size={12} color={COLORS.brand[700]} />
        <Text style={styles.privacyBannerText}>
          Personal phone numbers are hidden. Messages are archived for school records.
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            const isMe = msg.sender === 'parent';
            const isLeaveNotice = msg.text.includes('Formal Leave Request');
            const isApprovalNotice = msg.text.includes('Leave Request Approved');

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageBubbleWrapper,
                  isMe ? styles.alignRight : styles.alignLeft,
                ]}
              >
                {!isMe && (
                  <Text style={styles.senderNameLabel}>{msg.senderName}</Text>
                )}

                {isLeaveNotice ? (
                  <View style={[styles.leaveNoticeCard, SHADOWS.card]}>
                    <View style={styles.leaveNoticeHeader}>
                      <View style={styles.leaveNoticeIconWrap}>
                        <FileText size={16} color={COLORS.brand[700]} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.leaveNoticeTitle}>Student Leave Application</Text>
                        <Text style={styles.leaveNoticeStudent}>Rahul Suresh • Class 8-B</Text>
                      </View>
                      <View style={styles.leaveNoticePendingBadge}>
                        <Clock size={11} color="#D97706" />
                        <Text style={styles.leaveNoticePendingText}>Pending Review</Text>
                      </View>
                    </View>

                    <Text style={styles.leaveNoticeBody}>{msg.text}</Text>

                    <View style={styles.leaveNoticeFooter}>
                      <Text style={styles.leaveNoticeFooterText}>
                        Sent to Form Tutor Mrs. Deepa R. • {msg.timestamp}
                      </Text>
                    </View>
                  </View>
                ) : isApprovalNotice ? (
                  <View style={[styles.approvalNoticeCard, SHADOWS.card]}>
                    <View style={styles.approvalNoticeHeader}>
                      <CheckCircle2 size={18} color={COLORS.presentText} />
                      <Text style={styles.approvalNoticeTitle}>Leave Request Approved ✓</Text>
                    </View>
                    <Text style={styles.approvalNoticeBody}>{msg.text}</Text>
                    <Text style={styles.approvalNoticeTime}>{msg.timestamp}</Text>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.messageBubble,
                      isMe ? styles.bubbleParent : styles.bubbleTeacher,
                      SHADOWS.card,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isMe ? styles.textParent : styles.textTeacher,
                      ]}
                    >
                      {msg.text}
                    </Text>
                    <View style={styles.timestampRow}>
                      <Text
                        style={[
                          styles.timestampText,
                          isMe ? styles.timeParent : styles.timeTeacher,
                        ]}
                      >
                        {msg.timestamp}
                      </Text>
                      {isMe && (
                        <CheckCheck size={13} color="rgba(255,255,255,0.7)" />
                      )}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* QUICK REPLY CHIPS WITH LEAVE REQUEST BUTTON */}
        <View style={styles.quickChipsRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
          >
            <TouchableOpacity
              style={styles.requestLeaveChip}
              onPress={() => setIsLeaveModalVisible(true)}
              activeOpacity={0.8}
            >
              <PlusCircle size={14} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.requestLeaveChipText}>+ Request Leave</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickChip}
              onPress={() => handleSend('Acknowledged homework')}
            >
              <Text style={styles.quickChipText}>Acknowledged homework</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickChip}
              onPress={() => handleSend('Request PTM slot with Mrs. Deepa')}
            >
              <Text style={styles.quickChipText}>Request PTM slot</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickChip}
              onPress={() => handleSend('Doctor prescription note uploaded')}
            >
              <Text style={styles.quickChipText}>Doctor's note query</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* INPUT BAR */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message to Class Teacher..."
            placeholderTextColor={COLORS.slate[400]}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              inputText.trim().length > 0 && styles.sendBtnActive,
            ]}
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
          >
            <Send size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* FORMAL LEAVE REQUEST MODAL */}
      <Modal
        visible={isLeaveModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsLeaveModalVisible(false)}
      >
        <View style={styles.leaveModalOverlay}>
          <View style={styles.leaveModalCard}>
            <View style={styles.leaveModalHeader}>
              <View>
                <Text style={styles.leaveModalTitle}>Apply Student Absence Leave</Text>
                <Text style={styles.leaveModalSub}>Rahul Suresh • Class 8-B (Homeroom)</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsLeaveModalVisible(false)}
                style={styles.leaveModalCloseBtn}
              >
                <X size={20} color={COLORS.slate[600]} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.leaveModalScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* DATE DURATION */}
              <Text style={styles.leaveFieldLabel}>1. Select Absence Duration</Text>
              <View style={styles.leaveDaysRow}>
                <TouchableOpacity
                  style={[
                    styles.leaveDayOption,
                    leaveDaysOption === 'today' && styles.leaveDayOptionActive,
                  ]}
                  onPress={() => setLeaveDaysOption('today')}
                >
                  <Text
                    style={[
                      styles.leaveDayText,
                      leaveDaysOption === 'today' && styles.leaveDayTextActive,
                    ]}
                  >
                    Today Only
                  </Text>
                  <Text style={styles.leaveDaySub}>16 Nov 2026</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.leaveDayOption,
                    leaveDaysOption === 'tomorrow' && styles.leaveDayOptionActive,
                  ]}
                  onPress={() => setLeaveDaysOption('tomorrow')}
                >
                  <Text
                    style={[
                      styles.leaveDayText,
                      leaveDaysOption === 'tomorrow' && styles.leaveDayTextActive,
                    ]}
                  >
                    Tomorrow
                  </Text>
                  <Text style={styles.leaveDaySub}>17 Nov 2026</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.leaveDayOption,
                    leaveDaysOption === 'twodays' && styles.leaveDayOptionActive,
                  ]}
                  onPress={() => setLeaveDaysOption('twodays')}
                >
                  <Text
                    style={[
                      styles.leaveDayText,
                      leaveDaysOption === 'twodays' && styles.leaveDayTextActive,
                    ]}
                  >
                    2 Days
                  </Text>
                  <Text style={styles.leaveDaySub}>16 – 17 Nov</Text>
                </TouchableOpacity>
              </View>

              {/* REASON PRESETS */}
              <Text style={styles.leaveFieldLabel}>2. Reason for Absence</Text>
              <View style={styles.presetChipsRow}>
                <TouchableOpacity
                  style={styles.presetChip}
                  onPress={() =>
                    setLeaveReason('Mild viral fever & headache. Physician advised 1 day bed rest.')
                  }
                >
                  <Text style={styles.presetChipText}>Viral Fever / Sick</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.presetChip}
                  onPress={() =>
                    setLeaveReason('Consultation appointment at clinic for health checkup.')
                  }
                >
                  <Text style={styles.presetChipText}>Doctor Clinic Visit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.presetChip}
                  onPress={() =>
                    setLeaveReason('Family function and out of town travel. Resuming on scheduled date.')
                  }
                >
                  <Text style={styles.presetChipText}>Family Travel</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.leaveReasonInput}
                multiline
                numberOfLines={3}
                placeholder="Explain the detailed reason for student absence..."
                value={leaveReason}
                onChangeText={setLeaveReason}
              />

              {/* ATTACH MEDICAL PRESCRIPTION NOTE */}
              <Text style={styles.leaveFieldLabel}>3. Doctor's Note / Medical Slip (Optional)</Text>
              {medicalSlipUri ? (
                <View style={styles.attachedSlipCard}>
                  <Image source={{ uri: medicalSlipUri }} style={styles.attachedSlipThumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.attachedSlipTitle}>Medical Slip Attached ✓</Text>
                    <Text style={styles.attachedSlipSub}>Visible to Class Incharge</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setMedicalSlipUri(null)}
                    style={styles.removeSlipBtn}
                  >
                    <X size={16} color={COLORS.absent} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.attachSlipBtn}
                  onPress={handlePickMedicalSlip}
                  activeOpacity={0.8}
                >
                  <Camera size={18} color={COLORS.brand[600]} />
                  <Text style={styles.attachSlipBtnText}>Attach Doctor's Prescription Slip</Text>
                </TouchableOpacity>
              )}

              {/* NOTICE BOX */}
              <View style={styles.leaveNoticeDisclaimer}>
                <Shield size={14} color={COLORS.brand[700]} />
                <Text style={styles.leaveNoticeDisclaimerText}>
                  Submitting this will immediately update the Homeroom In-Charge roll call desk and record an Excused Absence entry.
                </Text>
              </View>

              {/* SUBMIT BUTTON */}
              <TouchableOpacity
                style={styles.submitLeaveBtn}
                onPress={handleSubmitLeaveRequest}
                activeOpacity={0.85}
              >
                <Text style={styles.submitLeaveBtnText}>Submit Leave Application</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.brand[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.present,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  teacherName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate[900],
  },
  teacherRole: {
    fontSize: 11,
    color: COLORS.slate[500],
  },
  maskedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  maskedPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brand[700],
  },

  privacyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.brand[50],
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.brand[100],
  },
  privacyBannerText: {
    fontSize: 10,
    color: COLORS.brand[900],
    fontWeight: '500',
  },

  messagesContainer: {
    padding: 16,
    gap: 12,
  },
  messageBubbleWrapper: {
    maxWidth: '82%',
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  alignLeft: {
    alignSelf: 'flex-start',
  },
  senderNameLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.slate[500],
    marginBottom: 2,
    marginLeft: 4,
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleTeacher: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    borderBottomLeftRadius: 4,
  },
  bubbleParent: {
    backgroundColor: COLORS.brand[600],
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
  textTeacher: {
    color: COLORS.slate[800],
  },
  textParent: {
    color: COLORS.white,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  timestampText: {
    fontSize: 9,
  },
  timeTeacher: {
    color: COLORS.slate[400],
  },
  timeParent: {
    color: 'rgba(255,255,255,0.7)',
  },

  // Quick Chips
  quickChipsRow: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[100],
  },
  quickChip: {
    backgroundColor: COLORS.slate[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
  },
  quickChipText: {
    fontSize: 11,
    color: COLORS.slate[700],
    fontWeight: '500',
  },

  // Input Bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[200],
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.slate[50],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.slate[900],
    maxHeight: 90,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.slate[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: COLORS.brand[600],
  },

  // Leave Request Highlight Chip
  requestLeaveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.brand[600],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
  },
  requestLeaveChipText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Leave Notice Card inside Chat
  leaveNoticeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.brand[200],
    width: 270,
  },
  leaveNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  leaveNoticeIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  leaveNoticeStudent: {
    fontSize: 10,
    color: COLORS.slate[500],
  },
  leaveNoticePendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  leaveNoticePendingText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#B45309',
  },
  leaveNoticeBody: {
    fontSize: 12,
    color: COLORS.slate[700],
    lineHeight: 17,
    marginBottom: 8,
  },
  leaveNoticeFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[100],
    paddingTop: 6,
  },
  leaveNoticeFooterText: {
    fontSize: 9,
    color: COLORS.slate[400],
  },

  // Approval Notice Card inside Chat
  approvalNoticeCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    width: 270,
  },
  approvalNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  approvalNoticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.presentText,
  },
  approvalNoticeBody: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 17,
  },
  approvalNoticeTime: {
    fontSize: 9,
    color: '#15803D',
    marginTop: 6,
    textAlign: 'right',
  },

  // Leave Request Modal Styles
  leaveModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  leaveModalCard: {
    backgroundColor: COLORS.screenBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  leaveModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[200],
  },
  leaveModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate[900],
  },
  leaveModalSub: {
    fontSize: 12,
    color: COLORS.slate[500],
    marginTop: 2,
    fontWeight: '500',
  },
  leaveModalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveModalScroll: {
    padding: 20,
    gap: 12,
    paddingBottom: 36,
  },
  leaveFieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.slate[800],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 6,
  },
  leaveDaysRow: {
    flexDirection: 'row',
    gap: 10,
  },
  leaveDayOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.slate[200],
    alignItems: 'center',
  },
  leaveDayOptionActive: {
    borderColor: COLORS.brand[600],
    backgroundColor: COLORS.brand[50],
  },
  leaveDayText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate[700],
  },
  leaveDayTextActive: {
    color: COLORS.brand[700],
  },
  leaveDaySub: {
    fontSize: 10,
    color: COLORS.slate[400],
    marginTop: 2,
  },
  presetChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.slate[700],
  },
  leaveReasonInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    borderRadius: 14,
    padding: 14,
    fontSize: 13,
    color: COLORS.slate[900],
    textAlignVertical: 'top',
    minHeight: 80,
    lineHeight: 18,
  },
  attachSlipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.brand[300],
    borderRadius: 14,
    paddingVertical: 14,
  },
  attachSlipBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[600],
  },
  attachedSlipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.presentBorder,
  },
  attachedSlipThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.slate[200],
  },
  attachedSlipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.presentText,
  },
  attachedSlipSub: {
    fontSize: 10,
    color: COLORS.slate[500],
  },
  removeSlipBtn: {
    padding: 8,
  },
  leaveNoticeDisclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.brand[50],
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.brand[100],
  },
  leaveNoticeDisclaimerText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.brand[900],
    lineHeight: 16,
  },
  submitLeaveBtn: {
    backgroundColor: COLORS.brand[600],
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: COLORS.brand[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitLeaveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
