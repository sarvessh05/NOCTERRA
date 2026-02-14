import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown, Minus, Loader2, X } from "lucide-react";
import { CityData } from "@/data/cities";
import { getAirQualityInsight, AirQualityInsight } from "@/services/gemini";

interface AIInsightPanelProps {
  city: CityData;
  onClose: () => void;
}

export default function AIInsightPanel({ city, onClose }: AIInsightPanelProps) {
  const [insight, setInsight] = useState<AirQualityInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    setLoading(true);
    try {
      const result = await getAirQualityInsight(city.name, city.aqi, city.trend);
      setInsight(result);
    } catch (error) {
      console.error("Failed to get insight:", error);
    } finally {
      setLoading(false);
    }
  };

  const trendIcon =
    city.trend === "up" ? (
      <TrendingUp className="w-4 h-4" />
    ) : city.trend === "down" ? (
      <TrendingDown className="w-4 h-4" />
    ) : (
      <Minus className="w-4 h-4" />
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="glass-panel p-4 w-full max-h-[calc(100vh-6rem)] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">AI Insights</h3>
            <p className="text-xs text-muted-foreground">{city.name}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Current Status */}
      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-secondary/50">
        <div className="text-2xl font-display font-bold text-primary">{city.aqi}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Current AQI</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {trendIcon}
            <span>{city.trend === "up" ? "Rising" : city.trend === "down" ? "Declining" : "Stable"}</span>
          </div>
        </div>
      </div>

      {/* Explain Button */}
      {!insight && !loading && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExplain}
          className="w-full py-3 px-4 rounded-xl font-display font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Explain Today's Air
        </motion.button>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">Analyzing air quality data...</p>
        </div>
      )}

      {/* Insight Display */}
      <AnimatePresence>
        {insight && !loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Explanation */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <h4 className="text-sm font-semibold text-foreground">Why This AQI?</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{insight.explanation}</p>
            </div>

            {/* Health Advice */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <h4 className="text-sm font-semibold text-foreground">Activity Advice</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{insight.healthAdvice}</p>
            </div>

            {/* Trend Prediction */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <h4 className="text-sm font-semibold text-foreground">What's Next</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{insight.trend}</p>
            </div>

            {/* AI Confidence */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20">
              <span className="text-xs text-muted-foreground">AI Confidence</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${insight.confidence}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-primary/60"
                  />
                </div>
                <span className="text-sm font-semibold text-primary">{insight.confidence}%</span>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleExplain}
              className="w-full py-2 px-4 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              Refresh Analysis
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
