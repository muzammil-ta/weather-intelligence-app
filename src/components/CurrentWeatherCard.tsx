import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
  Compass,
} from 'lucide-react';
import {
  CurrentWeatherData,
  DailyWeatherData,
  GeocodingResult,
  TemperatureUnit,
  WindSpeedUnit,
} from '../types/weather';
import { getWeatherMeta, formatTemperature, formatWindSpeed } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  location: GeocodingResult;
  current: CurrentWeatherData;
  daily: DailyWeatherData;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  location,
  current,
  daily,
  tempUnit,
  windUnit,
}) => {
  const meta = getWeatherMeta(current.weather_code);
  const maxToday = daily.temperature_2m_max?.[0] ?? current.temperature_2m;
  const minToday = daily.temperature_2m_min?.[0] ?? current.temperature_2m;
  const precipProbToday = daily.precipitation_probability_max?.[0] ?? 0;

  // Format observation time if available
  const dateObj = new Date();
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const getWindClassification = (speedKmh: number): string => {
    if (speedKmh < 5) return 'Calm';
    if (speedKmh < 12) return 'Light Air';
    if (speedKmh < 20) return 'Gentle Breeze';
    if (speedKmh < 29) return 'Moderate Breeze';
    if (speedKmh < 39) return 'Fresh Breeze';
    if (speedKmh < 50) return 'Strong Breeze';
    return 'High Wind / Gale';
  };

  const getHumidityComfort = (humidity: number): string => {
    if (humidity < 30) return 'Dry / Crisp';
    if (humidity <= 60) return 'Optimal Comfort';
    if (humidity <= 75) return 'Moderate Humidity';
    return 'High Moisture / Muggy';
  };

  return (
    <div
      id="current-weather"
      className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors"
    >
      {/* Subtle Atmospheric Top Gradient */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 opacity-80" />

      <div className="p-6 sm:p-8">
        {/* Top Header Row: Location and Time */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-semibold tracking-wide uppercase">
              <MapPin className="w-3.5 h-3.5" />
              <span>Current Meteorological Station</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {location.name}
              {location.country && (
                <span className="text-slate-400 dark:text-slate-500 font-normal text-xl sm:text-2xl ml-2">
                  {location.country}
                </span>
              )}
            </h1>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              {location.admin1 && <span>{location.admin1}</span>}
              {location.admin1 && <span aria-hidden="true">·</span>}
              <span className="tabular-nums">
                {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E
              </span>
              {location.elevation !== undefined && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{location.elevation}m elev</span>
                </>
              )}
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="flex items-center sm:justify-end gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Observed Today</span>
            </div>
            <div className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              {formattedDate}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              TZ: {location.timezone || 'Auto-detected'}
            </div>
          </div>
        </div>

        {/* Hero Weather Section: Temperature & Big Condition */}
        <div className="py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
              <WeatherIcon code={current.weather_code} className="w-14 h-14 sm:w-16 sm:h-16" />
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
                  {formatTemperature(current.temperature_2m, tempUnit)}
                </span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Feels like{' '}
                  <strong className="text-slate-800 dark:text-slate-200 tabular-nums">
                    {formatTemperature(current.apparent_temperature, tempUnit)}
                  </strong>
                </span>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {meta.label}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
                  — {meta.description}
                </span>
              </div>
            </div>
          </div>

          {/* Today's Range Quick Strip */}
          <div className="flex md:flex-col items-center md:items-end justify-between gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <span className="flex items-center gap-1 text-rose-500 font-medium">
                <ArrowUp className="w-4 h-4" />
                <span className="text-slate-500 dark:text-slate-400 text-xs">High</span>
                <span className="tabular-nums font-semibold">
                  {formatTemperature(maxToday, tempUnit)}
                </span>
              </span>
              <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">|</span>
              <span className="flex items-center gap-1 text-sky-500 font-medium">
                <ArrowDown className="w-4 h-4" />
                <span className="text-slate-500 dark:text-slate-400 text-xs">Low</span>
                <span className="tabular-nums font-semibold">
                  {formatTemperature(minToday, tempUnit)}
                </span>
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              Rain Risk Today: <strong className="text-slate-700 dark:text-slate-300">{precipProbToday}%</strong>
            </div>
          </div>
        </div>

        {/* 4 Essential Atmospheric Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          {/* 1. Apparent Temp */}
          <div className="p-4 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Apparent Temp</span>
              <Thermometer className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              {formatTemperature(current.apparent_temperature, tempUnit)}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {current.apparent_temperature > current.temperature_2m
                ? 'Higher thermal index'
                : current.apparent_temperature < current.temperature_2m
                ? 'Cooler wind chill'
                : 'Equal to ambient temp'}
            </div>
          </div>

          {/* 2. Relative Humidity */}
          <div className="p-4 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Relative Humidity</span>
              <Droplets className="w-4 h-4 text-sky-500" />
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              {current.relative_humidity_2m}%
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {getHumidityComfort(current.relative_humidity_2m)}
            </div>
          </div>

          {/* 3. Wind Speed */}
          <div className="p-4 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Wind Velocity (10m)</span>
              <Wind className="w-4 h-4 text-teal-500" />
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              {formatWindSpeed(current.wind_speed_10m, windUnit)}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {getWindClassification(current.wind_speed_10m)}
            </div>
          </div>

          {/* 4. Weather Condition Code */}
          <div className="p-4 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Atmospheric State</span>
              <Compass className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white truncate">
              {meta.label}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
              WMO Code #{current.weather_code}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
