# NOCTERRA Features

## Core Features

### Interactive 3D Globe
- Cinematic rendering with emissive night lights and atmospheric glow
- Real-time rotation with smooth user interaction
- ACES Filmic tone mapping for premium visual quality
- High-resolution sphere (128x128 segments) for smooth rendering
- Drag to spin, zoom in/out with mouse wheel
- Scroll-aware UI that fades when viewing Health Impact section

### Smart City System
- 60+ famous cities across 6 continents
- Daily rotation: 10 cities per continent change every 24 hours
- Permanent city: Nashik always visible
- Real-time AQI updates every 30 seconds with dynamic pin colors
- Color-coded markers showing pollution levels
- Deterministic rotation algorithm

### City Data
- Real-time Air Quality Index (AQI) monitoring
- 7-day forecast predictions
- Trend indicators (rising, falling, stable)
- Historical data tracking
- City-specific geographical coordinates

## AI-Powered Features

### AI Insights
- Personalized explanations powered by Google Gemini AI
- "Explain Today's Air" button for instant AI analysis
- Health recommendations and outdoor activity advice
- AI confidence scores for transparency
- City-specific analysis based on geography and climate

### 72-Hour AI Forecast
- Advanced predictions with confidence metrics
- Hourly AQI predictions for the next 3 days
- Visual trend indicators with animated arrows
- AI confidence percentage display
- Dynamic forecasting based on weather patterns

### AI Health Impact Analysis
- Respiratory risk assessment
- Visibility index calculations
- Outdoor activity recommendations
- City-specific health insights
- Dynamic health cards with real-time updates

## Analytics & Visualization

### City Comparison Mode
- Side-by-side city analysis
- Split-screen visualization
- Animated comparison bars
- Percentage difference calculations
- Winner badge for better air quality
- Real-time comparison updates

### Future Mode
- Simulate projected AQI increases
- Dynamic percentage calculations based on AI predictions
- City-specific projection reasons
- Visual representation of future scenarios
- Toggle on/off for comparison

### Pollution Simulation
- Adjustable intensity slider
- Real-time visual feedback on globe
- Smog layer visualization
- Particle system for pollution effects
- Scenario modeling capabilities

### Data Visualization
- Interactive charts using Recharts
- 7-day forecast graphs
- AQI trend lines
- Confidence interval displays
- Color-coded data points

## User Interface

### Navigation
- Smooth landing page with "Enter Live Atmosphere" button
- City search functionality
- Quick access to comparison mode
- Responsive navigation menu
- Mobile-friendly design

### Visual Design
- Tailwind CSS utility-first styling
- shadcn/ui component library
- Framer Motion animations
- Smooth transitions and micro-interactions
- Dark theme optimized for night viewing

### Health Impact Cards
- Respiratory risk levels
- Visibility information
- Outdoor activity guidance
- Color-coded severity indicators
- Loading states and error handling

### Toast Notifications
- Real-time update notifications
- Error messages
- Success confirmations
- Non-intrusive design
- Auto-dismiss functionality

## Technical Features

### Performance
- Vite for lightning-fast builds
- Code splitting and lazy loading
- Optimized 3D rendering
- Efficient state management
- Request caching and deduplication

### API Integration
- Google Gemini AI for insights and forecasting
- OpenAQ API for real-time air quality data
- Fallback mechanisms for API failures
- Rate limiting and quota management
- Error handling and retry logic

### Data Management
- Real-time AQI updates every 30 seconds
- Cached responses (10-minute duration)
- Request deduplication to prevent parallel calls
- Automatic provider switching (Groq to Gemini)
- Fallback to static data when APIs unavailable

### Type Safety
- Full TypeScript implementation
- Type-safe API responses
- Interface definitions for all data structures
- Compile-time error checking
- IntelliSense support

## Accessibility

### User Experience
- Keyboard navigation support
- Screen reader compatible
- High contrast color schemes
- Responsive touch interactions
- Clear visual feedback

### Mobile Optimization
- Touch-friendly controls
- Responsive layouts
- Optimized performance for mobile devices
- Adaptive UI elements
- Mobile-first design approach

## Security

### API Key Management
- Environment variable configuration
- Proxy for sensitive API calls
- No client-side key exposure
- Secure Netlify Functions
- CORS protection

### Data Privacy
- No user data collection
- No tracking or analytics
- Client-side processing
- Secure API communications
- Privacy-focused design

## Future Enhancements

### Planned Features
- Historical data analysis
- Custom city additions
- Export data functionality
- Social sharing capabilities
- Multi-language support
- Advanced filtering options
- Notification system for AQI alerts
- User preferences and settings
- Offline mode support
- Progressive Web App (PWA) capabilities
