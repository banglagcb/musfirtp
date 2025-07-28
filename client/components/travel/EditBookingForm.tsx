import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  Plane,
  DollarSign,
  Save,
  X,
  MapPin,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIRLINES, ROUTES, Booking, User } from "@shared/travel-types";
import dataService from "@/services/dataService";
import { useTranslation } from "@/contexts/AppContext";

interface EditBookingFormProps {
  booking: Booking;
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBookingForm({
  booking,
  user,
  onClose,
  onSuccess,
}: EditBookingFormProps) {
  const [formData, setFormData] = useState({
    customerName: booking.customerName,
    mobile: booking.mobile,
    passport: booking.passport,
    email: booking.email,
    flightDate: booking.flightDate,
    route: booking.route,
    airline: booking.airline,
    purchasePrice: booking.purchasePrice.toString(),
    salePrice: booking.salePrice.toString(),
    paymentStatus: booking.paymentStatus as "paid" | "pending" | "partial",
    paidAmount: booking.paidAmount.toString(),
    notes: booking.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if this booking should be view-only for managers
  const isViewOnly =
    user.role === "manager" && booking.paymentStatus === "paid";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "গ্রাহকের ��াম আবশ্যিক";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "মোবাইল নম্বর আবশ্যিক";
    } else if (!/^01[3-9]\d{8}$/.test(formData.mobile)) {
      newErrors.mobile = "���ঠিক মোবাইল নম্বর লিখুন";
    }

    if (!formData.passport.trim()) {
      newErrors.passport = "পাসপোর্ট নম্বর আবশ্যিক";
    }

    if (!formData.email.trim()) {
      newErrors.email = "ইমেইল আবশ্যিক";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "সঠিক ইমেইল ঠিকানা লিখুন";
    }

    if (!formData.flightDate) {
      newErrors.flightDate = "ফ্লাইট তারিখ আবশ্যিক";
    }

    if (!formData.route) {
      newErrors.route = "রুট ��ির্বাচন করুন";
    }

    if (!formData.airline) {
      newErrors.airline = "এয়ারলাইন নির্বাচন করুন";
    }

    if (!formData.purchasePrice || isNaN(Number(formData.purchasePrice))) {
      newErrors.purchasePrice = "ক্রয়মূল্য আবশ্যিক";
    }

    if (!formData.salePrice || isNaN(Number(formData.salePrice))) {
      newErrors.salePrice = "বিক্রয়মূল্য আবশ্যিক";
    }

    const purchasePrice = Number(formData.purchasePrice);
    const salePrice = Number(formData.salePrice);

    if (salePrice <= purchasePrice) {
      newErrors.salePrice = "বিক্রয���মূল্য ক্রয়মূল্যের চেয়ে বেশি হতে হবে";
    }

    if (formData.paymentStatus === "partial") {
      const paidAmount = Number(formData.paidAmount);
      if (!formData.paidAmount || isNaN(paidAmount)) {
        newErrors.paidAmount = "পেইড পরিমাণ আবশ্যিক";
      } else if (paidAmount <= 0 || paidAmount >= salePrice) {
        newErrors.paidAmount =
          "পেইড পরিমাণ ০ এর চেয়ে বেশি এবং বিক্রয়মূল্যের চেয়ে ��ম হতে হবে";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if in view-only mode
    if (isViewOnly) {
      alert("বিক্রিত টিকেট পরিবর্তন করা যাবে না। কেবল দেখা যায়।");
      return;
    }

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate paid amount based on payment status
      let paidAmount = 0;
      if (formData.paymentStatus === "paid") {
        paidAmount = Number(formData.salePrice);
      } else if (formData.paymentStatus === "partial") {
        paidAmount = Number(formData.paidAmount);
      }

      const updatedBooking = {
        customerName: formData.customerName.trim(),
        mobile: formData.mobile.trim(),
        passport: formData.passport.trim(),
        email: formData.email.trim(),
        flightDate: formData.flightDate,
        route: formData.route,
        airline: formData.airline,
        purchasePrice: Number(formData.purchasePrice),
        salePrice: Number(formData.salePrice),
        paymentStatus: formData.paymentStatus,
        paidAmount,
        notes: formData.notes.trim(),
      };

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const success = dataService.updateBooking(booking.id, updatedBooking);

      if (success) {
        onSuccess();
      } else {
        setErrors({ submit: t("updateBookingError") });
      }
    } catch (error) {
      setErrors({ submit: "একটি ত্রুটি ঘটেছে" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePaymentStatusChange = (
    status: "paid" | "pending" | "partial",
  ) => {
    setFormData((prev) => ({
      ...prev,
      paymentStatus: status,
      paidAmount:
        status === "paid"
          ? prev.salePrice
          : status === "pending"
            ? "0"
            : prev.paidAmount,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-folder-primary to-folder-secondary rounded-full flex items-center justify-center">
            <Edit3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isViewOnly ? t("viewBooking") : t("editBooking")}
            </h1>
            <p className="text-white/70">
              {t("bookingID")}: {booking.id}
              {isViewOnly && ` (${t("viewOnly")})`}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <UserIcon className="w-5 h-5" />
            <span>গ্রাহকের তথ্য</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                গ্রাহকের নাম *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) =>
                  handleInputChange("customerName", e.target.value)
                }
                disabled={isViewOnly}
                className={cn(
                  "w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50",
                  "focus:outline-none focus:ring-2 focus:ring-folder-primary/50 transition-all",
                  errors.customerName ? "border-red-400" : "border-white/20",
                  isViewOnly && "opacity-50 cursor-not-allowed",
                )}
                placeholder="গ্রাহকের সম্পূর��ণ নাম"
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.customerName}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                মোবাইল নম্বর *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  disabled={isViewOnly}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50",
                    "focus:outline-none focus:ring-2 focus:ring-folder-primary/50 transition-all",
                    errors.mobile ? "border-red-400" : "border-white/20",
                    isViewOnly && "opacity-50 cursor-not-allowed",
                  )}
                  placeholder="01XXXXXXXXX"
                />
              </div>
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-400">{errors.mobile}</p>
              )}
            </div>

            {/* Passport */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                পাসপোর্ট নম্বর *
              </label>
              <input
                type="text"
                value={formData.passport}
                onChange={(e) => handleInputChange("passport", e.target.value)}
                disabled={isViewOnly}
                className={cn(
                  "w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50",
                  "focus:outline-none focus:ring-2 focus:ring-folder-primary/50 transition-all",
                  errors.passport ? "border-red-400" : "border-white/20",
                  isViewOnly && "opacity-50 cursor-not-allowed",
                )}
                placeholder="BE1234567"
              />
              {errors.passport && (
                <p className="mt-1 text-sm text-red-400">{errors.passport}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                ��মেইল ঠিকানা *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isViewOnly}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50",
                    "focus:outline-none focus:ring-2 focus:ring-folder-primary/50 transition-all",
                    errors.email ? "border-red-400" : "border-white/20",
                    isViewOnly && "opacity-50 cursor-not-allowed",
                  )}
                  placeholder="example@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Flight Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Plane className="w-5 h-5" />
            <span>ফ্লাইট তথ্য</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Flight Date */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                ফ্লাইট তারিখ *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="date"
                  value={formData.flightDate}
                  onChange={(e) =>
                    handleInputChange("flightDate", e.target.value)
                  }
                  disabled={isViewOnly}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white",
                    "focus:outline-none focus:ring-2 focus:ring-folder-primary/50 transition-all",
                    errors.flightDate ? "border-red-400" : "border-white/20",
                    isViewOnly && "opacity-50 cursor-not-allowed",
                  )}
                />
              </div>
              {errors.flightDate && (
                <p className="mt-1 text-sm text-red-400">{errors.flightDate}</p>
              )}
            </div>

