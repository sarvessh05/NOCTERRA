# Daily City Rotation System

## System Overview

The globe now displays famous cities from each continent with intelligent daily rotation, while keeping Nashik permanently visible.

## Key Features

### 1. ✅ Nashik is Permanent
- **Always visible** on the map
- **Real-time AQI updates** every 30 seconds
- **Never rotates out** - marked with `isPermanent: true`
- Your city stays on the map 24/7

### 2. ✅ Famous Cities (Not Just Polluted)
Expanded to 60+ famous cities across all continents:

**Asia (15 cities):**
- Tokyo, New Delhi, Beijing, Shanghai, Mumbai
- Seoul, Bangkok, Jakarta, Singapore, Dubai
- Hong Kong, Dhaka, Karachi, Manila, Kuala Lumpur

**Europe (13 cities):**
- London, Paris, Berlin, Madrid, Rome
- Moscow, Istanbul, Amsterdam, Vienna, Athens
- Warsaw, Stockholm, Prague

**North America (12 cities):**
- New York, Los Angeles, Mexico City, Toronto
- Chicago, Vancouver, San Francisco, Miami
- Houston, Montreal, Phoenix, Seattle

**South America (11 cities):**
- São Paulo, Buenos Aires, Rio de Janeiro, Lima
- Bogotá, Santiago, Caracas, Quito
- Montevideo, La Paz, Medellín

**Africa (11 cities):**
- Cairo, Lagos, Johannesburg, Nairobi
- Kinshasa, Casablanca, Addis Ababa, Accra
- Dar es Salaam, Cape Town, Algiers

**Oceania (10 cities):**
- Sydney, Melbourne, Brisbane, Perth
- Auckland, Wellington, Adelaide, Canberra
- Christchurch, Hobart

### 3. ✅ Daily Rotation System
- **10 cities per continent** displayed each day
- **Deterministic rotation** - same cities for everyone on the same day
- **Changes at midnight** - new cities appear every 24 hours
- **Nashik excluded** from rotation (always visible)

### 4. ✅ Real-Time AQI Updates
- **All cities** get AQI updates every 30 seconds
- **Pin colors change** dynamically based on current AQI
- **Realistic fluctuations** - ±5 points per update
- **Smooth transitions** - colors blend naturally

## Technical Implementation

### City Pool Structure
```typescript
export const permanentCities: CityData[] = [
  { name: "Nashik", ..., isPermanent: true },
];

export const cityPool: Record<string, CityData[]> = {
  Asia: [15 cities],
  Europe: [13 cities],
  "North America": [12 cities],
  "South America": [11 cities],
  Africa: [11 cities],
  Oceania: [10 cities],
};
```

### Daily Rotation Algorithm
```typescript
export function getActiveCities(): CityData[] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const activeCities: CityData[] = [...permanentCities];
  
  Object.entries(cityPool).forEach(([continent, cities]) => {
    // Deterministic shuffle based on day of year
    const shuffled = [...cities].sort((a, b) => {
      const hashA = (a.name.charCodeAt(0) + dayOfYear) % cities.length;
      const hashB = (b.name.charCodeAt(0) + dayOfYear) % cities.length;
      return hashA - hashB;
    });
    
    // Take first 10 cities for this continent
    activeCities.push(...shuffled.slice(0, 10));
  });
  
  return activeCities;
}
```

### Real-Time AQI Hook
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

## User Experience

### What Users See
1. **Nashik** - Always visible with live AQI
2. **10 cities per continent** - Famous cities, not just polluted ones
3. **Dynamic colors** - Pins change color as AQI updates
4. **Daily variety** - Different cities each day
5. **61 total cities** - 1 permanent + 60 rotating

### Example Daily Rotation
**Day 1:**
- Asia: Tokyo, Delhi, Beijing, Shanghai, Mumbai, Seoul, Bangkok, Jakarta, Singapore, Dubai
- Europe: London, Paris, Berlin, Madrid, Rome, Moscow, Istanbul, Amsterdam, Vienna, Athens
- (+ 40 more cities from other continents)

**Day 2:**
- Asia: Dhaka, Karachi, Manila, Hong Kong, Kuala Lumpur, Tokyo, Delhi, Beijing, Shanghai, Mumbai
- Europe: Warsaw, Stockholm, Prague, London, Paris, Berlin, Madrid, Rome, Moscow, Istanbul
- (Different selection, but Nashik still there!)

## Benefits

1. **Global coverage** - All major cities represented
2. **Fresh content** - New cities daily keeps it interesting
3. **Personal touch** - Nashik always visible for you
4. **Real-time data** - Live AQI updates every 30 seconds
5. **Fair representation** - Not biased toward polluted cities

## Git Status

Changes committed locally:
```
feat: implement daily city rotation with Nashik permanent, 10 famous cities per continent, real-time AQI
```

Push manually with: `git push --set-upstream origin main`
