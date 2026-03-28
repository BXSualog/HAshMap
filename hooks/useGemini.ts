// hooks/useGemini.ts
import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { sendGeminiMessage } from '../services/geminiService';
import { ChatMessage as GeminiHistory } from '../services/geminiService';
import { ChatMessage } from '../types';
import { generateId } from '../utils/typhoonSignals';

export function useGemini() {
  const {
    chatHistory,
    isChatLoading,
    weather,
    activeAlert,
    addChatMessage,
    updateLastChatMessage,
    setChatLoading,
    clearChat,
  } = useAppStore();

  const sendMessage = useCallback(
    async (userText: string) => {
      if (isChatLoading || !userText.trim()) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: userText.trim(),
        timestamp: Date.now(),
      };
      addChatMessage(userMsg);

      const loadingMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isLoading: true,
      };
      addChatMessage(loadingMsg);
      setChatLoading(true);

      try {
        // Build history for Gemini (exclude the loading message)
        const history: GeminiHistory[] = chatHistory
          .filter((m) => !m.isLoading)
          .slice(-10)
          .map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
          }));

        const reply = await sendGeminiMessage(userText, weather, activeAlert, history);

        updateLastChatMessage({ content: reply, isLoading: false });
      } catch (error: any) {
        updateLastChatMessage({
          content: `⚠️ Error: ${error.message}. Please try again.`,
          isLoading: false,
        });
      } finally {
        setChatLoading(false);
      }
    },
    [chatHistory, isChatLoading, weather, activeAlert]
  );

  return { chatHistory, isChatLoading, sendMessage, clearChat };
}
