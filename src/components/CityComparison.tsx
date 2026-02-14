import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ArrowRight } from "lucide-react";
import { CityData, cities, getAqiColor, getAqiLabel } from "@/data/cities";

interface CityComparisonProps {
  initialCity: CityData;
  onClose: () => void;
}

export default function CityComparison({ initialCity, onClose }: CityComparisonProps) {
  const [city1] = useState<CityData>(initialCity);
  const [city2, setCity2] = useState<CityData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(true);

  const filteredCities = cities.filter(
    (c) =>
      c.name !== city1.name &&
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCity = (city: CityData) => {
    setCity2(city);
    setShowSearch(false);
  };

  const aqiDiff = city2 ? city2.aqi - city1.aqi : 0;
  const percentDiff = city2 ? Math.round((aqiDiff / city1.aqi) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-panel p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">City Comparison</h2>
            <p className="text-xs md:text-sm text-muted-foreground">Compare air quality between cities</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split Screen Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
          {/* City 1 */}
          <CityCard city={city1} label="City 1" />

          {/* City 2 or Search */}
          {city2 ? (
            <CityCard city={city2} label="City 2" onRemove={() => setCity2(null)} />
          ) : (
            <div className="p-4 md:p-6 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center min-h-[250px] md:min-h-[300px]">
              {showSearch ? (
                <>
                  <Search className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mb-3 md:mb-4" />
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">Select a city to compare</p>
                  
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city..."
                    className="w-full px-4 py-2 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                    autoFocus
                  />

                  <div className="w-full max-h-48 overflow-y-auto space-y-2">
                    {filteredCities.slice(0, 10).map((city) => (
                      <button
                        key={city.name}
                        onClick={() => handleSelectCity(city)}
                        className="w-full p-3 rounded-xl bg-secondary/50 hover:bg-secondary text-left transition-colors"
                      >
                        <p className="text-sm font-medium text-foreground">{city.name}</p>
                        <p className="text-xs text-muted-foreground">{city.country}</p>
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>

        {/* Comparison Stats */}
        {city2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* AQI Difference */}
            <div className="p-3 md:p-4 rounded-xl bg-secondary/30 border border-border">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <span className="text-xs md:text-sm text-muted-foreground">AQI Difference</span>
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="text-xl md:text-2xl font-bold" style={{ color: aqiDiff > 0 ? "hsl(0, 84%, 55%)" : "hsl(142, 76%, 36%)" }}>
                    {aqiDiff > 0 ? "+" : ""}{aqiDiff}
                  </span>
                  <span className="text-xs md:text-sm text-muted-foreground">({percentDiff > 0 ? "+" : ""}{percentDiff}%)</span>
                </div>
              </div>
              
              {/* Visual Bar Comparison */}
              <div className="relative h-10 md:h-12 rounded-xl bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(city1.aqi / Math.max(city1.aqi, city2.aqi)) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-full flex items-center justify-end pr-3"
                  style={{ backgroundColor: getAqiColor(city1.aqi) + "80" }}
                >
                  <span className="text-xs font-semibold text-foreground">{city1.name}: {city1.aqi}</span>
                </motion.div>
                
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(city2.aqi / Math.max(city1.aqi, city2.aqi)) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="absolute left-0 bottom-0 h-full flex items-center justify-end pr-3"
                  style={{ backgroundColor: getAqiColor(city2.aqi) + "80" }}
                >
                  <span className="text-xs font-semibold text-foreground">{city2.name}: {city2.aqi}</span>
                </motion.div>
              </div>
            </div>

            {/* Winner Badge */}
            <div className="p-3 md:p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Better Air Quality</p>
              <p className="text-lg md:text-xl font-bold text-primary">
                {city1.aqi < city2.aqi ? city1.name : city2.name}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                {Math.abs(percentDiff)}% cleaner air
              </p>
            </div>

            {/* Side by Side Stats */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <div className="p-2 md:p-3 rounded-xl bg-secondary/30 text-center">
                <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Population</p>
                <p className="text-xs md:text-sm font-semibold text-foreground">{city1.population}</p>
                <ArrowRight className="w-3 h-3 mx-auto my-1 text-muted-foreground" />
                <p className="text-xs md:text-sm font-semibold text-foreground">{city2.population}</p>
              </div>
              
              <div className="p-2 md:p-3 rounded-xl bg-secondary/30 text-center">
                <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Trend</p>
                <p className="text-xs md:text-sm font-semibold text-foreground capitalize">{city1.trend}</p>
                <ArrowRight className="w-3 h-3 mx-auto my-1 text-muted-foreground" />
                <p className="text-xs md:text-sm font-semibold text-foreground capitalize">{city2.trend}</p>
              </div>
              
              <div className="p-2 md:p-3 rounded-xl bg-secondary/30 text-center">
                <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Category</p>
                <p className="text-[10px] md:text-xs font-semibold" style={{ color: getAqiColor(city1.aqi) }}>
                  {getAqiLabel(city1.aqi)}
                </p>
                <ArrowRight className="w-3 h-3 mx-auto my-1 text-muted-foreground" />
                <p className="text-[10px] md:text-xs font-semibold" style={{ color: getAqiColor(city2.aqi) }}>
                  {getAqiLabel(city2.aqi)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function CityCard({ city, label, onRemove }: { city: CityData; label: string; onRemove?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 md:p-6 rounded-2xl border border-border bg-secondary/20 relative"
    >
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 md:top-3 md:right-3 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      
      <p className="text-[10px] md:text-xs text-muted-foreground mb-2">{label}</p>
      <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-1">{city.name}</h3>
      <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">{city.country} · {city.population}</p>
      
      {/* AQI Circle */}
      <div className="flex items-center justify-center mb-3 md:mb-4">
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="hsl(var(--border))"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke={getAqiColor(city.aqi)}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 40}
              initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - city.aqi / 500) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-display font-bold" style={{ color: getAqiColor(city.aqi) }}>
              {city.aqi}
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground">AQI</span>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-xs md:text-sm font-semibold mb-1" style={{ color: getAqiColor(city.aqi) }}>
          {getAqiLabel(city.aqi)}
        </p>
        <p className="text-[10px] md:text-xs text-muted-foreground capitalize">{city.trend} trend</p>
      </div>
    </motion.div>
  );
}
