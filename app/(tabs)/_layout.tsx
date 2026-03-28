// app/(tabs)/_layout.tsx — Tab Navigation Layout
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { signalColors } from '../../theme/colors';

export default function TabLayout() {
  const { currentSignal } = useAppStore();
  const alertColor = currentSignal > 0 ? signalColors[currentSignal] : '#fcfcfcff';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2f2f2fff',
          borderTopColor: 'rgba(234, 0, 0, 0.48)',
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 84 : 64,
          elevation: 0,
        },
        tabBarActiveTintColor: '#ee5757ff',
        tabBarInactiveTintColor: 'rgba(145, 143, 143, 1)',
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '900',
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="partly-sunny" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={currentSignal > 0 ? 'alert-circle' : 'alert-circle-outline'}
              size={size}
              color={currentSignal > 0 ? alertColor : color}
            />
          ),
          tabBarBadge: currentSignal > 0 ? `S${currentSignal}` : undefined,
          tabBarBadgeStyle: {
            backgroundColor: alertColor,
            color: '#ffffff',
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
