import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import type { ChartDataPoint } from '../types'

interface TooltipProps {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
  label?: string;
}

const ChartTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-[#1c1c1b] border border-[#e5e5e4] dark:border-[#2e2e2c] p-3 text-sm rounded shadow-sm">
      <p className="font-medium text-[#8a8a85] text-xs mb-2 tracking-wide uppercase">{label}</p>
      <div className="flex flex-col gap-1.5">
        {payload.map((entry, i: number) => (
          <div key={i} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[#1a1a18] dark:text-[#eeeeec] font-medium">{entry.name}</span>
            </div>
            <span className="tabular-nums font-medium">{entry.value} MW</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const GenerationChart = ({ data }: { data: ChartDataPoint[] }) => {
  // not great but Recharts needs this wrapper
  return (
    <div className="w-full h-[320px] md:h-[400px] border border-[#e5e5e4] dark:border-[#2e2e2c] rounded-md shadow-sm p-4 md:p-6 bg-white dark:bg-[#1c1c1b] transition-shadow duration-300 hover:shadow-md">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e4" vertical={false} />
          <XAxis 
            dataKey="time" 
            height={60}
            tick={{ fontSize: 11, fill: '#8a8a85' }}
            tickMargin={15}
            angle={-35}
            textAnchor="end"
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#8a8a85' }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'MW', position: 'top', offset: 10, fill: '#8a8a85', fontSize: 11 }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#e5e5e4', strokeWidth: 1 }} />
          <Legend 
            wrapperStyle={{ fontSize: '12px', color: '#8a8a85', paddingTop: '10px' }}
            iconType="circle"
            iconSize={8}
            verticalAlign="bottom"
            align="left"
          />
          <Line 
            name="Actual generation"
            type="monotone" 
            dataKey="actual" 
            stroke="#2563eb" 
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
            isAnimationActive={true}
          />
          <Line 
            name="Forecast (≥4h horizon)"
            type="monotone" 
            dataKey="forecast" 
            stroke="#16a34a" 
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
            connectNulls={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
