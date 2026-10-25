import { ServiceLogo } from "@/components/service-icon";
import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { getService, SERVICE_CATALOG } from "@/constants/service-catalog";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

// Catalog ids shown as Quick pick, in order
const QUICK_PICK_IDS = [
  "netflix",
  "youtube",
  "spotify",
  "disneyplus",
  "canva",
  "chatgpt",
  "icloud",
  "primevideo",
];

export function QuickPickSection({
  selectedSlug,
  onSelect,
  onSeeMore,
}: {
  selectedSlug: string | null;
  onSelect: (slug: string, name: string, category: string) => void;
  onSeeMore: () => void;
}) {
  const styles = useThemedStyles(makeStyles);
  const presets = QUICK_PICK_IDS.map((id) => getService(id)!);
  const selectedId = getService(selectedSlug)?.id;

  return (
    <View style={styles.section}>
      <View style={styles.labelRow}>
        <ThemedText style={styles.sectionLabel}>POPULAR SERVICES</ThemedText>
        <Pressable onPress={onSeeMore}>
          <ThemedText style={styles.seeMore}>
            See all {SERVICE_CATALOG.length}
          </ThemedText>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {presets.map((preset) => {
          const selected = selectedId === preset.id;

          return (
            <Pressable
              key={preset.id}
              style={styles.chip}
              onPress={() => onSelect(preset.id, preset.name, preset.category)}
            >
              <View style={[styles.ring, selected && styles.ringSelected]}>
                <ServiceLogo service={preset} size={54} />
              </View>
              <ThemedText
                style={[styles.chipLabel, selected && styles.chipLabelSelected]}
                numberOfLines={1}
              >
                {preset.name}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    section: { marginTop: 0 },
    labelRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: c.textTertiary,
      textTransform: "uppercase",
    },
    seeMore: {
      fontSize: 13,
      fontWeight: "600",
      color: c.accentText,
    },
    chipRow: {
      paddingHorizontal: 20,
      gap: 5,
    },
    chip: {
      alignItems: "center",
      width: 64,
    },
    ring: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: "transparent", // reserved space — no layout shift on select
    },
    ringSelected: {
      borderColor: c.accent,
    },
    chipLabel: {
      fontSize: 12,
      color: c.textSecondary,
      marginTop: 6,
    },
    chipLabelSelected: {
      color: c.accentText,
      fontWeight: "600",
    },
  });
