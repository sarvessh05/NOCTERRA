// Use serverless function in production, direct API in development
const USE_PROXY = import.meta.env.PROD || import.meta.env.VITE_USE_PROXY === 'true';
const PROXY_URL = '/.netlify/functions/gemini-proxy';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash-001';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Cache for API responses
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

function getCachedResponse<T>(key: string): T | null {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`✅ Using cached data for: ${key}`);
    return cached.data as T;
  }
  responseCache.delete(key);
  return null;
}

function setCachedResponse(key: string, data: any): void {
  responseCache.set(key, { data, timestamp: Date.now() });
}

export interface AirQualityInsight {
  explanation: string;
  healthAdvice: string;
  trend: string;
  confidence: number;
}

export interface HealthImpactData {
  respiratoryRisk: {
    level: string;
    description: string;
    color: string;
  };
  visibility: {
    value: string;
    description: string;
    color: string;
  };
  outdoorActivity: {
    level: string;
    description: string;
    color: string;
  };
}

// Combined response interface
export interface CombinedAirQualityData {
  insight: AirQualityInsight;
  forecast: { hour: number; aqi: number; confidence: number }[];
  healthImpact: HealthImpactData;
}

// Single unified API call for all data
export async function getAllAirQualityData(
  cityName: string,
  aqi: number,
  trend: 'up' | 'down' | 'stable',
  historicalData: number[]
): Promise<CombinedAirQualityData> {
  // Check cache first
  const cacheKey = `combined-${cityName}-${aqi}`;
  const cached = getCachedResponse<CombinedAirQualityData>(cacheKey);
  if (cached) {
    return cached;
  }

  const prompt = `You are an air quality expert analyzing ${cityName}. Provide a comprehensive analysis in ONE JSON response.

Current Data:
- City: ${cityName}
- Current AQI: ${aqi}
- Trend: ${trend}
- Recent 7-day data: ${historicalData.join(', ')}

Return a SINGLE JSON object with ALL three sections:

{
  "insight": {
    "explanation": "Why does ${cityName} have an AQI of ${aqi}? (2-3 sentences, city-specific)",
    "healthAdvice": "Practical recommendations for ${cityName} residents today",
    "trend": "What to expect in next 24-48 hours for ${cityName}",
    "confidence": 85
  },
  "forecast": [
    {"hour": 1, "aqi": 145, "confidence": 90},
    ... (72 hourly entries with realistic patterns)
  ],
  "healthImpact": {
    "respiratoryRisk": {
      "level": "Low/Moderate/High/Very High",
      "description": "Respiratory health risks in ${cityName}",
      "color": "hsl(142, 76%, 50%)"
    },
    "visibility": {
      "value": "X km or Good/Fair/Poor",
      "description": "Visibility in ${cityName}",
      "color": "hsl(142, 76%, 50%)"
    },
    "outdoorActivity": {
      "level": "Unrestricted/Limited/Avoid",
      "description": "Activity recommendations for ${cityName}",
      "color": "hsl(142, 76%, 50%)"
    }
  }
}

Color guidelines:
- Good (0-50): "hsl(142, 76%, 50%)"
- Moderate (51-100): "hsl(45, 100%, 55%)"
- Unhealthy Sensitive (101-150): "hsl(25, 100%, 55%)"
- Unhealthy (151-200): "hsl(0, 84%, 55%)"
- Very Unhealthy (201-300): "hsl(280, 80%, 55%)"
- Hazardous (301+): "hsl(320, 90%, 40%)"

Return ONLY valid JSON, no markdown.`;

  try {
    console.log(`🔄 Making API call for: ${cityName}`);
    
    let data;
    
    if (USE_PROXY) {
      // Use serverless function (production)
      console.log('Using serverless proxy');
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          config: {
            temperature: 0.8,
            maxOutputTokens: 3000,
          }
        })
      });

      if (response.status === 429) {
        console.warn('⚠️ Rate limit hit, using fallback data');
        throw new Error('Rate limit exceeded');
      }

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      data = await response.json();
    } else {
      // Direct API call (development only)
      console.log('Using direct API call (development)');
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 3000,
          }
        })
      });

      if (response.status === 429) {
        console.warn('⚠️ Rate limit hit, using fallback data');
        throw new Error('Rate limit exceeded');
      }

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      data = await response.json();
    }
    const text = data.candidates[0].content.parts[0].text;
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const result = JSON.parse(jsonMatch[0]);
    
    // Ensure forecast has exactly 72 entries
    if (!result.forecast || result.forecast.length < 72) {
      result.forecast = generateRuleBasedForecast(aqi, historicalData);
    }
    
    // Cache the response
    setCachedResponse(cacheKey, result);
    console.log(`✅ Cached data for: ${cityName}`);
    
    return result;
  } catch (error) {
    console.error('❌ API error, using fallback:', error);
    const fallback = generateFallbackData(cityName, aqi, trend, historicalData);
    setCachedResponse(cacheKey, fallback);
    return fallback;
  }
}

