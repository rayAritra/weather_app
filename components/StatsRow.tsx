export const StatsRow = ({ data }: { data: any[] }) => {
  const withForecast = data.filter(d => d.actual !== null && d.actual !== undefined && d.forecast !== null && d.forecast !== undefined)
  
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
    <div className="flex flex-row gap-6 mt-4">
      <div>
        <span className="text-xs text-muted uppercase tracking-wide">MAE</span>
        <span className="text-sm font-medium ml-1">{formatVal(mae)} MW</span>
      </div>
      <div>
        <span className="text-xs text-muted uppercase tracking-wide">RMSE</span>
        <span className="text-sm font-medium ml-1">{formatVal(rmse)} MW</span>
      </div>
      <div>
        <span className="text-xs text-muted uppercase tracking-wide">Bias</span>
        <span className="text-sm font-medium ml-1">{bias > 0 ? '+' : ''}{formatVal(bias)} MW</span>
      </div>
      <div>
        <span className="text-xs text-muted uppercase tracking-wide">Coverage</span>
        <span className="text-sm font-medium ml-1">{coverage}%</span>
      </div>
    </div>
  )
}
