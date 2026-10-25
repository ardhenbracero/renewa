import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { AVATAR_COLORS, InitialsAvatar } from "@/components/InitialsAvatar";
import { customIconSlug, ServiceLogo } from "@/components/service-icon";
import { ThemedText } from "@/components/themed-text";
import { CATEGORIES } from "@/constants/categories";
import type { ThemeColors } from "@/constants/palette";
import {
  getService,
  SERVICE_CATALOG,
  type ServiceEntry,
} from "@/constants/service-catalog";
import { useAppTheme } from "@/context/theme-context";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";

export type PickedService = { iconSlug: string; name: string; category: string };

export function ServicePickerModal({
  visible,
  selectedSlug,
  onClose,
  onSelect,
}: {
  visible: boolean;
  selectedSlug: string | null;
  onClose: () => void;
  onSelect: (picked: PickedService) => void;
}) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const { scheme } = useAppTheme();
  const [query, setQuery] = useState("");
  // Custom-service form: null = browsing the catalog
  const [customName, setCustomName] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState(AVATAR_COLORS[7]);

  // Start fresh every time the sheet opens
  useEffect(() => {
    if (visible) {
      setQuery("");
      setCustomName(null);
    }
  }, [visible]);

  const trimmed = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      trimmed
        ? SERVICE_CATALOG.filter((s) => s.name.toLowerCase().includes(trimmed))
        : SERVICE_CATALOG,
    [trimmed],
  );
  // Category order from constants/categories.ts, skipping empty ones
  const sections = CATEGORIES.map((c) => ({
    title: c.name,
    data: results.filter((s) => s.category === c.name),
  })).filter((s) => s.data.length > 0);

  const selected = getService(selectedSlug);

  function pick(service: ServiceEntry) {
    onSelect({ iconSlug: service.id, name: service.name, category: service.category });
    onClose();
  }

  function submitCustom() {
    const name = customName?.trim();
    if (!name) return;
    onSelect({ iconSlug: customIconSlug(customColor), name, category: "Other" });
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>
            {customName === null ? "Choose a service" : "Custom service"}
          </ThemedText>
          <Pressable onPress={onClose} hitSlop={10} style={styles.closeButton}>
            <Ionicons name="close" size={18} color={theme.text} />
          </Pressable>
        </View>

        {customName === null ? (
          <>
            <View style={styles.searchRow}>
              <Ionicons name="search" size={16} color={theme.textTertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search Netflix, Canva, ChatGPT…"
                placeholderTextColor={theme.textTertiary}
                keyboardAppearance={scheme}
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>

            <ScrollView
              contentContainerStyle={styles.list}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              automaticallyAdjustKeyboardInsets
            >
              <Pressable
                style={styles.customRow}
                onPress={() => setCustomName(query.trim())}
              >
                <View style={styles.customIcon}>
                  <Ionicons name="add" size={20} color={theme.accentText} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.customTitle} numberOfLines={1}>
                    {trimmed
                      ? `Add “${query.trim()}” as a custom service`
                      : "Custom service"}
                  </ThemedText>
                  <ThemedText style={styles.customSub}>
                    Not in the list? Pick your own name and color
                  </ThemedText>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.textTertiary}
                />
              </Pressable>

              {sections.map((section) => (
                <View key={section.title} style={styles.section}>
                  <ThemedText style={styles.sectionTitle}>
                    {section.title.toUpperCase()}
                  </ThemedText>
                  <View style={styles.grid}>
                    {section.data.map((service) => {
                      const isSelected = selected?.id === service.id;
                      return (
                        <Pressable
                          key={service.id}
                          style={styles.tile}
                          onPress={() => pick(service)}
                          accessibilityLabel={service.name}
                        >
                          <View
                            style={[styles.ring, isSelected && styles.ringSelected]}
                          >
                            <ServiceLogo service={service} size={48} />
                          </View>
                          <ThemedText
                            style={[
                              styles.tileLabel,
                              isSelected && styles.tileLabelSelected,
                            ]}
                            numberOfLines={2}
                          >
                            {service.name}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}

              {sections.length === 0 && (
                <ThemedText style={styles.empty}>
                  No service matches “{query.trim()}”. Add it as a custom
                  service above.
                </ThemedText>
              )}
            </ScrollView>
          </>
        ) : (
          <ScrollView
            contentContainerStyle={styles.customForm}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
          >
            <View style={styles.preview}>
              <InitialsAvatar
                name={customName.trim() || "?"}
                size={64}
                color={customColor}
              />
            </View>

            <ThemedText style={styles.fieldLabel}>NAME</ThemedText>
            <TextInput
              style={styles.nameInput}
              placeholder="e.g. Gym membership"
              placeholderTextColor={theme.textTertiary}
              keyboardAppearance={scheme}
              value={customName}
              onChangeText={setCustomName}
              autoFocus
              maxLength={40}
              returnKeyType="done"
              onSubmitEditing={submitCustom}
            />

            <ThemedText style={styles.fieldLabel}>COLOR</ThemedText>
            <View style={styles.swatches}>
              {AVATAR_COLORS.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setCustomColor(color)}
                  style={[
                    styles.swatchRing,
                    customColor === color && { borderColor: color },
                  ]}
                  accessibilityLabel={`Color ${color}`}
                >
                  <View style={[styles.swatch, { backgroundColor: color }]} />
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.useButton, !customName.trim() && styles.useButtonDisabled]}
              disabled={!customName.trim()}
              onPress={submitCustom}
            >
              <ThemedText style={styles.useButtonText}>Use this service</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => setCustomName(null)}
              hitSlop={8}
              style={styles.backLink}
            >
              <ThemedText style={styles.backLinkText}>Back to the list</ThemedText>
            </Pressable>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 12,
    },
    title: { fontSize: 22, lineHeight: 28, fontWeight: "800", color: c.text },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginHorizontal: 20,
      marginBottom: 8,
      paddingHorizontal: 12,
      height: 44,
      borderRadius: 12,
      backgroundColor: c.surfaceMuted,
    },
    searchInput: { flex: 1, fontSize: 15, color: c.text, padding: 0 },
    list: { paddingHorizontal: 20, paddingBottom: 40 },
    customRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop: 8,
      padding: 14,
      borderRadius: 16,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
    },
    customIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    customTitle: { fontSize: 15, fontWeight: "700", color: c.text },
    customSub: { fontSize: 12, color: c.textTertiary, marginTop: 1 },
    section: { marginTop: 22 },
    sectionTitle: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: c.textTertiary,
      marginBottom: 10,
    },
    grid: { flexDirection: "row", flexWrap: "wrap", rowGap: 14 },
    tile: { width: "25%", alignItems: "center", gap: 6 },
    ring: {
      padding: 3,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: "transparent", // reserved so selecting doesn't shift layout
    },
    ringSelected: { borderColor: c.accent },
    tileLabel: {
      fontSize: 11,
      lineHeight: 14,
      textAlign: "center",
      color: c.textSecondary,
      paddingHorizontal: 2,
    },
    tileLabelSelected: { color: c.accentText, fontWeight: "700" },
    empty: {
      marginTop: 24,
      fontSize: 13,
      textAlign: "center",
      color: c.textTertiary,
    },
    customForm: { paddingHorizontal: 20, paddingBottom: 40 },
    preview: { alignItems: "center", marginVertical: 16 },
    fieldLabel: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: c.textTertiary,
      marginTop: 12,
      marginBottom: 8,
    },
    nameInput: {
      height: 48,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: c.surfaceMuted,
      fontSize: 16,
      fontWeight: "600",
      color: c.text,
    },
    swatches: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    swatchRing: {
      padding: 3,
      borderRadius: 22,
      borderWidth: 2,
      borderColor: "transparent",
    },
    swatch: { width: 32, height: 32, borderRadius: 16 },
    useButton: {
      marginTop: 28,
      height: 52,
      borderRadius: 26,
      backgroundColor: c.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    useButtonDisabled: { opacity: 0.45 },
    useButtonText: { color: c.onAccent, fontSize: 16, fontWeight: "700" },
    backLink: { alignSelf: "center", marginTop: 14 },
    backLinkText: { fontSize: 14, color: c.textSecondary },
  });
