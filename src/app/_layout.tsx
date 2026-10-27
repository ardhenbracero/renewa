import { BottomTabBar } from "@/components/bottom-tab-bar";
import { LogoIntro } from "@/components/logo-intro";
import { ThemeProvider, useAppTheme } from "@/context/theme-context";
import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { AppState } from "react-native";

import { ProProvider } from "@/context/pro-context";
import { ProfileProvider, useProfile } from "@/context/profile-context";
import { syncReminders } from "@/utils/notifications";
import { initDatabase } from "@db/database";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { loaded, onboarded } = useProfile();
  const { loaded: themeLoaded, scheme } = useAppTheme();
  const theme = useTheme();
  const [dbReady, setDbReady] = useState(false);
  // Launch animation plays once per app start, over whatever screen loads
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    initDatabase();
    setDbReady(true);
  }, []);

  const ready = dbReady && loaded && themeLoaded;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // Refresh reminders on launch and whenever the app comes back to the
  // foreground (a reminder may have fired, so the next one needs scheduling)
  useEffect(() => {
    if (!ready || !onboarded) return;
    syncReminders();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") syncReminders();
    });
    return () => sub.remove();
  }, [ready, onboarded]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style={showIntro || scheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Protected guard={!onboarded}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>

        <Stack.Protected guard={onboarded}>
          {/* Tabs fade instead of sliding, so only the tab bar indicator moves */}
          <Stack.Screen name="index" options={{ animation: "fade" }} />
          <Stack.Screen name="timeline" options={{ animation: "fade" }} />
          <Stack.Screen name="insights" options={{ animation: "fade" }} />
          <Stack.Screen name="settings" options={{ animation: "fade" }} />
          <Stack.Screen
            name="add-subscription"
            options={{
              // Opens at half height; drag up for full screen, down to close
              presentation: "formSheet",
              sheetAllowedDetents: [0.8, 1],
              sheetInitialDetentIndex: 0,
              sheetGrabberVisible: true,
              sheetCornerRadius: 24,
            }}
          />
          <Stack.Screen name="subscription-details" />
          <Stack.Screen name="pro" options={{ presentation: "modal" }} />
        </Stack.Protected>
      </Stack>

      {/* One floating tab bar above all screens; hides itself off the tabs */}
      {onboarded && <BottomTabBar />}

      {showIntro && <LogoIntro onDone={() => setShowIntro(false)} />}
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <ProProvider>
          <RootNavigator />
        </ProProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
