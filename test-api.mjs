

async function fetchWithRetry(url, retries = 3, delayMs = 1000) {
  let attempt = 1;
  while (true) {
    try {
      const response = await fetch(url);
      
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        if (!response.ok) {
          throw new Error(`Client error: ${response.status} ${response.statusText}`);
        }
        return response;
      }
      
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
      
    } catch (error) {
      if (attempt >= retries) {
        throw new Error(`Failed after ${retries} attempts: ${error.message}`);
      }
      
      console.warn(`Attempt ${attempt} failed for ${url}: ${error.message}. Retrying...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      
      delayMs *= 2; 
      attempt++;
    }
  }
}

async function testApi() {
  console.log('Testing WINDFOR 1 Day Chunk...');
  try {
    const windforUrl = 'https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR/stream?publishDateTimeFrom=2024-01-01T00:00:00.000Z&publishDateTimeTo=2024-01-02T00:00:00.000Z';
    const wRes = await fetchWithRetry(windforUrl);
    const wJson = await wRes.json();
    const wData = wJson.data || wJson;
    
    if(Array.isArray(wData)) {
      console.log(`WINDFOR count: ${wData.length}`);
      console.log('WINDFOR Top 3:', wData.slice(0, 3));
    } else {
      console.error('WINDFOR Error: Not an array', wData);
    }
  } catch (err) {
    console.error(`WINDFOR Fetch Failed:`, err);
  }

  console.log('\n---------------------------\n');
  
  console.log('Testing FUELHH 1 Day Chunk...');
  try {
    const fuelUrl = 'https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH/stream?startTime=2024-01-01T00:00:00.000Z&endTime=2024-01-02T00:00:00.000Z&fuelType=WIND';
    const fRes = await fetchWithRetry(fuelUrl);
    const fJson = await fRes.json();
    const fData = fJson.data || fJson;
    
    if(Array.isArray(fData)) {
      const windOnly = fData.filter(d => d.fuelType === 'WIND');
      console.log(`FUELHH total (WIND ONLY) count: ${windOnly.length}`);
      console.log('FUELHH Top 3:', windOnly.slice(0, 3));
    } else {
      console.error('FUELHH Error: Not an array', fData);
    }
  } catch (err) {
    console.error(`FUELHH Fetch Failed:`, err);
  }
}

testApi();
