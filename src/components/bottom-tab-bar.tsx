import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

export function BottomTabBar({ active }: { active: "vault" | "timeline" }) {
  const router = useRouter();

  return (
    <ThemedView type="backgroundElement" style={styles.wrapper}>
      <SafeAreaView edges={["bottom"]}>
        <View style={styles.row}>
          <Pressable style={styles.tab} onPress={() => router.replace("/")}>
            <ThemedText type="default">🔒</ThemedText>
            <ThemedText
              type="small"
              themeColor={active === "vault" ? "text" : "textSecondary"}
              style={active === "vault" ? styles.activeLabel : undefined}
            >
              Vault
            </ThemedText>
          </Pressable>
          <Pressable
            style={styles.tab}
            onPress={() => router.replace("/timeline")}
          >
            <ThemedText type="default">📅</ThemedText>
            <ThemedText
              type="small"
              themeColor={active === "timeline" ? "text" : "textSecondary"}
              style={active === "timeline" ? styles.activeLabel : undefined}
            >
              Timeline
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#8884",
  },
  row: {
    flexDirection: "row",
    paddingTop: Spacing.two,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    paddingBottom: Spacing.one,
  },
  activeLabel: {
    fontWeight: "700",
  },
});
