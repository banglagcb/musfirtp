import React, { useState, useEffect } from "react";
import { useApp } from "../../contexts/AppContext";
import ticketNotificationService, {
  NotificationData,
} from "../../services/ticketNotificationService";
import { Plane, MapPin, Clock, X, Ticket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TicketInventoryNotification: React.FC = () => {
  const { language } = useApp();
  const [notification, setNotification] = useState<NotificationData | null>(
    null,
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Subscribe to notification service
    const unsubscribe = ticketNotificationService.subscribe(
      (notificationData) => {
        if (notificationData) {
          setNotification(notificationData);
          setIsVisible(true);
        } else {
          setIsVisible(false);
          // Clear notification after animation
          setTimeout(() => setNotification(null), 300);
        }
      },
    );

    // Start the notification service
    ticketNotificationService.start();

    // Cleanup on unmount
    return () => {
      unsubscribe();
      ticketNotificationService.stop();
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setNotification(null), 300);
  };

  if (!notification) return null;

  const { country } = notification;
  const isLowStock = country.availableTickets <= 5;
  const stockPercentage =
    (country.availableTickets / country.totalTickets) * 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            opacity: { duration: 0.2 },
          }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
          style={{ zIndex: 9999 }}
        >
          <div
            className={`
            relative overflow-hidden rounded-xl shadow-2xl border backdrop-blur-sm
            ${
              isLowStock
                ? "bg-red-50/95 border-red-200 dark:bg-red-950/95 dark:border-red-800"
                : "bg-gradient-to-br from-blue-50/95 to-cyan-50/95 border-blue-200 dark:from-blue-950/95 dark:to-cyan-950/95 dark:border-blue-800"
            }
          `}
          >
            {/* Header */}
            <div
              className={`
              px-4 py-3 flex items-center justify-between
              ${
                isLowStock
                  ? "bg-red-100/80 dark:bg-red-900/80"
                  : "bg-gradient-to-r from-blue-100/80 to-cyan-100/80 dark:from-blue-900/80 dark:to-cyan-900/80"
              }
            `}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`
                  p-1.5 rounded-full
                  ${
                    isLowStock
                      ? "bg-red-200 text-red-700 dark:bg-red-800 dark:text-red-300"
                      : "bg-blue-200 text-blue-700 dark:bg-blue-800 dark:text-blue-300"
                  }
                `}
                >
                  <Ticket size={16} />
                </div>
                <h3
                  className={`
                  font-semibold text-sm
                  ${
                    isLowStock
                      ? "text-red-800 dark:text-red-200"
                      : "text-blue-800 dark:text-blue-200"
                  }
                `}
                >
                  {language === "bn"
                    ? "টিকেট স্টক আপডেট"
                    : "Ticket Stock Update"}
                </h3>
              </div>

              <button
                onClick={handleClose}
                className={`
                  p-1 rounded-full transition-colors
                  ${
                    isLowStock
                      ? "hover:bg-red-200 text-red-600 dark:hover:bg-red-800 dark:text-red-400"
                      : "hover:bg-blue-200 text-blue-600 dark:hover:bg-blue-800 dark:text-blue-400"
                  }
                `}
              >
                <X size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Destination */}
              <div className="flex items-start gap-3">
                <div
                  className={`
                  p-2 rounded-lg mt-0.5
                  ${
                    isLowStock
                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                  }
                `}
                >
                  <MapPin size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-tight">
                    {language === "bn" ? country.countryBn : country.country}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {language === "bn"
                      ? "ঢাকা থেকে " + country.destinationBn
                      : "Dhaka to " + country.destination}
                  </p>
                </div>
              </div>

              {/* Stock Information */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === "bn" ? "উপলব্ধ টিকেট" : "Available Tickets"}
                  </span>
                  <span
                    className={`
                    font-bold text-lg
                    ${
                      isLowStock
                        ? "text-red-600 dark:text-red-400"
                        : "text-blue-600 dark:text-blue-400"
                    }
                  `}
                  >
                    {country.availableTickets}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`
                      h-2.5 rounded-full transition-all duration-300
                      ${
                        isLowStock
                          ? "bg-gradient-to-r from-red-500 to-red-600"
                          : stockPercentage > 50
                            ? "bg-gradient-to-r from-green-500 to-green-600"
                            : "bg-gradient-to-r from-yellow-500 to-orange-500"
                      }
                    `}
                    style={{ width: `${stockPercentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {country.availableTickets} / {country.totalTickets}
                  </span>
                  <span>{Math.round(stockPercentage)}%</span>
                </div>
              </div>

              {/* Warning for low stock */}
              {isLowStock && (
                <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-red-700 dark:text-red-300">
                    {language === "bn"
                      ? "স্টক কম! তাড়াতাড়ি বুক করুন"
                      : "Low Stock! Book Quickly"}
                  </span>
                </div>
              )}

              {/* Last Updated */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-200 dark:border-gray-700">
                <Clock size={12} />
                <span>
                  {language === "bn" ? "আপডেট: " : "Updated: "}
                  {new Date(country.lastUpdated).toLocaleTimeString(
                    language === "bn" ? "bn-BD" : "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: language === "en",
                    },
                  )}
                </span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-tr-full" />

            {/* Animated plane icon for visual appeal */}
            <div className="absolute top-2 right-2">
              <motion.div
                animate={{
                  x: [0, 3, 0],
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`
                  ${
                    isLowStock
                      ? "text-red-300 dark:text-red-600"
                      : "text-blue-300 dark:text-blue-600"
                  }
                `}
              >
                <Plane size={14} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TicketInventoryNotification;
