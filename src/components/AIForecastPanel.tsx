import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";
import { TrendingUp, Loader2, Zap } from "lucide-react";
import { CityData, getAqiColor } from "@/data/cities";
import { get72HourForecast } from "@/services/gemini";

interface AIForecastPanelProps {
  city: CityData;
}

export default function AIForecastPanel({ city }: AIForecastPanelProps) {
  const [forecast, setForecast] = useState<{ hour: number; aqi: number; confidence: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [avgConfidence, setAvgConfidence] = useState(0);

  useEffect(() => {
    loadForecast();
  }, [city.name]);

  const loadForecast = async () => {
    setLoading(true);
    try {
      const result = await get72HourForecast(city.name, city.aqi, city.forecast);
      setForecast(result);
      
      // Calculate average confidence
      const avg = result.reduce((sum, item) => sum + item.confidence, 0) / result.length;
      setAvgConfidence(Math.round(avg));
    } catch (error) {
      console.error("Failed to get forecast:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data (show every 6 hours for readability)
  const chartData = forecast
    .filter((_, index) => index % 6 === 0)
    .map((item) => ({
      hour: `${item.hour}h`,
      aqi: item.aqi,
      confidence: item.confidence,
    }));

  const maxAqi = Math.max(...forecast.map((f) => f.aqi), city.aqi);
  const minAqi = Math.min(...forecast.map((f) => f.aqi), city.aqi);
  const trend = forecast.length > 0 && forecast[forecast.length - 1].aqi > city.aqi ? "up" : "down";

  return (
    <div className="glass-panel p-4 md:p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground text-sm md:text-base">72-Hour AI Forecast</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground">Powered by Gemini AI</p>
          </div>
        </div>
        
        {/* AI Confidence Badge */}
        {!loading && forecast.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-primary/20 border border-primary/30"
          >
            <div className="flex items-center gap-1 md:gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] md:text-xs font-semibold text-primary">AI: {avgConfidence}%</span>
            </div>
          </motion.div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">Generating AI forecast...</p>
        </div>
      ) : forecast.length > 0 ? (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="p-2 md:p-3 rounded-xl bg-secondary/30 text-center">
              <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Current</p>
              <p className="text-base md:text-lg font-bold" style={{ color: getAqiColor(city.aqi) }}>
                {city.aqi}
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-xl bg-secondary/30 text-center">
              <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Peak</p>
              <p className="text-base md:text-lg font-bold" style={{ color: getAqiColor(maxAqi) }}>
                {maxAqi}
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-xl bg-secondary/30 text-center">
              <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Low</p>
              <p className="text-base md:text-lg font-bold" style={{ color: getAqiColor(minAqi) }}>
                {minAqi}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-40 md:h-48 mb-3 md:mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getAqiColor(city.aqi)} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={getAqiColor(city.aqi)} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="hour"
                  tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(222, 40%, 8%)",
                    border: "1px solid hsl(222, 30%, 16%)",
                    borderRadius: "8px",
                    color: "hsl(210, 40%, 92%)",
                    fontSize: 12,
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "aqi") return [value, "AQI"];
                    if (name === "confidence") return [`${value}%`, "Confidence"];
                    return [value, name];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  stroke={getAqiColor(city.aqi)}
                  fill="url(#forecastGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Trend Arrow Animation */}
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary/20">
            <motion.div
              animate={{
                y: trend === "up" ? [-2, 2, -2] : [2, -2, 2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <TrendingUp
                className={`w-5 h-5 ${
                  trend === "up" ? "text-destructive rotate-0" : "text-primary rotate-180"
                }`}
              />
            </motion.div>
            <p className="text-sm text-muted-foreground">
              {trend === "up" ? "AQI expected to rise" : "AQI expected to improve"} over next 72 hours
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No forecast data available</p>
        </div>
      )}
    </div>
  );
}
