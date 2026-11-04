import React from 'react';
import {
  Gauge,
  Wind,
  Droplets,
  Thermometer,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { CurrentWeatherData, DailyWeatherData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { formatTemperature, formatWindSpeed } from '../utils/weatherCodes';

interface AtmosphericDetailsProps {
  current: CurrentWeatherData;
  daily: DailyWeatherData;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const AtmosphericDetails: React.FC<AtmosphericDetailsProps> = ({
  current,
  daily,
  tempUnit,
  windUnit,
}) => {
  // Approximate dew point using Magnus-Tetens formula
  const t = current.temperature_2m;
  const rh = current.relative_humidity_2m;
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * t) / (b + t) + Math.log(rh / 100);
  const dewPointC = (b * alpha) / (a - alpha);

  // Pressure approximation / stability
  const todayPrecipProb = daily.precipitation_probability_max?.[0] ?? 0;

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
      <div className="flex items-center gap-2 pb-5 border-b border-slate-100 dark:border-slate-800">
        <Gauge className="w-5 h-5 text-sky-500" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Atmospheric Dynamics & Indices
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Dew Point Card */}
        <div className="p-4 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Dew Point Temperature</span>
            <Thermometer className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {formatTemperature(dewPointC, tempUnit)}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {dewPointC < 10
              ? 'Crisp and dry air mass'
              : dewPointC <= 16
              ? 'Comfortable atmospheric moisture'
              : dewPointC <= 21
              ? 'Noticeably humid conditions'
              : 'Oppressive, muggy atmosphere'}
          </p>
        </div>

        {/* Wind Dynamic Card */}
        <div className="p-4 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Kinetic Wind Exposure</span>
            <Wind className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {formatWindSpeed(current.wind_speed_10m, windUnit)}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {current.wind_speed_10m > 30
              ? 'High drag resistance; secure loose items'
              : current.wind_speed_10m > 15
              ? 'Moderate breeze; comfortable ventilation'
              : 'Light aerodynamic airflow'}
          </p>
        </div>

        {/* Precipitation Risk Profile */}
        <div className="p-4 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Hydrological Risk</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {todayPrecipProb}%
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {todayPrecipProb > 50
              ? 'High saturation likelihood. Plan indoor buffers.'
              : todayPrecipProb > 20
              ? 'Isolated chance of scattered precipitation.'
              : 'Negligible chance of rainfall interference.'}
          </p>
        </div>
      </div>
    </div>
  );
};
