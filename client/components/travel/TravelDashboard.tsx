import React, { memo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plane,
  Users,
  CreditCard,
  TrendingUp,
  Calendar,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Search,
  Package,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import dataService from "@/services/dataService";
import { DashboardStats, User } from "@shared/travel-types";
import { useApp, useTranslation } from "@/contexts/AppContext";
import { PerformanceMonitor } from "@/utils/performance";
import {
  staggeredContainer,
  scaleIn,
  cardHover,
  cardTap,
  fadeInUp,
  getOptimizedVariants,
} from "@/utils/animationConfig";

interface TravelDashboardProps {
  user: User;
  onCardClick: (cardId: string) => void;
}

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
}

const dashboardCards: DashboardCard[] = [
  {
    id: "new-booking",
    title: "নতুন বুকিং",
    description: "নতুন ফ্লাইট বুকিং যোগ কর����ন",
    icon: PlusCircle,
    color: "from-neon-green to-neon-blue",
    gradient: "bg-gradient-to-br from-green-500/20 to-blue-500/20",
  },
  {
    id: "bookings-list",
    title: "ব���কিং লিস্ট",
    description: "সব বুকিং দে���ুন ও ম্যানেজ করুন",
    icon: FileText,
    color: "from-neon-blue to-neon-purple",
    gradient: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
  },
  {
    id: "search-filter",
    title: "সার্চ ও ফ���ল্টার",
    description: "���ুকিং খ��ঁজুন ও ফিল্টার করুন",
    icon: Search,
    color: "from-neon-purple to-neon-pink",
    gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
  },
  {
    id: "reports",
    title: "রিপোর্ট",
    description: "বিক্রয় ও মুনাফার রিপোর্ট দেখুন",
    icon: TrendingUp,
    color: "from-orange-500 to-red-500",
    gradient: "bg-gradient-to-br from-orange-500/20 to-red-500/20",
  },
  {
    id: "export-data",
    title: "��েটা এক্সপো��্ট",
    description: "CSV/Excel ফাইলে ডাউনলোড করুন",
    icon: DollarSign,
    color: "from-green-500 to-teal-500",
    gradient: "bg-gradient-to-br from-green-500/20 to-teal-500/20",
  },
  {
    id: "ticket-inventory",
    title: "টিকেট ইনভেন্টরি",
    description: "টিকেট স্টক দেখুন ও ম্যানেজ করুন",
    icon: Package,
    color: "from-indigo-500 to-purple-500",
    gradient: "bg-gradient-to-br from-indigo-500/20 to-purple-500/20",
  },
  {
    id: "bulk-purchase",
    title: "বাল্ক টিকেট ক্রয়",
    description: "অগ্রিম টিকেট ক্রয় করুন",
    icon: ShoppingCart,
    color: "from-emerald-500 to-teal-500",
    gradient: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "settings",
    title: "সেটিংস",
    description: "সিস্টেম সেটিংস ও কনফিগারেশন",
    icon: Calendar,
    color: "from-red-500 to-pink-500",
    gradient: "bg-gradient-to-br from-red-500/20 to-pink-500/20",
  },
];

