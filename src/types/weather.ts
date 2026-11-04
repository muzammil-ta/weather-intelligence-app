export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

export interface CurrentWeatherUnits {
  time: string;
  interval?: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  weather_code: string;
  wind_speed_10m: string;
}

export interface CurrentWeatherData {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface DailyWeatherUnits {
  time: string;
  weather_code: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  precipitation_probability_max: string;
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentWeatherUnits;
  current: CurrentWeatherData;
  daily_units: DailyWeatherUnits;
  daily: DailyWeatherData;
}

export interface ForecastDayItem {
  date: string;
  dayName: string;
  weatherCode: number;
  conditionLabel: string;
  tempMax: number;
  tempMin: number;
  precipProb: number;
  isToday: boolean;
}

export type ActivityLevel = 'excellent' | 'good' | 'fair' | 'poor';

export interface ActivityRating {
  name: string;
  level: ActivityLevel;
  score: number; // 0-100
  reason: string;
  iconName: 'running' | 'bike' | 'park' | 'laundry';
}

export interface WeatherRecommendation {
  id: string;
  type: 'umbrella' | 'heat' | 'cold' | 'wind' | 'optimal';
  severity: 'info' | 'warning' | 'alert' | 'success';
  title: string;
  message: string;
  actionableTip: string;
}

export interface PlanningIntelligence {
  recommendations: WeatherRecommendation[];
  overallActivityScore: number;
  overallActivityLevel: ActivityLevel;
  summaryText: string;
  activityBreakdown: ActivityRating[];
}