function generateFallbackData(
  cityName: string,
  aqi: number,
  trend: 'up' | 'down' | 'stable',
  historicalData: number[]
): CombinedAirQualityData {
  return {
    insight: {
      explanation: `${cityName} currently has an AQI of ${aqi}, which indicates ${aqi > 150 ? 'unhealthy' : aqi > 100 ? 'moderate' : 'good'} air quality. This is influenced by local emissions, weather patterns, and seasonal factors.`,
      healthAdvice: aqi > 150 
        ? `Residents of ${cityName} should limit outdoor activities. Keep windows closed and use air purifiers.`
        : aqi > 100
        ? `In ${cityName}, sensitive individuals should reduce prolonged outdoor exertion.`
        : `Air quality in ${cityName} is good. Enjoy outdoor activities.`,
      trend: trend === 'up' 
        ? `Air quality in ${cityName} may worsen in the coming hours.`
        : trend === 'down'
        ? `Conditions in ${cityName} are expected to improve.`
        : `Air quality in ${cityName} should remain stable.`,
      confidence: 75
    },
    forecast: generateRuleBasedForecast(aqi, historicalData),
    healthImpact: generateFallbackHealthData(cityName, aqi)
  };
}

function generateRuleBasedForecast(
  currentAqi: number,
  historicalData: number[]
): { hour: number; aqi: number; confidence: number }[] {
  const forecast = [];
  const avgChange = historicalData.length > 1 
    ? (historicalData[historicalData.length - 1] - historicalData[0]) / historicalData.length
    : 0;

  for (let hour = 1; hour <= 72; hour++) {
    const hourOfDay = (new Date().getHours() + hour) % 24;
    
    // Traffic patterns
    const trafficFactor = (hourOfDay >= 7 && hourOfDay <= 9) || (hourOfDay >= 17 && hourOfDay <= 19) 
      ? 1.15 
      : hourOfDay >= 22 || hourOfDay <= 5 
      ? 0.85 
      : 1.0;
    
    // Random variation
    const randomFactor = 0.95 + Math.random() * 0.1;
    
    // Trend continuation
    const trendFactor = 1 + (avgChange * hour / 100);
    
    const predictedAqi = Math.round(
      currentAqi * trafficFactor * randomFactor * trendFactor
    );
    
    // Confidence decreases with time
    const confidence = Math.max(70, 95 - Math.floor(hour / 3));
    
    forecast.push({
      hour,
      aqi: Math.max(0, Math.min(500, predictedAqi)),
      confidence
    });
  }
  
  return forecast;
}

function generateFallbackHealthData(cityName: string, aqi: number): HealthImpactData {
  const getColorForAqi = (aqi: number) => {
    if (aqi <= 50) return "hsl(142, 76%, 50%)";
    if (aqi <= 100) return "hsl(45, 100%, 55%)";
    if (aqi <= 150) return "hsl(25, 100%, 55%)";
    if (aqi <= 200) return "hsl(0, 84%, 55%)";
    if (aqi <= 300) return "hsl(280, 80%, 55%)";
    return "hsl(320, 90%, 40%)";
  };

  return {
    respiratoryRisk: {
      level: aqi > 150 ? "High" : aqi > 100 ? "Moderate" : "Low",
      description: aqi > 150 
        ? `High respiratory risk in ${cityName}. Sensitive groups should stay indoors.`
        : aqi > 100
        ? `Moderate risk in ${cityName}. Sensitive individuals should limit prolonged outdoor exertion.`
        : `Low respiratory risk in ${cityName}. Air quality is acceptable.`,
      color: getColorForAqi(aqi)
    },
    visibility: {
      value: aqi > 150 ? "< 5 km" : aqi > 100 ? "5-10 km" : "> 10 km",
      description: aqi > 150
        ? `Poor visibility in ${cityName} due to high particulate concentration.`
        : aqi > 100
        ? `Moderate visibility in ${cityName}. Some haze may be present.`
        : `Good visibility in ${cityName}. Clear skies expected.`,
      color: getColorForAqi(aqi)
    },
    outdoorActivity: {
      level: aqi > 150 ? "Avoid" : aqi > 100 ? "Limited" : "Unrestricted",
      description: aqi > 150
        ? `Avoid outdoor activities in ${cityName}. Stay indoors with air purifiers.`
        : aqi > 100
        ? `Limit outdoor activities in ${cityName}. Morning hours are best for exercise.`
        : `Unrestricted outdoor activities in ${cityName}. Enjoy the fresh air!`,
      color: getColorForAqi(aqi)
    }
  };
}

// Legacy functions for backward compatibility (they now use the combined call)
export async function getAirQualityInsight(
  cityName: string,
  aqi: number,
  trend: 'up' | 'down' | 'stable'
): Promise<AirQualityInsight> {
  const data = await getAllAirQualityData(cityName, aqi, trend, [aqi]);
  return data.insight;
}

export async function get72HourForecast(
  cityName: string,
  currentAqi: number,
  historicalData: number[]
): Promise<{ hour: number; aqi: number; confidence: number }[]> {
  const data = await getAllAirQualityData(cityName, currentAqi, 'stable', historicalData);
  return data.forecast;
}

export async function getHealthImpact(
  cityName: string,
  aqi: number
): Promise<HealthImpactData> {
  const data = await getAllAirQualityData(cityName, aqi, 'stable', [aqi]);
  return data.healthImpact;
}
