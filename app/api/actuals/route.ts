import { NextRequest, NextResponse } from 'next/server';
import { fetchWithRetry } from '../../../lib/fetchWithRetry';

interface FuelItem {
  fuelType: string;
  startTime: string;
  generation: number;
  [key: string]: unknown;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startTimeStr = searchParams.get('startTime');
    const endTimeStr = searchParams.get('endTime');

    if (!startTimeStr || !endTimeStr) {
      return NextResponse.json({ error: 'startTime and endTime are required' }, { status: 400 });
    }

    const startMs = new Date(startTimeStr).getTime();
    const endMs = new Date(endTimeStr).getTime();
    
    const CHUNK_SIZE_MS = 24 * 60 * 60 * 1000; // 1 day
    
    let allData: FuelItem[] = [];
    let currentFromMs = startMs;

    while (currentFromMs <= endMs) {
      const currentToMs = Math.min(currentFromMs + CHUNK_SIZE_MS, endMs);
      
      const chunkStartDate = new Date(currentFromMs).toISOString().split('T')[0];
      const chunkEndDate = new Date(currentToMs).toISOString().split('T')[0];
      
      const baseUrl = process.env.ELEXON_API_BASE_URL;
      if (!baseUrl) {
        throw new Error('ELEXON_API_BASE_URL is not defined in environment variables');
      }
      const url = `${baseUrl}/datasets/FUELHH/stream?settlementDateFrom=${chunkStartDate}&settlementDateTo=${chunkEndDate}&fuelType=WIND`;
      
      const response = await fetchWithRetry(url, 3, 1000);
      const json = await response.json();
      const data = json.data || json;
      
      if (!Array.isArray(data)) {
        throw new Error(`Expected array format from API, got: ${typeof data}`);
      }

      allData = allData.concat(data as FuelItem[]);

      currentFromMs = currentToMs + 1000; // Step to avoid overlap
    }

    const actuals = allData
      .filter((item: FuelItem) => item.fuelType === 'WIND')
      .map((item: FuelItem) => ({
        startTime: item.startTime,
        generation: item.generation
      }))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    return NextResponse.json(actuals, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate'
      }
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in actuals route:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
