import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

const ACTIVE_COLOR = "#5B21B6";
const INACTIVE_COLOR = "#9CA3AF";

export function BottomTabBar({ active }: { active: "vault" | "timeline" }) {
  const router = useRouter();

  return (
    <ThemedView type="backgroundElement" style={styles.wrapper}>
      <SafeAreaView edges={["bottom"]}>
        <View style={styles.row}>
          <Pressable style={styles.tab} onPress={() => router.replace("/")}>
            <Ionicons
              name="home"
              size={24}
              color={active === "vault" ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
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
            <Ionicons
              name="calendar"
              size={24}
              color={active === "timeline" ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <ThemedText
              type="small"
              themeColor={active === "timeline" ? "text" : "textSecondary"}
              style={active === "timeline" ? styles.activeLabel : undefined}
            >
              Timeline
            </ThemedText>
          </Pressable>

          {/* <Pressable
            style={styles.tab}
            onPress={() => router.replace("/insights")}
          >
            <Ionicons
              name="stats-chart"
              size={24}
              color={active === "insights" ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <ThemedText
              type="small"
              themeColor={active === "insights" ? "text" : "textSecondary"}
              style={active === "insights" ? styles.activeLabel : undefined}
            >
              Insights
            </ThemedText>
          </Pressable> */}
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
