import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomTabBar } from "@/components/bottom-tab-bar";
import { FadeUpGroup } from "@/components/fade-up";
import { AppearanceCard } from "@/components/settings/appearance-card";
import { EditNameSheet } from "@/components/settings/edit-name-sheet";
import { ProfileCard } from "@/components/settings/profile-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { ThemeColors } from "@/constants/palette";
import { useProfile } from "@/context/profile-context";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useThemedStyles } from "@/hooks/use-themed-styles";

export default function SettingsScreen() {
  const styles = useThemedStyles(makeStyles);
  const { name, updateName } = useProfile();
  const { subscriptions } = useSubscriptions();
  const [editVisible, setEditVisible] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <FadeUpGroup step={90}>
            <View style={styles.header}>
              <ThemedText style={styles.title}>Settings</ThemedText>
              <ThemedText style={styles.subtitle}>
                Manage your profile and preferences
              </ThemedText>
            </View>

            <ProfileCard
              name={name}
              subscriptionCount={subscriptions.length}
              onEditPress={() => setEditVisible(true)}
            />

            <AppearanceCard />
          </FadeUpGroup>
        </ScrollView>
      </SafeAreaView>

      <EditNameSheet
        visible={editVisible}
        currentName={name}
        onClose={() => setEditVisible(false)}
        onSave={(newName) => {
          updateName(newName);
          setEditVisible(false);
        }}
      />

      <BottomTabBar active="settings" />
    </ThemedView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
    header: { paddingTop: 8 },
    title: { fontSize: 30, fontWeight: "800", color: c.text },
    subtitle: { fontSize: 13, color: c.textTertiary, marginTop: 2 },
  });
