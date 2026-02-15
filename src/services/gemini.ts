// Primary AI: Gemini (Google)
const USE_PROXY = import.meta.env.PROD || import.meta.env.VITE_USE_PROXY === 'true';
const PROXY_URL = '/.netlify/functions/gemini-proxy';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash-001';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Fallback AI: Groq (Fast and generous free tier)
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = 'llama-3.3-70b-versatile'; // Fast and capable
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Feature flag - disable AI if quota exhausted
const AI_ENABLED = import.meta.env.VITE_AI_ENABLED !== 'false'; // Default true

// Cache for API responses
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Request deduplication - prevents parallel requests for same data
const pendingRequests = new Map<string, Promise<any>>();

// Track API failures to auto-switch providers
let geminiFailures = 0;
const MAX_GEMINI_FAILURES = 2; // Switch to Groq after 2 failures

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

// Combined response interface - AI only generates insight and health, forecast is rule-based
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

// Single unified API call - with request deduplication
export async function getAllAirQualityData(
  cityName: string,
  aqi: number,
  trend: 'up' | 'down' | 'stable',
  historicalData: number[]
): Promise<CombinedAirQualityData> {
  const cacheKey = `combined-${cityName}-${aqi}`;
  
  // 1️⃣ Check cache first
  const cached = getCachedResponse<CombinedAirQualityData>(cacheKey);
  if (cached) {
    return cached;
  }

  // 2️⃣ Check if request already in flight (deduplication)
  if (pendingRequests.has(cacheKey)) {
    console.log(`⏳ Waiting for existing request for ${cityName}...`);
    return pendingRequests.get(cacheKey)!;
  }

  // 3️⃣ Create new request promise
  const requestPromise = (async () => {
    try {
      // Generate forecast using rule-based algorithm (no AI needed - more reliable)
      const forecast = generateRuleBasedForecast(aqi, historicalData);
      
      // Check if AI is enabled
      if (!AI_ENABLED) {
        console.log('⚠️ AI disabled, using fallback data');
        const fallback = generateFallbackData(cityName, aqi, trend, historicalData);
        setCachedResponse(cacheKey, fallback);
        return fallback;
      }

      // Try AI for insight and health impact
      try {
        let aiResult;
        
        // Try Gemini first if not failing too much
        if (geminiFailures < MAX_GEMINI_FAILURES && GEMINI_API_KEY) {
          try {
            console.log('🔵 Trying Gemini AI...');
            aiResult = await makeGeminiRequest(cityName, aqi, trend);
            geminiFailures = 0; // Reset on success
            console.log('✅ Gemini AI succeeded');
          } catch (geminiError) {
            geminiFailures++;
            console.warn(`⚠️ Gemini failed (${geminiFailures}/${MAX_GEMINI_FAILURES}):`, geminiError);
            throw geminiError; // Let it fall through to Groq
          }
        } else {
          throw new Error('Gemini unavailable, trying Groq');
        }
        
        // If we got here, Gemini succeeded
        const result: CombinedAirQualityData = {
          insight: aiResult.insight,
          healthImpact: aiResult.healthImpact,
          forecast
        };
        
        setCachedResponse(cacheKey, result);
        return result;
        
      } catch (primaryError) {
        // Gemini failed, try Groq as fallback
        if (GROQ_API_KEY) {
          try {
            console.log('🟢 Trying Groq AI as fallback...');
            const groqResult = await makeGroqRequest(cityName, aqi, trend);
            console.log('✅ Groq AI succeeded');
            
            const result: CombinedAirQualityData = {
              insight: groqResult.insight,
              healthImpact: groqResult.healthImpact,
              forecast
            };
            
            setCachedResponse(cacheKey, result);
            return result;
          } catch (groqError) {
            console.warn('⚠️ Groq also failed:', groqError);
            // Fall through to static fallback
          }
        }
        
        // Both AI providers failed, use static fallback
        console.log('⚠️ All AI providers failed, using static fallback');
        const fallback = generateFallbackData(cityName, aqi, trend, historicalData);
        setCachedResponse(cacheKey, fallback);
        return fallback;
      }
    } finally {
      // Always clean up pending request
      pendingRequests.delete(cacheKey);
    }
  })();

  // Store the promise for deduplication
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
    "confidence": 85
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

Return ONLY valid JSON, no markdown.`;
  
  let data;
  
  if (USE_PROXY) {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        config: { temperature: 0.8, maxOutputTokens: 800 }
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
    "confidence": 85
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
}`;

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
          content: 'You are an air quality expert. Always respond with valid JSON only, no markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 800
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API failed: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  
  // Remove markdown code blocks if present
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
