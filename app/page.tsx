"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { DateRangePicker } from '@/components/DateRangePicker';
import { HorizonSlider } from '@/components/HorizonSlider';
import { StatsBar } from '@/components/StatsBar';
import { GenerationChart } from '@/components/GenerationChart';
import { fetchActuals } from '@/lib/fetchActuals';
import { fetchForecasts } from '@/lib/fetchForecasts';
import { filterForecastsByHorizon } from '@/lib/filterForecasts';
import { ActualGeneration, ForecastGeneration, ChartDataPoint } from '@/types';
import { Wind } from 'lucide-react';

export default function Home() {
  const [startTime, setStartTime] = useState('2024-01-01T00:00:00.000Z');
  const [endTime, setEndTime] = useState('2024-01-07T23:30:00.000Z');
  const [horizonHours, setHorizonHours] = useState(4);
  const [debouncedHorizon, setDebouncedHorizon] = useState(4);
  
  const [actuals, setActuals] = useState<ActualGeneration[]>([]);
  const [forecasts, setForecasts] = useState<ForecastGeneration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedHorizon(horizonHours);
    }, 300);
    return () => clearTimeout(handler);
  }, [horizonHours]);

  const loadData = async (start: string, end: string) => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedActuals, fetchedForecasts] = await Promise.all([
        fetchActuals(start, end),
        fetchForecasts(start, end)
      ]);
      setActuals(fetchedActuals);
      setForecasts(fetchedForecasts);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(startTime, endTime);
  }, [startTime, endTime]);

  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!actuals.length) return [];
    return filterForecastsByHorizon(actuals, forecasts, debouncedHorizon);
  }, [actuals, forecasts, debouncedHorizon]);

  const handleDateChange = (start: string, end: string) => {
    const utcStart = start.includes('Z') ? start : `${start}:00.000Z`;
    const utcEnd = end.includes('Z') ? end : `${end}:00.000Z`;
    setStartTime(utcStart);
    setEndTime(utcEnd);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-gray-100 p-4 md:p-8 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
          <Wind className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            UK Wind Power Forecast Monitor
          </h1>
        </header>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Time Range
            </h2>
            <DateRangePicker 
              start={startTime} 
              end={endTime} 
              onChange={handleDateChange} 
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Forecast Parameters
            </h2>
            <HorizonSlider 
              value={horizonHours} 
              onChange={setHorizonHours} 
            />
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-500 max-w-sm leading-relaxed">
              Adjusting the horizon determines how far ahead the forecast was generated relative to the target time.
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg border border-red-200 dark:border-red-900/30 font-medium">
            {error}
          </div>
        )}

        {/* Stats */}
        <section>
          <StatsBar data={chartData} />
        </section>

        {/* Chart */}
        <section className="pt-2">
          <GenerationChart data={chartData} loading={loading} />
        </section>

      </div>
    </main>
  );
}
