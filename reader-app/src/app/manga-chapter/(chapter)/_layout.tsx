import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";

export default function ChapterLayout() {
  return (
    <React.Fragment>
      {/* <StatusBar hidden={true} /> */}

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#262626" },
        }}
      />
    </React.Fragment>
  );
}
