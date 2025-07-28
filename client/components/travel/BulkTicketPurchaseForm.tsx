import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Plane,
  MapPin,
  DollarSign,
  Calendar,
  User,
  Package,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BulkTicketPurchase,
  COUNTRIES,
  FLIGHT_CLASSES,
  SUPPLIERS,
} from "@shared/ticket-types";
import { ROUTES } from "@shared/travel-types";
import ticketInventoryService from "@/services/ticketInventoryService";

interface BulkTicketPurchaseFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkTicketPurchaseForm({
  onClose,
  onSuccess,
}: BulkTicketPurchaseFormProps) {
  const [formData, setFormData] = useState<BulkTicketPurchase>({
    route: "",
    airline: "",
    flightClass: "Economy",
    country: "",
    quantity: 1,
    purchasePrice: 0,
    suggestedSalePrice: 0,
    supplier: "",
    validFrom: "",
    validTo: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.route) {
      newErrors.route = "রুট নির্বাচন করুন";
    }

    if (!formData.airline) {
      newErrors.airline = "এয়ারলাইন নির্বাচন করুন";
    }

    if (!formData.country) {
      newErrors.country = "দেশ নির্বাচন করুন";
    }

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = "টিকেট সংখ্যা ১ বা তার বেশি হতে হবে";
    }

    if (!formData.purchasePrice || formData.purchasePrice <= 0) {
      newErrors.purchasePrice = "ক্রয় মূল্য আবশ্যিক";
    }

    if (!formData.suggestedSalePrice || formData.suggestedSalePrice <= 0) {
      newErrors.suggestedSalePrice = "বিক্রয় মূল্য আবশ্যিক";
    }

    if (formData.suggestedSalePrice <= formData.purchasePrice) {
      newErrors.suggestedSalePrice =
        "বিক্রয় মূল্য ক্রয় মূল্যের চেয়ে বেশি হতে হবে";
    }

    if (!formData.supplier) {
      newErrors.supplier = "সাপ্লায়ার নির্বাচন করুন";
    }

    if (!formData.validFrom) {
      newErrors.validFrom = "বৈধতার শুরুর তারিখ আবশ্যিক";
    }

    if (!formData.validTo) {
      newErrors.validTo = "বৈধতার শেষ তারিখ আবশ্যিক";
    }

    if (
      formData.validFrom &&
      formData.validTo &&
      formData.validFrom >= formData.validTo
    ) {
      newErrors.validTo = "শেষ তারিখ শুরুর তারিখের চেয়ে পরে হতে হবে";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const inventoryId = ticketInventoryService.addBulkPurchase(formData);

      if (inventoryId) {
        onSuccess();
      } else {
        setErrors({ submit: "টিকেট ক্রয়ে সমস্যা হয়েছে" });
      }
    } catch (error) {
      setErrors({ submit: "একটি ত্রুটি ঘটেছে" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof BulkTicketPurchase,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const totalCost = formData.quantity * formData.purchasePrice;
  const potentialRevenue = formData.quantity * formData.suggestedSalePrice;
  const potentialProfit = potentialRevenue - totalCost;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              বাল্ক টিকেট ক্রয়
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              অগ্রিম টিকেট ক্রয় করুন
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Flight Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Plane className="w-5 h-5" />
            <span>ফ্লাইট তথ্য</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Route */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                রুট *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.route}
                  onChange={(e) => handleInputChange("route", e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                    errors.route
                      ? "border-red-400"
                      : "border-gray-300 dark:border-gray-600",
                  )}
                >
                  <option value="">রুট নির্বাচন করুন</option>
                  {ROUTES.map((route) => (
                    <option key={route} value={route}>
                      {route}
                    </option>
                  ))}
                </select>
              </div>
              {errors.route && (
                <p className="mt-1 text-sm text-red-600">{errors.route}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                গন্তব্য দেশ *
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className={cn(
                  "w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                  errors.country
                    ? "border-red-400"
                    : "border-gray-300 dark:border-gray-600",
                )}
              >
                <option value="">দেশ নির্বাচন করুন</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>

            {/* Airline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                এয়ারলাইন/সাপ্লায়ার *
              </label>
              <select
                value={formData.airline}
                onChange={(e) => handleInputChange("airline", e.target.value)}
                className={cn(
                  "w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                  errors.airline
                    ? "border-red-400"
                    : "border-gray-300 dark:border-gray-600",
                )}
              >
                <option value="">এয়ারলাইন নির্বাচন করুন</option>
                {SUPPLIERS.map((airline) => (
                  <option key={airline} value={airline}>
                    {airline}
                  </option>
                ))}
              </select>
              {errors.airline && (
                <p className="mt-1 text-sm text-red-600">{errors.airline}</p>
              )}
            </div>

            {/* Flight Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ফ্লাইট ক্লাস *
              </label>
              <select
                value={formData.flightClass}
                onChange={(e) =>
                  handleInputChange(
                    "flightClass",
                    e.target.value as "Economy" | "Business" | "First",
                  )
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {FLIGHT_CLASSES.map((cls) => (
                  <option key={cls.value} value={cls.value}>
                    {cls.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Purchase Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>ক্রয় বিবরণ</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                টিকেট সংখ্যা *
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  handleInputChange("quantity", parseInt(e.target.value) || 0)
                }
                min="1"
                className={cn(
                  "w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                  errors.quantity
                    ? "border-red-400"
                    : "border-gray-300 dark:border-gray-600",
                )}
                placeholder="১০"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                সাপ্লায়ার *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.supplier}
                  onChange={(e) =>
                    handleInputChange("supplier", e.target.value)
                  }
                  className={cn(
                    "w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                    errors.supplier
                      ? "border-red-400"
                      : "border-gray-300 dark:border-gray-600",
                  )}
                >
                  <option value="">সাপ্লায়ার নির্বাচন করুন</option>
                  {SUPPLIERS.map((supplier) => (
                    <option key={supplier} value={supplier}>
                      {supplier}
                    </option>
                  ))}
                </select>
              </div>
              {errors.supplier && (
                <p className="mt-1 text-sm text-red-600">{errors.supplier}</p>
              )}
            </div>

            {/* Purchase Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ক্রয় মূল্য (প্রতি টিকেট) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) =>
                    handleInputChange(
                      "purchasePrice",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  min="0"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                    errors.purchasePrice
                      ? "border-red-400"
                      : "border-gray-300 dark:border-gray-600",
                  )}
                  placeholder="৪২০০০"
                />
              </div>
              {errors.purchasePrice && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.purchasePrice}
                </p>
              )}
            </div>

            {/* Suggested Sale Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                প্রস্তাবিত বিক্রয় মূল্য *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.suggestedSalePrice}
                  onChange={(e) =>
                    handleInputChange(
                      "suggestedSalePrice",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  min="0"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                    errors.suggestedSalePrice
                      ? "border-red-400"
                      : "border-gray-300 dark:border-gray-600",
                  )}
                  placeholder="৫০০০০"
                />
              </div>
              {errors.suggestedSalePrice && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.suggestedSalePrice}
                </p>
              )}
            </div>

            {/* Valid From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                বৈধতার শুরু *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) =>
                    handleInputChange("validFrom", e.target.value)
                  }
                  className={cn(
                    "w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                    errors.validFrom
                      ? "border-red-400"
                      : "border-gray-300 dark:border-gray-600",
                  )}
                />
              </div>
              {errors.validFrom && (
                <p className="mt-1 text-sm text-red-600">{errors.validFrom}</p>
              )}
            </div>

            {/* Valid To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                বৈধতার শেষ *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => handleInputChange("validTo", e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                    errors.validTo
                      ? "border-red-400"
                      : "border-gray-300 dark:border-gray-600",
                  )}
                />
              </div>
              {errors.validTo && (
                <p className="mt-1 text-sm text-red-600">{errors.validTo}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Financial Summary */}
        {formData.quantity > 0 &&
          formData.purchasePrice > 0 &&
          formData.suggestedSalePrice > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700"
            >
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                আর্থিক সারসংক্ষেপ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ৳{totalCost.toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    মোট বিনিয়োগ
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ৳{potentialRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    সম্ভাব্য আয়
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    ৳{potentialProfit.toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    সম্ভাব্য মুনাফা
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            নোট (ঐচ্ছিক)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            placeholder="অতিরিক্ত তথ্য বা মন্তব্য..."
          />
        </motion.div>

        {/* Submit Error */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg"
          >
            <p className="text-red-700 dark:text-red-400 text-sm text-center">
              {errors.submit}
            </p>
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
            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            বাতিল
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium",
              "hover:from-green-600 hover:to-blue-600 transition-all shadow-lg",
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
            <span>{isSubmitting ? "ক্রয় হচ্ছে..." : "টিকেট ক্রয় করুন"}</span>
          </button>
        </motion.div>
      </form>
    </div>
  );
}
