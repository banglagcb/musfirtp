import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Plane,
  DollarSign,
  User,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import dataService from "@/services/dataService";
import { Booking } from "@shared/travel-types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface BookingsListProps {
  onClose: () => void;
  onEdit: (booking: Booking) => void;
}

export default function BookingsList({ onClose, onEdit }: BookingsListProps) {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<string>("all");
  const [selectedAirline, setSelectedAirline] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    setLoading(true);
    try {
      const allBookings = dataService.getBookings();
      setBookings(allBookings);
    } catch (error) {
      toast({
        title: "ত্রুটি!",
        description: "বুকিং তালিকা লোড করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = (id: string) => {
    try {
      dataService.deleteBooking(id);
      setBookings((prev) => prev.filter((booking) => booking.id !== id));
      toast({
        title: "সফল!",
        description: "বুকিং সফলভাবে ডিলিট করা হয়েছে",
      });
    } catch (error) {
      toast({
        title: "ত্রুটি!",
        description: "বুকিং ডিলিট করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    }
  };

  const paymentStatusConfig = {
    paid: { label: "পরিশোধি���", color: "bg-green-500", icon: CheckCircle },
    partial: { label: "আংশিক", color: "bg-yellow-500", icon: Clock },
    pending: { label: "অপেক্ষমাণ", color: "bg-red-500", icon: AlertCircle },
  };

  const airlines = useMemo(() => {
    const uniqueAirlines = Array.from(new Set(bookings.map((b) => b.airline)));
    return uniqueAirlines.sort();
  }, [bookings]);

  const filteredAndSortedBookings = useMemo(() => {
    let filtered = bookings.filter((booking) => {
      const matchesSearch =
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerPhone.includes(searchTerm) ||
        booking.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.airline.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPaymentStatus =
        selectedPaymentStatus === "all" ||
        booking.paymentStatus === selectedPaymentStatus;

      const matchesAirline =
        selectedAirline === "all" || booking.airline === selectedAirline;

      const bookingDate = new Date(booking.flightDate);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      let matchesDate = true;
      switch (dateFilter) {
        case "today":
          matchesDate = bookingDate.toDateString() === today.toDateString();
          break;
        case "yesterday":
          matchesDate = bookingDate.toDateString() === yesterday.toDateString();
          break;
        case "week":
          matchesDate = bookingDate >= weekAgo;
          break;
        case "month":
          matchesDate = bookingDate >= monthAgo;
          break;
      }

      return (
        matchesSearch && matchesPaymentStatus && matchesAirline && matchesDate
      );
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "amount_high":
          return b.sellingPrice - a.sellingPrice;
        case "amount_low":
          return a.sellingPrice - b.sellingPrice;
        case "profit_high":
          return b.sellingPrice - b.costPrice - (a.sellingPrice - a.costPrice);
        case "profit_low":
          return a.sellingPrice - a.costPrice - (b.sellingPrice - b.costPrice);
        case "name":
          return a.customerName.localeCompare(b.customerName, "bn");
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    bookings,
    searchTerm,
    selectedPaymentStatus,
    selectedAirline,
    dateFilter,
    sortBy,
  ]);

  const totalStats = useMemo(() => {
    const total = filteredAndSortedBookings.reduce(
      (acc, booking) => {
        const sellingPrice = booking.sellingPrice || 0;
        const costPrice = booking.costPrice || 0;
        acc.totalAmount += sellingPrice;
        acc.totalProfit += sellingPrice - costPrice;
        return acc;
      },
      { totalAmount: 0, totalProfit: 0 },
    );

    return {
      ...total,
      count: filteredAndSortedBookings.length,
    };
  }, [filteredAndSortedBookings]);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <span className="ml-4 text-xl text-gray-600 dark:text-gray-300">
          লোড হচ্ছে...
        </span>
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
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4"
          >
            <Plane className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              বুকিং তালিকা
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              মোট {totalStats.count}টি বুকিং (৳
              {totalStats.totalAmount.toLocaleString()} আয়)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={loadBookings}
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

      {/* Enhanced Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                মোট বুকিং
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {totalStats.count}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Plane className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                মোট আয়
              </p>
              <p className="text-2xl font-bold text-green-600">
                ৳{totalStats.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-6 border border-yellow-200/50 dark:border-yellow-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                মোট মুনাফা
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                ৳{totalStats.totalProfit.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                গড় মুনাফা
              </p>
              <p className="text-2xl font-bold text-purple-600">
                ৳
                {totalStats.count > 0
                  ? Math.round(
                      totalStats.totalProfit / totalStats.count,
                    ).toLocaleString()
                  : 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="নাম, ফোন, রুট বা এয়ারলাইন খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-white/50 dark:bg-gray-700/50"
              />
            </div>
          </div>

          {/* Payment Status Filter */}
          <Select
            value={selectedPaymentStatus}
            onValueChange={setSelectedPaymentStatus}
          >
            <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-700/50">
              <SelectValue placeholder="পেমেন্ট স্ট্যাটাস" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
              <SelectItem value="paid">পরিশোধিত</SelectItem>
              <SelectItem value="partial">আংশিক</SelectItem>
              <SelectItem value="pending">অপেক্ষমাণ</SelectItem>
            </SelectContent>
          </Select>

          {/* Airline Filter */}
          <Select value={selectedAirline} onValueChange={setSelectedAirline}>
            <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-700/50">
              <SelectValue placeholder="এয়ারলাইন" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব এয়ারলাইন</SelectItem>
              {airlines.map((airline) => (
                <SelectItem key={airline} value={airline}>
                  {airline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-700/50">
              <SelectValue placeholder="তারিখ ফিল্টার" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব তারিখ</SelectItem>
              <SelectItem value="today">আজ</SelectItem>
              <SelectItem value="yesterday">গতকাল</SelectItem>
              <SelectItem value="week">গত ৭ দিন</SelectItem>
              <SelectItem value="month">গত ৩০ দিন</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-700/50">
              <SelectValue placeholder="সর্ট করুন" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">নতুন আগে</SelectItem>
              <SelectItem value="oldest">পুরাতন আগে</SelectItem>
              <SelectItem value="amount_high">বেশি টাকা আগে</SelectItem>
              <SelectItem value="amount_low">কম টাকা আগে</SelectItem>
              <SelectItem value="profit_high">বেশি মুনাফা আগে</SelectItem>
              <SelectItem value="profit_low">কম মুনাফা আগে</SelectItem>
              <SelectItem value="name">নাম অনুযায়ী</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Enhanced Bookings List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <AnimatePresence>
          {filteredAndSortedBookings.map((booking, index) => {
            const sellingPrice = booking.sellingPrice || 0;
            const costPrice = booking.costPrice || 0;
            const profit = sellingPrice - costPrice;
            const profitPercentage =
              costPrice > 0
                ? ((profit / costPrice) * 100).toFixed(1)
                : "0";
            const statusConfig = paymentStatusConfig[booking.paymentStatus];

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Customer Info */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {booking.customerName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {booking.customerPhone}
                        </p>
                        {booking.customerEmail && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {booking.customerEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Flight Info */}
                  <div className="lg:col-span-3">
                    <div className="space-y-2">
                      <p className="font-medium text-gray-800 dark:text-white flex items-center">
                        <Plane className="w-4 h-4 mr-2 text-blue-500" />
                        {booking.airline}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-green-500" />
                        {booking.route}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                        {format(new Date(booking.flightDate), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div className="lg:col-span-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          বিক্রয়মূল্য:
                        </span>
                        <span className="font-semibold text-green-600">
                          ৳{sellingPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          ক্রয়মূল্য:
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          ৳{booking.costPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          মুনাফা:
                        </span>
                        <span
                          className={cn(
                            "font-bold",
                            profit >= 0 ? "text-green-600" : "text-red-600",
                          )}
                        >
                          ৳{profit.toLocaleString()} ({profitPercentage}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        className={cn(
                          "flex items-center space-x-1 text-white",
                          statusConfig.color,
                        )}
                      >
                        <statusConfig.icon className="w-3 h-3" />
                        <span>{statusConfig.label}</span>
                      </Badge>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBooking(booking)}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(booking)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBooking(booking.id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredAndSortedBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              কোনো বুকিং পাওয়া যায়নি
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              অনুসন্ধান বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  বুকিং বিস্তারিত
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setSelectedBooking(null)}
                  className="flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    গ্রাহক তথ্য
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">নাম:</span>{" "}
                      {selectedBooking.customerName}
                    </p>
                    <p>
                      <span className="font-medium">ফোন:</span>{" "}
                      {selectedBooking.customerPhone}
                    </p>
                    {selectedBooking.customerEmail && (
                      <p>
                        <span className="font-medium">ইমেইল:</span>{" "}
                        {selectedBooking.customerEmail}
                      </p>
                    )}
                    {selectedBooking.passportNumber && (
                      <p>
                        <span className="font-medium">পাসপোর্ট:</span>{" "}
                        {selectedBooking.passportNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    ফ্লাইট তথ্য
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">এয়ারলাইন:</span>{" "}
                      {selectedBooking.airline}
                    </p>
                    <p>
                      <span className="font-medium">রু���:</span>{" "}
                      {selectedBooking.route}
                    </p>
                    <p>
                      <span className="font-medium">তারিখ:</span>{" "}
                      {format(
                        new Date(selectedBooking.flightDate),
                        "dd MMM yyyy",
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    আর্থিক তথ্য
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">ক্রয়মূল্য:</span> ৳
                      {(selectedBooking.costPrice || 0).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">বিক্রয়মূল্য:</span> ৳
                      {(selectedBooking.sellingPrice || 0).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">মুনাফা:</span> ৳
                      {(
                        (selectedBooking.sellingPrice || 0) - (selectedBooking.costPrice || 0)
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    অন্যান্য
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">পেমেন্ট:</span>{" "}
                      {paymentStatusConfig[selectedBooking.paymentStatus].label}
                    </p>
                    <p>
                      <span className="font-medium">তৈরি:</span>{" "}
                      {format(
                        new Date(selectedBooking.createdAt),
                        "dd MMM yyyy, hh:mm a",
                      )}
                    </p>
                    {selectedBooking.notes && (
                      <p>
                        <span className="font-medium">মন্তব্য:</span>{" "}
                        {selectedBooking.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
