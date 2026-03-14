import { NextRequest, NextResponse } from 'next/server';
import { fetchWithRetry } from '../../../lib/fetchWithRetry';

interface ElexonResponse {
  data?: any[];
  [key: string]: any;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');

    if (!startTime || !endTime) {
      return NextResponse.json({ error: 'startTime and endTime are required' }, { status: 400 });
    }

    const startMs = new Date(startTime).getTime();
    const endMs = new Date(endTime).getTime();
    
    // Look back 48 hours to secure forecast available for the target window
    const publishFromMs = startMs - 48 * 60 * 60 * 1000;
    const publishToMs = endMs;

    const CHUNK_SIZE_MS = 24 * 60 * 60 * 1000; // 1 day
    
    let allData: any[] = [];
    let currentFromMs = publishFromMs;

    while (currentFromMs <= publishToMs) {
      const currentToMs = Math.min(currentFromMs + CHUNK_SIZE_MS, publishToMs);
      
      const chunkStart = new Date(currentFromMs).toISOString();
      const chunkEnd = new Date(currentToMs).toISOString();
      
      const baseUrl = process.env.ELEXON_API_BASE_URL || 'https://data.elexon.co.uk/bmrs/api/v1';
      const url = `${baseUrl}/datasets/WINDFOR/stream?publishDateTimeFrom=${encodeURIComponent(chunkStart)}&publishDateTimeTo=${encodeURIComponent(chunkEnd)}`;
      
      const response = await fetchWithRetry(url, 3, 1000);
      const json: ElexonResponse = await response.json();
      
      const data = json.data || json; // Handle both wrapped and unwrapped arrays depending on endpoint flavor
      
      if (!Array.isArray(data)) {
        throw new Error(`Expected array format from API, got: ${typeof data}`);
      }

      allData = allData.concat(data);

      currentFromMs = currentToMs + 1000; // Step to avoid overlap
    }

    const forecasts = allData
      .map((item: any) => ({
        startTime: item.startTime,
        publishTime: item.publishTime,
        generation: item.generation
      }))
      .filter((item: any) => {
        const targetTime = new Date(item.startTime).getTime();
        const publishTime = new Date(item.publishTime).getTime();
        const horizonHours = (targetTime - publishTime) / 3600000;
        return horizonHours >= 0 && horizonHours <= 48;
      });

    return NextResponse.json(forecasts, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate'
      }
    });

  } catch (error: any) {
    console.error('Error in forecasts route:', error.message);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
