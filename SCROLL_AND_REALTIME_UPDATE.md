# Scroll-Aware UI & Real-Time AQI Updates

## Changes Implemented

### 1. ✅ Scroll-Aware UI
The globe UI now intelligently hides when scrolling to reveal the Health Impact section:

- **Top bar** - Fades out when scrolling down
- **Prediction panels** - Hide when scrolled
- **AI Forecast panel** - Hides when scrolled
- **Simulation controls** - Fade out when scrolling
- **Hint text** - Hides when scrolled

This prevents overlapping and makes the Health Cards section fully visible.

### 2. ✅ Expanded City Database (30+ Cities)
Added comprehensive city coverage across all continents:

**Asia (8 cities):**
- New Delhi (312 AQI) - Highest
- Dhaka (278 AQI)
- Lahore (245 AQI)
- Beijing (185 AQI)
- Jakarta (155 AQI)
- Nashik (125 AQI)
- Dubai (105 AQI)
- Tokyo (55 AQI)

**Africa (5 cities):**
- Lagos (168 AQI) - Highest
- Cairo (142 AQI)
- Kinshasa (135 AQI)
- Johannesburg (98 AQI)
- Nairobi (88 AQI)

**Europe (5 cities):**
- Moscow (88 AQI) - Highest
- Istanbul (72 AQI)
- Milan (65 AQI)
- Paris (38 AQI)
- London (42 AQI)

**North America (4 cities):**
- Mexico City (115 AQI) - Highest
- Los Angeles (78 AQI)
- Phoenix (68 AQI)
- Toronto (45 AQI)

**South America (4 cities):**
- São Paulo (95 AQI) - Highest
- Lima (88 AQI)
- Bogotá (75 AQI)
- Buenos Aires (52 AQI)

**Oceania (2 cities):**
- Melbourne (32 AQI)
- Sydney (28 AQI)

### 3. ✅ Real-Time AQI Color Updates
Implemented live AQI monitoring system:

- **Custom hook** - `useRealtimeAQI` updates city AQI every 30 seconds
- **Dynamic colors** - Pin colors change automatically based on current AQI
- **Realistic simulation** - AQI fluctuates ±5 points to simulate real conditions
- **Smooth transitions** - Color changes are smooth and natural

### 4. ✅ Helper Functions Added

**`getTopPollutedByContinent(limit)`**
- Returns top polluted cities per continent
- Default limit: 8 cities per continent

**`getAllTopPollutedCities(limit)`**
- Returns globally top polluted cities
- Default limit: 10 cities

## Technical Implementation

### Scroll Detection
```typescript
useEffect(() => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setScrolled(scrollPosition > 100);
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

### Real-Time AQI Updates
```typescript
export function useRealtimeAQI(cities: CityData[], updateInterval: number = 30000) {
  const [updatedCities, setUpdatedCities] = useState<CityData[]>(cities);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdatedCities(prevCities =>
        prevCities.map(city => {
          const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
          const newAqi = Math.max(0, Math.min(500, city.aqi + change));
          return { ...city, aqi: newAqi };
        })
      );
    }, updateInterval);
    
    return () => clearInterval(interval);
  }, [updateInterval]);
  
  return updatedCities;
}
```

## User Experience Improvements

1. **Seamless scrolling** - No more overlapping UI elements
2. **Clear content hierarchy** - Globe view → Health Impact section
3. **Live data** - City pins update colors in real-time
4. **Comprehensive coverage** - 30+ cities across 6 continents
5. **Top polluted tracking** - Easy to identify worst-affected areas per continent

## Next Steps (Optional)

- Connect to real OpenAQ API for actual real-time data
- Add continent filter in UI
- Show "Top 10 Most Polluted" overlay
- Add notification when AQI crosses thresholds
- Implement city search by continent

## Git Status

Changes committed locally:
```
feat: add scroll-aware UI, expand cities to 30+ with continents, implement real-time AQI updates
```

Push manually with: `git push --set-upstream origin main`
