import fetch from 'node-fetch';

async function run() {
  const url = 'http://localhost:3000/api/forecasts?startTime=2024-03-14T00:00:00.000Z&endTime=2024-03-15T00:00:00.000Z';
  const res = await fetch(url);
  const data = await res.json();
  if (!Array.isArray(data)) {
    console.log("Not an array:", data);
    return;
  }
  console.log(`Forecasts length: ${data.length}`);
  if (data.length > 0) {
    console.log("First 3:", data.slice(0, 3));
  }
}
run();
