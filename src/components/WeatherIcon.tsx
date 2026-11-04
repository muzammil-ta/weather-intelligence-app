import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from 'lucide-react';

interface WeatherIconProps {
  code: number;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, className = 'w-6 h-6', size }) => {
  // Clear
  if (code === 0) {
    return <Sun size={size} className={`text-amber-500 animate-spin-slow ${className}`} />;
  }
  if (code === 1) {
    return <Sun size={size} className={`text-amber-400 ${className}`} />;
  }
  // Partly cloudy / Overcast
  if (code === 2) {
    return <CloudSun size={size} className={`text-sky-400 ${className}`} />;
  }
  if (code === 3) {
    return <Cloud size={size} className={`text-slate-400 ${className}`} />;
  }
  // Fog
  if (code === 45 || code === 48) {
    return <CloudFog size={size} className={`text-zinc-400 ${className}`} />;
  }
  // Drizzle
  if ([51, 53, 55, 56, 57].includes(code)) {
    return <CloudDrizzle size={size} className={`text-teal-400 ${className}`} />;
  }
  // Rain
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return <CloudRain size={size} className={`text-blue-500 ${className}`} />;
  }
  // Snow
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return <CloudSnow size={size} className={`text-indigo-300 ${className}`} />;
  }
  // Thunderstorm
  if ([95, 96, 99].includes(code)) {
    return <CloudLightning size={size} className={`text-amber-500 ${className}`} />;
  }

  return <CloudSun size={size} className={`text-slate-400 ${className}`} />;
};
