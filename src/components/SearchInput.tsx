import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
} from "react-native";
import { Search } from "lucide-react-native";
import { colors, typography, spacing, borderRadius } from "../styles/theme";

interface SearchInputProps {
  onSearch: (city: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = "Nhập tên thành phố...",
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      Keyboard.dismiss();
      onSearch(trimmedQuery);
    }
  };

  return (
    <View style={[styles.container, isFocused && styles.containerFocused]}>
      <Search size={20} color={colors.textMuted} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCorrect={false}
        autoCapitalize="words"
      />
      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.searchButton}
        activeOpacity={0.7}
      >
        <View style={styles.searchButtonInner}>
          <Search size={20} color={colors.textPrimary} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  containerFocused: {
    borderColor: "rgba(122, 184, 245, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
    ...(Platform.OS === "web" ? { outlineStyle: "none" as any } : {}),
  },
  searchButton: {
    marginLeft: spacing.sm,
  },
  searchButtonInner: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.sm + 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
