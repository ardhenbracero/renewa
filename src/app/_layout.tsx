import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import { initDatabase } from "@db/database";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initDatabase();
    setReady(true);
    SplashScreen.hideAsync();
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="timeline" />
      <Stack.Screen
        name="add-subscription"
        options={{
          presentation: "modal",
          headerShown: true,
          title: "Add Subscription",
        }}
      />
    </Stack>
  );
}
