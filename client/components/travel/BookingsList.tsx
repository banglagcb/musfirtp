import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Edit3,
  Trash2,
  Calendar,
  User as UserIcon,
  Phone,
  Mail,
  Plane,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Booking, FilterOptions, AIRLINES, User } from "@shared/travel-types";
import dataService from "@/services/dataService";
import { useTranslation } from "@/contexts/AppContext";

interface BookingsListProps {
  user: User;
  onClose: () => void;
  onEdit: (booking: Booking) => void;
}

export default function BookingsList({
  user,
  onClose,
  onEdit,
}: BookingsListProps) {
  const { t, language } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    customerName: "",
    dateFrom: "",
    dateTo: "",
    paymentStatus: "all",
    airline: "",
  });

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filters]);

  const loadBookings = () => {
    const allBookings = dataService.getBookings();
    setBookings(allBookings);
  };

  const applyFilters = () => {
    const filtered = dataService.searchBookings(filters);
    setFilteredBookings(filtered);
  };

  const handleFilterChange = (field: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      customerName: "",
      dateFrom: "",
      dateTo: "",
      paymentStatus: "all",
      airline: "",
    });
  };

  const handleDelete = async (id: string) => {
    // Only owners can delete bookings
    if (user.role !== "owner") {
      alert(t("deleteBookingPermission"));
      return;
    }
    if (window.confirm(t("deleteConfirm"))) {
      const success = dataService.deleteBooking(id);
      if (success) {
        loadBookings();
      }
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "partial":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return t("paid");
      case "partial":
        return t("partial");
      case "pending":
        return t("pending");
      default:
        return language === "bn" ? "অজানা" : "Unknown";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "bn" ? "bn-BD" : "en-BD");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t("bookings")}</h1>
            <p className="text-white/70">
              {t("totalBookingsFound")}: {filteredBookings.length}
            </p>
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

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search by customer name */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                value={filters.customerName}
                onChange={(e) =>
                  handleFilterChange("customerName", e.target.value)
                }
                placeholder="গ্রাহকের নাম দিয়ে খুঁজুন..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-folder-primary/50"
              />
            </div>

            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "px-6 py-3 backdrop-blur-md border rounded-xl transition-colors flex items-center space-x-2",
                showFilters
                  ? "bg-folder-primary/20 border-folder-primary/50 text-white"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20",
              )}
            >
              <Filter className="w-5 h-5" />
              <span>ফিল্টার</span>
            </motion.button>

            {/* Clear Filters */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearFilters}
              className="px-6 py-3 bg-red-500/20 border border-red-400/50 rounded-xl text-red-200 hover:bg-red-500/30 transition-colors"
            >
              ক্লিয়ার
            </motion.button>
          </div>

          {/* Extended Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {/* Date From */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    তারিখ থেকে
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                    className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-folder-primary/50"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    তারিখ পর্যন্ত
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-folder-primary/50"
                  />
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    পেমেন্ট স্ট্যাটাস
                  </label>
                  <select
                    value={filters.paymentStatus}
                    onChange={(e) =>
                      handleFilterChange("paymentStatus", e.target.value)
                    }
                    className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-folder-primary/50"
                  >
                    <option value="all" className="bg-slate-800">
                      সব
                    </option>
                    <option value="paid" className="bg-slate-800">
                      পেইড
                    </option>
                    <option value="partial" className="bg-slate-800">
                      আংশিক
                    </option>
                    <option value="pending" className="bg-slate-800">
                      পেন্ডিং
                    </option>
                  </select>
                </div>

                {/* Airline */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    এয়ারলাইন
                  </label>
                  <select
                    value={filters.airline}
                    onChange={(e) =>
                      handleFilterChange("airline", e.target.value)
                    }
                    className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-folder-primary/50"
                  >
                    <option value="" className="bg-slate-800">
                      সব এয়ারলাইন
                    </option>
                    {AIRLINES.map((airline) => (
                      <option
                        key={airline}
                        value={airline}
                        className="bg-slate-800"
                      >
                        {airline}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bookings Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getPaymentStatusIcon(booking.paymentStatus)}
                  <span className="text-sm font-medium text-white">
                    {getPaymentStatusText(booking.paymentStatus)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedBooking(booking)}
                    className="p-2 bg-blue-500/20 border border-blue-400/50 rounded-lg text-blue-200 hover:bg-blue-500/30 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                  {/* Only show edit/delete for owners OR if booking is not fully paid */}
                  {(user.role === "owner" ||
                    booking.paymentStatus !== "paid") && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(booking)}
                        className="p-2 bg-yellow-500/20 border border-yellow-400/50 rounded-lg text-yellow-200 hover:bg-yellow-500/30 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(booking.id)}
                        className="p-2 bg-red-500/20 border border-red-400/50 rounded-lg text-red-200 hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5 text-white/50" />
                  <div>
                    <p className="text-white font-medium">
                      {booking.customerName}
                    </p>
                    <p className="text-white/70 text-sm">{booking.passport}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-white/50" />
                  <p className="text-white/70 text-sm">{booking.mobile}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <Plane className="w-5 h-5 text-white/50" />
                  <div>
                    <p className="text-white font-medium">{booking.route}</p>
                    <p className="text-white/70 text-sm">{booking.airline}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-white/50" />
                  <p className="text-white/70 text-sm">
                    {formatDate(booking.flightDate)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-white/50" />
                    <div>
                      <p className="text-white font-medium">
                        {formatCurrency(booking.salePrice)}
                      </p>
                      <p className="text-white/70 text-xs">বিক্রয়মূল্য</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-medium">
                      {formatCurrency(booking.paidAmount)}
                    </p>
                    <p className="text-white/70 text-xs">পেইড</p>
                  </div>
                </div>

                {/* Profit */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">মুনাফা:</span>
                    <span className="text-neon-green font-medium">
                      {formatCurrency(
                        booking.paidAmount -
                          booking.purchasePrice *
                            (booking.paidAmount / booking.salePrice),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No bookings found */}
        {filteredBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-white/70 text-lg">{t("noBookingsFound")}</p>
            <p className="text-white/50 text-sm mt-2">
              {t("filterAndRetry")}
            </p>
          </motion.div>
        )}

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
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {t("bookingDetails")}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedBooking(null)}
                    className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {t("customerInfo")}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-white/70">
                        <span className="text-white">নাম:</span>{" "}
                        {selectedBooking.customerName}
                      </p>
                      <p className="text-white/70">
                        <span className="text-white">মোবাইল:</span>{" "}
                        {selectedBooking.mobile}
                      </p>
                      <p className="text-white/70">
                        <span className="text-white">ইমেইল:</span>{" "}
                        {selectedBooking.email}
                      </p>
                      <p className="text-white/70">
                        <span className="text-white">পাসপোর্ট:</span>{" "}
                        {selectedBooking.passport}
                      </p>
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      ফ্লাইট ��থ্য
                    </h3>
                    <div className="space-y-2">
                      <p className="text-white/70">
                        <span className="text-white">রুট:</span>{" "}
                        {selectedBooking.route}
                      </p>
                      <p className="text-white/70">
                        <span className="text-white">এয়ারলাইন:</span>{" "}
                        {selectedBooking.airline}
                      </p>
                      <p className="text-white/70">
                        <span className="text-white">{t("flightDate")}:</span>{" "}
                        {formatDate(selectedBooking.flightDate)}
                      </p>
                      <p className="text-white/70">
                        <span className="text-white">{t("bookingDate")}:</span>{" "}
                        {formatDate(selectedBooking.bookingDate)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {t("paymentInfo")}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-white/70">
                        <span className="text-white">{t("purchasePrice")}:</span>{" "}
                        {formatCurrency(selectedBooking.purchasePrice)}
                      </p>
                      <p className="text-white/70">
                        <span className="text-white">{t("salePrice")}:</span>{" "}
                        {formatCurrency(selectedBooking.salePrice)}
                      </p>
                      <p className="text-white/70">
                        <span className="text-white">{t("paidAmount")}:</span>{" "}
                        {formatCurrency(selectedBooking.paidAmount)}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-white">{t("status")}:</span>
                        {getPaymentStatusIcon(selectedBooking.paymentStatus)}
                        <span className="text-white/70">
                          {getPaymentStatusText(selectedBooking.paymentStatus)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Profit Calculation */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {t("profitCalculation")}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-white/70">
                        <span className="text-white">{t("totalProfit")}:</span>{" "}
                        {formatCurrency(
                          selectedBooking.salePrice -
                            selectedBooking.purchasePrice,
                        )}
                      </p>
                      <p className="text-neon-green font-medium">
                        <span className="text-white">অর্জিত মুনাফা:</span>{" "}
                        {formatCurrency(
                          selectedBooking.paidAmount -
                            selectedBooking.purchasePrice *
                              (selectedBooking.paidAmount /
                                selectedBooking.salePrice),
                        )}
                      </p>
                      {selectedBooking.paymentStatus !== "paid" && (
                        <p className="text-yellow-400">
                          <span className="text-white">বাকি:</span>{" "}
                          {formatCurrency(
                            selectedBooking.salePrice -
                              selectedBooking.paidAmount,
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      নোট
                    </h3>
                    <p className="text-white/70 bg-white/5 p-3 rounded-lg">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
