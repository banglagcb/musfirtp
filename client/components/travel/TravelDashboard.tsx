import { useEffect, useState } from "react";
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
        (sum, booking) => sum + (Number(booking.sellingPrice) || 0),
        0,
      );
      const totalProfit = bookings.reduce(
        (sum, booking) => sum + ((Number(booking.sellingPrice) || 0) - (Number(booking.costPrice) || 0)),
        0,
      );

      const dailyRevenue = todayBookings.reduce(
        (sum, booking) => sum + (Number(booking.sellingPrice) || 0),
        0,
      );
      const dailyProfit = todayBookings.reduce(
        (sum, booking) => sum + ((Number(booking.sellingPrice) || 0) - (Number(booking.costPrice) || 0)),
        0,
      );

      const thisMonthProfit = thisMonthBookings.reduce(
        (sum, booking) => sum + ((Number(booking.sellingPrice) || 0) - (Number(booking.costPrice) || 0)),
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
      title: "নতুন টিকেট ক্রয়",
      description: "গ্রাহকের জন্য নতুন টিকেট বুক করুন",
      details: "সম্পূর্ণ বুকিং প্রক্রিয়া ও মুনাফা গণনা",
      icon: Plus,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-700",
      priority: "high",
    },
    {
      id: "bookings-list",
      title: "বুকিং ম্যানেজমেন্ট",
      description: `মোট ${stats.totalBookings}টি বুকিং রয়েছে`,
      details: "সব বুকিং দেখুন, এডিট ও ট্র্��াক করুন",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
      priority: "medium",
    },
    {
      id: "search-filter",
      title: "উন্নত সার্চ",
      description: `${stats.pendingPayments}টি পেন্ডিং পেমেন্ট`,
      details: "তারিখ, গ্রাহক, স্ট্যাটাস অনুযায়ী খুঁজুন",
      icon: Search,
      color: "text-violet-600",
      bgColor: "bg-violet-50 dark:bg-violet-900/20",
      borderColor: "border-violet-200 dark:border-violet-700",
      priority: "medium",
    },
    {
      id: "reports",
      title: "আর্থিক রিপোর্ট",
      description: `আজকের মুনাফা ৳${stats.dailyProfit.toLocaleString()}`,
      details: "বিস্তারিত আয়-ব্যয় ও মুনাফা বিশ্লেষণ",
      icon: TrendingUp,
      color: "text-rose-600",
      bgColor: "bg-rose-50 dark:bg-rose-900/20",
      borderColor: "border-rose-200 dark:border-rose-700",
      priority: "high",
    },
    {
      id: "export-data",
      title: "ডেটা ���্যাকআপ",
      description: "Excel/CSV ফরম্যাটে ডাউনলোড",
      details: "সম্পূর্ণ ডেটা এক্সপোর্ট ও ইমপোর্ট",
      icon: Download,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-700",
      priority: "low",
    },
    {
      id: "settings",
      title: "সিস্টেম সেটিংস",
      description: "কোম্পানি তথ্য ও কনফিগারেশন",
      details: "নিরাপত্তা, প্রিন্টিং ও প্রাথমিক সেটিংস",
      icon: SettingsIcon,
      color: "text-slate-600",
      bgColor: "bg-slate-50 dark:bg-slate-900/20",
      borderColor: "border-slate-200 dark:border-slate-700",
      priority: "low",
    },
  ];

  const statCards = [
    {
      title: "আজকের বুকিং",
      value: stats.dailyBookings,
      suffix: "টি",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "আজকের আয়",
      value: stats.dailyRevenue,
      prefix: "৳",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "পেন্ডিং পেমেন্ট",
      value: stats.pendingPayments,
      suffix: "টি",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: "সম্পূর্ণ বুকিং",
      value: stats.completedBookings,
      suffix: "টি",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      title: "মোট রেভিনিউ",
      value: stats.totalRevenue,
      prefix: "৳",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "মোট মুনাফা",
      value: stats.totalProfit,
      prefix: "৳",
      icon: Award,
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {statCards.map((stat, index) => (
          <div
            key={stat.title}
            className={cn(
              "p-3 sm:p-4 lg:p-6 rounded-lg border bg-white dark:bg-gray-800",
              stat.bgColor,
              "hover:shadow-lg transition-all duration-300 hover:scale-105",
            )}
          >
            <div className="flex items-center justify-between mb-2 lg:mb-3">
              <stat.icon
                className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8",
                  stat.color,
                )}
              />
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 dark:text-white mb-1">
              {stat.prefix}
              {typeof stat.value === "number"
                ? stat.value.toLocaleString()
                : stat.value}
              {stat.suffix}
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 leading-tight">
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Main Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {dashboardCards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => onCardClick(card.id)}
            className={cn(
              "group p-4 sm:p-5 lg:p-6 rounded-lg cursor-pointer border bg-white dark:bg-gray-800",
              card.bgColor,
              card.borderColor,
              "hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95",
              index === 0 && "ring-2 ring-emerald-200 dark:ring-emerald-700", // Highlight New Booking card
            )}
          >
            {/* Enhanced Icon */}
            <div
              className={cn(
                "w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg mb-3 lg:mb-4 flex items-center justify-center",
                card.bgColor,
                "group-hover:scale-110 transition-transform duration-300",
              )}
            >
              <card.icon
                className={cn(
                  "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8",
                  card.color,
                )}
              />
            </div>

            {/* Enhanced Content */}
            <div>
              <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-gray-800 dark:text-white mb-2">
                {card.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {card.description}
              </p>

              {/* Add Quick Action Indicator for New Booking */}
              {index === 0 && (
                <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                  দ্রুত অ্যাকশন
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
