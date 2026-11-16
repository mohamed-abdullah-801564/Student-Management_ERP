import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Home, Settings } from 'lucide-react-native';
import { COLORS } from '../../src/constants/theme';

export default function TeacherTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.brand[600],
        tabBarInactiveTintColor: COLORS.slate[400],
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: COLORS.slate[200],
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 62,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      {/* ONLY 2 VISIBLE TABS */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size || 22} color={color} strokeWidth={2.2} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size || 22} color={color} strokeWidth={2.2} />
          ),
        }}
      />

      {/* SUB-PAGES ACCESSED VIA QUICK ACTIONS (Hidden from bottom tab bar) */}
      <Tabs.Screen
        name="attendance"
        options={{
          tabBarItemStyle: { display: 'none' },
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="homework"
        options={{
          tabBarItemStyle: { display: 'none' },
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="marks"
        options={{
          tabBarItemStyle: { display: 'none' },
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="timetable"
        options={{
          tabBarItemStyle: { display: 'none' },
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="substitute"
        options={{
          tabBarItemStyle: { display: 'none' },
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
