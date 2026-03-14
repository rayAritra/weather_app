'use client'

import { useState, useEffect } from 'react'
import { GenerationChart } from '../components/GenerationChart'
import { Controls } from '../components/Controls'
import { StatsRow } from '../components/StatsRow'
import { fetchActuals } from '../lib/fetchActuals'
import { fetchForecasts } from '../lib/fetchForecasts'
import { filterForecastsByHorizon } from '../lib/filterForecasts'
import type { ActualGeneration, ForecastGeneration } from '../types'

export default function WindPage() {
  const [start, setStart] = useState('2024-01-01T00:00')
  const [end, setEnd] = useState('2024-01-07T23:30')
  const [horizon, setHorizon] = useState(4)
  const [debouncedHorizon, setDebouncedHorizon] = useState(4)
  
  const [actuals, setActuals] = useState<ActualGeneration[]>([])
  const [forecasts, setForecasts] = useState<ForecastGeneration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedHorizon(horizon), 300)
    return () => clearTimeout(t)
  }, [horizon])

  useEffect(() => {
    const fetchData = async () => {
      if (!start.startsWith('2024-01') || !end.startsWith('2024-01') || start >= end) {
        return
      }

      setLoading(true)
      setError('')
      
      try {
        const tStart = new Date(start + ':00Z').toISOString()
        const tEnd = new Date(end + ':00Z').toISOString()
        
        const [act, fcast] = await Promise.all([
          fetchActuals(tStart, tEnd),
          fetchForecasts(tStart, tEnd)
        ])
        
        setActuals(act)
        setForecasts(fcast)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [start, end])

  const chartData = filterForecastsByHorizon(actuals, forecasts, debouncedHorizon)

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <header>
        <h1 className="text-lg font-medium">Wind Generation — UK</h1>
        <p className="muted mt-1">Forecast accuracy monitor · January 2024</p>
      </header>

      <Controls 
        startTime={start} 
        endTime={end} 
        horizon={horizon} 
        onStartChange={setStart} 
        onEndChange={setEnd} 
        onHorizonChange={setHorizon} 
      />

      <StatsRow data={chartData} />

      <div className="mt-6">
        {loading && <p className="muted mb-4">Fetching data...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <GenerationChart data={chartData} />
      </div>

      <footer className="mt-8">
        <p className="text-xs text-muted">Data: Elexon BMRS API · Built for reint.ai hiring challenge</p>
      </footer>
    </main>
  )
}
