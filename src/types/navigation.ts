import { WeatherData } from "./weather";

export type RootStackParamList = {
  Home: undefined;
  Detail: {
    cityName: string;
    weatherData: WeatherData;
  };
};
