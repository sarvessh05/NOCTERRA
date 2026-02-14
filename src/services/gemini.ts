const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash-001'; // Updated to latest model
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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

export async function getAirQualityInsight(
  cityName: string,
  aqi: number,
  trend: 'up' | 'down' | 'stable'
): Promise<AirQualityInsight> {
  const prompt = `You are an air quality expert analyzing ${cityName} specifically.

Current Data:
- City: ${cityName}
- Current AQI: ${aqi}
- Trend: ${trend}

Provide a detailed, city-specific analysis in JSON format:

1. explanation: Why does ${cityName} have an AQI of ${aqi} right now? Consider:
   - Local geography and climate
   - Industrial activity in the region
   - Traffic patterns
   - Seasonal factors
   - Recent weather conditions
   Be specific to ${cityName}, not generic.

2. healthAdvice: Practical recommendations for people in ${cityName} today:
   - What outdoor activities are safe?
   - Best times for exercise
   - Precautions for sensitive groups
   - Indoor air quality tips

3. trend: What should ${cityName} residents expect in the next 24-48 hours?
   - Will it improve or worsen?
   - Why?

4. confidence: Your confidence level (0-100) in this analysis

Return ONLY valid JSON with these exact fields. Be conversational and specific to ${cityName}.`;

  try {
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
          temperature: 0.9,
          maxOutputTokens: 800,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get AI insight');
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const insight = JSON.parse(jsonMatch[0]);
    return insight;
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback response - city-specific
    return {
      explanation: `${cityName} currently has an AQI of ${aqi}, which indicates ${aqi > 150 ? 'unhealthy' : aqi > 100 ? 'moderate' : 'good'} air quality. This is influenced by local emissions, weather patterns, and seasonal factors specific to the region.`,
      healthAdvice: aqi > 150 
        ? `Residents of ${cityName} should limit outdoor activities, especially sensitive groups. Keep windows closed and use air purifiers indoors.`
        : aqi > 100
        ? `In ${cityName}, sensitive individuals should reduce prolonged outdoor exertion. Morning hours are generally better for exercise.`
        : `Air quality in ${cityName} is good. Enjoy outdoor activities without restrictions.`,
      trend: trend === 'up' 
        ? `Air quality in ${cityName} may worsen in the coming hours due to atmospheric conditions.`
        : trend === 'down'
        ? `Conditions in ${cityName} are expected to improve with better ventilation.`
        : `Air quality in ${cityName} should remain relatively stable.`,
      confidence: 75
    };
  }
}

export async function get72HourForecast(
  cityName: string,
  currentAqi: number,
  historicalData: number[]
): Promise<{ hour: number; aqi: number; confidence: number }[]> {
  const prompt = `As an air quality forecaster, predict the next 72 hours of AQI for ${cityName}.
Current AQI: ${currentAqi}
Recent 7-day data: ${historicalData.join(', ')}

Generate a realistic 72-hour forecast (hourly) considering:
- Time of day patterns (traffic peaks, industrial activity)
- Weather patterns
- Historical trends

Return JSON array with format: [{"hour": 1, "aqi": 145, "confidence": 85}, ...]
Include 72 entries. Confidence should vary (70-95) based on prediction distance.
Return ONLY valid JSON array, no markdown.`;

  try {
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
          maxOutputTokens: 2000,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get forecast');
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const forecast = JSON.parse(jsonMatch[0]);
    return forecast.slice(0, 72); // Ensure exactly 72 hours
  } catch (error) {
    console.error('Forecast API error:', error);
    // Fallback: Generate rule-based forecast
    return generateRuleBasedForecast(currentAqi, historicalData);
  }
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

export async function getHealthImpact(
  cityName: string,
  aqi: number
): Promise<HealthImpactData> {
  const prompt = `You are a health expert analyzing air quality impact for ${cityName}.

Current AQI: ${aqi}

Provide health impact analysis in JSON format:

{
  "respiratoryRisk": {
    "level": "Low/Moderate/High/Very High",
    "description": "1-2 sentences about respiratory health risks in ${cityName} at this AQI",
    "color": "hsl color code based on risk"
  },
  "visibility": {
    "value": "X km or Good/Fair/Poor",
    "description": "How air quality affects visibility in ${cityName}",
    "color": "hsl color code"
  },
  "outdoorActivity": {
    "level": "Unrestricted/Limited/Avoid",
    "description": "Specific outdoor activity recommendations for ${cityName} residents",
    "color": "hsl color code"
  }
}

Be specific to ${cityName}. Use these color guidelines:
- Good (AQI 0-50): "hsl(142, 76%, 50%)"
- Moderate (51-100): "hsl(45, 100%, 55%)"
- Unhealthy for Sensitive (101-150): "hsl(25, 100%, 55%)"
- Unhealthy (151-200): "hsl(0, 84%, 55%)"
- Very Unhealthy (201-300): "hsl(280, 80%, 55%)"
- Hazardous (301+): "hsl(320, 90%, 40%)"

Return ONLY valid JSON.`;

  try {
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
          maxOutputTokens: 600,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get health impact');
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const healthData = JSON.parse(jsonMatch[0]);
    return healthData;
  } catch (error) {
    console.error('Health Impact API error:', error);
    // Fallback response
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
}
