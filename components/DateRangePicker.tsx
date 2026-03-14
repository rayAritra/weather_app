"use client";

import React, { useState, useEffect } from 'react';

interface DateRangePickerProps {
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
}

export function DateRangePicker({ start, end, onChange }: DateRangePickerProps) {
  const [localStart, setLocalStart] = useState(start);
  const [localEnd, setLocalEnd] = useState(end);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalStart(start);
    setLocalEnd(end);
  }, [start, end]);

  const validateAndChange = (newStart: string, newEnd: string) => {
    const startDate = new Date(newStart);
    const endDate = new Date(newEnd);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError('Invalid date format');
      return;
    }

    if (endDate <= startDate) {
      setError('End date must be after start date');
      return;
    }

    // Must be in Jan 2024
    if (
      startDate.getUTCFullYear() !== 2024 ||
      startDate.getUTCMonth() !== 0 ||
      endDate.getUTCFullYear() !== 2024 ||
      endDate.getUTCMonth() !== 0
    ) {
      setError('Dates must be within January 2024');
      return;
    }

    setError(null);
    onChange(newStart, newEnd);
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setLocalStart(newStart);
    validateAndChange(newStart, localEnd);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    setLocalEnd(newEnd);
    validateAndChange(localStart, newEnd);
  };

  const formatForInput = (isoStr: string) => isoStr.substring(0, 16);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-1 w-full relative">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Start Time (UTC)
          </label>
          <input
            type="datetime-local"
            value={formatForInput(localStart)}
            onChange={handleStartChange}
            min="2024-01-01T00:00"
            max="2024-01-31T23:59"
            className="px-3 py-2 border rounded-md text-sm border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1 w-full relative">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            End Time (UTC)
          </label>
          <input
            type="datetime-local"
            value={formatForInput(localEnd)}
            onChange={handleEndChange}
            min="2024-01-01T00:00"
            max="2024-01-31T23:59"
            className="px-3 py-2 border rounded-md text-sm border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}
