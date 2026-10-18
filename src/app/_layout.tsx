import { ThemeProvider, useAppTheme } from "@/context/theme-context";
import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

import { ProfileProvider, useProfile } from "@/context/profile-context";
import { initDatabase } from "@db/database";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { loaded, onboarded } = useProfile();
  const { loaded: themeLoaded, scheme } = useAppTheme();
  const theme = useTheme();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase();
    setDbReady(true);
  }, []);

  const ready = dbReady && loaded && themeLoaded;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!onboarded}>
            <Stack.Screen name="onboarding" />
          </Stack.Protected>

          <Stack.Protected guard={onboarded}>
            <Stack.Screen name="index" />
            <Stack.Screen name="timeline" />
            <Stack.Screen name="insights" />
            <Stack.Screen
              name="add-subscription"
              options={{ presentation: "modal", headerShown: false }}
            />
            <Stack.Screen name="subscription-details" />
          </Stack.Protected>
        </Stack>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <RootNavigator />
      </ProfileProvider>
    </ThemeProvider>
  );
}
