export interface WeatherCodeMeta {
  label: string;
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunder';
  description: string;
  badgeColor: string;
}

export const WEATHER_CODES: Record<number, WeatherCodeMeta> = {
  0: {
    label: 'Clear Sky',
    category: 'clear',
    description: 'Cloudless and sunny skies with excellent visibility.',
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  1: {
    label: 'Mainly Clear',
    category: 'clear',
    description: 'Scattered high clouds with abundant sunshine.',
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  },
  2: {
    label: 'Partly Cloudy',
    category: 'cloudy',
    description: 'Mix of sun and intermittent cloud cover.',
    badgeColor: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  },
  3: {
    label: 'Overcast',
    category: 'cloudy',
    description: 'Full uniform gray cloud deck with muted daylight.',
    badgeColor: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  },
  45: {
    label: 'Fog',
    category: 'fog',
    description: 'Ground-level cloud reducing horizontal visibility.',
    badgeColor: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20',
  },
  48: {
    label: 'Depositing Rime Fog',
    category: 'fog',
    description: 'Freezing fog depositing frosty crystalline coatings.',
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  },
  51: {
    label: 'Light Drizzle',
    category: 'drizzle',
    description: 'Fine mist and intermittent droplets.',
    badgeColor: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  },
  53: {
    label: 'Moderate Drizzle',
    category: 'drizzle',
    description: 'Steady fine mist wetting outdoor surfaces.',
    badgeColor: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  },
  55: {
    label: 'Dense Drizzle',
    category: 'drizzle',
    description: 'Heavy damp mist reducing visibility.',
    badgeColor: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
  },
  56: {
    label: 'Freezing Drizzle (Light)',
    category: 'drizzle',
    description: 'Sub-zero fine droplets forming black ice.',
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  },
  57: {
    label: 'Freezing Drizzle (Dense)',
    category: 'drizzle',
    description: 'Heavy sub-zero mist creating hazardous icy surfaces.',
    badgeColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  },
  61: {
    label: 'Slight Rain',
    category: 'rain',
    description: 'Gentle raindrops with damp pavement.',
    badgeColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  },
  63: {
    label: 'Moderate Rain',
    category: 'rain',
    description: 'Steady consistent rainfall. Umbrella required.',
    badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  65: {
    label: 'Heavy Rain',
    category: 'rain',
    description: 'Intense precipitation with potential surface runoff.',
    badgeColor: 'text-blue-600 bg-blue-600/10 border-blue-600/20',
  },
  66: {
    label: 'Freezing Rain (Light)',
    category: 'rain',
    description: 'Liquid drops freezing immediately upon contact.',
    badgeColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  },
  67: {
    label: 'Freezing Rain (Heavy)',
    category: 'rain',
    description: 'Significant glaze ice accumulation hazard.',
    badgeColor: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  },
  71: {
    label: 'Slight Snow',
    category: 'snow',
    description: 'Light flurries dancing in the air.',
    badgeColor: 'text-indigo-300 bg-indigo-300/10 border-indigo-300/20',
  },
  73: {
    label: 'Moderate Snow',
    category: 'snow',
    description: 'Steady snowfall accumulating on cold ground.',
    badgeColor: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  },
  75: {
    label: 'Heavy Snow',
    category: 'snow',
    description: 'Dense snowfall with notable accumulation and reduced visibility.',
    badgeColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  },
  77: {
    label: 'Snow Grains',
    category: 'snow',
    description: 'Tiny white opaque ice particles.',
    badgeColor: 'text-indigo-300 bg-indigo-300/10 border-indigo-300/20',
  },
  80: {
    label: 'Light Rain Showers',
    category: 'rain',
    description: 'Brief passing showers with sudden wet spells.',
    badgeColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  },
  81: {
    label: 'Moderate Rain Showers',
    category: 'rain',
    description: 'Frequent passing downpours with clear intervals.',
    badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  82: {
    label: 'Violent Rain Showers',
    category: 'rain',
    description: 'Sudden torrential rainfall and rapid street puddling.',
    badgeColor: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
  },
  85: {
    label: 'Slight Snow Showers',
    category: 'snow',
    description: 'Intermittent snow bursts with gusty winds.',
    badgeColor: 'text-indigo-300 bg-indigo-300/10 border-indigo-300/20',
  },
  86: {
    label: 'Heavy Snow Showers',
    category: 'snow',
    description: 'Intense snow squalls causing rapid low visibility.',
    badgeColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  },
  95: {
    label: 'Thunderstorm',
    category: 'thunder',
    description: 'Convective storm with lightning and rumbling thunder.',
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  96: {
    label: 'Thunderstorm with Hail',
    category: 'thunder',
    description: 'Severe electrical activity accompanied by small hail.',
    badgeColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  },
  99: {
    label: 'Severe Thunderstorm & Hail',
    category: 'thunder',
    description: 'High-impact storm cell with destructive hail gusts.',
    badgeColor: 'text-rose-600 bg-rose-600/10 border-rose-600/20',
  },
};

export function getWeatherMeta(code: number): WeatherCodeMeta {
  return (
    WEATHER_CODES[code] || {
      label: 'Variable Conditions',
      category: 'cloudy',
      description: 'Typical localized atmospheric patterns.',
      badgeColor: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    }
  );
}

export function formatTemperature(celsius: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    const f = Math.round((celsius * 9) / 5 + 32);
    return `${f}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatWindSpeed(kmh: number, unit: 'kmh' | 'mph'): string {
  if (unit === 'mph') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}
