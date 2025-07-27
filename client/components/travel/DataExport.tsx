import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Calendar,
  Filter,
  CheckCircle,
  X,
  RefreshCw,
  FileSpreadsheet,
  Database,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import dataService from "@/services/dataService";
import { Booking } from "@shared/travel-types";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

interface DataExportProps {
  onClose: () => void;
}

interface ExportField {
  key: keyof Booking | "profit" | "profitPercentage";
  label: string;
  enabled: boolean;
}

export default function DataExport({ onClose }: DataExportProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [dateFilter, setDateFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [airlineFilter, setAirlineFilter] = useState("all");

  const [exportFields, setExportFields] = useState<ExportField[]>([
    { key: "id", label: "বুকিং আইডি", enabled: true },
    { key: "customerName", label: "গ্রাহকের নাম", enabled: true },
    { key: "customerPhone", label: "মোবাইল নম্বর", enabled: true },
    { key: "customerEmail", label: "ইমেইল", enabled: false },
    { key: "passportNumber", label: "পাসপোর্ট নম্বর", enabled: false },
    { key: "flightDate", label: "ফ্লাইট তারিখ", enabled: true },
    { key: "route", label: "রুট", enabled: true },
    { key: "airline", label: "এয়ারলাইন", enabled: true },
    { key: "costPrice", label: "ক্রয়মূল্য", enabled: true },
    { key: "sellingPrice", label: "বিক্রয়মূল্য", enabled: true },
    { key: "profit", label: "মুনাফা", enabled: true },
    { key: "profitPercentage", label: "মুনাফার হার (%)", enabled: true },
    { key: "paymentStatus", label: "পেমেন্ট স্ট্যাটাস", enabled: true },
    { key: "notes", label: "মন্তব্য", enabled: false },
    { key: "createdAt", label: "তৈরির তারিখ", enabled: true },
  ]);

  const bookings = useMemo(() => {
    return dataService.getBookings();
  }, []);

  const airlines = useMemo(() => {
    return Array.from(new Set(bookings.map(b => b.airline))).sort();
  }, [bookings]);

  const dateRange = useMemo(() => {
    const now = new Date();
    switch (dateFilter) {
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
        return null;
    }
  }, [dateFilter]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      // Date filter
      if (dateRange) {
        const bookingDate = new Date(booking.flightDate);
        if (bookingDate < dateRange.start || bookingDate > dateRange.end) {
          return false;
        }
      }

      // Payment status filter
      if (paymentStatusFilter !== "all" && booking.paymentStatus !== paymentStatusFilter) {
        return false;
      }

      // Airline filter
      if (airlineFilter !== "all" && booking.airline !== airlineFilter) {
        return false;
      }

      return true;
    });
  }, [bookings, dateRange, paymentStatusFilter, airlineFilter]);

  const exportStats = useMemo(() => {
    const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.sellingPrice, 0);
    const totalProfit = filteredBookings.reduce((sum, b) => sum + (b.sellingPrice - b.costPrice), 0);
    
    return {
      count: filteredBookings.length,
      totalRevenue,
      totalProfit,
      averageProfit: filteredBookings.length > 0 ? totalProfit / filteredBookings.length : 0,
    };
  }, [filteredBookings]);

  const toggleField = (index: number) => {
    setExportFields(prev => prev.map((field, i) => 
      i === index ? { ...field, enabled: !field.enabled } : field
    ));
  };

  const selectAllFields = () => {
    setExportFields(prev => prev.map(field => ({ ...field, enabled: true })));
  };

  const deselectAllFields = () => {
    setExportFields(prev => prev.map(field => ({ ...field, enabled: false })));
  };

  const formatValue = (booking: Booking, key: string): string => {
    switch (key) {
      case "profit":
        return (booking.sellingPrice - booking.costPrice).toString();
      case "profitPercentage":
        const profit = booking.sellingPrice - booking.costPrice;
        const percentage = booking.costPrice > 0 ? (profit / booking.costPrice) * 100 : 0;
        return percentage.toFixed(2);
      case "flightDate":
        return format(new Date(booking.flightDate), "yyyy-MM-dd");
      case "createdAt":
        return format(new Date(booking.createdAt), "yyyy-MM-dd HH:mm:ss");
      case "paymentStatus":
        const statusMap = {
          paid: "পরিশোধিত",
          partial: "আংশিক পরিশোধিত",
          pending: "অপেক্ষমাণ"
        };
        return statusMap[booking.paymentStatus] || booking.paymentStatus;
      default:
        return (booking[key as keyof Booking] || "").toString();
    }
  };

  const generateCSV = (): string => {
    const enabledFields = exportFields.filter(field => field.enabled);
    
    // Header
    const headers = enabledFields.map(field => field.label);
    let csv = headers.join(",") + "\n";
    
    // Data rows
    filteredBookings.forEach(booking => {
      const row = enabledFields.map(field => {
        const value = formatValue(booking, field.key);
        // Escape commas and quotes in CSV
        return `"${value.replace(/"/g, '""')}"`;
      });
      csv += row.join(",") + "\n";
    });
    
    return csv;
  };

  const generateJSON = (): string => {
    const enabledFields = exportFields.filter(field => field.enabled);
    
    const data = filteredBookings.map(booking => {
      const row: Record<string, any> = {};
      enabledFields.forEach(field => {
        row[field.label] = formatValue(booking, field.key);
      });
      return row;
    });
    
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      filters: {
        dateFilter,
        paymentStatusFilter,
        airlineFilter,
      },
      stats: exportStats,
      data,
    }, null, 2);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    const enabledFields = exportFields.filter(field => field.enabled);
    
    if (enabledFields.length === 0) {
      toast({
        title: "ত্রুটি!",
        description: "কমপক্ষে একটি ফিল্ড নির্বাচন করুন",
        variant: "destructive",
      });
      return;
    }

    if (filteredBookings.length === 0) {
      toast({
        title: "ত্রুটি!",
        description: "এক্সপোর্ট করার জন্য কোনো ডেটা নেই",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time

      const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
      const baseFilename = `travel-bookings_${timestamp}`;

      if (exportFormat === "csv") {
        const csvContent = generateCSV();
        downloadFile(csvContent, `${baseFilename}.csv`, "text/csv");
      } else {
        const jsonContent = generateJSON();
        downloadFile(jsonContent, `${baseFilename}.json`, "application/json");
      }

      toast({
        title: "সফল!",
        description: `${filteredBookings.length}টি বুকিং সফলভাবে এক্সপোর্ট করা হয়েছে`,
      });

    } catch (error) {
      toast({
        title: "ত্রুটি!",
        description: "ডেটা এক্সপোর্ট করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

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
            className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4"
          >
            <Download className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">ডেটা এক্সপোর্ট</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {exportStats.count}টি বুকিং এক্সপোর্ট করার জন্য প্রস্তুত
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={onClose}
          className="flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>বন্ধ</span>
        </Button>
      </motion.div>

      {/* Export Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">মোট বুকিং</p>
              <p className="text-2xl font-bold text-blue-600">{exportStats.count}</p>
            </div>
            <Database className="w-8 h-8 text-blue-600/50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">মোট আয়</p>
              <p className="text-2xl font-bold text-green-600">৳{exportStats.totalRevenue.toLocaleString()}</p>
            </div>
            <FileSpreadsheet className="w-8 h-8 text-green-600/50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">মোট মুনাফা</p>
              <p className="text-2xl font-bold text-purple-600">৳{exportStats.totalProfit.toLocaleString()}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-600/50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50 dark:border-orange-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">গড় মুনাফা</p>
              <p className="text-2xl font-bold text-orange-600">৳{Math.round(exportStats.averageProfit).toLocaleString()}</p>
            </div>
            <Settings className="w-8 h-8 text-orange-600/50" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <Filter className="w-6 h-6 mr-2 text-blue-500" />
            ফিল্টার ও সেটিংস
          </h3>

          <div className="space-y-6">
            {/* Export Format */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                এক্সপোর্ট ফরম্যাট
              </Label>
              <Select value={exportFormat} onValueChange={(value: "csv" | "json") => setExportFormat(value)}>
                <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-700/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Excel এ খোলা যাবে)</SelectItem>
                  <SelectItem value="json">JSON (প্রোগ্রামিং এর জন্য)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                তারিখ ফিল্টার
              </Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-700/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব তারিখ</SelectItem>
                  <SelectItem value="thisMonth">এই মাস</SelectItem>
                  <SelectItem value="lastMonth">গত মাস</SelectItem>
                  <SelectItem value="last3Months">গত ৩ মাস</SelectItem>
                  <SelectItem value="last6Months">গত ৬ মাস</SelectItem>
                  <SelectItem value="thisYear">এই বছর</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                পেমেন্ট স্ট্যাটাস
              </Label>
              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-700/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
                  <SelectItem value="paid">পরিশোধিত</SelectItem>
                  <SelectItem value="partial">আংশিক পরিশোধিত</SelectItem>
                  <SelectItem value="pending">অপেক্ষমা���</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Airline Filter */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                এয়ারলাইন
              </Label>
              <Select value={airlineFilter} onValueChange={setAirlineFilter}>
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
          </div>
        </motion.div>

        {/* Fields Selection */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
              ফিল্ড নির্বাচন
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllFields}
                className="text-xs"
              >
                সব নির্বাচন
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deselectAllFields}
                className="text-xs"
              >
                সব বাতিল
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
            {exportFields.map((field, index) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.02 }}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-xl border transition-all duration-200",
                  field.enabled 
                    ? "bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-700" 
                    : "bg-gray-50/50 dark:bg-gray-700/20 border-gray-200 dark:border-gray-600"
                )}
              >
                <Checkbox
                  id={`field-${field.key}`}
                  checked={field.enabled}
                  onCheckedChange={() => toggleField(index)}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                <Label
                  htmlFor={`field-${field.key}`}
                  className={cn(
                    "flex-1 cursor-pointer transition-colors",
                    field.enabled 
                      ? "text-gray-800 dark:text-white font-medium" 
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {field.label}
                </Label>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>{exportFields.filter(f => f.enabled).length}</strong> টি ফিল্ড নির্বাচিত
            </p>
          </div>
        </motion.div>
      </div>

      {/* Export Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <Button
          onClick={handleExport}
          disabled={isExporting || exportFields.filter(f => f.enabled).length === 0}
          className={cn(
            "px-8 py-4 text-lg font-semibold",
            "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700",
            "disabled:from-gray-400 disabled:to-gray-500",
            "shadow-lg hover:shadow-xl transition-all duration-300"
          )}
        >
          {isExporting ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>এক্সপোর্ট হচ্ছে...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>
                {exportFormat === "csv" ? "CSV" : "JSON"} এ ডাউনলোড করুন
              </span>
            </div>
          )}
        </Button>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          {filteredBookings.length}টি বুকিং • {exportFields.filter(f => f.enabled).length}টি ফিল্ড • {exportFormat.toUpperCase()} ফরম্যাট
        </p>
      </motion.div>
    </div>
  );
}
