import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');

    if (!startTime || !endTime) {
      return NextResponse.json({ error: 'startTime and endTime are required' }, { status: 400 });
    }
    // Calculate publish ranges to ensure we have forecasts for the start of the horizon
    const startMs = new Date(startTime).getTime();
    const endMs = new Date(endTime).getTime();
    
    // To have forecast up to 48 hours ahead for the start of the window,
    // we need to look back at publish times up to 48 hours before start.
    const overallPublishFromMs = startMs - 48 * 60 * 60 * 1000;
    const overallPublishToMs = endMs;

    // The API restricts queries to a max of 7 days (7 * 24 * 60 * 60 * 1000 ms)
    const MAX_RANGE_MS = 7 * 24 * 60 * 60 * 1000;
    
    let allData: any[] = [];
    let currentFromMs = overallPublishFromMs;

    while (currentFromMs <= overallPublishToMs) {
      let currentToMs = currentFromMs + MAX_RANGE_MS;
      if (currentToMs > overallPublishToMs) {
        currentToMs = overallPublishToMs;
      }
      
      const publishFrom = new Date(currentFromMs).toISOString();
      const publishTo = new Date(currentToMs).toISOString();
      
      const url = `https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR?publishDateTimeFrom=${encodeURIComponent(publishFrom)}&publishDateTimeTo=${encodeURIComponent(publishTo)}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const json = await response.json();
      const data = json.data || json;
      
      if (!Array.isArray(data)) {
        return NextResponse.json({ error: 'Expected array format from API', raw: json }, { status: 500 });
      }

      allData = allData.concat(data);

      currentFromMs = currentToMs + 1000; // Increment to avoid overlap
    }

    const forecasts = allData
      .map((item: any) => ({
        startTime: item.startTime,
        publishTime: item.publishTime,
        generation: item.generation
      }))
      .filter((item: any) => {
        const targetMs = new Date(item.startTime).getTime();
        const publishMs = new Date(item.publishTime).getTime();
        const horizonHours = (targetMs - publishMs) / (1000 * 60 * 60);
        return horizonHours >= 0 && horizonHours <= 48;
      })
      .sort((a, b) => {
        const timeDiff = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        if (timeDiff !== 0) return timeDiff;
        return new Date(a.publishTime).getTime() - new Date(b.publishTime).getTime();
      });

    return NextResponse.json(forecasts);

  } catch (error: any) {
    console.error('Error in forecasts route:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
