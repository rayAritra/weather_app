import { ForecastGeneration } from '../types';

export async function fetchForecasts(startTime: string, endTime: string): Promise<ForecastGeneration[]> {
  const url = new URL('/api/forecasts', window.location.origin);
  url.searchParams.append('startTime', startTime);
  url.searchParams.append('endTime', endTime);
  
  const res = await fetch(url.toString());
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch forecasts: ${res.status} ${errorText}`);
  }
  
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  return data;
}
