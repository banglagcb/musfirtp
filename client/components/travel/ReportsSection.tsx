import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Users,
  Plane,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  X,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import dataService from "@/services/dataService";
import { Booking } from "@shared/travel-types";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subDays, subMonths } from "date-fns";

interface ReportsSectionProps {
  onClose: () => void;
  onExportData: () => void;
}

interface ReportStats {
  totalBookings: number;
  totalRevenue: number;
  totalProfit: number;
  averageProfit: number;
  topAirline: string;
  topRoute: string;
  profitMargin: number;
  conversionRate: number;
}

interface TimeSeriesData {
  date: string;
  bookings: number;
  revenue: number;
  profit: number;
}

export default function ReportsSection({ onClose, onExportData }: ReportsSectionProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [chartView, setChartView] = useState("revenue");
  const [selectedAirline, setSelectedAirline] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const allBookings = dataService.getBookings();
      setBookings(allBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const dateRange = useMemo(() => {
    const now = new Date();
    switch (selectedPeriod) {
      case "today":
        return { start: now, end: now };
      case "yesterday":
        const yesterday = subDays(now, 1);
        return { start: yesterday, end: yesterday };
      case "thisWeek":
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case "lastWeek":
        const lastWeekStart = startOfWeek(subDays(now, 7));
        const lastWeekEnd = endOfWeek(subDays(now, 7));
        return { start: lastWeekStart, end: lastWeekEnd };
      case "thisMonth":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "lastMonth":
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case "last3Months":
        return { start: subMonths(now, 3), end: now };
      case "last6Months":
        return { start: subMonths(now, 6), end: now };
      case "thisYear":
        return { start: new Date(now.getFullYear(), 0, 1), end: now };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  }, [selectedPeriod]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.flightDate);
      const airlineMatch = selectedAirline === "all" || booking.airline === selectedAirline;
      const dateMatch = bookingDate >= dateRange.start && bookingDate <= dateRange.end;
      return airlineMatch && dateMatch;
    });
  }, [bookings, selectedAirline, dateRange]);

  const reportStats = useMemo((): ReportStats => {
    if (filteredBookings.length === 0) {
      return {
        totalBookings: 0,
        totalRevenue: 0,
        totalProfit: 0,
        averageProfit: 0,
        topAirline: "N/A",
        topRoute: "N/A",
        profitMargin: 0,
        conversionRate: 0,
      };
    }

    const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.sellingPrice, 0);
    const totalProfit = filteredBookings.reduce((sum, b) => sum + (b.sellingPrice - b.costPrice), 0);
    const totalCost = filteredBookings.reduce((sum, b) => sum + b.costPrice, 0);

    // Airline frequency
    const airlineCount: Record<string, number> = {};
    filteredBookings.forEach(b => {
      airlineCount[b.airline] = (airlineCount[b.airline] || 0) + 1;
    });
    const topAirline = Object.entries(airlineCount).sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";

    // Route frequency
    const routeCount: Record<string, number> = {};
    filteredBookings.forEach(b => {
      routeCount[b.route] = (routeCount[b.route] || 0) + 1;
    });
    const topRoute = Object.entries(routeCount).sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";

    return {
      totalBookings: filteredBookings.length,
      totalRevenue,
      totalProfit,
      averageProfit: totalProfit / filteredBookings.length,
      topAirline,
      topRoute,
      profitMargin: totalCost > 0 ? (totalProfit / totalCost) * 100 : 0,
      conversionRate: filteredBookings.filter(b => b.paymentStatus === "paid").length / filteredBookings.length * 100,
    };
  }, [filteredBookings]);

  const timeSeriesData = useMemo((): TimeSeriesData[] => {
    const dataMap: Record<string, TimeSeriesData> = {};
    
    filteredBookings.forEach(booking => {
      const dateKey = format(new Date(booking.flightDate), "yyyy-MM-dd");
      if (!dataMap[dateKey]) {
        dataMap[dateKey] = {
          date: dateKey,
          bookings: 0,
          revenue: 0,
          profit: 0,
        };
      }
      dataMap[dateKey].bookings += 1;
      dataMap[dateKey].revenue += booking.sellingPrice;
      dataMap[dateKey].profit += (booking.sellingPrice - booking.costPrice);
    });

    return Object.values(dataMap).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredBookings]);

  const airlineStats = useMemo(() => {
    const stats: Record<string, { bookings: number; revenue: number; profit: number; }> = {};
    
    filteredBookings.forEach(booking => {
      if (!stats[booking.airline]) {
        stats[booking.airline] = { bookings: 0, revenue: 0, profit: 0 };
      }
      stats[booking.airline].bookings += 1;
      stats[booking.airline].revenue += booking.sellingPrice;
      stats[booking.airline].profit += (booking.sellingPrice - booking.costPrice);
    });

    return Object.entries(stats)
      .map(([airline, data]) => ({ airline, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredBookings]);

  const paymentStatusStats = useMemo(() => {
    const paid = filteredBookings.filter(b => b.paymentStatus === "paid").length;
    const partial = filteredBookings.filter(b => b.paymentStatus === "partial").length;
    const pending = filteredBookings.filter(b => b.paymentStatus === "pending").length;
    const total = filteredBookings.length;

    return [
      { status: "paid", label: "পরিশোধিত", count: paid, percentage: total > 0 ? (paid / total) * 100 : 0, color: "bg-green-500" },
      { status: "partial", label: "আংশিক", count: partial, percentage: total > 0 ? (partial / total) * 100 : 0, color: "bg-yellow-500" },
      { status: "pending", label: "অপেক্ষমাণ", count: pending, percentage: total > 0 ? (pending / total) * 100 : 0, color: "bg-red-500" },
    ];
  }, [filteredBookings]);

  const airlines = useMemo(() => {
    return Array.from(new Set(bookings.map(b => b.airline))).sort();
  }, [bookings]);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <span className="ml-4 text-xl text-gray-600 dark:text-gray-300">রিপোর্ট তৈরি হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800 p-6">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4"
          >
            <BarChart3 className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">রিপোর্ট ও বিশ্লেষণ</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {filteredBookings.length}টি বুকিং এর বিস্তারিত রিপোর্ট
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onExportData}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>এক্সপোর্ট</span>
          </Button>
          <Button
            variant="outline"
            onClick={loadData}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>রিফ্রেশ</span>
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>বন্ধ</span>
          </Button>
        </div>
      </motion.div>

      {/* Enhanced Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">সময়কাল</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-700/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">আজ</SelectItem>
                <SelectItem value="yesterday">গতকাল</SelectItem>
                <SelectItem value="thisWeek">এই সপ্তাহ</SelectItem>
                <SelectItem value="lastWeek">গত সপ্তাহ</SelectItem>
                <SelectItem value="thisMonth">এই মাস</SelectItem>
                <SelectItem value="lastMonth">গত মাস</SelectItem>
                <SelectItem value="last3Months">গত ৩ মাস</SelectItem>
                <SelectItem value="last6Months">গত ৬ মাস</SelectItem>
                <SelectItem value="thisYear">এই বছর</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">এয়ারলাইন</label>
            <Select value={selectedAirline} onValueChange={setSelectedAirline}>
              <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-700/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব এয়ারলাইন</SelectItem>
                {airlines.map(airline => (
                  <SelectItem key={airline} value={airline}>{airline}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">চার্ট ভিউ</label>
            <Select value={chartView} onValueChange={setChartView}>
              <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-700/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">আয়</SelectItem>
                <SelectItem value="profit">মুনাফা</SelectItem>
                <SelectItem value="bookings">বুকিং সংখ্যা</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">তারিখ পরিসর</p>
              <p className="font-medium text-gray-800 dark:text-white">
                {format(dateRange.start, "dd MMM")} - {format(dateRange.end, "dd MMM yyyy")}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
      >
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">মোট বুকিং</p>
              <p className="text-2xl font-bold text-blue-600">{reportStats.totalBookings}</p>
              <p className="text-xs text-gray-500">+{Math.round(reportStats.conversionRate)}% সম্পূর্ণ</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Plane className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">মোট আয়</p>
              <p className="text-2xl font-bold text-green-600">৳{reportStats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">গড় ৳{Math.round(reportStats.totalRevenue / Math.max(reportStats.totalBookings, 1)).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">মোট মুনাফা</p>
              <p className="text-2xl font-bold text-purple-600">৳{reportStats.totalProfit.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{reportStats.profitMargin.toFixed(1)}% মার্জিন</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50 dark:border-orange-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">গড় মুনাফা</p>
              <p className="text-2xl font-bold text-orange-600">৳{Math.round(reportStats.averageProfit).toLocaleString()}</p>
              <p className="text-xs text-gray-500">প্রতি বুকিং</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 backdrop-blur-sm rounded-2xl p-6 border border-pink-200/50 dark:border-pink-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">টপ এয়ারলাইন</p>
              <p className="text-sm font-bold text-pink-600 truncate">{reportStats.topAirline}</p>
              <p className="text-xs text-gray-500">সবচেয়ে জনপ্রিয়</p>
            </div>
            <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Payment Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50"
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
          <PieChart className="w-6 h-6 mr-2 text-blue-500" />
          পেমেন্ট স্ট্যাটাস বিতরণ
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paymentStatusStats.map((stat, index) => (
            <motion.div
              key={stat.status}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${stat.percentage * 2.51} 251`}
                    className={cn(
                      stat.status === "paid" && "text-green-500",
                      stat.status === "partial" && "text-yellow-500",
                      stat.status === "pending" && "text-red-500"
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-800 dark:text-white">
                    {Math.round(stat.percentage)}%
                  </span>
                </div>
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white">{stat.label}</h4>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">{stat.count}টি</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Airline Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50"
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-purple-500" />
          এয়ারলাইন কর্মক্ষমতা
        </h3>

        <div className="space-y-4">
          {airlineStats.slice(0, 5).map((airline, index) => (
            <motion.div
              key={airline.airline}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800 dark:text-white">{airline.airline}</h4>
                <Badge variant="outline">{airline.bookings}টি বুকিং</Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-300">আয়</p>
                  <p className="font-semibold text-green-600">৳{airline.revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300">মুনাফা</p>
                  <p className="font-semibold text-purple-600">৳{airline.profit.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300">গড় মুনাফা</p>
                  <p className="font-semibold text-blue-600">৳{Math.round(airline.profit / airline.bookings).toLocaleString()}</p>
                </div>
              </div>

              {/* Revenue bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(airline.revenue / Math.max(...airlineStats.map(a => a.revenue))) * 100}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 1 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Time Series Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50"
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
          সময়ভিত্তিক ট্রেন্ড ({chartView === "revenue" ? "আয়" : chartView === "profit" ? "মুনাফা" : "বুকিং"})
        </h3>

        {timeSeriesData.length > 0 ? (
          <div className="space-y-4">
            {timeSeriesData.slice(-7).map((data, index) => {
              const value = chartView === "revenue" ? data.revenue : chartView === "profit" ? data.profit : data.bookings;
              const maxValue = Math.max(...timeSeriesData.map(d => 
                chartView === "revenue" ? d.revenue : chartView === "profit" ? d.profit : d.bookings
              ));
              const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

              return (
                <motion.div
                  key={data.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-20 text-sm font-medium text-gray-600 dark:text-gray-300">
                    {format(new Date(data.date), "dd MMM")}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 1 }}
                        className={cn(
                          "h-3 rounded-full",
                          chartView === "revenue" && "bg-gradient-to-r from-green-500 to-emerald-600",
                          chartView === "profit" && "bg-gradient-to-r from-purple-500 to-pink-600",
                          chartView === "bookings" && "bg-gradient-to-r from-blue-500 to-cyan-600"
                        )}
                      />
                    </div>
                  </div>
                  <div className="w-24 text-right text-sm font-semibold text-gray-800 dark:text-white">
                    {chartView === "bookings" ? `${value}টি` : `৳${value.toLocaleString()}`}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">নির্বাচিত সময়কালে কোনো ডেটা পাওয়া যায়নি</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
