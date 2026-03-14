import { ForecastGeneration } from '../types';

export async function fetchForecasts(startTime: string, endTime: string): Promise<ForecastGeneration[]> {
  const url = new URL('/api/forecasts', window.location.origin);
  url.searchParams.append('startTime', startTime);
  url.searchParams.append('endTime', endTime);
  
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Failed to fetch forecasts');
  }
  return res.json();
}
