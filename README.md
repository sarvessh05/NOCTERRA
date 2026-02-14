# AERIS - Air Quality Visualization Platform

![AERIS Banner](https://img.shields.io/badge/AERIS-Air%20Quality%20Visualization-4dd0e1?style=for-the-badge)

**AERIS** (Atmospheric Environmental Real-time Information System) is an interactive 3D globe visualization platform that displays real-time air quality data for cities worldwide. Experience the Earth's atmosphere like never before with stunning visuals and predictive analytics.

## ✨ Features

- **Interactive 3D Globe**: Explore a beautifully rendered Earth with real-time city markers
- **Air Quality Index (AQI) Visualization**: Color-coded markers showing pollution levels
- **7-Day Forecasting**: View predicted air quality trends for major cities
- **Future Mode**: Simulate projected AQI increases due to climate factors
- **Pollution Simulation**: Adjust simulation intensity to visualize potential scenarios
- **Health Impact Cards**: Understand how air quality affects respiratory health and visibility
- **City Search**: Quickly find and explore specific cities
- **Smooth Animations**: Fluid transitions and engaging user experience

## 🚀 Tech Stack

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Three.js** - 3D graphics rendering
- **React Three Fiber** - React renderer for Three.js
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **Recharts** - Data visualization

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Setup

```bash
# Clone the repository
git clone https://github.com/ghotekarsarvesh05-stack/AERIS.git

# Navigate to project directory
cd AERIS

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

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
3. **View Details**: See AQI levels, trends, and 7-day forecasts
4. **Future Mode**: Toggle to see projected pollution increases
5. **Simulation**: Use the bottom-left controls to simulate pollution scenarios
6. **Search**: Use the search icon to find specific cities
7. **Scroll Down**: View health impact information

## 📊 AQI Categories

| AQI Range | Category | Color |
|-----------|----------|-------|
| 0-50 | Good | Green |
| 51-100 | Moderate | Yellow |
| 101-150 | Unhealthy for Sensitive Groups | Orange |
| 151-200 | Unhealthy | Red |
| 201-300 | Very Unhealthy | Purple |
| 301+ | Hazardous | Maroon |

## 🗂️ Project Structure

```
AERIS/
├── src/
│   ├── components/       # React components
│   │   ├── GlobeScene.tsx
│   │   ├── PredictionPanel.tsx
│   │   ├── SimulationControls.tsx
│   │   ├── HealthCards.tsx
│   │   └── ui/          # shadcn/ui components
│   ├── data/            # City data and utilities
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── assets/          # Images and static files
├── public/              # Public assets
└── ...config files
```

## 🌍 Data Sources

The application uses simulated air quality data for demonstration purposes. In a production environment, you would integrate with real-time APIs such as:

- [OpenAQ](https://openaq.org/)
- [AirVisual](https://www.iqair.com/air-pollution-data-api)
- [EPA AirNow](https://www.airnow.gov/international/us-embassies-and-consulates/)

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

**AERIS** - The Earth That Breathes
