async function run() {
  const url1 = "https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH/stream?startTime=2024-01-01T00:00:00Z&endTime=2024-01-01T23:59:00Z&fuelType=WIND";
  const url2 = "https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH/stream?settlementDateFrom=2024-01-01&settlementDateTo=2024-01-01&fuelType=WIND";
  const url3 = "https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH?settlementDateFrom=2024-01-01&settlementDateTo=2024-01-01&fuelType=WIND";

  for (const u of [url1, url2, url3]) {
    try {
      const r = await fetch(u);
      const d = await r.json();
      console.log(u);
      const arr = d.data || d;
      console.log("length:", arr.length);
      if (arr.length > 0) {
        console.log("First:", arr[0].startTime);
      }
    } catch(e) {
      console.log("Error:", e.message);
    }
  }
}
run();
