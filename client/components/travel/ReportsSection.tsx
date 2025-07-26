import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  BarChart3,
  PieChart,
  X,
  Download,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportData } from "@shared/travel-types";
import dataService from "@/services/dataService";

interface ReportsSectionProps {
  onClose: () => void;
  onExportData: () => void;
}

export default function ReportsSection({ onClose, onExportData }: ReportsSectionProps) {
  const [reportType, setReportType] = useState<'daily' | 'monthly'>('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalCost: 0,
    totalBookings: 0,
    avgProfit: 0,
    profitMargin: 0
  });

  useEffect(() => {
    generateReport();
  }, [reportType, selectedYear, selectedMonth]);

  const generateReport = () => {
    if (reportType === 'monthly') {
      const monthlyData = dataService.getMonthlyReport(selectedYear, selectedMonth);
      setReportData(monthlyData);
      
      // Calculate summary statistics
      const totalRevenue = monthlyData.reduce((sum, day) => sum + day.totalRevenue, 0);
      const totalCost = monthlyData.reduce((sum, day) => sum + day.totalCost, 0);
      const totalProfit = totalRevenue - totalCost;
      const totalBookings = monthlyData.reduce((sum, day) => sum + day.totalBookings, 0);
      const avgProfit = totalBookings > 0 ? totalProfit / totalBookings : 0;
      const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
      
      setSummaryStats({
        totalRevenue,
        totalCost,
        totalProfit,
        totalBookings,
        avgProfit,
        profitMargin
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD');
  };

  const getMonthName = (month: number) => {
    const months = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    return months[month - 1];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">রিপোর্ট ও বিশ্লেষণ</h1>
            <p className="text-white/70">বিক্রয় ও মুনাফার বিস্তারিত রিপোর্ট</p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExportData}
              className="px-6 py-3 bg-gradient-to-r from-neon-green to-neon-blue rounded-xl text-white font-medium shadow-glow flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>ডেটা এক্সপোর্ট</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Report Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Report Type */}
            <div className="flex items-center space-x-2">
              <span className="text-white/70">রিপোর্ট ধরন:</span>
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setReportType('monthly')}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    reportType === 'monthly'
                      ? "bg-folder-primary text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  মাসিক
                </button>
                <button
                  onClick={() => setReportType('daily')}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    reportType === 'daily'
                      ? "bg-folder-primary text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  দৈনিক
                </button>
              </div>
            </div>

            {/* Year Selection */}
            <div className="flex items-center space-x-2">
              <span className="text-white/70">বছর:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-folder-primary/50"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <option key={year} value={year} className="bg-slate-800">
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Month Selection */}
            {reportType === 'monthly' && (
              <div className="flex items-center space-x-2">
                <span className="text-white/70">মাস:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-folder-primary/50"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-slate-800">
                      {getMonthName(i + 1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </motion.div>

        {/* Summary Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">মোট আয়</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(summaryStats.totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-neon-green" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">মোট মুনাফা</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(summaryStats.totalProfit)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-neon-blue" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">মোট বুকিং</p>
                <p className="text-2xl font-bold text-white">{summaryStats.totalBookings}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-neon-purple" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">মুনাফার হার</p>
                <p className="text-2xl font-bold text-white">{summaryStats.profitMargin.toFixed(1)}%</p>
              </div>
              <PieChart className="w-8 h-8 text-neon-pink" />
            </div>
          </div>
        </motion.div>

        {/* Detailed Report Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-semibold text-white flex items-center space-x-2">
              <Calendar className="w-6 h-6" />
              <span>
                {reportType === 'monthly' 
                  ? `${getMonthName(selectedMonth)} ${selectedYear} এর দৈনিক রিপোর্ট`
                  : `${selectedYear} এর মাসিক রিপোর্ট`
                }
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-white/70 font-medium">তারিখ</th>
                  <th className="px-6 py-4 text-right text-white/70 font-medium">বুকিং</th>
                  <th className="px-6 py-4 text-right text-white/70 font-medium">আয়</th>
                  <th className="px-6 py-4 text-right text-white/70 font-medium">খরচ</th>
                  <th className="px-6 py-4 text-right text-white/70 font-medium">মুনাফা</th>
                  <th className="px-6 py-4 text-right text-white/70 font-medium">মুনাফার হার</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => {
                  const profitMargin = row.totalRevenue > 0 ? (row.totalProfit / row.totalRevenue) * 100 : 0;
                  return (
                    <motion.tr
                      key={row.date}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white">{formatDate(row.date)}</td>
                      <td className="px-6 py-4 text-right text-white">{row.totalBookings}</td>
                      <td className="px-6 py-4 text-right text-white">{formatCurrency(row.totalRevenue)}</td>
                      <td className="px-6 py-4 text-right text-white/70">{formatCurrency(row.totalCost)}</td>
                      <td className="px-6 py-4 text-right text-neon-green font-medium">{formatCurrency(row.totalProfit)}</td>
                      <td className="px-6 py-4 text-right text-white">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          profitMargin >= 20 ? "bg-green-500/20 text-green-400" :
                          profitMargin >= 10 ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        )}>
                          {profitMargin.toFixed(1)}%
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {reportData.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-white/70 text-lg">এই সময়ের জন্য কোনো ডেটা পাওয়া যায়নি</p>
              <p className="text-white/50 text-sm mt-2">অন্য মাস বা বছর নির্বাচন করে দেখুন</p>
            </div>
          )}
        </motion.div>

        {/* Additional Insights */}
        {reportData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
          >
            {/* Best Day */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">সর্বোচ্চ মুনাফার দিন</h3>
              {(() => {
                const bestDay = reportData.reduce((max, day) => 
                  day.totalProfit > max.totalProfit ? day : max, reportData[0]
                );
                return (
                  <div className="space-y-2">
                    <p className="text-white/70">তারিখ: <span className="text-white">{formatDate(bestDay.date)}</span></p>
                    <p className="text-white/70">মুনাফা: <span className="text-neon-green font-medium">{formatCurrency(bestDay.totalProfit)}</span></p>
                    <p className="text-white/70">বুকিং: <span className="text-white">{bestDay.totalBookings}</span></p>
                  </div>
                );
              })()}
            </div>

            {/* Average Performance */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">গড় পারফরম্যান্স</h3>
              <div className="space-y-2">
                <p className="text-white/70">গড় দৈনিক আয়: <span className="text-white">{formatCurrency(summaryStats.avgProfit)}</span></p>
                <p className="text-white/70">গড় মুনাফার হার: <span className="text-white">{summaryStats.profitMargin.toFixed(1)}%</span></p>
                <p className="text-white/70">গড় দৈনিক বুকিং: <span className="text-white">{(summaryStats.totalBookings / Math.max(reportData.length, 1)).toFixed(1)}</span></p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
