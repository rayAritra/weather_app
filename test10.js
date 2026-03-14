

// Copy logic from filterForecastsByHorizon
function filterForecastsByHorizon(actuals, forecasts, horizonHours) {
  const forecastsByTargetTime = new Map();
  for (const f of forecasts) {
    const timeMs = new Date(f.startTime).getTime();
    if (!forecastsByTargetTime.has(timeMs)) {
      forecastsByTargetTime.set(timeMs, []);
    }
    forecastsByTargetTime.get(timeMs).push(f);
  }

  return actuals.map(actual => {
    const targetTimeMs = new Date(actual.startTime).getTime();
    const cutoffMs = targetTimeMs - horizonHours * 60 * 60 * 1000;
    
    let relevantForecasts = forecastsByTargetTime.get(targetTimeMs);
    
    if (!relevantForecasts || relevantForecasts.length === 0) {
      const hourStartMs = targetTimeMs - (targetTimeMs % (60 * 60 * 1000));
      if (hourStartMs !== targetTimeMs) {
        relevantForecasts = forecastsByTargetTime.get(hourStartMs);
      }
    }
    
    if (!relevantForecasts) {
      relevantForecasts = [];
    }
    
    let bestForecast = null;
    let maxPublishTime = -Infinity;
    
    for (const f of relevantForecasts) {
      const pubTimeMs = new Date(f.publishTime).getTime();
      if (pubTimeMs <= cutoffMs) {
        if (pubTimeMs > maxPublishTime) {
          maxPublishTime = pubTimeMs;
          bestForecast = f;
        }
      }
    }
    
    return {
      time: actual.startTime,
      actual: actual.generation,
      forecast: bestForecast ? bestForecast.generation : null,
      forecastsCount: relevantForecasts.length
    };
  });
}

async function run() {
  const urlAct = 'http://localhost:3000/api/actuals?startTime=2024-01-01T00:00:00.000Z&endTime=2024-01-07T23:30:00.000Z';
  const urlFor = 'http://localhost:3000/api/forecasts?startTime=2024-01-01T00:00:00.000Z&endTime=2024-01-07T23:30:00.000Z';
  
  const [resAct, resFor] = await Promise.all([fetch(urlAct), fetch(urlFor)]);
  const actuals = await resAct.json();
  const forecasts = await resFor.json();
  
  console.log("Actuals len:", actuals.length);
  console.log("Forecasts len:", forecasts.length);
  
  if (actuals.length > 0 && forecasts.length > 0) {
    const chartData = filterForecastsByHorizon(actuals, forecasts, 4);
    const nonNulls = chartData.filter(d => d.forecast !== null);
    console.log("ChartData len:", chartData.length);
    console.log("NonNull Forecasts:", nonNulls.length);
    if(nonNulls.length === 0 && chartData.length > 0) {
      console.log("Sample chart data:", chartData[0]);
    }
  }
}
run();
