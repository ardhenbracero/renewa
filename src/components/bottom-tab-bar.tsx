import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { ThemeColors } from "@/constants/palette";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";

export function BottomTabBar({
  active,
}: {
  active: "vault" | "timeline" | "insights" | "settings";
}) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const router = useRouter();

  return (
    <ThemedView type="backgroundElement" style={styles.wrapper}>
      <SafeAreaView edges={["bottom"]}>
        <View style={styles.row}>
          <Pressable style={styles.tab} onPress={() => router.replace("/")}>
            <Ionicons
              name="home"
              size={24}
              color={active === "vault" ? theme.accentText : theme.textTertiary}
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
              color={active === "timeline" ? theme.accentText : theme.textTertiary}
            />
            <ThemedText
              type="small"
              themeColor={active === "timeline" ? "text" : "textSecondary"}
              style={active === "timeline" ? styles.activeLabel : undefined}
            >
              Timeline
            </ThemedText>
          </Pressable>

          <Pressable
            style={styles.tab}
            onPress={() => router.replace("/insights")}
          >
            <Ionicons
              name="stats-chart"
              size={24}
              color={active === "insights" ? theme.accentText : theme.textTertiary}
            />
            <ThemedText
              type="small"
              themeColor={active === "insights" ? "text" : "textSecondary"}
              style={active === "insights" ? styles.activeLabel : undefined}
            >
              Insights
            </ThemedText>
          </Pressable>

          <Pressable
            style={styles.tab}
            onPress={() => router.replace("/settings")}
          >
            <Ionicons
              name="settings"
              size={24}
              color={active === "settings" ? theme.accentText : theme.textTertiary}
            />
            <ThemedText
              type="small"
              themeColor={active === "settings" ? "text" : "textSecondary"}
              style={active === "settings" ? styles.activeLabel : undefined}
            >
              Settings
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
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
