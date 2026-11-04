import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastSection } from './components/ForecastSection';
import { RecommendationsCard } from './components/RecommendationsCard';
import { AtmosphericDetails } from './components/AtmosphericDetails';
import { searchCity, fetchForecast } from './services/openMeteo';
import { calculatePlanningIntelligence } from './utils/recommendations';
import {
  ForecastResponse,
  GeocodingResult,
  TemperatureUnit,
  WindSpeedUnit,
} from './types/weather';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';

const DEFAULT_CITY = 'London';
const STORAGE_KEY_RECENT = 'aether_weather_recent_searches';
const STORAGE_KEY_THEME = 'aether_weather_theme';
const STORAGE_KEY_TEMP_UNIT = 'aether_weather_temp_unit';
const STORAGE_KEY_WIND_UNIT = 'aether_weather_wind_unit';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved) return saved === 'dark';
    return true; // default dark for modern sleek aesthetic
  });

  // Units state
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>(() => {
    return (localStorage.getItem(STORAGE_KEY_TEMP_UNIT) as TemperatureUnit) || 'celsius';
  });

  const [windUnit, setWindUnit] = useState<WindSpeedUnit>(() => {
    return (localStorage.getItem(STORAGE_KEY_WIND_UNIT) as WindSpeedUnit) || 'kmh';
  });

  // Weather data states
  const [location, setLocation] = useState<GeocodingResult | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECENT);
      return saved ? JSON.parse(saved) : ['London', 'Tokyo', 'New York'];
    } catch {
      return ['London', 'Tokyo', 'New York'];
    }
  });

  // Keep dark class synced on HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [darkMode]);

  // Persist units
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TEMP_UNIT, tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WIND_UNIT, windUnit);
  }, [windUnit]);

  const addRecentSearch = (cityName: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== cityName.toLowerCase());
      const updated = [cityName, ...filtered].slice(0, 6);
      localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(updated));
      return updated;
    });
  };

  // Perform geocoding + forecast load
  const loadCityWeather = useCallback(async (cityName: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Call Open-Meteo Geocoding API with count=1
      const geocodingResults = await searchCity(cityName, 1);
      const chosenLocation = geocodingResults[0];

      // 2. Call Open-Meteo Forecast API with coordinates
      const forecastData = await fetchForecast(
        chosenLocation.latitude,
        chosenLocation.longitude
      );

      setLocation(chosenLocation);
      setForecast(forecastData);
      addRecentSearch(chosenLocation.name);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to fetch weather data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // HTML5 Geolocation handler
  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = Number(pos.coords.latitude.toFixed(4));
          const lon = Number(pos.coords.longitude.toFixed(4));

          // Fetch forecast directly using coordinates
          const forecastData = await fetchForecast(lat, lon);

          const localLocation: GeocodingResult = {
            id: 0,
            name: 'Local Device Position',
            latitude: lat,
            longitude: lon,
            country: 'Detected via GPS',
            admin1: 'Your Coordinates',
            timezone: forecastData.timezone,
          };

          setLocation(localLocation);
          setForecast(forecastData);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setErrorMessage(err.message);
          } else {
            setErrorMessage('Failed to load forecast for your current location.');
          }
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMessage('Location permission was denied. Please search for your city by name instead.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setErrorMessage('Position unavailable. Please search for your city name.');
        } else {
          setErrorMessage('Location detection timed out. Please enter a city name.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Initial load on mount
  useEffect(() => {
    loadCityWeather(DEFAULT_CITY);
  }, [loadCityWeather]);

  // Compute planning intelligence
  const planningIntelligence =
    forecast && forecast.current && forecast.daily
      ? calculatePlanningIntelligence(
          forecast.current,
          forecast.daily,
          tempUnit,
          windUnit
        )
      : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-sky-500 selection:text-white">
      {/* Top Bar following contract */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        tempUnit={tempUnit}
        onToggleTempUnit={() =>
          setTempUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'))
        }
        windUnit={windUnit}
        onToggleWindUnit={() =>
          setWindUnit((prev) => (prev === 'kmh' ? 'mph' : 'kmh'))
        }
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Search & Location Bar */}
        <div className="max-w-3xl mx-auto">
          <SearchBar
            onSearch={loadCityWeather}
            onLocationClick={handleCurrentLocation}
            isLoading={isLoading}
            isLocating={isLocating}
            errorMessage={errorMessage}
            onClearError={() => setErrorMessage(null)}
            recentSearches={recentSearches}
            onSelectRecent={loadCityWeather}
          />
        </div>

        {/* Loading Spinner Skeleton */}
        {isLoading && !forecast && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-sky-500 mb-3" />
            <p className="text-sm font-medium">Resolving meteorological station & models...</p>
          </div>
        )}

        {/* Populated State */}
        {forecast && location && planningIntelligence && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 1. Current Weather Card */}
            <CurrentWeatherCard
              location={location}
              current={forecast.current}
              daily={forecast.daily}
              tempUnit={tempUnit}
              windUnit={windUnit}
            />

            {/* 2. Planning Recommendations & Rule Advisories */}
            <RecommendationsCard intelligence={planningIntelligence} />

            {/* 3. 7-Day Forecast (Cards / Table) */}
            <ForecastSection daily={forecast.daily} tempUnit={tempUnit} />

            {/* 4. Atmospheric Dynamics & Indices */}
            <AtmosphericDetails
              current={forecast.current}
              daily={forecast.daily}
              tempUnit={tempUnit}
              windUnit={windUnit}
            />
          </div>
        )}

        {/* Empty / Error Fallback when no forecast is loaded */}
        {!forecast && !isLoading && (
          <div className="py-20 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-sky-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              No Meteorological Data Loaded
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Please enter a city name above or select one of the quick cities to view current conditions and forecasts.
            </p>
            <button
              onClick={() => loadCityWeather(DEFAULT_CITY)}
              className="mt-5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Default (London)</span>
            </button>
          </div>
        )}
      </main>

      {/* Clean Human Editorial Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>Aether Weather Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Data powered by Open-Meteo WMO Models</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => location && loadCityWeather(location.name)}
              disabled={isLoading}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Station</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
