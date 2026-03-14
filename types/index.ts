export interface ActualGeneration {
  startTime: string;   // ISO datetime
  generation: number;  // MW
}

export interface ForecastGeneration {
  startTime: string;   // target time ISO datetime
  publishTime: string; // when forecast was created ISO datetime
  generation: number;  // MW
}

export interface ChartDataPoint {
  time: string;          // formatted label
  actual: number | null;
  forecast: number | null;
}
