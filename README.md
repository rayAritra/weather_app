# Wind Power Forecast Monitor

**Live App:** [https://weather-app-mocha-chi-69.vercel.app/](https://weather-app-mocha-chi-69.vercel.app/)

A minimalist React dashboard for analyzing the accuracy of UK wind generation forecasts against actual metered output. Built to process data from the Elexon BMRS API.

The project evaluates how forecast horizons (time between forecast publication and the target window) impact accuracy using standard statistical metrics.

## Architecture

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (custom minimalist design system)
- **Visualization:** Recharts
- **Data Source:** Elexon BMRS (WINDFOR and FUELHH streams)

## Directory Structure

```text
.
├── app
│   ├── api
│   │   ├── actuals/        # Next.js GET proxy handling FUELHH datasets
│   │   └── forecasts/      # Next.js GET proxy handling WINDFOR datasets
│   ├── globals.css         # Minimalist standard layout & Tailwind directives
│   ├── layout.tsx          # System-native layout renderer
│   └── page.tsx            # Dashboard orchestration & debounced hooks
├── components
│   ├── Controls.tsx        # Boundless input range & horizon UI forms
│   ├── GenerationChart.tsx # Restyled headless Recharts component 
│   └── StatsRow.tsx        # Local data intersection calculations
├── lib
│   ├── fetchActuals.ts     # Client typed fetcher 
│   ├── fetchForecasts.ts   # Client typed fetcher
│   ├── fetchWithRetry.ts   # Exponential backoff handler
│   └── filterForecasts.ts  # Horizon constraint matching engine
└── types
    └── index.ts            # Shared TS interfaces
```

## Data Pipeline

The Elexon API presents specific challenges regarding historical data extraction and parameter strictness. To ensure a resilient pipeline, all browser requests are proxied through local Next.js API routes (`/api/actuals` and `/api/forecasts`), which handle:

1. **Date Chunking:** Elexon enforces maximum query windows (e.g., 7 days for REST WINDFOR). The backend intercepts requested date ranges and automatically chunks them into 24-hour fragments.
2. **Endpoint Normalization:** 
   - Forecasts are fetched using `WINDFOR/stream` with `publishDateTimeFrom` parameters, going backwards 48 hours to guarantee horizon availability for the start of the window.
   - Actuals are fetched via `FUELHH/stream` utilizing strict `settlementDateFrom` parameters (bypassing the stream's bugged `startTime` ISO parser).
3. **Resiliency:** A custom exponential backoff utility handles occasional 5xx server closures from BMRS without crashing the client state.

## Core Logic

The application matches 30-minute actual physical generation periods with the best available hourly horizon forecast.

Inside `lib/filterForecasts.ts`, the matching mechanism:
- Groups the raw `WINDFOR` dataset by target time.
- Implements an hour-floor fallback mechanism out of necessity (actuals generate at hh:00 and hh:30, whereas forecasts often only publish for hh:00 target times).
- Reversely filters the array to identify the latest forecasted output published *before* the strict `< target time - computed horizon >` cutoff.

Statistical functions (MAE, RMSE, Bias, Coverage Percentage) run entirely in-browser purely based on successful paired tuples.

## Reliability Analysis (P10)

How much wind can grid operators reliably count on? By sorting the historical `FUELHH` sequence in January 2024 to identify the **P10 value** (the generation threshold exceeded 90% of the time, effectively the reliable baseline yield), the dataset evaluates to **5,542 MW**. 

That is the conservative but defensible minimum recommendation to factor into spinning reserve requirements.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to view the application metrics.
