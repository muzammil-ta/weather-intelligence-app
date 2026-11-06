# Aether Weather Intelligence

A high-performance, client-side weather analytics and daily planning intelligence application built with **React 19**, **Vite**, **Tailwind CSS v4**, and the open-access **Open-Meteo APIs**.

![Application Type](https://img.shields.io/badge/Architecture-100%25%20Client--Side-brightgreen)
![Framework](https://img.shields.io/badge/Framework-React%2019%20%2B%20Vite-blue)
![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8)
![API](https://img.shields.io/badge/Weather%20Data-Open--Meteo-orange)

---

## Highlights & Features

### 1. City Search & Dynamic Geocoding
- **Open-Meteo Geocoding Integration**: Resolves geographic coordinates, state/province, country, and elevation dynamically via `https://geocoding-api.open-meteo.com/v1/search`.
- **Graceful Error Handling**: Detects non-existent cities, typos, or empty results and provides inline dismissible feedback without crashing.
- **Quick-Access Presets**: 1-click presets for global hubs (Tokyo, London, New York, Paris, Sydney, Dubai).
- **Recent Search History**: Saves recent city queries to `localStorage` for rapid switching.
- **HTML5 Geolocation**: "My Location" button retrieves local device GPS coordinates and fetches real-time atmospheric conditions.

### 2. High-Fidelity Current Conditions
- **Real-Time Atmospheric Metrics**:
  - Ambient Temperature and Apparent ("Feels-Like") Temperature.
  - Relative Humidity (%) and air moisture comfort ratings.
  - 10-meter Wind Velocity with aerodynamic Beaufort-style wind classifications.
  - Comprehensive WMO Weather Code resolution with animated condition icons.
  - Geographic coordinates, elevation, observation timezone, and daily high/low temperatures.

### 3. Rule-Based Planning Recommendations & Advisories
Transparent, real-world meteorological decision intelligence:
- **Umbrella Alert**: Triggered whenever daily precipitation probability exceeds 40% (with differentiated moderate vs. essential storm alerts).
- **UV / Extreme Heat Warning**: Flags temperatures exceeding 30°C and 35°C with actionable hydration and sun exposure safety tips.
- **Cold Weather / Freeze Advisory**: Warns of near-freezing or sub-zero temperatures and wind-chill hazards.
- **Wind Drag Advisory**: Alerts users to sustained winds above 25 km/h and 40 km/h.
- **Outdoor Readiness Index (0–100 Score)**:
  - Transparent formula factoring in rain penalty, thermal comfort windows (16°C–24°C ideal), wind drag, and severe WMO weather codes.
  - Segmented activity suitability ratings (**Excellent**, **Good**, **Fair**, **Poor**) for:
    - Running & Jogging
    - Cycling & Commuting
    - Park & Outdoor Dining
    - Line Laundry Drying

### 4. 7-Day Synoptic Forecast (Dual Mode)
- **Cards Grid View**: Day-by-day micro-cards with min/max temperatures, rain probability bars, and weekly temperature range spectrum bars.
- **Tabular Data View**: High-density table featuring `tabular-nums` formatting for precision comparison across the full 7-day outlook.

### 5. Architectural & Design Discipline
- **Zero API Key Requirement**: Runs 100% in the user's browser against Open-Meteo's open-access meteorological APIs.
- **Dual Visual Themes**: Clean Dark Mode and Light Mode with persistent preference storage and seamless Tailwind CSS v4 styling.
- **Unit Conversions**: Instant toggle between Metric (°C, km/h) and Imperial (°F, mph).
- **Anti-Slop Design**: Follows strict design guidelines—no static pill-badge clutter, no fake telemetry gimmicks, high WCAG AA legibility, and responsive 1440px-optimized layouts.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Bundler & Dev Server** | [Vite 8](https://vitejs.dev/) |
| **Styling & Theme** | [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite` |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Language** | [TypeScript 5+](https://www.typescriptlang.org/) |
| **Weather & Geocoding APIs** | [Open-Meteo](https://open-meteo.com/) (Free, non-commercial/fair-use, no API keys needed) |

---

## Project Structure

```
├── public/
│   └── _redirects              # Cloudflare Pages SPA rewrite rule
├── src/
│   ├── components/
│   │   ├── AtmosphericDetails.tsx    # Dew point, moisture, and kinetic wind data
│   │   ├── CurrentWeatherCard.tsx    # Primary observation card
│   │   ├── ForecastSection.tsx       # 7-day outlook (cards + table view)
│   │   ├── Header.tsx                # 3-zone header (brand, nav, theme/unit switches)
│   │   ├── RecommendationsCard.tsx   # Rule-based advisories and outdoor activity matrix
│   │   ├── SearchBar.tsx             # City search, presets, location button & error state
│   │   └── WeatherIcon.tsx           # WMO-to-Lucide animated icon mapper
│   ├── services/
│   │   └── openMeteo.ts              # Geocoding & Forecast API client
│   ├── types/
│   │   └── weather.ts                # TypeScript interfaces for API & rule engine
│   ├── utils/
│   │   ├── recommendations.ts        # Algorithmic scoring and recommendation rules
│   │   └── weatherCodes.ts           # WMO code definitions and unit formatters
│   ├── App.tsx                       # Master application component & state management
│   ├── index.css                     # Tailwind v4 imports, dark variant, typography
│   └── main.tsx                      # React root entry point
├── Cloudflare_Deployment_Notes.md    # Dedicated guide for deploying to Cloudflare Pages
├── index.html                        # HTML5 shell with font preconnects
├── package.json                      # Dependencies and scripts (clean of esbuild conflicts)
├── tsconfig.json                     # TypeScript configuration
└── vite.config.ts                    # Vite configuration with Tailwind CSS plugin
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or v20.0.0+ recommended
- **npm** or **bun** / **pnpm**

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd react-example
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

4. Run linting / type-checking:
   ```bash
   npm run lint
   ```

5. Build for production:
   ```bash
   npm run build
   ```
   The production-ready static assets will be output to the `dist/` folder.

6. Preview the production build locally:
   ```bash
   npm run preview
   ```

---

## API Endpoints Used

All weather data is fetched client-side directly from Open-Meteo:

1. **Geocoding API**:
   ```
   https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json
   ```
2. **Forecast API**:
   ```
   https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto
   ```

---

## Deployment

This is a pure static single-page application (SPA). It can be deployed to any static host:
- **Cloudflare Pages**: See detailed instructions and troubleshooting in [`Cloudflare_Deployment_Notes.md`](./Cloudflare_Deployment_Notes.md).
- **Vercel**: Import repository; build command `npm run build`, output directory `dist`.
- **Netlify**: Import repository; build command `npm run build`, publish directory `dist`.
- **GitHub Pages**: Deploy contents of `dist/` via GitHub Actions.

---

## License

Apache-2.0
