async function run() {
  const url = 'https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR?publishDateTimeFrom=2023-12-30&publishDateTimeTo=2024-01-08';
  const res = await fetch(url);
  console.log("Status:", res.status);
  if(!res.ok) {
    const text = await res.text();
    console.log(text);
  } else {
    const json = await res.json();
    console.log("Success. Keys:", Object.keys(json));
  }
}
run();
