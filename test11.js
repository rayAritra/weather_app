async function run() {
  const paramsList = [
    '?settlementDateFrom=2024-01-01&settlementDateTo=2024-01-02',
    '?publishTimeFrom=2024-01-01&publishTimeTo=2024-01-02',
  ]
  for (const params of paramsList) {
    const url = 'https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH' + params;
    const res = await fetch(url);
    const data = await res.json();
    console.log("FUELHH Params:", params);
    if(data.data && data.data.length > 0) {
      console.log("First:", data.data[0].startTime);
    } else {
      console.log("No data or not array");
    }
  }
}
run();
