import { Platform } from "react-native";

export const colors = {
  // Primary colors
  primaryDark: "#1E6BB8",
  /* ========= BRAND ========= */
  primary: "#4FACFE",
  primaryLight: "#8EC5FF",
  accent: "#FFD166",
  // Background colors
  background: "#0B1220",
  backgroundLight: "#132F4C",
  backgroundDark: "#071423",

  // Text colors
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.75)",
  textMuted: "rgba(255,255,255,0.45)",

  // Status colors
  error: "#FF6B6B",
  success: "#2DD4BF",
  warning: "#FACC15",

  // Card colors (glassmorphism)
  cardBackground:
    Platform.OS === "web" ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.15)",

  cardItemBackground: "rgba(255,255,255,0.12)",
  cardBorder: "rgba(255,255,255,0.2)",
};
export const gradients = {
  clear: ["#FF9F1C", "#FF6F00", "#9B2226"] as const,
  clouds: ["#5F0F40", "#310A31", "#1B0F1E"] as const,
  rain: ["#3A0F7D", "#240046", "#10002B"] as const,
  thunderstorm: ["#240046", "#3C096C", "#10002B"] as const,
  snow: ["#F8EDEB", "#EDEDE9", "#F8EDEB"] as const,
  mist: ["#6D597A", "#355070", "#6D597A"] as const,
  night: ["#0B090A", "#161A1D", "#2B2D42"] as const,
  default: ["#2B1D3A", "#3B2558", "#FF9F1C"] as const,
};

export const typography = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 48,
    giant: 72,
  },

  // Font weights
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  round: 9999,
};

// Map weather condition to gradient
export const getWeatherGradient = (
  weatherMain: string,
  isNight: boolean = false,
) => {
  if (isNight) return gradients.night;

  const condition = weatherMain.toLowerCase();

  switch (condition) {
    case "clear":
      return gradients.clear;
    case "clouds":
      return gradients.clouds;
    case "rain":
    case "drizzle":
      return gradients.rain;
    case "thunderstorm":
      return gradients.thunderstorm;
    case "snow":
      return gradients.snow;
    case "mist":
    case "fog":
    case "haze":
    case "smoke":
    case "dust":
    case "sand":
    case "ash":
    case "squall":
    case "tornado":
      return gradients.mist;
    default:
      return gradients.default;
  }
};
