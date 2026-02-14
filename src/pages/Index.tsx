import { useState, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlobeScene from "@/components/GlobeScene";
import PredictionPanel from "@/components/PredictionPanel";
import SimulationControls from "@/components/SimulationControls";
import HealthCards from "@/components/HealthCards";
import AIInsightPanel from "@/components/AIInsightPanel";
import AIForecastPanel from "@/components/AIForecastPanel";
import CityComparison from "@/components/CityComparison";
import { CityData, cities as allCities } from "@/data/cities";
import { MapPin, Search, Sparkles, GitCompare } from "lucide-react";

export default function Index() {
  const [entered, setEntered] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [futureMode, setFutureMode] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationIntensity, setSimulationIntensity] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showAIInsight, setShowAIInsight] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleEnter = useCallback(() => setEntered(true), []);
  const handleCitySelect = useCallback((city: CityData | null) => setSelectedCity(city), []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
      const found = allCities.find(
        (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (found) {
        setSelectedCity(found);
        setShowSearch(false);
        setSearchQuery("");
      }
    },
    [searchQuery]
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* 3D Globe - always rendered */}
      <div className="fixed inset-0 z-0">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <GlobeScene
            onCitySelect={handleCitySelect}
            selectedCity={selectedCity}
            simulationIntensity={simulationActive ? simulationIntensity : 0}
            entered={entered}
          />
        </Suspense>
      </div>

      {/* Landing Overlay */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            className="fixed inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-md"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80 pointer-events-none" />

            <motion.div className="relative text-center px-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-sm font-body tracking-[0.3em] uppercase text-muted-foreground mb-4"
              >
                AERIS
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="font-display text-5xl md:text-7xl font-bold text-foreground glow-text mb-3"
              >
                Your City Is Breathing.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="font-display text-2xl md:text-3xl text-muted-foreground mb-12"
              >
                But Is It Surviving?
              </motion.p>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEnter}
                className="px-8 py-4 rounded-2xl font-display font-semibold text-primary-foreground bg-primary/90 backdrop-blur-md border border-primary/30 hover:bg-primary transition-all duration-300"
                style={{
                  boxShadow: "0 0 40px hsla(170, 80%, 50%, 0.25), 0 0 80px hsla(170, 80%, 50%, 0.1)",
                }}
              >
                Enter Live Atmosphere
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main UI (shown after entering) */}
      {entered && (
        <>
          {/* Top bar */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
              <span className="font-display text-sm font-semibold text-foreground tracking-wider">
                AERIS
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                title="Search City"
              >
                <Search className="w-4 h-4" />
              </button>
              {selectedCity && (
                <>
                  <button
                    onClick={() => setShowAIInsight(!showAIInsight)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors relative"
                    title="AI Insights"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </button>
                  <button
                    onClick={() => setShowComparison(true)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                    title="Compare Cities"
                  >
                    <GitCompare className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setSelectedCity(null);
                  setSimulationActive(false);
                  setSimulationIntensity(0);
                  setShowAIInsight(false);
                }}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                title="Reset View"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </motion.header>

          {/* Search bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSearch}
                className="fixed top-16 left-1/2 -translate-x-1/2 z-30 w-80"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city..."
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-secondary/80 backdrop-blur-md border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </motion.form>
            )}
          </AnimatePresence>

          {/* Prediction Panel - right side */}
          <div className="fixed top-20 right-6 z-20 space-y-4 max-w-md">
            <AnimatePresence>
              {selectedCity && (
                <>
                  <PredictionPanel
                    city={selectedCity}
                    futureMode={futureMode}
                    onToggleFuture={() => setFutureMode(!futureMode)}
                    onClose={() => setSelectedCity(null)}
                  />
                  
                  {showAIInsight && (
                    <AIInsightPanel
                      city={selectedCity}
                      onClose={() => setShowAIInsight(false)}
                    />
                  )}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* AI Forecast Panel - bottom center */}
          {selectedCity && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 w-full max-w-3xl px-6">
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <AIForecastPanel city={selectedCity} />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Simulation Controls - bottom left */}
          <div className="fixed bottom-6 left-6 z-20">
            <SimulationControls
              intensity={simulationIntensity}
              onIntensityChange={setSimulationIntensity}
              active={simulationActive}
              onToggle={() => setSimulationActive(!simulationActive)}
            />
          </div>

          {/* Hint text */}
          {!selectedCity && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 text-xs text-muted-foreground text-center"
            >
              Click on any city marker to explore its atmosphere
            </motion.p>
          )}

          {/* City Comparison Modal */}
          <AnimatePresence>
            {showComparison && selectedCity && (
              <CityComparison
                initialCity={selectedCity}
                onClose={() => setShowComparison(false)}
              />
            )}
          </AnimatePresence>
        </>
      )}

      {/* Health Cards Section (scrollable below) */}
      {entered && (
        <div className="relative z-10 mt-[100vh]">
          <HealthCards />

          {/* Footer */}
          <footer className="relative z-10 text-center py-12 text-xs text-muted-foreground">
            <p className="font-display tracking-wider">AERIS — The Earth That Breathes</p>
          </footer>
        </div>
      )}
    </div>
  );
}
