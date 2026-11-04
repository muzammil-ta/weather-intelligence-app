import { ForecastResponse, GeocodingResponse, GeocodingResult } from '../types/weather';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCity(name: string, count: number = 1): Promise<GeocodingResult[]> {
  const query = name.trim();
  if (!query) {
    throw new Error('Please enter a city or location name.');
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(query)}&count=${count}&language=en&format=json`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding server responded with status ${response.status}`);
    }

    const data: GeocodingResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error(`No locations found matching "${query}". Please check the spelling or try another city.`);
    }

    return data.results;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to resolve city location. Please try again.');
  }
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
  });

  const url = `${FORECAST_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Forecast server responded with status ${response.status}`);
    }

    const data: ForecastResponse = await response.json();

    if (!data.current || !data.daily) {
      throw new Error('Incomplete meteorological data received for this coordinate.');
    }

    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to retrieve forecast data. Please check your internet connection and try again.');
  }
}
