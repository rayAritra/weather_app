import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');

    if (!startTime || !endTime) {
      return NextResponse.json({ error: 'startTime and endTime are required' }, { status: 400 });
    }

    const url = `https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH/stream?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}&fuelType=WIND`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Elexon dataset stream normally returns an array
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Expected array format from API' }, { status: 500 });
    }

    const actuals = data
      .filter((item: any) => item.fuelType === 'WIND')
      .map((item: any) => ({
        startTime: item.startTime,
        generation: item.generation
      }))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    return NextResponse.json(actuals);

  } catch (error: any) {
    console.error('Error in actuals route:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
