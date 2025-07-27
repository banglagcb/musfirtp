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
    description: "নতুন ফ্লাইট বুকিং যোগ করুন",
    icon: PlusCircle,
    color: "from-neon-green to-neon-blue",
    gradient: "bg-gradient-to-br from-green-500/20 to-blue-500/20",
  },
  {
    id: "bookings-list",
    title: "বুকিং লিস্ট",
    description: "সব বুকিং দেখুন ও ম্যানেজ করুন",
    icon: FileText,
    color: "from-neon-blue to-neon-purple",
    gradient: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
  },
  {
    id: "search-filter",
    title: "সার্চ ও ফিল্টার",
    description: "���ুকিং খুঁজুন ও ফিল্টার করুন",
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
    title: "ডেটা এক্সপো��্ট",
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
  const { isMobile, isTablet } = useApp();
  const { t, language } = useTranslation();

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
  const dashboardCards = useMemo(() => [
    {
      id: "new-booking",
      title: t("newBooking"),
      description: language === 'bn' ? "নতুন ফ্লাইট বুকিং যোগ করুন" : "Add new flight booking",
      icon: PlusCircle,
      color: "from-neon-green to-neon-blue",
      gradient: "bg-gradient-to-br from-green-500/20 to-blue-500/20",
    },
    {
      id: "bookings-list",
      title: t("bookings"),
      description: language === 'bn' ? "সব বুকিং দেখুন ও ম্যানেজ করুন" : "View and manage all bookings",
      icon: FileText,
      color: "from-neon-blue to-neon-purple",
      gradient: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
    },
    {
      id: "search-filter",
      title: language === 'bn' ? "সার্চ ও ফিল্টার" : "Search & Filter",
      description: language === 'bn' ? "বুকিং খুঁজুন ও ফিল্টার করুন" : "Search and filter bookings",
      icon: Search,
      color: "from-neon-purple to-neon-pink",
      gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
    },
    {
      id: "reports",
      title: t("reports"),
      description: language === 'bn' ? "বিক্রয�� ও মুনাফার রিপোর্ট দেখুন" : "View sales and profit reports",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      gradient: "bg-gradient-to-br from-orange-500/20 to-red-500/20",
    },
    {
      id: "export-data",
      title: language === 'bn' ? "ডেটা এক্সপোর্ট" : "Data Export",
      description: language === 'bn' ? "CSV/Excel ফাইলে ডাউনলোড করুন" : "Download as CSV/Excel files",
      icon: DollarSign,
      color: "from-green-500 to-teal-500",
      gradient: "bg-gradient-to-br from-green-500/20 to-teal-500/20",
    },
    {
      id: "ticket-inventory",
      title: t("inventory"),
      description: language === 'bn' ? "টিকেট স্টক দেখুন ও ম্যানেজ করুন" : "View and manage ticket inventory",
      icon: Package,
      color: "from-indigo-500 to-purple-500",
      gradient: "bg-gradient-to-br from-indigo-500/20 to-purple-500/20",
    },
    ...(user.role === 'owner' ? [{
      id: "bulk-purchase",
      title: t("bulkPurchase"),
      description: language === 'bn' ? "অগ্রিম টিকেট ক্রয় করুন" : "Purchase tickets in advance",
      icon: ShoppingCart,
      color: "from-emerald-500 to-teal-500",
      gradient: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
    }] : []),
    {
      id: "settings",
      title: t("settings"),
      description: language === 'bn' ? "সিস্টেম সেটিংস ও কনফিগারেশন" : "System settings and configuration",
      icon: Calendar,
      color: "from-red-500 to-pink-500",
      gradient: "bg-gradient-to-br from-red-500/20 to-pink-500/20",
    },
  ], [user.role, t, language]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  return (
    <div className={cn(
      "min-h-screen p-6 transition-colors duration-300",
      "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900",
      "light:from-blue-50 light:via-indigo-50 light:to-purple-50"
    )}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className={cn(
              "text-4xl font-bold mb-2 transition-colors",
              "text-white dark:text-white light:text-gray-800"
            )}>
              {t('dashboard')}
            </h1>
            <p className={cn(
              "transition-colors",
              "text-white/70 dark:text-white/70 light:text-gray-600"
            )}>
              {t('welcome')}, {user.name} -{" "}
              {user.role === "owner" ? t('owner') : t('manager')}
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
        <div className={cn(
          "backdrop-blur-md rounded-2xl p-6 border transition-colors",
          "bg-white/10 dark:bg-white/10 light:bg-white/80",
          "border-white/20 dark:border-white/20 light:border-gray-200"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn(
                "text-sm transition-colors",
                "text-white/70 dark:text-white/70 light:text-gray-600"
              )}>
                {t('totalBookings')}
              </p>
              <p className={cn(
                "text-2xl font-bold transition-colors",
                "text-white dark:text-white light:text-gray-800"
              )}>
                {stats.totalBookings}
              </p>
            </div>
            <Users className="w-8 h-8 text-neon-blue" />
          </div>
        </div>

        <div className={cn(
          "backdrop-blur-md rounded-2xl p-6 border transition-colors",
          "bg-white/10 dark:bg-white/10 light:bg-white/80",
          "border-white/20 dark:border-white/20 light:border-gray-200"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn(
                "text-sm transition-colors",
                "text-white/70 dark:text-white/70 light:text-gray-600"
              )}>
                {t('todayBookings')}
              </p>
              <p className={cn(
                "text-2xl font-bold transition-colors",
                "text-white dark:text-white light:text-gray-800"
              )}>
                {stats.todayBookings}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-neon-green" />
          </div>
        </div>

        <div className={cn(
          "backdrop-blur-md rounded-2xl p-6 border transition-colors",
          "bg-white/10 dark:bg-white/10 light:bg-white/80",
          "border-white/20 dark:border-white/20 light:border-gray-200"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn(
                "text-sm transition-colors",
                "text-white/70 dark:text-white/70 light:text-gray-600"
              )}>
                {t('totalRevenue')}
              </p>
              <p className={cn(
                "text-xl font-bold transition-colors",
                "text-white dark:text-white light:text-gray-800"
              )}>
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-neon-purple" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">মোট মুনাফা</p>
              <p className="text-xl font-bold text-white">
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
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-neon-green" />
            <div>
              <p className="text-white/70 text-sm">পেইড বুকিং</p>
              <p className="text-2xl font-bold text-white">
                {stats.paidBookings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-white/70 text-sm">আংশিক পেমেন্ট</p>
              <p className="text-2xl font-bold text-white">
                {stats.partialPayments}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-white/70 text-sm">পেন্ডিং পেমেন্ট</p>
              <p className="text-2xl font-bold text-white">
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
              whileHover={{
                scale: 1.08,
                y: -10,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                },
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCardClick(card.id)}
              className={cn(
                "relative group cursor-pointer rounded-2xl p-6 border border-white/20",
                "bg-white/10 backdrop-blur-md hover:bg-white/20",
                "transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25",
                "overflow-hidden",
                "hover:border-white/40",
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
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white transition-colors">
                  {card.title}
                </h3>
                <p className="text-white/70 text-sm mb-4 group-hover:text-white/90 transition-colors">
                  {card.description}
                </p>

                {/* Hover Effect Indicator */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h2 className="text-2xl font-semibold text-white mb-4">
          দ্রুত অ্যাকশন
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCardClick("new-booking")}
            className="p-4 bg-gradient-to-r from-neon-green to-neon-blue rounded-xl text-white font-medium shadow-glow flex items-center space-x-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>নতুন বুকিং</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCardClick("bookings-list")}
            className="p-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl text-white font-medium shadow-glow flex items-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>সব বুকিং</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCardClick("search-filter")}
            className="p-4 bg-gradient-to-r from-neon-purple to-neon-pink rounded-xl text-white font-medium shadow-glow flex items-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>���ার্চ করুন</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCardClick("reports")}
            className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white font-medium shadow-glow flex items-center space-x-2"
          >
            <TrendingUp className="w-5 h-5" />
            <span>রিপোর্ট</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
