import { NextRequest, NextResponse } from 'next/server';
import { fetchWithRetry } from '../../../lib/fetchWithRetry';

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
    
    let allData: any[] = [];
    let currentFromMs = startMs;

    while (currentFromMs <= endMs) {
      const currentToMs = Math.min(currentFromMs + CHUNK_SIZE_MS, endMs);
      
      const chunkStart = new Date(currentFromMs).toISOString();
      const chunkEnd = new Date(currentToMs).toISOString();
      
      const url = `https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH/stream?startTime=${encodeURIComponent(chunkStart)}&endTime=${encodeURIComponent(chunkEnd)}&fuelType=WIND`;
      
      const response = await fetchWithRetry(url, 3, 1000);
      const json: any = await response.json();
      const data = json.data || json;
      
      if (!Array.isArray(data)) {
        throw new Error(`Expected array format from API, got: ${typeof data}`);
      }

      allData = allData.concat(data);

      currentFromMs = currentToMs + 1000; // Step to avoid overlap
    }

    const actuals = allData
      .filter((item: any) => item.fuelType === 'WIND')
      .map((item: any) => ({
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

  } catch (error: any) {
    console.error('Error in actuals route:', error.message);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
