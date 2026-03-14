import type { ChartDataPoint } from '../types'

export const StatsRow = ({ data }: { data: ChartDataPoint[] }) => {
  const withForecast = data.filter(
    (d): d is ChartDataPoint & { actual: number; forecast: number } => 
      d.actual !== null && d.actual !== undefined && d.forecast !== null && d.forecast !== undefined
  )
  
  let mae = 0
  let rmse = 0
  let bias = 0
  let coverage = 0

  if (data.length > 0) {
    coverage = Math.round((withForecast.length / data.length) * 100)
    
    if (withForecast.length > 0) {
      const sumAbs = withForecast.reduce((acc, d) => acc + Math.abs(d.forecast - d.actual), 0)
      const sumSq = withForecast.reduce((acc, d) => acc + Math.pow(d.forecast - d.actual, 2), 0)
      const sumBias = withForecast.reduce((acc, d) => acc + (d.forecast - d.actual), 0)

      mae = Math.round(sumAbs / withForecast.length)
      rmse = Math.round(Math.sqrt(sumSq / withForecast.length))
      bias = Math.round(sumBias / withForecast.length)
    }
  }

  const formatVal = (v: number) => new Intl.NumberFormat('en-GB').format(v)

  return (
    <div className="flex flex-wrap gap-8 md:gap-12 mt-8 mb-6 border-y border-[#e5e5e4] dark:border-[#2e2e2c] py-4">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-[#8a8a85] uppercase tracking-widest font-medium">MAE</span>
        <span className="text-lg font-medium tracking-tight text-[#1a1a18] dark:text-[#eeeeec]">
          {formatVal(mae)} <span className="text-xs text-[#8a8a85] font-normal ml-0.5">MW</span>
        </span>
      </div>
      <div className="w-[1px] bg-[#e5e5e4] dark:bg-[#2e2e2c] hidden md:block" />
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-[#8a8a85] uppercase tracking-widest font-medium">RMSE</span>
        <span className="text-lg font-medium tracking-tight text-[#1a1a18] dark:text-[#eeeeec]">
          {formatVal(rmse)} <span className="text-xs text-[#8a8a85] font-normal ml-0.5">MW</span>
        </span>
      </div>
      <div className="w-[1px] bg-[#e5e5e4] dark:bg-[#2e2e2c] hidden md:block" />
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-[#8a8a85] uppercase tracking-widest font-medium">Bias</span>
        <span className="text-lg font-medium tracking-tight text-[#1a1a18] dark:text-[#eeeeec]">
          {bias > 0 ? '+' : ''}{formatVal(bias)} <span className="text-xs text-[#8a8a85] font-normal ml-0.5">MW</span>
        </span>
      </div>
      <div className="w-[1px] bg-[#e5e5e4] dark:bg-[#2e2e2c] hidden md:block" />
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-[#8a8a85] uppercase tracking-widest font-medium">Coverage</span>
        <span className="text-lg font-medium tracking-tight text-[#1a1a18] dark:text-[#eeeeec]">
          {coverage}<span className="text-xs text-[#8a8a85] font-normal ml-0.5">%</span>
        </span>
      </div>
    </div>
  )
}
