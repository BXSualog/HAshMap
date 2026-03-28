// components/ChatInput.tsx
import React, { useState, useRef } from 'react';
import { View, TextInput, Pressable, StyleSheet, ActivityIndicator, Keyboard, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../theme/colors';
import { fontSizes } from '../theme/typography';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  isLoading = false,
  placeholder = 'Ask Alisto...',
}: ChatInputProps) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText('');

  };

  const canSend = text.trim().length > 0 && !isLoading;

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            isFocused && styles.inputFocused
          ]}
          value={text}
          onChangeText={setText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.4)"
          multiline
          maxLength={500}
          textAlignVertical="top"
          onSubmitEditing={handleSend}
          returnKeyType="send"
          blurOnSubmit={false}
        />
        <Pressable
          onPress={handleSend}
          disabled={!canSend}
          style={[styles.sendBtn, canSend ? styles.sendBtnActive : styles.sendBtnDisabled]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={17} color="#fff" />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#0a0e27',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: fontSizes.base,
    maxHeight: 120,
    minHeight: 45,
  },
  inputFocused: {
    borderColor: '#900707ff',
    backgroundColor: 'rgba(25,118,210,0.12)',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  sendBtnActive: {
    backgroundColor: '#1a73e8',
    shadowColor: '#1a73e8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});
