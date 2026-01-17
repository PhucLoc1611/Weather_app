import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AlertCircle, WifiOff, MapPinOff } from "lucide-react-native";
import { colors, typography, spacing, borderRadius } from "../styles/theme";

interface ErrorMessageProps {
  message: string;
  type?: "network" | "notFound" | "general";
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = "general",
}) => {
  const getIcon = () => {
    switch (type) {
      case "network":
        return <WifiOff size={48} color={colors.error} />;
      case "notFound":
        return <MapPinOff size={48} color={colors.warning} />;
      default:
        return <AlertCircle size={48} color={colors.error} />;
    }
  };

  return (
    <View style={styles.container}>
      {getIcon()}
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.hint}>Vui lòng thử lại</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    marginHorizontal: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  message: {
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    textAlign: "center",
    marginTop: spacing.md,
  },
  hint: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
