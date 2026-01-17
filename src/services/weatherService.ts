import { API_URL, API_KEY } from "@env";
import { WeatherData, ForecastData, ApiError } from "../types/weather";

const BASE_URL = API_URL || "https://api.openweathermap.org/data/2.5";

interface WeatherResponse {
  success: boolean;
  data?: WeatherData;
  error?: string;
}

interface ForecastResponse {
  success: boolean;
  data?: ForecastData;
  error?: string;
}

/**
 * Vietnamese city name mappings for better API matching
 */
const CITY_MAPPINGS: Record<string, string> = {
  "hà nội": "Hanoi",
  "ha noi": "Hanoi",
  hanoi: "Hanoi",
  "hồ chí minh": "Ho Chi Minh City",
  "ho chi minh": "Ho Chi Minh City",
  "tp hcm": "Ho Chi Minh City",
  "sài gòn": "Ho Chi Minh City",
  saigon: "Ho Chi Minh City",
  "đà nẵng": "Da Nang",
  "da nang": "Da Nang",
  "hải phòng": "Haiphong",
  "hai phong": "Haiphong",
  "cần thơ": "Can Tho",
  "can tho": "Can Tho",
  "nha trang": "Nha Trang",
  huế: "Hue",
  hue: "Hue",
  "vũng tàu": "Vung Tau",
  "vung tau": "Vung Tau",
  "đà lạt": "Da Lat",
  "da lat": "Da Lat",
  "biên hòa": "Bien Hoa",
  "bien hoa": "Bien Hoa",
  "quy nhơn": "Quy Nhon",
  "quy nhon": "Quy Nhon",
};

/**
 * Remove Vietnamese diacritics from text
 */
const removeVietnameseDiacritics = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

/**
 * Normalize city name for API - supports Vietnamese with diacritics
 */
const normalizeCityName = (city: string): string => {
  const lowerCity = city.toLowerCase().trim();

  // Check direct mapping first
  if (CITY_MAPPINGS[lowerCity]) {
    return CITY_MAPPINGS[lowerCity];
  }

  // Check mapping after removing diacritics
  const withoutDiacritics = removeVietnameseDiacritics(lowerCity);
  if (CITY_MAPPINGS[withoutDiacritics]) {
    return CITY_MAPPINGS[withoutDiacritics];
  }

  // Return original (API might still recognize it)
  return city;
};

/**
 * Fetch current weather for a city
 * @param city - City name (e.g., "Hà Nội", "Hồ Chí Minh", "London")
 */
export const getCurrentWeather = async (
  city: string,
): Promise<WeatherResponse> => {
  try {
    const normalizedCity = normalizeCityName(city);
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(normalizedCity)}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ApiError;
      if (response.status === 404) {
        return {
          success: false,
          error: "Không tìm thấy thành phố. Vui lòng kiểm tra lại tên.",
        };
      }
      return {
        success: false,
        error: errorData.message || "Đã xảy ra lỗi khi lấy dữ liệu thời tiết.",
      };
    }

    return { success: true, data: data as WeatherData };
  } catch (error) {
    // Network error
    if (error instanceof TypeError && error.message.includes("Network")) {
      return {
        success: false,
        error: "Không có kết nối Internet. Vui lòng kiểm tra mạng.",
      };
    }
    return { success: false, error: "Đã xảy ra lỗi. Vui lòng thử lại sau." };
  }
};

/**
 * Fetch 5-day forecast for a city (3-hour intervals)
 * @param city - City name
 */
export const getForecastWeather = async (
  city: string,
): Promise<ForecastResponse> => {
  try {
    const normalizedCity = normalizeCityName(city);
    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(normalizedCity)}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ApiError;
      if (response.status === 404) {
        return { success: false, error: "Không tìm thấy thành phố." };
      }
      return { success: false, error: errorData.message || "Đã xảy ra lỗi." };
    }

    return { success: true, data: data as ForecastData };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Network")) {
      return { success: false, error: "Không có kết nối Internet." };
    }
    return { success: false, error: "Đã xảy ra lỗi. Vui lòng thử lại sau." };
  }
};

/**
 * Get high-quality weather icon URL
 * @param iconCode - Weather icon code from API (e.g., "10d", "01n")
 */
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
};

/**
 * Format Unix timestamp to readable time
 * @param timestamp - Unix timestamp
 * @param timezone - Timezone offset in seconds
 */
export const formatTime = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
};

/**
 * Format date from dt_txt string
 * @param dtTxt - Date string (e.g., "2024-01-15 12:00:00")
 */
export const formatDate = (dtTxt: string): string => {
  const date = new Date(dtTxt);
  return date.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

/**
 * Get day of week from dt_txt
 */
export const getDayOfWeek = (dtTxt: string): string => {
  const date = new Date(dtTxt);
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return days[date.getDay()];
};

/**
 * Check if it's night time based on sunrise/sunset
 */
export const isNightTime = (
  currentTime: number,
  sunrise: number,
  sunset: number,
): boolean => {
  return currentTime < sunrise || currentTime > sunset;
};
