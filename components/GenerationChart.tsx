"use client";

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ChartDataPoint } from '../types';

interface GenerationChartProps {
  data: ChartDataPoint[];
  loading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const actual = payload.find((p: any) => p.dataKey === 'actual')?.value;
    const forecast = payload.find((p: any) => p.dataKey === 'forecast')?.value;
    
    let errorStr = 'N/A';
    if (actual !== undefined && actual !== null && forecast !== undefined && forecast !== null) {
      errorStr = (actual - forecast).toFixed(2) + ' MW';
    }

    return (
      <div className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl min-w-[200px]">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">{label}</p>
        <div className="space-y-2">
          {actual !== undefined && actual !== null && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Actual:
              </span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{actual} MW</span>
            </div>
          )}
          {forecast !== undefined && forecast !== null && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Forecast:
              </span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{forecast} MW</span>
            </div>
          )}
        </div>
        {errorStr !== 'N/A' && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Error (Act - Fcst):</span>
              <span className="font-semibold px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-900 dark:text-gray-100">{errorStr}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function GenerationChart({ data, loading }: GenerationChartProps) {
  if (loading) {
    return (
      <div className="w-full h-[450px] flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/20 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="animate-pulse flex flex-col items-center w-full max-w-2xl px-8">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-8"></div>
          <div className="w-full space-y-4">
            <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
            <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded w-5/6 mx-auto"></div>
            <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded w-4/6 mx-auto"></div>
            <div className="h-24 bg-gray-100 dark:bg-gray-800/50 rounded-lg w-full mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[450px] flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/20 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="text-center px-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium font-medium text-lg mb-1">No data available</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 max-w-sm mx-auto">Try selecting a different time range or adjusting the forecast parameters to see generation data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm relative group overflow-hidden">
      {/* Decorative gradient background similar to modern designs */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-green-50/20 dark:from-blue-900/5 dark:to-green-900/5 pointer-events-none" />
      
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Generation Profile</h3>
        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded">MW</span>
      </div>

      <div className="w-full h-full pt-10 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="4 4" opacity={0.3} vertical={false} stroke="#9ca3af" />
            <XAxis 
              dataKey="time" 
              angle={-45} 
              textAnchor="end"
              height={60}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={40}
              dy={10}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              domain={['auto', 'auto']}
              width={50}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Legend 
              verticalAlign="top" 
              height={40} 
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingTop: '4px' }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Generation"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
              connectNulls={false}
              animationDuration={1500}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Forecast Generation"
              stroke="#22C55E"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#22C55E', stroke: '#fff', strokeWidth: 2 }}
              connectNulls={false}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
