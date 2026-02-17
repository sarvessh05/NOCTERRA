import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wind, Eye, Activity, Loader2 } from "lucide-react";
import { CityData, getAqiColor } from "@/data/cities";
import { getHealthImpact, HealthImpactData } from "@/services/gemini";

interface HealthCardsProps {
  city: CityData | null;
}

export default function HealthCards({ city }: HealthCardsProps) {
  const [healthData, setHealthData] = useState<HealthImpactData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (city) {
      loadHealthImpact();
    }
  }, [city?.name, city?.aqi]);

  const loadHealthImpact = async () => {
    if (!city) return;
    
    setLoading(true);
    try {
      const data = await getHealthImpact(city.name, city.aqi);
      setHealthData(data);
    } catch (error) {
      setHealthData(null);
    } finally {
      setLoading(false);
    }
  };

  // Default cards when no city selected
  const defaultCards = [
    {
      icon: Activity,
      title: "Respiratory Risk",
      value: "Select a city",
      description: "Click on any city marker to see health impact",
      color: "hsl(var(--aqi-moderate))",
    },
    {
      icon: Eye,
      title: "Visibility Index",
      value: "N/A",
      description: "Real-time data for selected city",
      color: "hsl(var(--aqi-unhealthy-sensitive))",
    },
    {
      icon: Wind,
      title: "Outdoor Activity",
      value: "N/A",
      description: "AI-powered recommendations",
      color: "hsl(var(--aqi-good))",
    },
  ];

  const cards = healthData
    ? [
        {
          icon: Activity,
          title: "Respiratory Risk",
          value: healthData.respiratoryRisk.level,
          description: healthData.respiratoryRisk.description,
          color: healthData.respiratoryRisk.color,
        },
        {
          icon: Eye,
          title: "Visibility Index",
          value: healthData.visibility.value,
          description: healthData.visibility.description,
          color: healthData.visibility.color,
        },
        {
          icon: Wind,
          title: "Outdoor Activity",
          value: healthData.outdoorActivity.level,
          description: healthData.outdoorActivity.description,
          color: healthData.outdoorActivity.color,
        },
      ]
    : defaultCards;

  return (
    <section className="relative z-10 px-4 md:px-6 py-12 md:py-20 max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-2xl md:text-3xl font-bold text-center mb-3 md:mb-4 text-foreground glow-text"
      >
        Health Impact {city && `- ${city.name}`}
      </motion.h2>

      {city && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs md:text-sm text-muted-foreground mb-6 md:mb-8"
        >
          AI-powered health analysis for current air quality
        </motion.p>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">Analyzing health impact...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ scale: 1.03, rotateY: 3, rotateX: -3 }}
              className="glass-panel p-5 md:p-6 cursor-default group"
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            >
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <card.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: card.color }} />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1 text-sm md:text-base">{card.title}</h3>
              <p className="text-base md:text-lg font-bold mb-2" style={{ color: card.color }}>
                {card.value}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">{card.description}</p>

              {/* Glow pulse on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow: `0 0 30px ${card.color}20, inset 0 0 30px ${card.color}08`,
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
