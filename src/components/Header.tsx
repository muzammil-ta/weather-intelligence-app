import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { TemperatureUnit, WindSpeedUnit } from '../types/weather';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  tempUnit: TemperatureUnit;
  onToggleTempUnit: () => void;
  windUnit: WindSpeedUnit;
  onToggleWindUnit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  tempUnit,
  onToggleTempUnit,
  windUnit,
  onToggleWindUnit,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 dark:bg-sky-400/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <a
            href="#"
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            Aether Weather
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a
            href="#current-weather"
            className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            Current
          </a>
          <a
            href="#planning-intel"
            className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            Intelligence
          </a>
          <a
            href="#forecast-outlook"
            className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            7-Day Outlook
          </a>
          <a
            href="#activity-ratings"
            className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            Activity Index
          </a>
        </nav>

        {/* Zone 3: Interactive Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Unit Toggle Button */}
          <button
            onClick={onToggleTempUnit}
            title={`Switch to ${tempUnit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors tabular-nums whitespace-nowrap shrink-0"
          >
            °{tempUnit === 'celsius' ? 'C' : 'F'}
          </button>

          <button
            onClick={onToggleWindUnit}
            title={`Switch to ${windUnit === 'kmh' ? 'mph' : 'km/h'}`}
            className="hidden sm:inline-flex px-2.5 py-1.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors tabular-nums whitespace-nowrap shrink-0"
          >
            {windUnit === 'kmh' ? 'km/h' : 'mph'}
          </button>

          {/* Theme Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle visual theme"
            className="p-2 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
