import { Stack } from 'expo-router'
import React from 'react'

export default function ChapterLayout() {
  return (
    <React.Fragment>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#262626' }
        }}
      />
    </React.Fragment>
  )
}
