"use client";

import React from 'react';
import * as Slider from '@radix-ui/react-slider';

interface HorizonSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function HorizonSlider({ value, onChange }: HorizonSliderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Forecast Horizon
        </label>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {value} {value === 1 ? 'hour' : 'hours'}
        </span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        max={48}
        min={0}
        step={1}
        onValueChange={(vals) => onChange(vals[0])}
      >
        <Slider.Track className="bg-gray-200 dark:bg-gray-800 relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-black/10 rounded-[10px] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Volume"
        />
      </Slider.Root>
    </div>
  );
}
