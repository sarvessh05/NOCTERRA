import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface SimulationControlsProps {
  intensity: number;
  onIntensityChange: (val: number) => void;
  active: boolean;
  onToggle: () => void;
}

export default function SimulationControls({
  intensity,
  onIntensityChange,
  active,
  onToggle,
}: SimulationControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel p-4 md:p-5 w-full max-w-[300px]"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-aqi-unhealthy" />
        <h3 className="font-display font-semibold text-sm text-foreground">
          Pollution Simulation
        </h3>
      </div>

      <button
        onClick={onToggle}
        className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 mb-4 ${
          active
            ? "bg-destructive/20 text-destructive border border-destructive/30"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        {active ? "Simulation Active" : "Simulate Extreme Scenario"}
      </button>

      {active && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <label className="text-xs text-muted-foreground block mb-2">
            Industrial Growth Rate
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={intensity}
            onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(var(--aqi-good)) 0%, hsl(var(--aqi-unhealthy)) 50%, hsl(var(--aqi-hazardous)) 100%)`,
            }}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>Low</span>
            <span>Extreme</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
