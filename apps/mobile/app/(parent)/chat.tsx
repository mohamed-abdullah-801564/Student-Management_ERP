import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import {
  ArrowLeft,
  Send,
  Lock,
  Paperclip,
  CheckCheck,
  Shield,
  PhoneOff,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { MOCK_CHAT_MESSAGES, ChatMessage } from '../../src/constants/mockData';

export default function ParentChatScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');

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

  const quickChips = [
    'Acknowledged homework',
    'Rahul is feeling unwell today',
    'Request PTM slot',
  ];

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

    setMessages((prev) => [...prev, newMessage]);
    if (!textToSend) setInputText('');
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
            <Text style={styles.teacherAvatarText}>MD</Text>
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
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            const isMe = msg.sender === 'parent';
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
              </View>
            );
          })}
        </ScrollView>

        {/* QUICK REPLY CHIPS */}
        <View style={styles.quickChipsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickChips.map((chip, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.quickChip}
                onPress={() => handleSend(chip)}
              >
                <Text style={styles.quickChipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
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
});
