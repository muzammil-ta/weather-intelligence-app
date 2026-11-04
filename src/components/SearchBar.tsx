import React, { useState } from 'react';
import { Search, MapPin, Loader2, X, AlertCircle } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => Promise<void>;
  onLocationClick: () => Promise<void>;
  isLoading: boolean;
  isLocating: boolean;
  errorMessage: string | null;
  onClearError: () => void;
  recentSearches: string[];
  onSelectRecent: (city: string) => void;
}

const PRESET_CITIES = ['Tokyo', 'London', 'New York', 'Paris', 'Sydney', 'Dubai'];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onLocationClick,
  isLoading,
  isLocating,
  errorMessage,
  onClearError,
  recentSearches,
  onSelectRecent,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClearError();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onClearError();
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (errorMessage) onClearError();
            }}
            placeholder="Search city or location (e.g., Kyoto, Oslo, San Francisco)..."
            disabled={isLoading}
            className="w-full pl-10 pr-10 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all disabled:opacity-60"
          />
          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex-1 sm:flex-none px-5 py-3 text-sm font-semibold text-white bg-sky-600 dark:bg-sky-500 hover:bg-sky-500 dark:hover:bg-sky-400 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-600 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Locating...</span>
              </>
            ) : (
              <span>Search</span>
            )}
          </button>

          <button
            type="button"
            onClick={onLocationClick}
            disabled={isLocating || isLoading}
            title="Detect atmospheric data for your current location"
            className="px-3.5 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
            ) : (
              <MapPin className="w-4 h-4 text-sky-500" />
            )}
            <span className="hidden sm:inline">My Location</span>
          </button>
        </div>
      </form>

      {/* Inline Error Message */}
      {errorMessage && (
        <div
          role="alert"
          className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-sm flex items-start justify-between gap-3 animate-in fade-in duration-200"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={onClearError}
            className="text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-200 shrink-0"
            aria-label="Dismiss error notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Select Preset Cities and Recent Searches */}
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium text-slate-700 dark:text-slate-300">Quick Cities:</span>
        {PRESET_CITIES.map((city, idx) => (
          <React.Fragment key={city}>
            <button
              onClick={() => {
                setQuery(city);
                onClearError();
                onSearch(city);
              }}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
            >
              {city}
            </button>
            {idx < PRESET_CITIES.length - 1 && <span className="opacity-40" aria-hidden="true">·</span>}
          </React.Fragment>
        ))}

        {recentSearches.length > 0 && (
          <>
            <span className="opacity-40 ml-1 hidden sm:inline" aria-hidden="true">/</span>
            <span className="font-medium text-slate-700 dark:text-slate-300 ml-1 hidden sm:inline">Recent:</span>
            {recentSearches.slice(0, 3).map((city, idx) => (
              <React.Fragment key={`rec-${city}`}>
                <button
                  onClick={() => {
                    setQuery(city);
                    onClearError();
                    onSelectRecent(city);
                  }}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors italic cursor-pointer"
                >
                  {city}
                </button>
                {idx < Math.min(recentSearches.length, 3) - 1 && (
                  <span className="opacity-40" aria-hidden="true">·</span>
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
