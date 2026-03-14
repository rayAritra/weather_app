import { ActualGeneration, ForecastGeneration, ChartDataPoint } from '../types';
import { format } from 'date-fns';

export function filterForecastsByHorizon(
  actuals: ActualGeneration[],
  forecasts: ForecastGeneration[],
  horizonHours: number
): ChartDataPoint[] {
  // Group forecasts by target time in ms
  const forecastsByTargetTime = new Map<number, ForecastGeneration[]>();
  for (const f of forecasts) {
    const timeMs = new Date(f.startTime).getTime();
    if (!forecastsByTargetTime.has(timeMs)) {
      forecastsByTargetTime.set(timeMs, []);
    }
    forecastsByTargetTime.get(timeMs)!.push(f);
  }

  // Generate chart data points based on actuals times
  return actuals.map(actual => {
    const targetTimeMs = new Date(actual.startTime).getTime();
    // cutoff = T - horizonHours
    const cutoffMs = targetTimeMs - horizonHours * 60 * 60 * 1000;
    
    // Valid forecasts for this target time
    let relevantForecasts = forecastsByTargetTime.get(targetTimeMs);
    
    // If no exact match, fallback to the start of the hour (useful if forecast is hourly but actuals are half-hourly)
    if (!relevantForecasts || relevantForecasts.length === 0) {
      const hourStartMs = targetTimeMs - (targetTimeMs % (60 * 60 * 1000));
      if (hourStartMs !== targetTimeMs) {
        relevantForecasts = forecastsByTargetTime.get(hourStartMs);
      }
    }
    
    if (!relevantForecasts) {
      relevantForecasts = [];
    }
    
    let bestForecast: ForecastGeneration | null = null;
    let maxPublishTime = -Infinity;
    
    for (const f of relevantForecasts) {
      const pubTimeMs = new Date(f.publishTime).getTime();
      // find the LATEST one where publishTime <= cutoff
      if (pubTimeMs <= cutoffMs) {
        if (pubTimeMs > maxPublishTime) {
          maxPublishTime = pubTimeMs;
          bestForecast = f;
        }
      }
    }
    
    return {
      time: format(new Date(actual.startTime), 'dd/MM HH:mm'),
      actual: actual.generation,
      forecast: bestForecast ? bestForecast.generation : null
    };
  });
}
