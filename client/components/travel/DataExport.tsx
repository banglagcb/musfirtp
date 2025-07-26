import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, X, Calendar, Users, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import dataService from "@/services/dataService";

interface DataExportProps {
  onClose: () => void;
}

export default function DataExport({ onClose }: DataExportProps) {
  const [exportType, setExportType] = useState<'all' | 'filtered'>('all');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const [isExporting, setIsExporting] = useState(false);

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      
      const csvContent = dataService.exportToCSV();
      const filename = `travel_bookings_all_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
      
      alert('সফলভাবে এক্সপোর্ট হয়েছে!');
    } catch (error) {
      alert('এক্সপোর্ট করতে সমস্যা হয়েছে!');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportFiltered = async () => {
    if (!dateRange.from || !dateRange.to) {
      alert('তারিখের রেঞ্জ নির্বাচন করুন');
      return;
    }

    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      
      const filteredBookings = dataService.searchBookings({
        dateFrom: dateRange.from,
        dateTo: dateRange.to
      });

      if (filteredBookings.length === 0) {
        alert('নির্বাচিত সময়ের মধ্যে কোনো বুকিং পাওয়া যায়নি');
        setIsExporting(false);
        return;
      }

      // Create CSV content for filtered data
      const headers = [
        'গ্রাহকের নাম',
        'মোবাইল',
        'পাসপোর্ট',
        'ইমেইল',
        'ফ্লাইট তারিখ',
        'রুট',
        'এয়ারলাইন',
        'ক্রয়মূল্য',
        'বিক্রয়মূল্য',
        'পেমেন্ট স্ট্যাটাস',
        'পেইড পরিমাণ',
        'বুকিং তারিখ',
        'নোট'
      ];

      const csvContent = [
        headers.join(','),
        ...filteredBookings.map(booking => [
          booking.customerName,
          booking.mobile,
          booking.passport,
          booking.email,
          booking.flightDate,
          booking.route,
          booking.airline,
          booking.purchasePrice,
          booking.salePrice,
          booking.paymentStatus === 'paid' ? 'পেইড' : 
          booking.paymentStatus === 'pending' ? 'পেন্ডিং' : 'আংশিক',
          booking.paidAmount,
          booking.bookingDate,
          booking.notes || ''
        ].join(','))
      ].join('\n');

      const filename = `travel_bookings_${dateRange.from}_to_${dateRange.to}.csv`;
      downloadCSV(csvContent, filename);
      
      alert('সফলভাবে এক্সপোর্ট হয়েছে!');
    } catch (error) {
      alert('এক্সপোর্ট করতে সমস্যা হয়েছে!');
    } finally {
      setIsExporting(false);
    }
  };

  const bookingsCount = dataService.getBookings().length;
  const filteredCount = dateRange.from && dateRange.to 
    ? dataService.searchBookings({ dateFrom: dateRange.from, dateTo: dateRange.to }).length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">ডেটা এক্সপোর্ট</h1>
            <p className="text-white/70">বুকিং ডেটা CSV ফাইলে ডাউনল���ড করুন</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export All Data */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300",
              exportType === 'all' 
                ? "border-neon-green bg-green-500/10" 
                : "border-white/20 hover:border-white/40"
            )}
            onClick={() => setExportType('all')}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                "bg-gradient-to-r from-neon-green to-neon-blue"
              )}>
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">সম্পূর্ণ ডেটা</h3>
                <p className="text-white/70 text-sm">সকল বুকিং ডেটা এক্সপোর্ট করুন</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70">মোট বুকিং:</span>
                <span className="text-white font-medium">{bookingsCount} টি</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">ফাইল ফরম্যাট:</span>
                <span className="text-white font-medium">CSV</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">আকার:</span>
                <span className="text-white font-medium">আনুমানিক {Math.ceil(bookingsCount * 0.5)} KB</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                handleExportAll();
              }}
              disabled={isExporting}
              className="w-full mt-6 py-3 bg-gradient-to-r from-neon-green to-neon-blue rounded-xl text-white font-medium shadow-glow flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>এক্সপোর্ট হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>সব ডেটা ডাউনলোড করুন</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Export Filtered Data */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300",
              exportType === 'filtered' 
                ? "border-neon-purple bg-purple-500/10" 
                : "border-white/20 hover:border-white/40"
            )}
            onClick={() => setExportType('filtered')}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                "bg-gradient-to-r from-neon-purple to-neon-pink"
              )}>
                <Filter className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">ফিল্টার করা ডেটা</h3>
                <p className="text-white/70 text-sm">নির্দিষ্ট সময়ের ডেটা এক্সপোর্ট করুন</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Date Range Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">শুরুর তারিখ</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-folder-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">শেষ তারিখ</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-folder-primary/50"
                    />
                  </div>
                </div>
              </div>

              {/* Filtered Count */}
              {dateRange.from && dateRange.to && (
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">ফিল্টার করা বুকিং:</span>
                  <span className="text-white font-medium">{filteredCount} টি</span>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                handleExportFiltered();
              }}
              disabled={isExporting || !dateRange.from || !dateRange.to}
              className="w-full mt-6 py-3 bg-gradient-to-r from-neon-purple to-neon-pink rounded-xl text-white font-medium shadow-glow flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>এক্সপোর্ট হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>ফিল্টার করা ডেটা ডাউনলোড করুন</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Export Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Users className="w-6 h-6" />
            <span>এক্সপোর্ট সম্পর্কে তথ্য</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-3">অন্তর্ভুক্ত ফিল্ড সমূহ:</h4>
              <ul className="space-y-2 text-white/70">
                <li>• গ্রাহকের নাম</li>
                <li>• মোবাইল নম্বর</li>
                <li>• পাসপোর্ট নম্বর</li>
                <li>• ইমেইল ঠিকানা</li>
                <li>• ফ্লাইট তারিখ</li>
                <li>• রুট</li>
                <li>• এয়ারলাইন</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-3">আর্থিক তথ্য:</h4>
              <ul className="space-y-2 text-white/70">
                <li>• ক্রয়মূল্য</li>
                <li>• বিক্রয়মূল্য</li>
                <li>• পেমেন্ট স্ট্যাটাস</li>
                <li>• পেইড পরিমাণ</li>
                <li>• বুকিং তারিখ</li>
                <li>• অতিরিক্ত নোট</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-400/50 rounded-lg">
            <p className="text-blue-200 text-sm">
              <strong>নো��:</strong> এক্সপোর্ট করা ফাইল CSV ফরম্যাটে হবে যা Microsoft Excel, Google Sheets 
              এবং অন্যান্য স্প্রেডশিট অ্যাপ্লিকেশনে খোলা যাবে।
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
