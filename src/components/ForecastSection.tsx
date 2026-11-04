import React, { useState } from 'react';
import {
  Calendar,
  CloudRain,
  LayoutGrid,
  Table as TableIcon,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { DailyWeatherData, TemperatureUnit } from '../types/weather';
import { getWeatherMeta, formatTemperature } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface ForecastSectionProps {
  daily: DailyWeatherData;
  tempUnit: TemperatureUnit;
}

export const ForecastSection: React.FC<ForecastSectionProps> = ({ daily, tempUnit }) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Build 7-day items
  const daysCount = Math.min(daily.time.length, 7);
  const items = Array.from({ length: daysCount }).map((_, index) => {
    const rawDate = daily.time[index];
    const dateObj = new Date(rawDate + 'T00:00:00');
    const isToday = index === 0;

    const dayName = isToday
      ? 'Today'
      : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const weatherCode = daily.weather_code[index];
    const meta = getWeatherMeta(weatherCode);
    const tempMax = daily.temperature_2m_max[index];
    const tempMin = daily.temperature_2m_min[index];
    const precipProb = daily.precipitation_probability_max[index] ?? 0;

    return {
      index,
      rawDate,
      dayName,
      formattedDate,
      weatherCode,
      meta,
      tempMax,
      tempMin,
      precipProb,
      isToday,
    };
  });

  // Calculate week-wide min and max for the visual temperature range bar
  const allMins = items.map((i) => i.tempMin);
  const allMaxs = items.map((i) => i.tempMax);
  const weekMin = Math.min(...allMins);
  const weekMax = Math.max(...allMaxs);
  const weekRange = Math.max(1, weekMax - weekMin);

  return (
    <div
      id="forecast-outlook"
      className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors"
    >
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wide">
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day Synoptic Outlook</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            Seven-Day Atmospheric Forecast
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            High/Low thermal projections and maximum precipitation probability.
          </p>
        </div>

        {/* View Mode Toggle: Cards vs Table */}
        <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Mode A: Cards Grid */}
      {viewMode === 'cards' ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {items.map((item) => {
            // Visual range bar math
            const leftPct = ((item.tempMin - weekMin) / weekRange) * 100;
            const widthPct = Math.max(15, ((item.tempMax - item.tempMin) / weekRange) * 100);

            return (
              <div
                key={item.rawDate}
                className={`p-4 rounded-lg border transition-all flex flex-col justify-between ${
                  item.isToday
                    ? 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-300 dark:border-sky-800 ring-1 ring-sky-400/20'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Day Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        item.isToday
                          ? 'text-sky-600 dark:text-sky-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {item.dayName}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
                      {item.formattedDate}
                    </span>
                  </div>

                  {/* Icon & Label */}
                  <div className="my-4 flex flex-col items-center text-center">
                    <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-xs">
                      <WeatherIcon code={item.weatherCode} className="w-8 h-8" />
                    </div>
                    <span className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                      {item.meta.label}
                    </span>
                  </div>
                </div>

                {/* Temps & Rain */}
                <div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatTemperature(item.tempMax, tempUnit)}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 tabular-nums">
                      {formatTemperature(item.tempMin, tempUnit)}
                    </span>
                  </div>

                  {/* Temperature Range Mini Bar */}
                  <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-400 to-amber-400 rounded-full"
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                      }}
                    />
                  </div>

                  {/* Rain Probability Indicator */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <CloudRain
                        className={`w-3.5 h-3.5 ${
                          item.precipProb > 40
                            ? 'text-sky-500 dark:text-sky-400'
                            : 'text-slate-400'
                        }`}
                      />
                      <span>Precip</span>
                    </span>
                    <span
                      className={`font-semibold tabular-nums ${
                        item.precipProb > 40
                          ? 'text-sky-600 dark:text-sky-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.precipProb}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Mode B: Table View */
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4 text-center">Precipitation</th>
                <th className="py-3 px-4 text-right">Low</th>
                <th className="py-3 px-4 text-center">Week Spectrum</th>
                <th className="py-3 px-4 text-right">High</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {items.map((item) => {
                const leftPct = ((item.tempMin - weekMin) / weekRange) * 100;
                const widthPct = Math.max(15, ((item.tempMax - item.tempMin) / weekRange) * 100);

                return (
                  <tr
                    key={item.rawDate}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      item.isToday ? 'bg-sky-50/30 dark:bg-sky-950/15' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{item.dayName}</span>
                        {item.isToday && (
                          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider bg-sky-50 dark:bg-sky-950 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 tabular-nums">
                        {item.formattedDate}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <WeatherIcon code={item.weatherCode} className="w-5 h-5" />
                        <div>
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {item.meta.label}
                          </div>
                          <div className="text-xs text-slate-400 dark:text-slate-500">
                            WMO #{item.weatherCode}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 font-medium tabular-nums">
                        <CloudRain
                          className={`w-3.5 h-3.5 ${
                            item.precipProb > 40 ? 'text-sky-500' : 'text-slate-400'
                          }`}
                        />
                        <span
                          className={
                            item.precipProb > 40
                              ? 'text-sky-600 dark:text-sky-400 font-bold'
                              : 'text-slate-600 dark:text-slate-400'
                          }
                        >
                          {item.precipProb}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
                      <span className="inline-flex items-center gap-0.5 text-sky-500">
                        <ArrowDown className="w-3.5 h-3.5" />
                        <span>{formatTemperature(item.tempMin, tempUnit)}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 w-44">
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full relative overflow-hidden">
                        <div
                          className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-400 to-amber-400 rounded-full"
                          style={{
                            left: `${leftPct}%`,
                            width: `${widthPct}%`,
                          }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white tabular-nums whitespace-nowrap">
                      <span className="inline-flex items-center gap-0.5 text-rose-500">
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span>{formatTemperature(item.tempMax, tempUnit)}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
