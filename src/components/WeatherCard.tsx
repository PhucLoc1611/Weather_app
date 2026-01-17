import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin, Droplets, Wind, X } from "lucide-react-native";
import { WeatherData } from "../types/weather";
import { getWeatherIconUrl } from "../services/weatherService";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  getWeatherGradient,
} from "../styles/theme";

interface WeatherCardProps {
  weatherData: WeatherData;
  onPress: () => void;
  onDelete: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weatherData,
  onPress,
  onDelete,
}) => {
  const { name, main, weather, wind, sys } = weatherData;
  const currentWeather = weather[0];
  const isNight =
    Date.now() / 1000 < sys.sunrise || Date.now() / 1000 > sys.sunset;
  const gradientColors = getWeatherGradient(currentWeather.main, isNight);

  return (
    <View style={styles.wrapper}>
      {/* DELETE BUTTON */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={onDelete}
        activeOpacity={0.7}
      >
        <X size={18} color={colors.textPrimary} />
      </TouchableOpacity>

      {/* CARD CONTENT → OPEN DETAIL */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <LinearGradient
          colors={gradientColors}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* City */}
          <View style={styles.locationRow}>
            <MapPin size={20} color={colors.textPrimary} />
            <Text style={styles.cityName}>{name}</Text>
            <Text style={styles.country}>{sys.country}</Text>
          </View>

          {/* Temp */}
          <View style={styles.mainRow}>
            <View style={styles.tempContainer}>
              <Text style={styles.temperature}>{Math.round(main.temp)}°</Text>
              <Text style={styles.feelsLike}>
                Cảm giác như {Math.round(main.feels_like)}°
              </Text>
            </View>
            <Image
              source={{ uri: getWeatherIconUrl(currentWeather.icon) }}
              style={styles.weatherIcon}
            />
          </View>

          <Text style={styles.description}>
            {currentWeather.description.charAt(0).toUpperCase() +
              currentWeather.description.slice(1)}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Droplets size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>{main.humidity}%</Text>
            </View>
            <View style={styles.infoItem}>
              <Wind size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>{wind.speed} m/s</Text>
            </View>
          </View>

          <Text style={styles.tapHint}>Nhấn để xem chi tiết →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },

  deleteBtn: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 10,
    padding: spacing.xs,
    borderRadius: 20,
    backgroundColor: "rgb(198, 34, 34)",
  },

  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  cityName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  country: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tempContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: typography.fontSize.giant,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  feelsLike: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  weatherIcon: {
    width: 120,
    height: 120,
  },
  description: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  infoText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  tapHint: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    textAlign: "right",
    marginTop: spacing.md,
  },
});
