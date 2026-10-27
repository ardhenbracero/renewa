import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TAB_BAR_SPACE } from "@/components/bottom-tab-bar";
import { FadeUpGroup } from "@/components/fade-up";
import { AppearanceCard } from "@/components/settings/appearance-card";
import { EditNameSheet } from "@/components/settings/edit-name-sheet";
import { FamilyPromoCard } from "@/components/settings/family-promo-card";
import { NotificationsCard } from "@/components/settings/notifications-card";
import { PlanCard } from "@/components/settings/plan-card";
import { ProfileCard } from "@/components/settings/profile-card";
import { ScreenHeader } from "@/components/screen-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { ThemeColors } from "@/constants/palette";
import { useProfile } from "@/context/profile-context";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useThemedStyles } from "@/hooks/use-themed-styles";

export default function SettingsScreen() {
  const styles = useThemedStyles(makeStyles);
  const { name, updateName } = useProfile();
  const { subscriptions, refresh } = useSubscriptions();
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );
  const [editVisible, setEditVisible] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <FadeUpGroup step={90}>
            <ScreenHeader
              title="Settings"
              subtitle="Manage your profile and preferences"
            />

            <ProfileCard
              name={name}
              subscriptionCount={subscriptions.length}
              onEditPress={() => setEditVisible(true)}
            />

            <PlanCard activeCount={subscriptions.length} />

            <FamilyPromoCard />

            <AppearanceCard />

            <NotificationsCard />
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
    </ThemedView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    content: { paddingHorizontal: 20, paddingBottom: TAB_BAR_SPACE, gap: 16 },
  });
