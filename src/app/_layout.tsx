import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import { ProfileProvider, useProfile } from "@/context/profile-context";
import { initDatabase } from "@db/database";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { loaded, onboarded } = useProfile();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase();
    setDbReady(true);
  }, []);

  const ready = dbReady && loaded;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!onboarded}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>

      <Stack.Protected guard={onboarded}>
        <Stack.Screen name="index" />
        <Stack.Screen name="timeline" />
        <Stack.Screen
          name="add-subscription"
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ProfileProvider>
      <RootNavigator />
    </ProfileProvider>
  );
}
