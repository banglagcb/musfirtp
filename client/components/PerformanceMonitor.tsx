import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Zap, Clock, TrendingUp, Monitor, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PerformanceMonitor } from "@/utils/performance";
import { useApp } from "@/contexts/AppContext";

interface PerformanceMetrics {
  [key: string]: {
    average: number;
    samples: number;
  };
}

interface PerformanceDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const PerformanceDashboard = memo(
  ({ isOpen, onClose }: PerformanceDashboardProps) => {
    const { theme } = useApp();
    const [metrics, setMetrics] = useState<PerformanceMetrics>({});
    const [vitals, setVitals] = useState({
      fcp: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
    });

    useEffect(() => {
      if (!isOpen) return;

      const updateMetrics = () => {
        const monitor = PerformanceMonitor.getInstance();
        setMetrics(monitor.getMetrics());
      };

      const updateVitals = () => {
        if ("web-vitals" in window) {
          // Web Vitals would be imported and used here in a real implementation
          // For now, we'll use Performance API
          const navigation = performance.getEntriesByType(
            "navigation",
          )[0] as PerformanceNavigationTiming;
          const paintEntries = performance.getEntriesByType("paint");

          setVitals({
            fcp:
              paintEntries.find(
                (entry) => entry.name === "first-contentful-paint",
              )?.startTime || 0,
            lcp:
              paintEntries.find(
                (entry) => entry.name === "largest-contentful-paint",
              )?.startTime || 0,
            fid: 0, // Would be measured with actual user interactions
            cls: 0, // Would be measured with layout shift observer
          });
        }
      };

      // Update metrics every second
      const interval = setInterval(() => {
        updateMetrics();
        updateVitals();
      }, 1000);

      // Initial update
      updateMetrics();
      updateVitals();

      return () => clearInterval(interval);
    }, [isOpen]);

    const formatTime = (ms: number) => `${ms.toFixed(2)}ms`;
    const formatScore = (score: number) => {
      if (score < 100) return { color: "text-green-500", label: "Good" };
      if (score < 300)
        return { color: "text-yellow-500", label: "Needs Improvement" };
      return { color: "text-red-500", label: "Poor" };
    };

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={cn(
              "w-full max-w-4xl rounded-2xl border p-6 max-h-[90vh] overflow-auto",
              theme === "dark"
                ? "bg-gray-900/95 border-gray-700 text-white"
                : "bg-white/95 border-gray-200 text-gray-900",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Performance Monitor</h2>
                  <p
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Real-time performance metrics
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  theme === "dark"
                    ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-900",
                )}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Web Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div
                className={cn(
                  "p-4 rounded-xl border",
                  theme === "dark"
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-gray-50 border-gray-200",
                )}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">FCP</span>
                </div>
                <div className="text-2xl font-bold">
                  {formatTime(vitals.fcp)}
                </div>
                <div className={`text-xs ${formatScore(vitals.fcp).color}`}>
                  {formatScore(vitals.fcp).label}
                </div>
              </div>

              <div
                className={cn(
                  "p-4 rounded-xl border",
                  theme === "dark"
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-gray-50 border-gray-200",
                )}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Monitor className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">LCP</span>
                </div>
                <div className="text-2xl font-bold">
                  {formatTime(vitals.lcp)}
                </div>
                <div className={`text-xs ${formatScore(vitals.lcp).color}`}>
                  {formatScore(vitals.lcp).label}
                </div>
              </div>

              <div
                className={cn(
                  "p-4 rounded-xl border",
                  theme === "dark"
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-gray-50 border-gray-200",
                )}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">FID</span>
                </div>
                <div className="text-2xl font-bold">
                  {formatTime(vitals.fid)}
                </div>
                <div className={`text-xs ${formatScore(vitals.fid).color}`}>
                  {formatScore(vitals.fid).label}
                </div>
              </div>

              <div
                className={cn(
                  "p-4 rounded-xl border",
                  theme === "dark"
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-gray-50 border-gray-200",
                )}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">CLS</span>
                </div>
                <div className="text-2xl font-bold">
                  {vitals.cls.toFixed(3)}
                </div>
                <div
                  className={`text-xs ${formatScore(vitals.cls * 1000).color}`}
                >
                  {formatScore(vitals.cls * 1000).label}
                </div>
              </div>
            </div>

            {/* Custom Metrics */}
            <div
              className={cn(
                "rounded-xl border p-4",
                theme === "dark"
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-gray-50 border-gray-200",
              )}
            >
              <h3 className="text-lg font-semibold mb-4">
                Component Performance
              </h3>
              <div className="space-y-3">
                {Object.entries(metrics).map(([name, data]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{name}</span>
                    <div className="text-right">
                      <div className="text-sm font-mono">
                        {formatTime(data.average)}
                      </div>
                      <div
                        className={cn(
                          "text-xs",
                          theme === "dark" ? "text-gray-400" : "text-gray-600",
                        )}
                      >
                        {data.samples} samples
                      </div>
                    </div>
                  </div>
                ))}
                {Object.keys(metrics).length === 0 && (
                  <div
                    className={cn(
                      "text-center py-8",
                      theme === "dark" ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    No performance data available yet
                  </div>
                )}
              </div>
            </div>

            {/* Memory Usage */}
            <div
              className={cn(
                "rounded-xl border p-4 mt-4",
                theme === "dark"
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-gray-50 border-gray-200",
              )}
            >
              <h3 className="text-lg font-semibold mb-4">Memory Usage</h3>
              {(performance as any).memory ? (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Used JS Heap</div>
                    <div className="text-lg font-mono">
                      {(
                        (performance as any).memory.usedJSHeapSize /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total JS Heap</div>
                    <div className="text-lg font-mono">
                      {(
                        (performance as any).memory.totalJSHeapSize /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Heap Limit</div>
                    <div className="text-lg font-mono">
                      {(
                        (performance as any).memory.jsHeapSizeLimit /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "text-center py-4",
                    theme === "dark" ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Memory API not available in this browser
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  },
);

PerformanceDashboard.displayName = "PerformanceDashboard";

export default PerformanceDashboard;

// Performance monitoring hook
export function usePerformanceMonitor() {
  const [isOpen, setIsOpen] = useState(false);

  const showMonitor = () => setIsOpen(true);
  const hideMonitor = () => setIsOpen(false);

  return {
    isOpen,
    showMonitor,
    hideMonitor,
    PerformanceDashboard: () => (
      <PerformanceDashboard isOpen={isOpen} onClose={hideMonitor} />
    ),
  };
}
