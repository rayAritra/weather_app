# UK Wind Power Forecast Monitor

A production-ready monitoring dashboard comparing actual wind power generation against forecasted generation in the UK.

Built with AI assistance (Claude).

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI (react-slider), lucide-react
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Platform/Hosting**: Vercel

## Requirements

- Node.js 18.17 or later

## How to run locally

1. Open a terminal and navigate to the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How to deploy to Vercel

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click "Add New" -> "Project".
3. Import your repository.
4. Vercel will auto-detect Next.js and apply the correct build settings.
5. Click "Deploy".
*Note: No environment variables are required as all APIs are public.*

## File structure

```text
wind-forecast-monitor/
├── app/
│   ├── page.tsx               # Main dashboard component
│   ├── layout.tsx             # Root layout and metadata
│   ├── globals.css            # Global Tailwind CSS styles
│   └── api/
│       ├── actuals/route.ts   # Proxy endpoint for Elexon Actual Generaton API
│       └── forecasts/route.ts # Proxy endpoint for Elexon Forecast Generation API
├── components/
│   ├── DateRangePicker.tsx    # Date start/end input
│   ├── HorizonSlider.tsx      # Radix UI Slider for horizon hours
│   ├── GenerationChart.tsx    # Recharts Line Chart for plotting Actual/Forecasts
│   └── StatsBar.tsx           # Stat cards summarizing predictions (MAE, RMSE, Bias, etc)
├── lib/
│   ├── fetchActuals.ts        # Client API request hook for Actuals
│   ├── fetchForecasts.ts      # Client API request hook for Forecasts
│   └── filterForecasts.ts     # Core filtering logic to pick latest forecasts given a cutoff
├── types/
│   └── index.ts               # Core TS Interfaces
```
