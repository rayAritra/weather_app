import { ActualGeneration } from '../types';

export async function fetchActuals(startTime: string, endTime: string): Promise<ActualGeneration[]> {
  const url = new URL('/api/actuals', window.location.origin);
  url.searchParams.append('startTime', startTime);
  url.searchParams.append('endTime', endTime);
  
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Failed to fetch actuals');
  }
  return res.json();
}
