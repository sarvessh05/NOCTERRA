import { motion } from "framer-motion";
import { Wind, Eye, Activity } from "lucide-react";

const cards = [
  {
    icon: Activity,
    title: "Respiratory Risk",
    value: "Moderate",
    description: "Sensitive groups should limit outdoor exposure",
    color: "hsl(var(--aqi-moderate))",
  },
  {
    icon: Eye,
    title: "Visibility Index",
    value: "6.2 km",
    description: "Reduced due to particulate concentration",
    color: "hsl(var(--aqi-unhealthy-sensitive))",
  },
  {
    icon: Wind,
    title: "Outdoor Activity",
    value: "Limited",
    description: "Morning hours recommended for exercise",
    color: "hsl(var(--aqi-good))",
  },
];

export default function HealthCards() {
  return (
    <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-3xl font-bold text-center mb-12 text-foreground glow-text"
      >
        Health Impact
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            whileHover={{ scale: 1.03, rotateY: 3, rotateX: -3 }}
            className="glass-panel p-6 cursor-default group"
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${card.color}20` }}
            >
              <card.icon className="w-6 h-6" style={{ color: card.color }} />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">{card.title}</h3>
            <p className="text-lg font-bold mb-2" style={{ color: card.color }}>
              {card.value}
            </p>
            <p className="text-sm text-muted-foreground">{card.description}</p>

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
    </section>
  );
}
