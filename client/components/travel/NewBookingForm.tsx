import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  Calendar, 
  Plane, 
  DollarSign,
  Save,
  X,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIRLINES, ROUTES } from "@shared/travel-types";
import dataService from "@/services/dataService";

interface NewBookingFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewBookingForm({ onClose, onSuccess }: NewBookingFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    mobile: "",
    passport: "",
    email: "",
    flightDate: "",
    route: "",
    airline: "",
    purchasePrice: "",
    salePrice: "",
    paymentStatus: "pending" as 'paid' | 'pending' | 'partial',
    paidAmount: "",
    notes: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "গ্রাহকের নাম আবশ্যিক";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "মোবাইল নম্বর আবশ্যিক";
    } else if (!/^01[3-9]\d{8}$/.test(formData.mobile)) {
      newErrors.mobile = "সঠিক মোবাইল নম্বর লিখুন";
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
      newErrors.route = "রুট নির্বাচন করু���";
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
      newErrors.salePrice = "বিক্রয়মূল্য ক্রয়মূল্যের চেয়ে বেশি হতে হবে";
    }

    if (formData.paymentStatus === 'partial') {
      const paidAmount = Number(formData.paidAmount);
      if (!formData.paidAmount || isNaN(paidAmount)) {
        newErrors.paidAmount = "পেইড পরিমাণ আবশ্যিক";
      } else if (paidAmount <= 0 || paidAmount >= salePrice) {
        newErrors.paidAmount = "পেইড পরিমাণ ০ এর চেয়ে বেশি এবং বিক্রয়মূল্যের চেয়ে কম হতে হবে";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const paidAmount = formData.paymentStatus === 'paid' 
        ? Number(formData.salePrice)
        : formData.paymentStatus === 'partial'
        ? Number(formData.paidAmount)
        : 0;

      dataService.addBooking({
        customerName: formData.customerName,
        mobile: formData.mobile,
        passport: formData.passport,
        email: formData.email,
        flightDate: formData.flightDate,
        route: formData.route,
        airline: formData.airline,
        purchasePrice: Number(formData.purchasePrice),
        salePrice: Number(formData.salePrice),
        paymentStatus: formData.paymentStatus,
        paidAmount,
        notes: formData.notes
      });

      onSuccess();
    } catch (error) {
      console.error('Error adding booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">নতুন বুকিং যোগ করুন</h1>
            <p className="text-white/70">নতুন ফ্লাইট বুকিং এর তথ্য পূরণ করুন</p>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Customer Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <User className="w-6 h-6" />
                <span>গ্রাহকের তথ্য</span>
              </h2>

              <div className="space-y-4">
                {/* Customer Name */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">গ্রাহকের নাম *</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className={cn(
                      "w-full p-3 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-white/50",
                      "focus:outline-none focus:ring-2 transition-all duration-300",
                      errors.customerName ? "border-red-400 focus:ring-red-400/50" : "border-white/20 focus:ring-folder-primary/50"
                    )}
                    placeholder="যেমন: মোহাম্মদ রহিম"
                  />
                  {errors.customerName && (
                    <p className="text-red-400 text-sm mt-1">{errors.customerName}</p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">মোবাইল নম্বর *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 p-3 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-white/50",
                        "focus:outline-none focus:ring-2 transition-all duration-300",
                        errors.mobile ? "border-red-400 focus:ring-red-400/50" : "border-white/20 focus:ring-folder-primary/50"
                      )}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-red-400 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>

                {/* Passport */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">পাসপোর্ট নম্বর *</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="text"
                      value={formData.passport}
                      onChange={(e) => handleInputChange('passport', e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 p-3 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-white/50",
                        "focus:outline-none focus:ring-2 transition-all duration-300",
                        errors.passport ? "border-red-400 focus:ring-red-400/50" : "border-white/20 focus:ring-folder-primary/50"
                      )}
                      placeholder="যেমন: BE1234567"
                    />
                  </div>
                  {errors.passport && (
                    <p className="text-red-400 text-sm mt-1">{errors.passport}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">ইমেইল ঠিকানা *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 p-3 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-white/50",
                        "focus:outline-none focus:ring-2 transition-all duration-300",
                        errors.email ? "border-red-400 focus:ring-red-400/50" : "border-white/20 focus:ring-folder-primary/50"
                      )}
                      placeholder="example@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Flight Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Plane className="w-6 h-6" />
                <span>ফ্লাইট তথ্য</span>
              </h2>

              <div className="space-y-4">
                {/* Flight Date */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">ফ্লাইট তারিখ *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="date"
                      value={formData.flightDate}
                      onChange={(e) => handleInputChange('flightDate', e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 p-3 bg-white/10 backdrop-blur-md border rounded-xl text-white",
                        "focus:outline-none focus:ring-2 transition-all duration-300",
                        errors.flightDate ? "border-red-400 focus:ring-red-400/50" : "border-white/20 focus:ring-folder-primary/50"
                      )}
                    />
                  </div>
                  {errors.flightDate && (
                    <p className="text-red-400 text-sm mt-1">{errors.flightDate}</p>
                  )}
                </div>

                {/* Route */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">রুট *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <select
                      value={formData.route}
                      onChange={(e) => handleInputChange('route', e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 p-3 bg-white/10 backdrop-blur-md border rounded-xl text-white",
                        "focus:outline-none focus:ring-2 transition-all duration-300",
                        errors.route ? "border-red-400 focus:ring-red-400/50" : "border-white/20 focus:ring-folder-primary/50"
                      )}
                    >
                      <option value="">রুট নির্বাচন করুন</option>
                      {ROUTES.map((route) => (
                        <option key={route} value={route} className="bg-slate-800 text-white">
                          {route}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.route && (
                    <p className="text-red-400 text-sm mt-1">{errors.route}</p>
                  )}
                </div>

                {/* Airline */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">এয়ারলাইন *</label>
                  <div className="relative">
                    <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <select
                      value={formData.airline}
                      onChange={(e) => handleInputChange('airline', e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 p-3 bg-white/10 backdrop-blur-md border rounded-xl text-white",
                        "focus:outline-none focus:ring-2 transition-all duration-300",
                        errors.airline ? "border-red-400 focus:ring-red-400/50" : "border-white/20 focus:ring-folder-primary/50"
                      )}
                    >
                      <option value="">এয়ারলাইন ন��র্বাচন করুন</option>
                      {AIRLINES.map((airline) => (
                        <option key={airline} value={airline} className="bg-slate-800 text-white">
                          {airline}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.airline && (
                    <p className="text-red-400 text-sm mt-1">{errors.airline}</p>
                  )}
                </div>

                {/* Purchase Price */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">ক্রয়মূল্য (টাকা) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="number"
                      value={formData.purchasePrice}
                      onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 p-3 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-white/50",
                        "focus:outline-none focus:ring-2 transition-all duration-300",
                        errors.purchasePrice ? "border-red-400 focus:ring-red-400/50" : "border-white/20 focus:ring-folder-primary/50"
                      )}
                      placeholder="যেমন: 45000"
                    />
                  </div>
                  {errors.purchasePrice && (
                    <p className="text-red-400 text-sm mt-1">{errors.purchasePrice}</p>
                  )}
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">বিক্রয়মূল্য (টাকা) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) => handleInputChange('salePrice', e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 p-3 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-white/50",
                        "focus:outline-none focus:ring-2 transition-all duration-300",
                        errors.salePrice ? "border-red-400 focus:ring-red-400/50" : "border-white/20 focus:ring-folder-primary/50"
                      )}
                      placeholder="যেমন: 50000"
                    />
                  </div>
                  {errors.salePrice && (
                    <p className="text-red-400 text-sm mt-1">{errors.salePrice}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <CreditCard className="w-6 h-6" />
              <span>পেমেন্ট তথ্য</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Payment Status */}
              <div>
                <label className="block text-white/70 text-sm mb-2">পেমেন্ট স্ট্যাটাস *</label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                  className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-folder-primary/50"
                >
                  <option value="pending" className="bg-slate-800 text-white">পেন্ডিং</option>
                  <option value="partial" className="bg-slate-800 text-white">আংশিক</option>
                  <option value="paid" className="bg-slate-800 text-white">পেইড</option>
                </select>
              </div>

              {/* Paid Amount - only show for partial payment */}
              {formData.paymentStatus === 'partial' && (
                <div>
                  <label className="block text-white/70 text-sm mb-2">পেইড পরিমাণ (টাকা) *</label>
                  <input
                    type="number"
                    value={formData.paidAmount}
                    onChange={(e) => handleInputChange('paidAmount', e.target.value)}
                    className={cn(
                      "w-full p-3 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-white/50",
                      "focus:outline-none focus:ring-2 transition-all duration-300",
                      errors.paidAmount ? "border-red-400 focus:ring-red-400/50" : "border-white/20 focus:ring-folder-primary/50"
                    )}
                    placeholder="যেমন: 25000"
                  />
                  {errors.paidAmount && (
                    <p className="text-red-400 text-sm mt-1">{errors.paidAmount}</p>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className={formData.paymentStatus === 'partial' ? 'md:col-span-1' : 'md:col-span-2'}>
                <label className="block text-white/70 text-sm mb-2">নোট (ঐচ্ছিক)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-folder-primary/50 resize-none"
                  placeholder="অতিরিক্ত তথ্য লিখুন..."
                />
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end space-x-4"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
            >
              বাতিল
            </motion.button>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-folder-primary to-folder-secondary rounded-xl text-white font-medium shadow-glow flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>সেভ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>বুকিং সেভ করুন</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
