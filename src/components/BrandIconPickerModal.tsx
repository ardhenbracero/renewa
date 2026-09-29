import { BrandIcon } from "@/components/brand-icon";
import { ThemedText } from "@/components/themed-text";
import {
    ALL_BRAND_ICONS,
    BrandIconEntry,
    CURATED_BRAND_ICONS,
} from "@/constants/all-brand-icons";
import { useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

export function BrandIconPickerModal({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (entry: BrandIconEntry) => void;
}) {
  const [query, setQuery] = useState("");
  const [searchAll, setSearchAll] = useState(false);

  const curatedResults = useMemo(() => {
    if (!query.trim()) return CURATED_BRAND_ICONS;
    const q = query.toLowerCase();
    return CURATED_BRAND_ICONS.filter((icon) =>
      icon.title.toLowerCase().includes(q),
    );
  }, [query]);

  const fullResults = useMemo(() => {
    if (!searchAll || !query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_BRAND_ICONS.filter((icon) =>
      icon.title.toLowerCase().includes(q),
    );
  }, [searchAll, query]);

  // Reset the "search all" toggle whenever the query changes
  const handleQueryChange = (text: string) => {
    setQuery(text);
    setSearchAll(false);
  };

  const showEmptyState =
    query.trim().length > 0 && curatedResults.length === 0 && !searchAll;
  const results = searchAll ? fullResults : curatedResults;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Choose an icon</ThemedText>
          <Pressable onPress={onClose}>
            <ThemedText>Close</ThemedText>
          </Pressable>
        </View>

        <TextInput
          style={styles.search}
          placeholder="Search brands..."
          value={query}
          onChangeText={handleQueryChange}
          autoFocus
        />

        {showEmptyState ? (
          <View style={styles.emptyState}>
            <ThemedText
              type="small"
              style={{ textAlign: "center", marginBottom: 12 }}
            >
              No match in the common list for "{query}".
            </ThemedText>
            <Pressable
              style={styles.searchAllButton}
              onPress={() => setSearchAll(true)}
            >
              <ThemedText type="small">Search all icons →</ThemedText>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.slug}
            numColumns={4}
            initialNumToRender={24}
            maxToRenderPerBatch={24}
            windowSize={5}
            removeClippedSubviews
            renderItem={({ item }) => (
              <Pressable
                style={styles.gridItem}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <BrandIcon slug={item.slug} size={28} />
                <ThemedText
                  type="small"
                  numberOfLines={1}
                  style={styles.gridLabel}
                >
                  {item.title}
                </ThemedText>
              </Pressable>
            )}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  gridItem: {
    width: "25%",
    alignItems: "center",
    paddingVertical: 12,
    gap: 4,
  },
  gridLabel: { fontSize: 11, textAlign: "center" },
  emptyState: {
    alignItems: "center",
    paddingTop: 40,
  },
  searchAllButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
