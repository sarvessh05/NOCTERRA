import { motion } from "framer-motion";
import { CityData, getAqiColor, getAqiLabel } from "@/data/cities";
import { TrendingUp, TrendingDown, Minus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllAirQualityData } from "@/services/gemini";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

interface PredictionPanelProps {
  city: CityData;
  futureMode: boolean;
  onToggleFuture: () => void;
  onClose: () => void;
}

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PredictionPanel({
  city,
  futureMode,
  onToggleFuture,
  onClose,
}: PredictionPanelProps) {
  const [futureProjection, setFutureProjection] = useState({ percentIncrease: 12, reason: 'rising temperature and wind stagnation' });

  useEffect(() => {
    // Fetch AI projection data
    const fetchProjection = async () => {
      try {
        const data = await getAllAirQualityData(city.name, city.aqi, city.trend, city.forecast);
        if (data.insight.futureProjection) {
          setFutureProjection(data.insight.futureProjection);
        }
      } catch (error) {
        // Failed to get future projection
      }
    };
    fetchProjection();
  }, [city.name, city.aqi]);

  const projectionMultiplier = 1 + (futureProjection.percentIncrease / 100);
  
  const chartData = city.forecast.map((val, i) => ({
    day: dayLabels[i],
    aqi: val,
    projected: futureMode ? Math.round(val * projectionMultiplier) : val,
  }));

  const trendIcon =
    city.trend === "up" ? (
      <TrendingUp className="w-4 h-4" />
    ) : city.trend === "down" ? (
      <TrendingDown className="w-4 h-4" />
    ) : (
      <Minus className="w-4 h-4" />
    );

  const riskPercent = Math.min(100, (city.aqi / 500) * 100);
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (riskPercent / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-panel p-4 md:p-6 w-full max-h-[85vh] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 md:mb-6">
        <div>
          <h2 className="font-display text-lg md:text-xl font-bold text-foreground">
            {city.name}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">{city.country} · {city.population}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* AQI Display */}
      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="relative w-20 h-20 md:w-24 md:h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50" cy="50" r="40"
              stroke="hsl(var(--border))"
              strokeWidth="6"
              fill="none"
            />
            <motion.circle
              cx="50" cy="50" r="40"
              stroke={getAqiColor(city.aqi)}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-xl md:text-2xl font-display font-bold"
              style={{ color: getAqiColor(city.aqi) }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {city.aqi}
            </motion.span>
            <span className="text-[9px] md:text-[10px] text-muted-foreground">AQI</span>
          </div>
        </div>
        <div>
          <p className="text-xs md:text-sm font-medium" style={{ color: getAqiColor(city.aqi) }}>
            {getAqiLabel(city.aqi)}
          </p>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground text-[10px] md:text-xs">
            {trendIcon}
            <span>
              {city.trend === "up" ? "Rising" : city.trend === "down" ? "Declining" : "Stable"}
            </span>
          </div>
        </div>
      </div>

      {/* Future Mode Toggle */}
      <div className="flex items-center justify-between mb-3 md:mb-4 p-2.5 md:p-3 rounded-xl bg-secondary/50">
        <div>
          <p className="text-xs md:text-sm font-medium text-foreground">Future Mode</p>
          <p className="text-[10px] md:text-[11px] text-muted-foreground">Show projected AQI</p>
        </div>
        <button
          onClick={onToggleFuture}
          className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
            futureMode ? "bg-primary" : "bg-border"
          }`}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-foreground"
            animate={{ x: futureMode ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      {/* Chart */}
      <div className="mb-3 md:mb-4">
        <p className="text-[10px] md:text-xs text-muted-foreground mb-2">7-Day Forecast</p>
        <div className="h-28 md:h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getAqiColor(city.aqi)} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={getAqiColor(city.aqi)} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "hsl(222, 40%, 8%)",
                  border: "1px solid hsl(222, 30%, 16%)",
                  borderRadius: "8px",
                  color: "hsl(210, 40%, 92%)",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="aqi"
                stroke={getAqiColor(city.aqi)}
                fill="url(#aqiGrad)"
                strokeWidth={2}
              />
              {futureMode && (
                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke="hsl(0, 84%, 55%)"
                  fill="none"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Future mode message */}
      {futureMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 mb-2"
        >
          <p className="text-xs text-destructive">
            Projected Rise: {futureProjection.percentIncrease}% due to {futureProjection.reason}.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
