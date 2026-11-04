import {
  CurrentWeatherData,
  DailyWeatherData,
  PlanningIntelligence,
  WeatherRecommendation,
  ActivityRating,
  ActivityLevel,
  TemperatureUnit,
  WindSpeedUnit,
} from '../types/weather';
import { formatTemperature, formatWindSpeed } from './weatherCodes';

export function calculatePlanningIntelligence(
  current: CurrentWeatherData,
  daily: DailyWeatherData,
  tempUnit: TemperatureUnit = 'celsius',
  windUnit: WindSpeedUnit = 'kmh'
): PlanningIntelligence {
  const recommendations: WeatherRecommendation[] = [];

  const todayPrecipProb = daily.precipitation_probability_max?.[0] ?? 0;
  const todayMaxTemp = daily.temperature_2m_max?.[0] ?? current.temperature_2m;
  const currentTemp = current.temperature_2m;
  const feelsLike = current.apparent_temperature;
  const windSpeed = current.wind_speed_10m;
  const weatherCode = current.weather_code;

  // 1. Umbrella Alert Rule
  if (todayPrecipProb > 70 || [63, 65, 66, 67, 81, 82, 95, 96, 99].includes(weatherCode)) {
    recommendations.push({
      id: 'umbrella-high',
      type: 'umbrella',
      severity: 'alert',
      title: 'Umbrella Essential',
      message: `Precipitation probability peaks at ${todayPrecipProb}% today with active precipitation risks.`,
      actionableTip: 'Carry a compact windproof umbrella or wear a waterproof hooded jacket.',
    });
  } else if (todayPrecipProb > 40 || [51, 53, 55, 61, 80].includes(weatherCode)) {
    recommendations.push({
      id: 'umbrella-moderate',
      type: 'umbrella',
      severity: 'warning',
      title: 'Umbrella Recommended',
      message: `Precipitation probability is elevated at ${todayPrecipProb}% today. Scattered showers are probable.`,
      actionableTip: 'Keep an umbrella in your bag or car if you plan to be outdoors during midday or evening.',
    });
  } else {
    recommendations.push({
      id: 'umbrella-clear',
      type: 'umbrella',
      severity: 'success',
      title: 'No Umbrella Needed',
      message: `Rain probability is low at ${todayPrecipProb}%. Dry pavements and steady skies forecast.`,
      actionableTip: 'You can travel light without rain gear today.',
    });
  }

  // 2. Heat / UV Warning Rule
  if (todayMaxTemp > 35 || currentTemp > 35) {
    recommendations.push({
      id: 'heat-extreme',
      type: 'heat',
      severity: 'alert',
      title: 'Extreme Heat Warning',
      message: `High temperature reaches ${formatTemperature(todayMaxTemp, tempUnit)} (feels like ${formatTemperature(feelsLike, tempUnit)}).`,
      actionableTip: 'Stay in air-conditioned environments, drink electrolytes, and reschedule strenuous exercise away from 11:00–16:00.',
    });
  } else if (todayMaxTemp > 30 || currentTemp > 30) {
    recommendations.push({
      id: 'heat-warning',
      type: 'heat',
      severity: 'warning',
      title: 'UV & Heat Advisory',
      message: `Daytime high climbs to ${formatTemperature(todayMaxTemp, tempUnit)}. Elevated thermal stress and intense UV radiation.`,
      actionableTip: 'Apply broad-spectrum sunscreen (SPF 30+), wear UV-rated sunglasses, and maintain consistent hydration.',
    });
  } else if (currentTemp < 0 || feelsLike < 0) {
    // 3. Cold Alert Rule (sub-zero)
    recommendations.push({
      id: 'cold-freeze',
      type: 'cold',
      severity: 'alert',
      title: 'Freezing Weather Advisory',
      message: `Sub-zero temperatures of ${formatTemperature(currentTemp, tempUnit)} with wind chill at ${formatTemperature(feelsLike, tempUnit)}.`,
      actionableTip: 'Wear insulated thermal base layers, gloves, and watch out for hidden black ice on bridges and sidewalks.',
    });
  } else if (currentTemp < 6) {
    // Cold alert (chill)
    recommendations.push({
      id: 'cold-chill',
      type: 'cold',
      severity: 'warning',
      title: 'Cold Weather Advisory',
      message: `Chilly conditions at ${formatTemperature(currentTemp, tempUnit)} (feels like ${formatTemperature(feelsLike, tempUnit)}).`,
      actionableTip: 'Layer with a warm coat, scarf, and insulated footwear before heading out.',
    });
  }

  // 4. Wind Advisory Rule
  if (windSpeed > 40) {
    recommendations.push({
      id: 'wind-gale',
      type: 'wind',
      severity: 'alert',
      title: 'High Wind Warning',
      message: `Sustained winds clocked at ${formatWindSpeed(windSpeed, windUnit)}. Heavy crosswinds and turbulence expected.`,
      actionableTip: 'Secure patio furniture, exercise caution while cycling, and avoid standing near loose scaffolding or trees.',
    });
  } else if (windSpeed > 25) {
    recommendations.push({
      id: 'wind-breezy',
      type: 'wind',
      severity: 'warning',
      title: 'Breezy Wind Advisory',
      message: `Fresh breeze at ${formatWindSpeed(windSpeed, windUnit)}. Noticeable headwind resistance during outdoor travel.`,
      actionableTip: 'Dress in wind-resistant outer garments and hold tight to hats or loose accessories.',
    });
  }

  // 5. Activity Rating Calculation (0 - 100)
  let score = 100;

  // Rain penalty
  if (todayPrecipProb > 70) score -= 45;
  else if (todayPrecipProb > 40) score -= 30;
  else if (todayPrecipProb > 20) score -= 12;
  else if (todayPrecipProb > 10) score -= 4;

  // Temperature comfort penalty (ideal 16 - 24 °C)
  if (currentTemp >= 16 && currentTemp <= 24) {
    // 0 penalty
  } else if ((currentTemp >= 12 && currentTemp < 16) || (currentTemp > 24 && currentTemp <= 28)) {
    score -= 8;
  } else if ((currentTemp >= 8 && currentTemp < 12) || (currentTemp > 28 && currentTemp <= 32)) {
    score -= 18;
  } else if ((currentTemp >= 2 && currentTemp < 8) || (currentTemp > 32 && currentTemp <= 36)) {
    score -= 30;
  } else {
    score -= 46; // < 2 or > 36
  }

  // Wind penalty
  if (windSpeed > 40) score -= 25;
  else if (windSpeed > 25) score -= 14;
  else if (windSpeed > 18) score -= 6;

  // Storm / extreme code penalty
  if ([95, 96, 99].includes(weatherCode)) score -= 45;
  else if ([65, 75, 82, 86].includes(weatherCode)) score -= 35;
  else if ([45, 48].includes(weatherCode)) score -= 12;

  score = Math.max(12, Math.min(100, Math.round(score)));

  let overallActivityLevel: ActivityLevel = 'poor';
  let summaryText = '';

  if (score >= 82) {
    overallActivityLevel = 'excellent';
    summaryText = `Exceptional outdoor conditions today. Crisp visibility, comfortable ${formatTemperature(currentTemp, tempUnit)} ambient temperature, and minimal rain interference (${todayPrecipProb}%). Ideal for workouts, cycling, and leisure.`;
  } else if (score >= 64) {
    overallActivityLevel = 'good';
    summaryText = `Favorable conditions for most daily activities. Moderate temperature of ${formatTemperature(currentTemp, tempUnit)} and manageable atmospheric factors. Great for general errands and walking.`;
  } else if (score >= 45) {
    overallActivityLevel = 'fair';
    summaryText = `Marginal outdoor conditions. Keep in mind the ${todayPrecipProb}% rain probability and ${formatWindSpeed(windSpeed, windUnit)} winds. Consider lighter sessions and flexible timing.`;
  } else {
    overallActivityLevel = 'poor';
    summaryText = `Challenging outdoor weather due to adverse rain probability (${todayPrecipProb}%), winds (${formatWindSpeed(windSpeed, windUnit)}), or extreme temperatures. Prioritize indoor fitness and cozy spaces.`;
  }

  // Activity-specific breakdowns
  const runningScore = Math.max(10, Math.min(100, Math.round(
    100 - (todayPrecipProb * 0.45) - (Math.abs(currentTemp - 16) * 2.8) - (windSpeed * 0.4)
  )));

  const cyclingScore = Math.max(10, Math.min(100, Math.round(
    100 - (todayPrecipProb * 0.5) - (Math.abs(currentTemp - 18) * 2.0) - (windSpeed * 0.8)
  )));

  const parkScore = Math.max(10, Math.min(100, Math.round(
    100 - (todayPrecipProb * 0.6) - (Math.abs(currentTemp - 21) * 2.5) - (windSpeed * 0.5)
  )));

  const laundryScore = Math.max(10, Math.min(100, Math.round(
    100 - (todayPrecipProb * 0.7) - (current.relative_humidity_2m * 0.3) + (Math.min(windSpeed, 25) * 0.4)
  )));

  const getLevel = (s: number): ActivityLevel => {
    if (s >= 80) return 'excellent';
    if (s >= 62) return 'good';
    if (s >= 42) return 'fair';
    return 'poor';
  };

  const activityBreakdown: ActivityRating[] = [
    {
      name: 'Running & Jogging',
      level: getLevel(runningScore),
      score: runningScore,
      reason:
        runningScore >= 75
          ? 'Comfortable airflow and great track grip.'
          : runningScore >= 50
          ? 'Damp paths or mild breeze. Watch your step.'
          : 'High precipitation or thermal extremes.',
      iconName: 'running',
    },
    {
      name: 'Cycling & Commute',
      level: getLevel(cyclingScore),
      score: cyclingScore,
      reason:
        cyclingScore >= 75
          ? 'Calm wind drag and dry asphalt.'
          : cyclingScore >= 50
          ? `Breeze at ${formatWindSpeed(windSpeed, windUnit)} requires slight extra pedaling effort.`
          : 'Slick roads or gusty headwind hazards.',
      iconName: 'bike',
    },
    {
      name: 'Park & Outdoor Dining',
      level: getLevel(parkScore),
      score: parkScore,
      reason:
        parkScore >= 75
          ? 'Delightful ambient temperature for patios.'
          : parkScore >= 50
          ? 'Bring an extra light jacket for shady spots.'
          : 'High rain odds or unpleasant gusts.',
      iconName: 'park',
    },
    {
      name: 'Line Laundry Drying',
      level: getLevel(laundryScore),
      score: laundryScore,
      reason:
        laundryScore >= 75
          ? 'Good breeze and low humidity aid quick drying.'
          : laundryScore >= 50
          ? 'Dry times might be longer due to humidity.'
          : 'Risk of rain or high moisture. Use indoor rack.',
      iconName: 'laundry',
    },
  ];

  return {
    recommendations,
    overallActivityScore: score,
    overallActivityLevel,
    summaryText,
    activityBreakdown,
  };
}
