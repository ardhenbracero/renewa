import { BrandIcon, getBrandHex } from "@/components/brand-icon";
import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { SERVICE_PRESETS } from "@/constants/service-presets";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

const QUICK_PICK_LIMIT = 6;

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
  const presets = SERVICE_PRESETS.slice(0, QUICK_PICK_LIMIT);

  return (
    <View style={styles.section}>
      <View style={styles.labelRow}>
        <ThemedText style={styles.sectionLabel}>POPULAR SERVICES</ThemedText>
        <Pressable onPress={onSeeMore}>
          <ThemedText style={styles.seeMore}>See all 40+</ThemedText>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {presets.map((preset) => {
          const selected = selectedSlug === preset.slug;
          const badgeColor = getBrandHex(preset.slug) ?? "#111827";

          return (
            <Pressable
              key={preset.slug}
              style={styles.chip}
              onPress={() =>
                onSelect(preset.slug, preset.name, preset.category)
              }
            >
              <View style={[styles.ring, selected && styles.ringSelected]}>
                <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                  <BrandIcon slug={preset.slug} size={26} color="white" />
                </View>
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
    badge: {
      width: 54,
      height: 54,
      borderRadius: 27,
      justifyContent: "center",
      alignItems: "center",
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
