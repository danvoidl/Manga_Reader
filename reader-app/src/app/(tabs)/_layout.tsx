import { Tabs } from 'expo-router'
import Icon from '@react-native-vector-icons/material-design-icons'
import { SymbolView } from 'expo-symbols'
import { Drawer } from 'expo-router/drawer';
import { useState } from 'react';

const ACTIVE = '#AD89FF'
const INACTIVE = '#8b8b93'

export default function TabsLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: '#1c1b22',
          borderTopColor: 'rgba(255,255,255,0.08)'
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        sceneStyle: { backgroundColor: '#262626' }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size, focused }) => (
            <SymbolView
              name={{ ios: 'homepod', android: 'home' }}
              tintColor={color}
              size={size}
            />
          )
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size, focused }) => (
            <SymbolView
              name={{ ios: 'e.circle', android: 'explore' }}
              tintColor={color}
              size={size}
            />
          )
        }}
      />
      <Tabs.Screen
        name="bookshelf"
        options={{
          title: 'Estante',
          tabBarIcon: ({ color, size, focused }) => (
            <SymbolView
              name={{ ios: 'books.vertical', android: 'book' }}
              tintColor={color}
              size={size}
            />
          )
        }}
      />
    </Tabs>
  )
}
