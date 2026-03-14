export const Controls = ({
  startTime,
  endTime,
  horizon,
  onStartChange,
  onEndChange,
  onHorizonChange
}: any) => {
  const startObj = new Date(startTime)
  const endObj = new Date(endTime)
  // january 2024 only per spec
  const isErr = startObj >= endObj || startObj.getFullYear() !== 2024 || startObj.getMonth() !== 0 || endObj.getFullYear() !== 2024 || endObj.getMonth() !== 0

  return (
    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mt-6">
      <div className="flex items-center gap-2">
        <input 
          type="datetime-local" 
          value={startTime}
          onChange={e => onStartChange(e.target.value)}
          className="border border-[#e5e5e4] dark:border-[#2e2e2c] rounded px-3 py-1.5 text-sm bg-white dark:bg-[#1c1c1b] focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
        <span className="muted">to</span>
        <input 
          type="datetime-local" 
          value={endTime}
          onChange={e => onEndChange(e.target.value)}
          className="border border-[#e5e5e4] dark:border-[#2e2e2c] rounded px-3 py-1.5 text-sm bg-white dark:bg-[#1c1c1b] focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
      </div>
      
      <div className="flex items-center gap-3 md:ml-6 w-full md:w-auto">
        <input 
          type="range" 
          min="0" 
          max="48" 
          value={horizon}
          onChange={e => onHorizonChange(Number(e.target.value))}
          className="w-32 md:w-48 accent-blue-600"
        />
        <span className="text-sm">Forecast horizon: {horizon} hrs</span>
      </div>

      {isErr && (
        <span className="text-red-500 text-sm mt-1 md:mt-0 md:ml-4">
          Range must be valid and within Jan 2024
        </span>
      )}
    </div>
  )
}
