import { useState, useEffect } from 'react';
import { CityData } from '@/data/cities';

export function useRealtimeAQI(cities: CityData[], updateInterval: number = 30000) {
  const [updatedCities, setUpdatedCities] = useState<CityData[]>(cities);

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdatedCities(prevCities =>
        prevCities.map(city => {
          // All cities get real-time AQI updates (including Nashik)
          // Simulate real-time AQI changes (±5 points)
          const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
          const newAqi = Math.max(0, Math.min(500, city.aqi + change));
          
          return {
            ...city,
            aqi: newAqi,
          };
        })
      );
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return updatedCities;
}
