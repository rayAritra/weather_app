async function run() {
  const url = 'https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH?settlementDateFrom=2024-01-01&settlementDateTo=2024-01-07';
  const res = await fetch(url);
  const data = await res.json();
  console.log("First:", data.data ? data.data[0].startTime : "Failed", data);
}
run();
