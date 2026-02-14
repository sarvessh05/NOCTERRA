# AERIS Features

Complete feature list and capabilities of the AERIS platform.

## 🌍 Globe Visualization

### Cinematic Rendering
- **Emissive Night Lights**: Cities glow with warm amber light
- **Custom Bloom Effect**: Soft glow layer with additive blending
- **ACES Filmic Tone Mapping**: Cinema-grade color grading
- **Atmospheric Rim**: Subtle blue halo around Earth
- **High-Resolution Mesh**: 128x128 segments for smooth surface
- **Subtle Animation**: Barely-noticeable emissive pulsing

### Interaction
- **Auto-Rotation**: Globe spins automatically when no city selected
- **Manual Rotation**: Drag to spin the globe in any direction
- **Zoom Controls**: Mouse wheel to zoom in/out (3.5-12 units)
- **City Selection**: Click markers to view city details
- **Smooth Transitions**: Fluid camera movements and animations

### Visual Effects
- **Stars Background**: 3000 stars with fade effect
- **Floating Particles**: Dynamic particle system (200-500 particles)
- **Smog Layer**: Visual pollution layer (opacity based on simulation)
- **City Markers**: Color-coded pins with glow effects
- **Pulse Rings**: Animated rings on selected cities

## 🏙️ City System

### City Pool (60+ Cities)

**Asia (15 cities)**
- Tokyo, New Delhi, Beijing, Shanghai, Mumbai
- Seoul, Bangkok, Jakarta, Singapore, Dubai
- Hong Kong, Dhaka, Karachi, Manila, Kuala Lumpur

**Europe (13 cities)**
- London, Paris, Berlin, Madrid, Rome
- Moscow, Istanbul, Amsterdam, Vienna, Athens
- Warsaw, Stockholm, Prague

**North America (12 cities)**
- New York, Los Angeles, Mexico City, Toronto
- Chicago, Vancouver, San Francisco, Miami
- Houston, Montreal, Phoenix, Seattle

**South America (11 cities)**
- São Paulo, Buenos Aires, Rio de Janeiro, Lima
- Bogotá, Santiago, Caracas, Quito
- Montevideo, La Paz, Medellín

**Africa (11 cities)**
- Cairo, Lagos, Johannesburg, Nairobi
- Kinshasa, Casablanca, Addis Ababa, Accra
- Dar es Salaam, Cape Town, Algiers

**Oceania (10 cities)**
- Sydney, Melbourne, Brisbane, Perth
- Auckland, Wellington, Adelaide, Canberra
- Christchurch, Hobart

### Daily Rotation
- **10 cities per continent** displayed each day
- **Deterministic algorithm** - same cities for everyone on same day
- **Changes at midnight** - new cities every 24 hours
- **Permanent cities** - Nashik never rotates out
- **Total visible**: 61 cities (1 permanent + 60 rotating)

### Real-Time Updates
- **AQI updates every 30 seconds**
- **Dynamic pin colors** based on current AQI
- **Realistic fluctuations** (±5 points per update)
- **Smooth color transitions**

## 🤖 AI Features

### AI Insights Panel
- **Powered by Google Gemini AI**
- **Personalized explanations** of current air quality
- **Health recommendations** based on AQI level
- **Outdoor activity advice**
- **AI confidence scores** for transparency
- **"Explain Today's Air" button**

### 72-Hour Forecast
- **Hourly predictions** for next 3 days
- **Visual trend indicators** with animated arrows
- **AI confidence percentage** display
- **Peak and low AQI** highlights
- **Interactive chart** with hover details

### City Comparison
- **Side-by-side analysis** of two cities
- **Split-screen visualization**
- **Animated comparison bars**
- **Percentage difference** calculations
- **Winner badge** for better air quality
- **Real-time data** for both cities

## 📊 Data Visualization

### AQI Display
- **Color-coded system**:
  - Green (0-50): Good
  - Yellow (51-100): Moderate
  - Orange (101-150): Unhealthy for Sensitive
  - Red (151-200): Unhealthy
  - Purple (201-300): Very Unhealthy
  - Maroon (301+): Hazardous

### Charts & Graphs
- **7-Day Forecast Chart**: Line graph with trend visualization
- **72-Hour Forecast**: Detailed hourly predictions
- **Comparison Bars**: Animated horizontal bars
- **Trend Indicators**: Up/down/stable arrows
- **Health Impact Cards**: Visual health metrics

## 🎮 Interactive Controls

### Simulation Controls
- **Intensity Slider**: Adjust pollution simulation (0-100%)
- **Toggle Switch**: Enable/disable simulation
- **Real-time Updates**: See effects immediately on globe
- **Smog Layer**: Visual representation of pollution

### Future Mode
- **Toggle Switch**: Enable projected AQI increases
- **7-Day Projection**: See future pollution trends
- **Climate Factor Simulation**: Model environmental changes

### Search & Navigation
- **City Search**: Find cities by name
- **Quick Access**: Jump to any city instantly
- **Reset View**: Return to default globe view
- **Keyboard Shortcuts**: Fast navigation

## 🎨 User Interface

### Landing Page
- **Cinematic Entry**: Animated text and button
- **Backdrop Blur**: Blurred globe background
- **Smooth Transitions**: Fade-in animations
- **Call-to-Action**: "Enter Live Atmosphere" button

### Main Interface
- **Top Bar**: Logo, search, AI insights, comparison, reset
- **Prediction Panel**: City details (right side)
- **Forecast Panel**: 72-hour predictions (bottom center)
- **Simulation Controls**: Pollution controls (bottom left)
- **Hint Text**: Helpful instructions

### Scroll Experience
- **Scroll-Aware UI**: Controls fade when scrolling
- **Health Impact Section**: Detailed health information
- **Smooth Transitions**: Fade animations
- **No Overlap**: Clean content separation

## 📱 Responsive Design

### Desktop
- **Full 3D Experience**: Complete globe interaction
- **Multi-Panel Layout**: All features visible
- **Keyboard Support**: Shortcuts and navigation
- **High Performance**: Optimized rendering

### Mobile
- **Touch Controls**: Swipe to rotate globe
- **Pinch to Zoom**: Natural mobile gestures
- **Responsive Panels**: Adapted for small screens
- **Performance Optimized**: Reduced particle count

## 🔧 Technical Features

### Performance
- **Optimized Rendering**: Efficient Three.js usage
- **Lazy Loading**: Components load on demand
- **Memoization**: React optimization hooks
- **Debounced Updates**: Smooth real-time data

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels
- **Color Contrast**: WCAG compliant colors
- **Focus Indicators**: Clear focus states

### Data Management
- **Local State**: React hooks for UI state
- **Real-time Updates**: 30-second AQI refresh
- **Daily Rotation**: Automatic city changes
- **API Integration**: Gemini AI and OpenAQ

## 🚀 Future Enhancements

### Planned Features
- [ ] Historical data visualization
- [ ] User accounts and favorites
- [ ] Custom city alerts
- [ ] Social sharing
- [ ] Mobile app version
- [ ] More AI insights
- [ ] Weather integration
- [ ] Pollution source tracking

### Under Consideration
- [ ] VR/AR support
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Export data functionality
- [ ] API for developers
- [ ] Community contributions

---

For technical implementation details, see:
- [DAILY_CITY_ROTATION.md](./DAILY_CITY_ROTATION.md)
- [GLOBE_UPGRADE.md](./GLOBE_UPGRADE.md)
- [AI_FEATURES.md](./AI_FEATURES.md)