            {/* Route */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                রুট *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <select
                  value={formData.route}
                  onChange={(e) => handleInputChange("route", e.target.value)}
                  disabled={isViewOnly}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white",
                    "focus:outline-none focus:ring-2 focus:ring-folder-primary/50 transition-all",
                    errors.route ? "border-red-400" : "border-white/20",
                    isViewOnly && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <option value="" className="bg-gray-800">
                    রুট নির্বাচন করুন
                  </option>
                  {ROUTES.map((route) => (
                    <option key={route} value={route} className="bg-gray-800">
                      {route}
                    </option>
                  ))}
                </select>
              </div>
              {errors.route && (
                <p className="mt-1 text-sm text-red-400">{errors.route}</p>
              )}
            </div>

            {/* Airline */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-2">
                এয়ারলাইন *
              </label>
              <div className="relative">
                <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <select
                  value={formData.airline}
                  onChange={(e) => handleInputChange("airline", e.target.value)}
                  disabled={isViewOnly}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white",
                    "focus:outline-none focus:ring-2 focus:ring-folder-primary/50 transition-all",
                    errors.airline ? "border-red-400" : "border-white/20",
                    isViewOnly && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <option value="" className="bg-gray-800">
                    এয়া���লাইন নির্বাচন করুন
                  </option>
                  {AIRLINES.map((airline) => (
                    <option
                      key={airline}
                      value={airline}
                      className="bg-gray-800"
                    >
                      {airline}
                    </option>
                  ))}
                </select>
              </div>
              {errors.airline && (
                <p className="mt-1 text-sm text-red-400">{errors.airline}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Pricing Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>মূল্য ও পেমেন্ট</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Purchase Price */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                ক্রয়মূল্য (টাকা) *
              </label>
              <input
                type="number"
                value={formData.purchasePrice}
                onChange={(e) =>
                  handleInputChange("purchasePrice", e.target.value)
                }
                disabled={isViewOnly}
                className={cn(
                  "w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50",
                  "focus:outline-none focus:ring-2 focus:ring-folder-primary/50 transition-all",
                  errors.purchasePrice ? "border-red-400" : "border-white/20",
                  isViewOnly && "opacity-50 cursor-not-allowed",
                )}
                placeholder="45000"
              />
              {errors.purchasePrice && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.purchasePrice}
                </p>
              )}
            </div>

            {/* Sale Price */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                বিক্রয়মূল্য (টাকা) *
              </label>
              <input
                type="number"
                value={formData.salePrice}
                onChange={(e) => handleInputChange("salePrice", e.target.value)}
                disabled={isViewOnly}
                className={cn(
                  "w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50",
                  "focus:outline-none focus:ring-2 focus:ring-folder-primary/50 transition-all",
                  errors.salePrice ? "border-red-400" : "border-white/20",
                  isViewOnly && "opacity-50 cursor-not-allowed",
                )}
                placeholder="50000"
              />
              {errors.salePrice && (
                <p className="mt-1 text-sm text-red-400">{errors.salePrice}</p>
              )}
            </div>
          </div>

          {/* Payment Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/70 mb-3">
              পেমেন্ট স্ট্যাটাস *
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                {
                  value: "paid",
                  label: "পেইড",
                  color: "from-green-500 to-green-600",
                },
                {
                  value: "pending",
                  label: "পেন্ডিং",
                  color: "from-red-500 to-red-600",
                },
                {
                  value: "partial",
                  label: "আংশিক",
                  color: "from-yellow-500 to-yellow-600",
                },
              ].map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() =>
                    !isViewOnly &&
                    handlePaymentStatusChange(status.value as any)
                  }
                  disabled={isViewOnly}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all",
                    formData.paymentStatus === status.value
                      ? `bg-gradient-to-r ${status.color} text-white`
                      : "bg-white/10 text-white/70 hover:bg-white/20",
                    isViewOnly && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Paid Amount (for partial payment) */}
          {formData.paymentStatus === "partial" && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                পেইড পরিমাণ (টাকা) *
              </label>
              <input
                type="number"
                value={formData.paidAmount}
                onChange={(e) =>
                  handleInputChange("paidAmount", e.target.value)
                }
                disabled={isViewOnly}
                className={cn(
                  "w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50",
                  "focus:outline-none focus:ring-2 focus:ring-folder-primary/50 transition-all",
                  errors.paidAmount ? "border-red-400" : "border-white/20",
                  isViewOnly && "opacity-50 cursor-not-allowed",
                )}
                placeholder="25000"
              />
              {errors.paidAmount && (
                <p className="mt-1 text-sm text-red-400">{errors.paidAmount}</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <label className="block text-sm font-medium text-white/70 mb-2">
            নোট (ঐচ����ছিক)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            disabled={isViewOnly}
            rows={3}
            className={cn(
              "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-folder-primary/50 transition-all resize-none",
              isViewOnly && "opacity-50 cursor-not-allowed",
            )}
            placeholder="অতিরিক্ত তথ্য বা মন্তব্য..."
          />
        </motion.div>

        {/* Submit Error */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-500/20 border border-red-400/50 rounded-lg"
          >
            <p className="text-red-200 text-sm text-center">{errors.submit}</p>
          </motion.div>
        )}

        {/* Form Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-end space-x-4 pt-4"
        >
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
          >
            বাতিল
          </button>
          {!isViewOnly && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "px-6 py-3 bg-gradient-to-r from-folder-primary to-folder-secondary text-white rounded-xl font-medium",
                "hover:from-folder-secondary hover:to-folder-accent transition-all shadow-glow",
                "flex items-center space-x-2",
                isSubmitting && "opacity-70 cursor-not-allowed",
              )}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Save className="w-5 h-5" />
                </motion.div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{isSubmitting ? "আপডেট হচ্ছে..." : "আপডে�� করুন"}</span>
            </button>
          )}
        </motion.div>
      </form>
    </div>
  );
}
