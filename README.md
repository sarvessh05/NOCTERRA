# NOCTERRA - Air Quality Visualization Platform

![NOCTERRA Banner](https://img.shields.io/badge/NOCTERRA-Air%20Quality%20Visualization-4dd0e1?style=for-the-badge)

**NOCTERRA** (Nocturnal Observation & Climate Tracking for Environmental Real-time Research & Analysis) is an interactive 3D globe visualization platform that displays real-time air quality data for cities worldwide. Experience the Earth's atmosphere like never before with stunning cinematic visuals, daily city rotation, and predictive analytics.

## 🌐 Live Demo

View Live Project _https://nocterra.vercel.app/_

## ✨ Features

### 🌍 Interactive 3D Globe

- **Cinematic rendering** with emissive night lights and atmospheric glow
- **Real-time rotation** with smooth user interaction (drag to spin)
- **ACES Filmic tone mapping** for premium visual quality
- **High-resolution sphere** (128x128 segments) for smooth rendering

### 🏙️ Smart City System

- **60+ Famous Cities** across 6 continents
- **Daily Rotation**: 10 cities per continent change every 24 hours
- **Permanent Cities**: Nashik always visible (your home city!)
- **Real-time AQI Updates**: Pin colors change every 30 seconds based on live data
- **Color-coded markers** showing pollution levels

### 🤖 AI-Powered Features

- **AI Insights** ⚡: Get personalized explanations powered by Google Gemini AI
  - "Explain Today's Air" button for instant AI analysis
  - Health recommendations and outdoor activity advice
  - AI confidence scores for transparency
- **72-Hour AI Forecast** ⚡: Advanced predictions with confidence metrics
  - Hourly AQI predictions for the next 3 days
  - Visual trend indicators with animated arrows
  - AI confidence percentage display

### 📊 Advanced Analytics

- **City Comparison Mode** ⚡: Side-by-side city analysis
  - Split-screen visualization
  - Animated comparison bars
  - Percentage difference calculations
  - Winner badge for better air quality
- **7-Day Forecasting**: View predicted air quality trends
- **Future Mode**: Simulate projected AQI increases
- **Pollution Simulation**: Adjust intensity to visualize scenarios
- **AI-Powered Health Impact**: Dynamic health analysis per city
  - Respiratory risk assessment
  - Visibility index
  - Outdoor activity recommendations
  - City-specific AI insights

### 🎨 User Experience

- **Scroll-aware UI**: Globe controls fade when scrolling to Health Impact section
- **Health Impact Cards**: Understand respiratory health effects
- **City Search**: Quickly find specific cities
- **Smooth Animations**: Fluid transitions with Framer Motion
- **Responsive Design**: Works on desktop and mobile

## 🚀 Tech Stack

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Three.js** - 3D graphics rendering with cinematic effects
- **React Three Fiber** - React renderer for Three.js
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **Recharts** - Data visualization
- **Google Gemini AI** - AI-powered insights and forecasting
- **OpenAQ API** - Real-time air quality data

## 🌟 What's New

### Latest Updates (v2.0)

**Cinematic Globe Rendering**

- Emissive night lights with custom glow effect
- ACES Filmic tone mapping for cinema-grade visuals
- Atmospheric rim with additive blending
- Smooth rotation and user interaction

**Smart City System**

- 60+ famous cities across all continents
- Daily rotation: 10 cities per continent change every 24 hours
- Nashik permanently visible (never rotates out)
- Real-time AQI updates every 30 seconds with dynamic pin colors

**Enhanced UX**

- Scroll-aware UI that fades when viewing Health Impact section
- Improved globe interaction (drag to spin)
- Better performance with optimized rendering

See [DAILY_CITY_ROTATION.md](./DAILY_CITY_ROTATION.md) and [GLOBE_UPGRADE.md](./GLOBE_UPGRADE.md) for technical details.

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Setup

```bash
# Clone the repository
git clone https://github.com/sarvessh05/NOCTERRA.git

# Navigate to project directory
cd NOCTERRA

# Install dependencies
npm install

# Create .env file with your API keys
cp .env.example .env
# Edit .env and add your API keys:
# VITE_GEMINI_API_KEY=your_gemini_api_key
# VITE_OPENAQ_API_KEY=your_openaq_api_key

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### API Keys

To use the AI features, you'll need:

1. **Google Gemini API Key**: Get it from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **OpenAQ API Key**: Get it from [OpenAQ Platform](https://openaq.org/)

Add these to your `.env` file (see `.env.example` for template).

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🎮 Usage

1. **Landing Page**: Click "Enter Live Atmosphere" to begin
2. **Explore Cities**: Click on any glowing city marker on the globe
   - Drag to spin the globe manually
   - Zoom in/out with mouse wheel
   - 61 cities visible (1 permanent + 60 rotating daily)
3. **View Details**: See AQI levels, trends, and 7-day forecasts
4. **AI Insights** ⚡: Click the sparkle icon to get AI-powered explanations
   - Why is the AQI at this level?
   - What outdoor activities are safe?
   - What to expect in the next 24-48 hours
5. **72-Hour Forecast** ⚡: View detailed hourly predictions with confidence scores
6. **Compare Cities** ⚡: Click the comparison icon to analyze two cities side-by-side
7. **Future Mode**: Toggle to see projected pollution increases
8. **Simulation**: Use the bottom-left controls to simulate pollution scenarios
9. **Search**: Use the search icon to find specific cities
10. **Scroll Down**: View health impact information (globe UI fades automatically)

### City Rotation System

- **10 cities per continent** displayed each day
- **Changes at midnight** - new cities appear every 24 hours
- **Deterministic rotation** - everyone sees the same cities on the same day
- **Nashik is permanent** - always visible with real-time AQI updates
- **60+ city pool** includes famous cities from:
  - Asia (15 cities): Tokyo, Delhi, Mumbai, Seoul, Singapore, etc.
  - Europe (13 cities): London, Paris, Berlin, Rome, Moscow, etc.
  - North America (12 cities): NYC, LA, Toronto, Chicago, etc.
  - South America (11 cities): São Paulo, Buenos Aires, Rio, etc.
  - Africa (11 cities): Cairo, Lagos, Nairobi, Johannesburg, etc.
  - Oceania (10 cities): Sydney, Melbourne, Auckland, etc.

## 📊 AQI Categories

| AQI Range | Category                       | Color  |
| --------- | ------------------------------ | ------ |
| 0-50      | Good                           | Green  |
| 51-100    | Moderate                       | Yellow |
| 101-150   | Unhealthy for Sensitive Groups | Orange |
| 151-200   | Unhealthy                      | Red    |
| 201-300   | Very Unhealthy                 | Purple |
| 301+      | Hazardous                      | Maroon |

## 🗂️ Project Structure

```
NOCTERRA/
├── src/
│   ├── components/       # React components
│   │   ├── GlobeScene.tsx          # 3D globe with cinematic rendering
│   │   ├── PredictionPanel.tsx     # City AQI details
│   │   ├── SimulationControls.tsx  # Pollution simulation
│   │   ├── HealthCards.tsx         # Health impact info
│   │   ├── AIInsightPanel.tsx      # AI-powered insights
│   │   ├── AIForecastPanel.tsx     # 72-hour forecast
│   │   ├── CityComparison.tsx      # Side-by-side comparison
│   │   └── ui/                     # shadcn/ui components
│   ├── data/
│   │   └── cities.ts               # City pool & rotation logic
│   ├── hooks/
│   │   ├── use-realtime-aqi.ts     # Real-time AQI updates
│   │   └── use-toast.ts            # Toast notifications
│   ├── services/
│   │   ├── gemini.ts               # Google Gemini AI integration
│   │   └── openaq.ts               # OpenAQ API integration
│   ├── pages/           # Page components
│   ├── lib/             # Utility functions
│   └── assets/          # Images and static files
├── public/              # Public assets
├── DAILY_CITY_ROTATION.md    # City rotation system docs
├── GLOBE_UPGRADE.md          # Globe rendering details
└── ...config files
```

## 🌍 Data Sources

The application uses a combination of simulated and real-time air quality data:

- **City Pool**: 60+ famous cities with baseline AQI data
- **Real-time Updates**: AQI fluctuates every 30 seconds (±5 points)
- **Daily Rotation**: Deterministic algorithm selects 10 cities per continent daily

For production deployment, integrate with:

- [OpenAQ](https://openaq.org/) - Real-time air quality data
- [AirVisual](https://www.iqair.com/air-pollution-data-api) - Global AQI monitoring
- [EPA AirNow](https://www.airnow.gov/international/us-embassies-and-consulates/) - US Embassy data

## 📚 Documentation

- [DAILY_CITY_ROTATION.md](./DAILY_CITY_ROTATION.md) - City rotation system details
- [GLOBE_UPGRADE.md](./GLOBE_UPGRADE.md) - Cinematic rendering implementation
- [SCROLL_AND_REALTIME_UPDATE.md](./SCROLL_AND_REALTIME_UPDATE.md) - Scroll-aware UI
- [AI_FEATURES.md](./AI_FEATURES.md) - AI integration guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
- [QUICK_START.md](./QUICK_START.md) - Quick start guide

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👥 Authors

- Sarvesh Ghotekar - [@ghotekarsarvesh05-stack](https://github.com/ghotekarsarvesh05-stack)

## 🙏 Acknowledgments

- Earth night texture from NASA
- UI components from shadcn/ui
- 3D rendering powered by Three.js

---

**NOCTERRA** - The Earth That Breathes
