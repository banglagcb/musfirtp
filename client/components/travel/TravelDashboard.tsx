import { motion } from "framer-motion";
import {
  Plus,
  Users,
  Search,
  BarChart3,
  Download,
  Settings,
  Plane,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Package,
  Target,
  Globe,
  Award,
} from "lucide-react";
import { User, Booking } from "@shared/travel-types";
import { useEffect, useState } from "react";
import dataService from "@/services/dataService";
import { cn } from "@/lib/utils";

interface TravelDashboardProps {
  user: User;
  onCardClick: (cardId: string) => void;
}

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalProfit: number;
  dailyBookings: number;
  dailyRevenue: number;
  dailyProfit: number;
  pendingPayments: number;
  completedBookings: number;
  thisMonthBookings: number;
  thisMonthProfit: number;
}

export default function TravelDashboard({
  user,
  onCardClick,
}: TravelDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    totalProfit: 0,
    dailyBookings: 0,
    dailyRevenue: 0,
    dailyProfit: 0,
    pendingPayments: 0,
    completedBookings: 0,
    thisMonthBookings: 0,
    thisMonthProfit: 0,
  });

  useEffect(() => {
    const calculateStats = () => {
      const bookings = dataService.getBookings();
      const today = new Date().toDateString();
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();

      const todayBookings = bookings.filter(
        (booking) => new Date(booking.flightDate).toDateString() === today,
      );

      const thisMonthBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.flightDate);
        return (
          bookingDate.getMonth() === thisMonth &&
          bookingDate.getFullYear() === thisYear
        );
      });

      const totalRevenue = bookings.reduce(
        (sum, booking) => sum + booking.sellingPrice,
        0,
      );
      const totalProfit = bookings.reduce(
        (sum, booking) => sum + (booking.sellingPrice - booking.costPrice),
        0,
      );

      const dailyRevenue = todayBookings.reduce(
        (sum, booking) => sum + booking.sellingPrice,
        0,
      );
      const dailyProfit = todayBookings.reduce(
        (sum, booking) => sum + (booking.sellingPrice - booking.costPrice),
        0,
      );

      const thisMonthProfit = thisMonthBookings.reduce(
        (sum, booking) => sum + (booking.sellingPrice - booking.costPrice),
        0,
      );

      const pendingPayments = bookings.filter(
        (booking) => booking.paymentStatus === "pending",
      ).length;

      const completedBookings = bookings.filter(
        (booking) => booking.paymentStatus === "paid",
      ).length;

      setStats({
        totalBookings: bookings.length,
        totalRevenue,
        totalProfit,
        dailyBookings: todayBookings.length,
        dailyRevenue,
        dailyProfit,
        pendingPayments,
        completedBookings,
        thisMonthBookings: thisMonthBookings.length,
        thisMonthProfit,
      });
    };

    calculateStats();
  }, []);

  const dashboardCards = [
    {
      id: "new-booking",
      title: "নতুন বুকিং",
      description: "নতুন বুকিং যোগ করুন",
      icon: Plus,
      gradient: "from-emerald-500 to-teal-600",
      iconColor: "text-emerald-100",
      bgGradient: "from-emerald-500/10 to-teal-600/10",
      stats: null,
    },
    {
      id: "bookings-list",
      title: "বুকিং লিস্ট",
      description: `মোট ${stats.totalBookings}টি বুকিং`,
      icon: Package,
      gradient: "from-blue-500 to-indigo-600",
      iconColor: "text-blue-100",
      bgGradient: "from-blue-500/10 to-indigo-600/10",
      stats: stats.totalBookings,
    },
    {
      id: "search-filter",
      title: "সার্চ ও ফিল্টার",
      description: "নির্দিষ্ট বুকিং খুঁজুন",
      icon: Search,
      gradient: "from-violet-500 to-purple-600",
      iconColor: "text-violet-100",
      bgGradient: "from-violet-500/10 to-purple-600/10",
      stats: null,
    },
    {
      id: "reports",
      title: "রিপোর্ট ও বিশ্লেষণ",
      description: `আজকের মুনাফা ৳${stats.dailyProfit.toLocaleString()}`,
      icon: TrendingUp,
      gradient: "from-rose-500 to-pink-600",
      iconColor: "text-rose-100",
      bgGradient: "from-rose-500/10 to-pink-600/10",
      stats: stats.dailyProfit,
    },
    {
      id: "export-data",
      title: "ডেটা এক্সপোর্ট",
      description: "CSV/Excel এ ডাউনলোড করুন",
      icon: Download,
      gradient: "from-amber-500 to-orange-600",
      iconColor: "text-amber-100",
      bgGradient: "from-amber-500/10 to-orange-600/10",
      stats: null,
    },
    {
      id: "settings",
      title: "সেটিংস",
      description: "সিস্টেম কনফিগারেশন",
      icon: Settings,
      gradient: "from-slate-500 to-gray-600",
      iconColor: "text-slate-100",
      bgGradient: "from-slate-500/10 to-gray-600/10",
      stats: null,
    },
  ];

  const statCards = [
    {
      title: "আজকের বুকিং",
      value: stats.dailyBookings,
      suffix: "টি",
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "আজকের আয়",
      value: stats.dailyRevenue,
      prefix: "৳",
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "পেন্ডিং পেমেন্ট",
      value: stats.pendingPayments,
      suffix: "টি",
      icon: Clock,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "সম্পূ��্ণ বুকিং",
      value: stats.completedBookings,
      suffix: "টি",
      icon: CheckCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "মোট রেভিনিউ",
      value: stats.totalRevenue,
      prefix: "৳",
      icon: Target,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "মোট মুনাফা",
      value: stats.totalProfit,
      prefix: "৳",
      icon: Award,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 lg:mb-12"
      >
        <motion.h1
          className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ট্রাভেল এজেন্সি ম্যানেজমেন্ট
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg lg:text-xl text-white/70 mb-2"
        >
          স্বাগতম, {user.name}! ({user.role === "owner" ? "মালিক" : "ম্যানেজার"}
          )
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"
        />
      </motion.div>

      {/* Enhanced Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6 mb-8 lg:mb-12"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={cn(
              "p-4 lg:p-6 rounded-2xl border border-white/10 backdrop-blur-md",
              stat.bgColor,
              "hover:border-white/20 transition-all duration-300",
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={cn("w-6 h-6 lg:w-8 lg:h-8", stat.color)} />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
              />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
              {stat.prefix}
              {typeof stat.value === "number"
                ? stat.value.toLocaleString()
                : stat.value}
              {stat.suffix}
            </div>
            <div className="text-sm lg:text-base text-white/60">
              {stat.title}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Main Dashboard Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        {dashboardCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{
              delay: 0.5 + index * 0.1,
              duration: 0.6,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              scale: 1.05,
              y: -10,
              rotateX: 5,
              rotateY: 5,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCardClick(card.id)}
            className={cn(
              "group relative p-6 lg:p-8 rounded-3xl cursor-pointer overflow-hidden",
              "bg-gradient-to-br from-white/5 to-white/10",
              "border border-white/10 hover:border-white/20",
              "backdrop-blur-md transition-all duration-500",
              "shadow-lg hover:shadow-2xl",
              card.bgGradient,
            )}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Enhanced Background Gradient */}
            <motion.div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                card.gradient,
              )}
              style={{ mixBlendMode: "overlay" }}
            />

            {/* Enhanced Floating Icon */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={cn(
                "relative z-10 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl mb-6",
                `bg-gradient-to-br ${card.gradient}`,
                "flex items-center justify-center",
                "shadow-lg group-hover:shadow-xl transition-all duration-500",
              )}
            >
              <card.icon
                className={cn("w-8 h-8 lg:w-10 lg:h-10", card.iconColor)}
              />
            </motion.div>

            {/* Enhanced Content */}
            <div className="relative z-10">
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                {card.title}
              </h3>
              <p className="text-white/70 group-hover:text-white/90 transition-colors text-sm lg:text-base">
                {card.description}
              </p>

              {/* Stats Badge */}
              {card.stats !== null && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-white"
                >
                  {typeof card.stats === "number"
                    ? card.stats.toLocaleString()
                    : card.stats}
                </motion.div>
              )}
            </div>

            {/* Enhanced Hover Effect */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Enhanced Corner Decoration */}
            <motion.div
              className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="text-center mt-12 lg:mt-16"
      >
        <div className="text-white/50 text-sm lg:text-base">
          © 2024 ট্রাভেল এজেন্সি ম্যানেজমেন্ট সিস্টেম - সকল অধিকার সংরক্ষিত
        </div>
      </motion.div>
    </div>
  );
}
