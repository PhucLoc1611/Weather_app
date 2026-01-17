import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Cloud,
} from "lucide-react-native";

import { RootStackParamList } from "../types/navigation";
import { ForecastItem } from "../types/weather";
import {
  getForecastWeather,
  getWeatherIconUrl,
  formatTime,
  getDayOfWeek,
} from "../services/weatherService";
import { LoadingSpinner } from "../components/LoadingSpinner";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  getWeatherGradient,
} from "../styles/theme";

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, "Detail">;

export const DetailScreen: React.FC<DetailScreenProps> = ({ route }) => {
  const { cityName, weatherData } = route.params;
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loadingForecast, setLoadingForecast] = useState(true);

  const currentWeather = weatherData.weather[0];
  const isNight =
    Date.now() / 1000 < weatherData.sys.sunrise ||
    Date.now() / 1000 > weatherData.sys.sunset;
  const gradientColors = getWeatherGradient(currentWeather.main, isNight);

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    const result = await getForecastWeather(cityName);
    if (result.success && result.data) {
      // Get one forecast per day (around noon)
      const dailyForecast = result.data.list
        .filter((item, index) => index % 8 === 4)
        .slice(0, 5);
      setForecast(dailyForecast);
    }
    setLoadingForecast(false);
  };

  const renderForecastItem = ({ item }: { item: ForecastItem }) => (
    <View style={styles.forecastItem}>
      <Text style={styles.forecastDay}>{getDayOfWeek(item.dt_txt)}</Text>
      <Image
        source={{ uri: getWeatherIconUrl(item.weather[0].icon) }}
        style={styles.forecastIcon}
      />
      <Text style={styles.forecastTemp}>{Math.round(item.main.temp)}°</Text>
    </View>
  );

  const DetailItem = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <View style={styles.detailItem}>
      {icon}
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.locationRow}>
              <MapPin size={24} color={colors.textPrimary} />
              <Text style={styles.cityName}>{weatherData.name}</Text>
              <Text style={styles.country}>{weatherData.sys.country}</Text>
            </View>

            <View style={styles.mainWeather}>
              <Image
                source={{ uri: getWeatherIconUrl(currentWeather.icon) }}
                style={styles.mainIcon}
              />
              <Text style={styles.temperature}>
                {Math.round(weatherData.main.temp)}°C
              </Text>
            </View>

            <Text style={styles.description}>
              {currentWeather.description.charAt(0).toUpperCase() +
                currentWeather.description.slice(1)}
            </Text>
            <Text style={styles.highLow}>
              H: {Math.round(weatherData.main.temp_max)}° L:{" "}
              {Math.round(weatherData.main.temp_min)}°
            </Text>
          </View>

          {/* 5-Day Forecast */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Cloud size={20} color={colors.textSecondary} />
              <Text style={styles.sectionTitle}>Dự báo 5 ngày</Text>
            </View>
            {loadingForecast ? (
              <LoadingSpinner message="Đang tải dự báo..." />
            ) : (
              <FlatList
                data={forecast}
                renderItem={renderForecastItem}
                keyExtractor={(item) => item.dt.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.forecastList}
              />
            )}
          </View>

          {/* Weather Details Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chi tiết thời tiết</Text>
            <View style={styles.detailsGrid}>
              <DetailItem
                icon={<Thermometer size={24} color={colors.primaryLight} />}
                label="Cảm giác như"
                value={`${Math.round(weatherData.main.feels_like)}°C`}
              />
              <DetailItem
                icon={<Droplets size={24} color={colors.primaryLight} />}
                label="Độ ẩm"
                value={`${weatherData.main.humidity}%`}
              />
              <DetailItem
                icon={<Wind size={24} color={colors.primaryLight} />}
                label="Gió"
                value={`${weatherData.wind.speed} m/s`}
              />
              <DetailItem
                icon={<Gauge size={24} color={colors.primaryLight} />}
                label="Áp suất"
                value={`${weatherData.main.pressure} hPa`}
              />
              <DetailItem
                icon={<Eye size={24} color={colors.primaryLight} />}
                label="Tầm nhìn"
                value={`${(weatherData.visibility / 1000).toFixed(1)} km`}
              />
              <DetailItem
                icon={<Cloud size={24} color={colors.primaryLight} />}
                label="Mây"
                value={`${weatherData.clouds.all}%`}
              />
            </View>
          </View>

          {/* Sunrise/Sunset */}
          <View style={styles.section}>
            <View style={styles.sunTimes}>
              <View style={styles.sunTimeItem}>
                <Sunrise size={32} color={colors.warning} />
                <Text style={styles.sunTimeLabel}>Mặt trời mọc</Text>
                <Text style={styles.sunTimeValue}>
                  {formatTime(weatherData.sys.sunrise, weatherData.timezone)}
                </Text>
              </View>
              <View style={styles.sunTimeItem}>
                <Sunset size={32} color="#FF8C00" />
                <Text style={styles.sunTimeLabel}>Mặt trời lặn</Text>
                <Text style={styles.sunTimeValue}>
                  {formatTime(weatherData.sys.sunset, weatherData.timezone)}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: "center",
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cityName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  country: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  mainWeather: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
  },
  mainIcon: {
    width: 100,
    height: 100,
  },
  temperature: {
    fontSize: typography.fontSize.giant,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  description: {
    fontSize: typography.fontSize.xl,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  highLow: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  forecastList: {
    paddingVertical: spacing.sm,
  },
  forecastItem: {
    alignItems: "center",
    marginRight: spacing.lg,
    minWidth: 60,
  },
  forecastDay: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  forecastIcon: {
    width: 50,
    height: 50,
  },
  forecastTemp: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailItem: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  detailValue: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
    marginTop: spacing.xs,
  },
  sunTimes: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  sunTimeItem: {
    alignItems: "center",
  },
  sunTimeLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  sunTimeValue: {
    fontSize: typography.fontSize.xl,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
    marginTop: spacing.xs,
  },
});
