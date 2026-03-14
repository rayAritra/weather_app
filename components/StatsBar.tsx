"use client";

import React, { useMemo } from 'react';
import { ChartDataPoint } from '../types';

interface StatsBarProps {
  data: ChartDataPoint[];
}

export function StatsBar({ data }: StatsBarProps) {
  const stats = useMemo(() => {
    let maeSum = 0;
    let rmseSumSquare = 0;
    let biasSum = 0;
    let countWithForecast = 0;
    
    for (const point of data) {
      if (point.actual !== null && point.forecast !== null) {
        const error = point.actual - point.forecast;
        maeSum += Math.abs(error);
        rmseSumSquare += error * error;
        biasSum += error;
        countWithForecast++;
      }
    }

    const totalActuals = data.filter(d => d.actual !== null).length;
    const coverage = totalActuals === 0 ? 0 : (countWithForecast / totalActuals) * 100;
    const baseCount = countWithForecast === 0 ? 1 : countWithForecast; // Prevent div by 0

    return {
      mae: (maeSum / baseCount).toFixed(2),
      rmse: Math.sqrt(rmseSumSquare / baseCount).toFixed(2),
      bias: (biasSum / baseCount).toFixed(2),
      coverage: coverage.toFixed(1)
    };

  }, [data]);

  const cards = [
    { label: 'MAE', value: `${stats.mae} MW` },
    { label: 'RMSE', value: `${stats.rmse} MW` },
    { label: 'Bias', value: `${stats.bias} MW` },
    { label: 'Coverage', value: `${stats.coverage}%` }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 flex flex-col justify-center shadow-sm">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
