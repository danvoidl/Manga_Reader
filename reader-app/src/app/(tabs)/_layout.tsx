import { Tabs } from 'expo-router'
import Icon from '@react-native-vector-icons/material-design-icons'

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
            <Icon
              name={focused ? 'home' : 'home-outline'}
              color={color}
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
            <Icon
              name={focused ? 'compass' : 'compass-outline'}
              color={color}
              size={size}
            />
          )
        }}
      />
    </Tabs>
  )
}