export default function TravelDashboard({
  user,
  onCardClick,
}: TravelDashboardProps) {
  const { isMobile, isTablet, theme } = useApp();
  const { t, language } = useTranslation();

  // Get font class based on language
  const fontClass = language === "bn" ? "font-bengali" : "font-english";

  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    todayBookings: 0,
    totalRevenue: 0,
    totalProfit: 0,
    pendingPayments: 0,
    paidBookings: 0,
    partialPayments: 0,
  });

  useEffect(() => {
    const dashboardStats = dataService.getDashboardStats();
    setStats(dashboardStats);
  }, []);

  // Memoized dashboard cards with translations
  const dashboardCards = useMemo(
    () => [
      {
        id: "new-booking",
        title: t("newBooking"),
        description:
          language === "bn"
            ? "নতুন ফ্লাইট বুকিং যোগ করুন"
            : "Add new flight booking",
        icon: PlusCircle,
        color: "from-neon-green to-neon-blue",
        gradient: "bg-gradient-to-br from-green-500/20 to-blue-500/20",
      },
      {
        id: "bookings-list",
        title: t("bookings"),
        description:
          language === "bn"
            ? "সব বুকিং ��েখুন ও ম্যানেজ করুন"
            : "View and manage all bookings",
        icon: FileText,
        color: "from-neon-blue to-neon-purple",
        gradient: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
      },
      {
        id: "search-filter",
        title: t("searchAndFilter"),
        description:
          language === "bn"
            ? "বুকিং খুঁজ��ন ও ফিল্টার করুন"
            : "Search and filter bookings",
        icon: Search,
        color: "from-neon-purple to-neon-pink",
        gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
      },
      {
        id: "reports",
        title: t("reports"),
        description:
          language === "bn"
            ? "বিক্রয় ও মুনাফার রিপোর্ট দেখুন"
            : "View sales and profit reports",
        icon: TrendingUp,
        color: "from-orange-500 to-red-500",
        gradient: "bg-gradient-to-br from-orange-500/20 to-red-500/20",
      },
      {
        id: "export-data",
        title: t("dataExport"),
        description:
          language === "bn"
            ? "CSV/Excel ফাইলে ডাউনলোড করুন"
            : "Download as CSV/Excel files",
        icon: DollarSign,
        color: "from-green-500 to-teal-500",
        gradient: "bg-gradient-to-br from-green-500/20 to-teal-500/20",
      },
      {
        id: "ticket-inventory",
        title: t("inventory"),
        description:
          language === "bn"
            ? "টিকেট স্টক দেখুন ও ম্যানেজ করুন"
            : "View and manage ticket inventory",
        icon: Package,
        color: "from-indigo-500 to-purple-500",
        gradient: "bg-gradient-to-br from-indigo-500/20 to-purple-500/20",
      },
      ...(user.role === "owner"
        ? [
            {
              id: "bulk-purchase",
              title: t("bulkPurchase"),
              description:
                language === "bn"
                  ? "অগ্রিম টি��েট ক্রয় করুন"
                  : "Purchase tickets in advance",
              icon: ShoppingCart,
              color: "from-emerald-500 to-teal-500",
              gradient: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
            },
          ]
        : []),
      {
        id: "settings",
        title: t("settings"),
        description:
          language === "bn"
            ? "সিস্টেম সেটিংস ও কনফিগারেশন"
            : "System settings and configuration",
        icon: Calendar,
        color: "from-red-500 to-pink-500",
        gradient: "bg-gradient-to-br from-red-500/20 to-pink-500/20",
      },
    ],
    [user.role, t, language],
  );

  // Memoized card click handler to prevent unnecessary re-renders
  const handleCardClick = useCallback(
    (cardId: string) => {
      onCardClick(cardId);
    },
    [onCardClick],
  );

  // Optimized animation variants for better performance
  const containerVariants = useMemo(
    () => getOptimizedVariants(staggeredContainer),
    [],
  );
  const cardVariants = useMemo(() => getOptimizedVariants(scaleIn), []);

  // Memoized currency formatter for better performance
  const formatCurrency = useMemo(() => {
    const formatter = new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    });
    return (amount: number) => formatter.format(amount);
  }, []);

  // Performance monitoring
  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    const endTimer = monitor.startTimer("dashboard-render");
    return endTimer;
  }, []);

  return (
    <div
      className={cn(
        "min-h-screen p-6 transition-colors duration-300",
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
        fontClass,
      )}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1
              className={cn(
                "text-4xl font-bold mb-2 transition-colors",
                theme === "dark" ? "text-white" : "text-gray-800",
              )}
            >
              {t("dashboard")}
            </h1>
            <p
              className={cn(
                "transition-colors",
                theme === "dark" ? "text-white/70" : "text-gray-600",
              )}
            >
              {t("welcome")}, {user.name} -{" "}
              {user.role === "owner" ? t("owner") : t("manager")}
            </p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-folder-primary to-folder-secondary rounded-full flex items-center justify-center"
          >
            <Plane className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div
          className={cn(
            "backdrop-blur-md rounded-2xl p-6 border transition-colors",
            theme === "dark"
              ? "bg-white/10 border-white/20"
              : "bg-white/80 border-gray-200",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm transition-colors",
                  theme === "dark" ? "text-white/70" : "text-gray-600",
                )}
              >
                {t("totalBookings")}
              </p>
              <p
                className={cn(
                  "text-2xl font-bold transition-colors",
                  theme === "dark" ? "text-white" : "text-gray-800",
                )}
              >
                {stats.totalBookings}
              </p>
            </div>
            <Users className="w-8 h-8 text-neon-blue" />
          </div>
        </div>

        <div
          className={cn(
            "backdrop-blur-md rounded-2xl p-6 border transition-colors",
            theme === "dark"
              ? "bg-white/10 border-white/20"
              : "bg-white/80 border-gray-200",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm transition-colors",
                  theme === "dark" ? "text-white/70" : "text-gray-600",
                )}
              >
                {t("todayBookings")}
              </p>
              <p
                className={cn(
                  "text-2xl font-bold transition-colors",
                  theme === "dark" ? "text-white" : "text-gray-800",
                )}
              >
                {stats.todayBookings}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-neon-green" />
          </div>
        </div>

        <div
          className={cn(
            "backdrop-blur-md rounded-2xl p-6 border transition-colors",
            theme === "dark"
              ? "bg-white/10 border-white/20"
              : "bg-white/80 border-gray-200",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm transition-colors",
                  theme === "dark" ? "text-white/70" : "text-gray-600",
                )}
              >
                {t("totalRevenue")}
              </p>
              <p
                className={cn(
                  "text-xl font-bold transition-colors",
                  theme === "dark" ? "text-white" : "text-gray-800",
                )}
              >
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-neon-purple" />
          </div>
        </div>

        <div
          className={cn(
            "backdrop-blur-md rounded-2xl p-6 border transition-colors",
            theme === "dark"
              ? "bg-white/10 border-white/20"
              : "bg-white/80 border-gray-200",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm transition-colors",
                  theme === "dark" ? "text-white/70" : "text-gray-600",
                )}
              >
                {t("totalProfit")}
              </p>
              <p
                className={cn(
                  "text-xl font-bold transition-colors",
                  theme === "dark" ? "text-white" : "text-gray-800",
                )}
              >
                {formatCurrency(stats.totalProfit)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-neon-pink" />
          </div>
        </div>
      </motion.div>

      {/* Payment Status Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div
          className={cn(
            "backdrop-blur-md rounded-2xl p-6 border transition-colors",
            theme === "dark"
              ? "bg-white/10 border-white/20"
              : "bg-white/80 border-gray-200",
          )}
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-neon-green" />
            <div>
              <p
                className={cn(
                  "text-sm transition-colors",
                  theme === "dark" ? "text-white/70" : "text-gray-600",
                )}
              >
                {t("paidBookings")}
              </p>
              <p
                className={cn(
                  "text-2xl font-bold transition-colors",
                  theme === "dark" ? "text-white" : "text-gray-800",
                )}
              >
                {stats.paidBookings}
              </p>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "backdrop-blur-md rounded-2xl p-6 border transition-colors",
            theme === "dark"
              ? "bg-white/10 border-white/20"
              : "bg-white/80 border-gray-200",
          )}
        >
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-400" />
            <div>
              <p
                className={cn(
                  "text-sm transition-colors",
                  theme === "dark" ? "text-white/70" : "text-gray-600",
                )}
              >
                {t("partialPayments")}
              </p>
              <p
                className={cn(
                  "text-2xl font-bold transition-colors",
                  theme === "dark" ? "text-white" : "text-gray-800",
                )}
              >
                {stats.partialPayments}
              </p>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "backdrop-blur-md rounded-2xl p-6 border transition-colors",
            theme === "dark"
              ? "bg-white/10 border-white/20"
              : "bg-white/80 border-gray-200",
          )}
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <div>
              <p
                className={cn(
                  "text-sm transition-colors",
                  theme === "dark" ? "text-white/70" : "text-gray-600",
                )}
              >
                {t("pendingPayments")}
              </p>
              <p
                className={cn(
                  "text-2xl font-bold transition-colors",
                  theme === "dark" ? "text-white" : "text-gray-800",
                )}
              >
                {stats.pendingPayments}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {dashboardCards
          .filter((card) => {
            // Hide bulk purchase card for managers
            if (card.id === "bulk-purchase" && user.role === "manager") {
              return false;
            }
            return true;
          })
          .map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover={cardHover}
              whileTap={cardTap}
              onClick={() => handleCardClick(card.id)}
              className={cn(
                "relative group cursor-pointer rounded-2xl p-6 border transition-all duration-300 overflow-hidden",
                theme === "dark"
                  ? "border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/40 hover:shadow-2xl hover:shadow-purple-500/25"
                  : "border-gray-200 bg-white/90 backdrop-blur-md hover:bg-white hover:border-gray-300 hover:shadow-2xl hover:shadow-blue-500/25",
              )}
            >
              {/* Background Gradient */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  card.gradient,
                )}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={cn(
                    "w-12 h-12 rounded-xl mb-4 flex items-center justify-center",
                    `bg-gradient-to-r ${card.color}`,
                  )}
                >
                  <card.icon className="w-6 h-6 text-white" />
                </motion.div>

                {/* Title & Description */}
                <h3
                  className={cn(
                    "text-xl font-semibold mb-2 transition-colors",
                    theme === "dark"
                      ? "text-white group-hover:text-white"
                      : "text-gray-800 group-hover:text-gray-900",
                  )}
                >
                  {card.title}
                </h3>
                <p
                  className={cn(
                    "text-sm mb-4 transition-colors",
                    theme === "dark"
                      ? "text-white/70 group-hover:text-white/90"
                      : "text-gray-600 group-hover:text-gray-700",
                  )}
                >
                  {card.description}
                </p>

                {/* Hover Effect Indicator */}
                <motion.div
                  className={cn(
                    "absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                    theme === "dark" ? "bg-white" : "bg-gray-800",
                  )}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              {/* Glow Effect */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  theme === "dark" ? "via-white/5" : "via-gray-900/5",
                )}
              />
            </motion.div>
          ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className={cn(
          "mt-8 backdrop-blur-md rounded-2xl p-6 border transition-colors",
          theme === "dark"
            ? "bg-white/10 border-white/20"
            : "bg-white/80 border-gray-200",
        )}
      >
        <h2
          className={cn(
            "text-2xl font-semibold mb-4 transition-colors",
            theme === "dark" ? "text-white" : "text-gray-800",
          )}
        >
          {t("quickActions")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick("new-booking")}
            className="p-4 bg-gradient-to-r from-neon-green to-neon-blue rounded-xl text-white font-medium shadow-glow flex items-center space-x-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t("newBooking")}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick("bookings-list")}
            className="p-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl text-white font-medium shadow-glow flex items-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>{t("allBookings")}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick("search-filter")}
            className="p-4 bg-gradient-to-r from-neon-purple to-neon-pink rounded-xl text-white font-medium shadow-glow flex items-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>{t("searchAction")}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick("reports")}
            className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white font-medium shadow-glow flex items-center space-x-2"
          >
            <TrendingUp className="w-5 h-5" />
            <span>{t("reports")}</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
