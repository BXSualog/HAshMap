import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGemini } from '../../hooks/useGemini';
import { useAppStore } from '../../store/useAppStore';
import ChatBubble from '../../components/ChatBubble';
import ChatInput from '../../components/ChatInput';
import { fontSizes } from '../../theme/typography';
import { ChatMessage } from '../../types';
import { generateId } from '../../utils/typhoonSignals';

const QUICK_PROMPTS = [
  'Is it safe to go outside?',
  "What's the typhoon status?",
  'Give me safety tips',
  "What's the wind speed?",
];

export default function ChatScreen() {
  const { chatHistory, isChatLoading, sendMessage, clearChat } = useGemini();
  const { weather, activeAlert } = useAppStore();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (chatHistory.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);

  useEffect(() => {
    if (chatHistory.length === 0 && weather) {
      const welcomeMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `Hi! I am your Alisto:Go AI, your weather assistant. I'm tracking the current conditions in **${weather.city}** — ${weather.temperature}°C, ${weather.description}. \n\nHow can I help you stay safe today?`,
        timestamp: Date.now(),
      };
      useAppStore.getState().addChatMessage(welcomeMsg);
    }
  }, [weather]);

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <ChatBubble message={item} />
  );

  return (
    <View style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 10}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View>
                <Text style={styles.title}>Alisto:Go Assistant</Text>
                <Text style={styles.subtitle}>
                  {weather ? `${weather.city} · ${weather.temperature}°C` : 'Weather-aware AI'}
                </Text>
              </View>
            </View>
            {chatHistory.length > 1 && (
              <Pressable onPress={clearChat} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>Clear</Text>
              </Pressable>
            )}
          </View>

          {/* Active alert chip */}
          {activeAlert && activeAlert.signal > 0 && (
            <View style={styles.alertChip}>
              <Text style={styles.alertChipText}>
                Signal #{activeAlert.signal} Active — I have full context
              </Text>
            </View>
          )}

          {/* Chat List */}
          <FlatList
            style={{ flex: 1 }}
            ref={flatListRef}
            data={chatHistory}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatText}>Ask about the weather!</Text>
                <View style={styles.quickPrompts}>
                  {QUICK_PROMPTS.map((prompt) => (
                    <Pressable
                      key={prompt}
                      style={styles.quickBtn}
                      onPress={() => sendMessage(prompt)}
                    >
                      <Text style={styles.quickBtnText}>{prompt}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            }
          />

          {/* Input */}
          <ChatInput onSend={sendMessage} isLoading={isChatLoading} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0a0e27' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiAvatar: { fontSize: 36 },
  title: { color: '#ffffff', fontSize: fontSizes.md, fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: fontSizes.xs, marginTop: 1 },
  clearBtn: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  clearBtnText: { color: 'rgba(255,255,255,0.5)', fontSize: fontSizes.xs },
  alertChip: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(239,68,68,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  alertChipText: {
    color: '#ef4444',
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  chatContent: { paddingVertical: 16 },
  emptyChat: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, gap: 12 },
  emptyChatEmoji: { fontSize: 56 },
  emptyChatText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSizes.base,
    textAlign: 'center',
  },
  quickPrompts: { width: '100%', gap: 8, marginTop: 8 },
  quickBtn: {
    backgroundColor: 'rgba(26,115,232,0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(26,115,232,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  quickBtnText: {
    color: '#60a5fa',
    fontSize: fontSizes.sm,
    fontWeight: '500',
    textAlign: 'center',
  },
});
