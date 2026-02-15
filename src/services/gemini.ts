// Primary AI: Groq (Fast and generous free tier)
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Fallback AI: Gemini (Google)
const USE_PROXY = import.meta.env.PROD || import.meta.env.VITE_USE_PROXY === 'true';
const PROXY_URL = '/.netlify/functions/gemini-proxy';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash-001';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Feature flag - disable AI if quota exhausted
const AI_ENABLED = import.meta.env.VITE_AI_ENABLED !== 'false'; // Default true

// Cache for API responses
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Request deduplication - prevents parallel requests for same data
const pendingRequests = new Map<string, Promise<any>>();

// Track API failures to auto-switch providers
let groqFailures = 0;
const MAX_GROQ_FAILURES = 2; // Switch to Gemini after 2 failures

function getCachedResponse<T>(key: string): T | null {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
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
  forecastConfidence?: number;
  futureProjection?: {
    percentIncrease: number;
    reason: string;
  };
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

export interface CombinedAirQualityData {
  insight: AirQualityInsight;
  forecast: { hour: number; aqi: number; confidence: number }[];
  healthImpact: HealthImpactData;
}

function getColorForAqi(aqi: number): string {
  if (aqi <= 50) return "hsl(142, 76%, 50%)";
  if (aqi <= 100) return "hsl(45, 100%, 55%)";
  if (aqi <= 150) return "hsl(25, 100%, 55%)";
  if (aqi <= 200) return "hsl(0, 84%, 55%)";
  if (aqi <= 300) return "hsl(280, 80%, 55%)";
  return "hsl(320, 90%, 40%)";
}

export async function getAllAirQualityData(
  cityName: string,
  aqi: number,
  trend: 'up' | 'down' | 'stable',
  historicalData: number[]
): Promise<CombinedAirQualityData> {
  const cacheKey = `combined-${cityName}-${aqi}`;
  
  const cached = getCachedResponse<CombinedAirQualityData>(cacheKey);
  if (cached) {
    return cached;
  }

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!;
  }

  const requestPromise = (async () => {
    try {
      const forecast = generateRuleBasedForecast(aqi, historicalData);
      
      if (!AI_ENABLED) {
        const fallback = generateFallbackData(cityName, aqi, trend, historicalData);
        setCachedResponse(cacheKey, fallback);
        return fallback;
      }

      try {
        let aiResult;
        
        if (groqFailures < MAX_GROQ_FAILURES && GROQ_API_KEY) {
          try {
            aiResult = await makeGroqRequest(cityName, aqi, trend);
            groqFailures = 0;
          } catch (groqError) {
            groqFailures++;
            throw groqError;
          }
        } else {
          throw new Error('Groq unavailable, trying Gemini');
        }
        
        const result: CombinedAirQualityData = {
          insight: aiResult.insight,
          healthImpact: aiResult.healthImpact,
          forecast
        };
        
        setCachedResponse(cacheKey, result);
        return result;
        
      } catch (primaryError) {
        if (GEMINI_API_KEY) {
          try {
            const geminiResult = await makeGeminiRequest(cityName, aqi, trend);
            
            const result: CombinedAirQualityData = {
              insight: geminiResult.insight,
              healthImpact: geminiResult.healthImpact,
              forecast
            };
            
            setCachedResponse(cacheKey, result);
            return result;
          } catch (geminiError) {
            // Fall through to static fallback
          }
        }
        
        const fallback = generateFallbackData(cityName, aqi, trend, historicalData);
        setCachedResponse(cacheKey, fallback);
        return fallback;
      }
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

async function makeGeminiRequest(
  cityName: string,
  aqi: number,
  trend: 'up' | 'down' | 'stable'
): Promise<{ insight: AirQualityInsight; healthImpact: HealthImpactData }> {
  const prompt = `You are an air quality expert analyzing ${cityName}. Provide analysis in ONE JSON response.

Current Data:
- City: ${cityName}
- Current AQI: ${aqi}
- Trend: ${trend}

Return ONLY this JSON structure:

{
  "insight": {
    "explanation": "Why does ${cityName} have an AQI of ${aqi}? (2-3 sentences, city-specific)",
    "healthAdvice": "Practical recommendations for ${cityName} residents today",
    "trend": "What to expect in next 24-48 hours for ${cityName}",
    "confidence": 85,
    "forecastConfidence": 82,
    "futureProjection": {
      "percentIncrease": 15,
      "reason": "Expected increase due to [specific factors for ${cityName}]"
    }
  },
  "healthImpact": {
    "respiratoryRisk": {
      "level": "Low/Moderate/High/Very High",
      "description": "Respiratory health risks in ${cityName}",
      "color": "${getColorForAqi(aqi)}"
    },
    "visibility": {
      "value": "X km or Good/Fair/Poor",
      "description": "Visibility in ${cityName}",
      "color": "${getColorForAqi(aqi)}"
    },
    "outdoorActivity": {
      "level": "Unrestricted/Limited/Avoid",
      "description": "Activity recommendations for ${cityName}",
      "color": "${getColorForAqi(aqi)}"
    }
  }
}

IMPORTANT:
- confidence: Your confidence in current analysis (70-95)
- forecastConfidence: Your confidence in 72-hour forecast (65-90)
- percentIncrease: Realistic % increase for future scenario (5-25)
- Make values vary based on city conditions, not constant
- Be specific to ${cityName}'s geography, climate, and pollution sources
- Return ONLY valid JSON, no markdown.`;
  
  let data;
  
  if (USE_PROXY) {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        config: { temperature: 0.4, maxOutputTokens: 800 }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API failed: ${response.status}`);
    }
    data = await response.json();
  } else {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 800 }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API failed: ${response.status}`);
    }
    data = await response.json();
  }

  const text = data.candidates[0].content.parts[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid response format');
  
  return JSON.parse(jsonMatch[0]);
}

async function makeGroqRequest(
  cityName: string,
  aqi: number,
  trend: 'up' | 'down' | 'stable'
): Promise<{ insight: AirQualityInsight; healthImpact: HealthImpactData }> {
  const prompt = `You are an air quality expert analyzing ${cityName}. Provide analysis in ONE JSON response.

Current Data:
- City: ${cityName}
- Current AQI: ${aqi}
- Trend: ${trend}

Return ONLY this JSON structure (no markdown, no code blocks):

{
  "insight": {
    "explanation": "Why does ${cityName} have an AQI of ${aqi}? (2-3 sentences, city-specific)",
    "healthAdvice": "Practical recommendations for ${cityName} residents today",
    "trend": "What to expect in next 24-48 hours for ${cityName}",
    "confidence": 85,
    "forecastConfidence": 82,
    "futureProjection": {
      "percentIncrease": 15,
      "reason": "Expected increase due to [specific factors for ${cityName}]"
    }
  },
  "healthImpact": {
    "respiratoryRisk": {
      "level": "Low/Moderate/High/Very High",
      "description": "Respiratory health risks in ${cityName}",
      "color": "${getColorForAqi(aqi)}"
    },
    "visibility": {
      "value": "X km or Good/Fair/Poor",
      "description": "Visibility in ${cityName}",
      "color": "${getColorForAqi(aqi)}"
    },
    "outdoorActivity": {
      "level": "Unrestricted/Limited/Avoid",
      "description": "Activity recommendations for ${cityName}",
      "color": "${getColorForAqi(aqi)}"
    }
  }
}

IMPORTANT:
- confidence: Your confidence in current analysis (70-95)
- forecastConfidence: Your confidence in 72-hour forecast (65-90)
- percentIncrease: Realistic % increase for future scenario (5-25)
- Make values vary based on city conditions, not constant
- Be specific to ${cityName}'s geography, climate, and pollution sources`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an air quality expert. Always respond with valid JSON only, no markdown formatting. Vary confidence values based on data quality and city-specific factors.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API failed: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  
  const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid response format');
  
  return JSON.parse(jsonMatch[0]);
}

function generateFallbackData(
  cityName: string,
  aqi: number,
  trend: 'up' | 'down' | 'stable',
  historicalData: number[]
): CombinedAirQualityData {
  const baseConfidence = 75;
  const confidenceVariation = Math.floor(Math.random() * 10) - 5;
  const confidence = Math.max(70, Math.min(90, baseConfidence + confidenceVariation));
  
  const forecastConfidence = Math.max(65, confidence - 8);
  
  let percentIncrease = 12;
  if (trend === 'up') {
    percentIncrease = 15 + Math.floor(Math.random() * 8);
  } else if (trend === 'down') {
    percentIncrease = 5 + Math.floor(Math.random() * 5);
  } else {
    percentIncrease = 10 + Math.floor(Math.random() * 6);
  }
  
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
      confidence,
      forecastConfidence,
      futureProjection: {
        percentIncrease,
        reason: trend === 'up' 
          ? 'rising temperature and wind stagnation'
          : trend === 'down'
          ? 'improved ventilation and reduced emissions'
          : 'stable atmospheric conditions'
      }
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
    
    const trafficFactor = (hourOfDay >= 7 && hourOfDay <= 9) || (hourOfDay >= 17 && hourOfDay <= 19) 
      ? 1.15 
      : hourOfDay >= 22 || hourOfDay <= 5 
      ? 0.85 
      : 1.0;
    
    const randomFactor = 0.95 + Math.random() * 0.1;
    const trendFactor = 1 + (avgChange * hour / 100);
    
    const predictedAqi = Math.round(
      currentAqi * trafficFactor * randomFactor * trendFactor
    );
    
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
