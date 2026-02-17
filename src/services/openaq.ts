const OPENAQ_API_KEY = import.meta.env.VITE_OPENAQ_API_KEY;
const OPENAQ_BASE_URL = 'https://api.openaq.org/v2';

export interface OpenAQMeasurement {
  parameter: string;
  value: number;
  lastUpdated: string;
  unit: string;
}

export interface OpenAQLocation {
  id: number;
  name: string;
  city: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  measurements: OpenAQMeasurement[];
}

// Convert PM2.5 to AQI (US EPA standard)
export function pm25ToAqi(pm25: number): number {
  if (pm25 <= 12.0) {
    return Math.round(((50 - 0) / (12.0 - 0)) * (pm25 - 0) + 0);
  } else if (pm25 <= 35.4) {
    return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
  } else if (pm25 <= 55.4) {
    return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
  } else if (pm25 <= 150.4) {
    return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
  } else if (pm25 <= 250.4) {
    return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
  } else {
    return Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301);
  }
}

export async function getCityAirQuality(cityName: string): Promise<{
  aqi: number;
  pm25: number;
  lastUpdated: string;
} | null> {
  try {
    const response = await fetch(
      `${OPENAQ_BASE_URL}/latest?city=${encodeURIComponent(cityName)}&parameter=pm25&limit=1`,
      {
        headers: {
          'X-API-Key': OPENAQ_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch air quality data');
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const pm25Measurement = result.measurements.find(
        (m: OpenAQMeasurement) => m.parameter === 'pm25'
      );

      if (pm25Measurement) {
        return {
          aqi: pm25ToAqi(pm25Measurement.value),
          pm25: pm25Measurement.value,
          lastUpdated: pm25Measurement.lastUpdated,
        };
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function getMultipleCitiesAirQuality(
  cityNames: string[]
): Promise<Map<string, { aqi: number; pm25: number; lastUpdated: string }>> {
  const results = new Map();

  await Promise.all(
    cityNames.map(async (city) => {
      const data = await getCityAirQuality(city);
      if (data) {
        results.set(city, data);
      }
    })
  );

  return results;
}
