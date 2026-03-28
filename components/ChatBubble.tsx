import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { ChatMessage } from '../types';
import { fontSizes } from '../theme/typography';
import { palette } from '../theme/colors';
import { reverseGeocode } from '../services/locationService';

interface ChatBubbleProps {
  message: ChatMessage;
}

function TypingDots() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      );

    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 150);
    const a3 = animate(dot3, 300);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, []);

  return (
    <View style={styles.dotsRow}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View key={i} style={[styles.dot, { transform: [{ translateY: dot }] }]} />
      ))}
    </View>
  );
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const [translatedPlace, setTranslatedPlace] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isUser ? 20 : -20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    const coordRegex = /([-+]?\d{1,2}\.\d+),\s*([-+]?\d{1,3}\.\d+)/;
    const match = message.content.match(coordRegex);

    if (match && !isUser) {
      const lat = parseFloat(match[1]);
      const lon = parseFloat(match[2]);

      const lookupCoord = async () => {
        setIsGeocoding(true);
        try {
          const result = await reverseGeocode(lat, lon);
          if (result.city !== 'Unknown') {
            setTranslatedPlace(`${result.city}${result.province ? ', ' + result.province : ''}`);
          }
        } catch (e) {
          console.warn('Bubble reverse geocode error:', e);
        } finally {
          setIsGeocoding(false);
        }
      };

      lookupCoord();
    }
  }, [message.content, isUser]);

  return (
    <Animated.View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
        { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
      ]}
    >
      {!isUser && (
        <Image
          source={require('../assets/bot-avatar.png')}
          style={styles.aiAvatarImage}
        />
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {message.isLoading ? (
          <TypingDots />
        ) : (
          <>
            <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>
              {message.content}
            </Text>
            {translatedPlace && (
              <View style={styles.placeHintContainer}>
                <Text style={styles.placeHint}>📍 {isGeocoding ? 'Locating...' : translatedPlace}</Text>
              </View>
            )}
          </>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
    marginHorizontal: 12,
    gap: 8,
  },
  userContainer: { justifyContent: 'flex-end' },
  aiContainer: { justifyContent: 'flex-start' },
  aiAvatar: { fontSize: 22, marginBottom: 4 },
  aiAvatarImage: {
    width: 28,
    height: 28,
    borderRadius: 8,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#1a73e8',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: 'rgba(225, 86, 0, 1)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.24)',
    borderBottomLeftRadius: 4,
  },
  text: { fontSize: fontSizes.base, lineHeight: 20 },
  userText: { color: '#ffffff' },
  aiText: { color: '#e2e8f0' },
  placeHintContainer: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  placeHint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: fontSizes.xs,
    fontStyle: 'italic',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
});
