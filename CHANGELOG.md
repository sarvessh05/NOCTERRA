# Changelog

All notable changes to AERIS will be documented in this file.

## [2.0.0] - 2026-02-14

### 🌟 Major Features

#### Cinematic Globe Rendering
- **Emissive Night Lights**: Upgraded from basic material to standard material with emissive mapping
- **Custom Glow Effect**: Added emissive glow layer with additive blending (simulates bloom)
- **ACES Filmic Tone Mapping**: Cinema-grade color grading with increased exposure (1.2)
- **Atmospheric Rim**: Subtle blue halo with additive blending for premium look
- **High-Resolution Sphere**: 128x128 segments for smooth rendering
- **Subtle Animation**: Barely-noticeable emissive pulsing for alive feeling

#### Smart City System
- **60+ Famous Cities**: Expanded from 14 to 60+ cities across all continents
- **Daily Rotation**: 10 cities per continent change every 24 hours
- **Permanent Cities**: Nashik always visible (never rotates out)
- **Real-time AQI Updates**: Pin colors change every 30 seconds based on live data
- **Deterministic Algorithm**: Everyone sees the same cities on the same day

#### Enhanced User Experience
- **Scroll-Aware UI**: Globe controls fade when scrolling to Health Impact section
- **Improved Interaction**: Drag to spin globe with `rotateSpeed={0.5}`
- **Smooth Rotation**: Increased rotation speed from 0.0008 to 0.05
- **Blur Effect**: Restored backdrop blur on landing overlay
- **Better Performance**: Optimized rendering with minimal overhead

### 🔧 Technical Improvements

#### Globe Rendering
- Changed from `meshBasicMaterial` to `meshStandardMaterial`
- Added `emissiveMap` with intensity 1.8
- Implemented custom glow layer (2.01 radius) with 30% opacity
- Added ACES Filmic tone mapping to WebGL renderer
- Removed harsh point lights, reduced ambient to 0.2
- Increased sphere segments to 128x128 for smoothness

#### City Management
- Created `cityPool` with 60+ cities organized by continent
- Implemented `getActiveCities()` function for daily rotation
- Added `permanentCities` array for cities that never rotate
- Created `useRealtimeAQI` hook for live AQI updates (30s interval)
- Added continent field to `CityData` interface

#### UI/UX
- Added scroll detection with `scrolled` state
- Implemented fade animations for globe UI elements
- Added `pointer-events-none/auto` for better interaction
- Improved panel positioning and transitions

### 📦 New Files

- `src/hooks/use-realtime-aqi.ts` - Real-time AQI update hook
- `DAILY_CITY_ROTATION.md` - City rotation system documentation
- `GLOBE_UPGRADE.md` - Globe rendering upgrade details
- `SCROLL_AND_REALTIME_UPDATE.md` - Scroll-aware UI documentation
- `FIXES_APPLIED.md` - Bug fixes and improvements log
- `CHANGELOG.md` - This file

### 🐛 Bug Fixes

- Fixed globe rotation (was too slow, now visible)
- Fixed user interaction (added `enableRotate={true}`)
- Fixed blur effect on landing page
- Fixed overlapping UI when scrolling
- Removed problematic `@react-three/postprocessing` dependency

### 🎨 Visual Improvements

- Deep black space background (#060b18)
- Matte Earth surface (roughness=1, metalness=0)
- Warm amber city glow from emissive
- Soft glow halo (not neon, not cyberpunk)
- Gentle atmospheric rim
- Slow controlled rotation

## [1.0.0] - 2026-02-13

### Initial Release

#### Core Features
- Interactive 3D globe with Three.js
- 14 major cities with AQI data
- AI-powered insights with Google Gemini
- 72-hour forecast panel
- City comparison mode
- 7-day forecasting
- Future mode simulation
- Pollution simulation controls
- Health impact cards
- City search functionality
- Smooth animations with Framer Motion

#### Tech Stack
- React 18 + TypeScript
- Vite build tool
- Three.js + React Three Fiber
- Tailwind CSS + shadcn/ui
- Recharts for data visualization
- Google Gemini AI integration
- OpenAQ API integration

---

## Version History

- **v2.0.0** - Cinematic globe, daily city rotation, real-time AQI
- **v1.0.0** - Initial release with core features
