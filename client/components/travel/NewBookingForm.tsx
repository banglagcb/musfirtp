import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  X,
  User,
  Phone,
  Mail,
  FileText,
  Calendar,
  MapPin,
  Plane,
  DollarSign,
  CreditCard,
  AlertCircle,
  Calculator,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import dataService from "@/services/dataService";
import { Booking } from "@shared/travel-types";
import { cn } from "@/lib/utils";

interface NewBookingFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editBooking?: Booking;
}

const airlines = [
  "বিমান বাংলাদেশ এয়ারলাইনস",
  "এমিরেটস",
  "সিঙ্গাপুর এয়ারলাইনস",
  "কাতার এয়ারওয়েজ",
  "ফ্লাইদুবাই",
  "ইন্ডিগো",
  "মালয়েশিয়া এয়ারলাইনস",
  "থাই এয়ারওয়েজ",
  "তুর্কিশ এয়ারলাইনস",
  "এয়ার এশিয়া",
  "নোভো এয়ার",
  "ইউএস-বাংলা এয়ারলাইনস",
];

const routes = [
  "ঢাকা - দুবাই",
  "ঢাকা - কুয়ালালামপুর",
  "ঢাকা - সিঙ্গাপুর",
  "ঢাকা - ব্যাংকক",
  "ঢাকা - দোহা",
  "ঢাকা - মুম্বাই",
  "ঢাকা - দিল্লি",
  "ঢাকা - কলকাতা",
  "ঢাকা - চট্টগ্রাম",
  "ঢাকা - সিলেট",
  "ঢাকা - যশোর",
  "ঢাকা - রাজশাহী",
];

export default function NewBookingForm({
  onClose,
  onSuccess,
  editBooking,
}: NewBookingFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    pnrNumber: editBooking?.id || "",
    airline: editBooking?.airline || "",
    route: editBooking?.route || "",
    flightDate: editBooking?.flightDate || "",
    passengerCount: 1,
    costPrice: editBooking?.costPrice || 0,
    sellingPrice: editBooking?.sellingPrice || 0,
    customerName: editBooking?.customerName || "",
    customerPhone: editBooking?.customerPhone || "",
    notes: editBooking?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [netProfit, setNetProfit] = useState(0);

  // Calculate net profit when prices change
  useEffect(() => {
    const costPrice = Number(formData.costPrice) || 0;
    const sellingPrice = Number(formData.sellingPrice) || 0;
    const calculatedProfit = sellingPrice - costPrice;
    setNetProfit(calculatedProfit);
  }, [formData.costPrice, formData.sellingPrice]);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.pnrNumber.trim()) {
      newErrors.pnrNumber = "PNR নম্বর আবশ্যক";
    }

    if (!formData.airline) {
      newErrors.airline = "এয়ারলাইনস নির্বাচন করুন";
    }

    if (!formData.route) {
      newErrors.route = "রুট নির্বাচন করুন";
    }

    if (!formData.flightDate) {
      newErrors.flightDate = "ফ্লাইটের তারিখ আবশ্যক";
    }

    if (!formData.passengerCount || formData.passengerCount <= 0) {
      newErrors.passengerCount = "যাত্রী সংখ্যা সঠিক নয়";
    }

    if (!formData.costPrice || formData.costPrice <= 0) {
      newErrors.costPrice = "ক্রয়মূল্য সঠিক নয়";
    }

    if (!formData.sellingPrice || formData.sellingPrice <= 0) {
      newErrors.sellingPrice = "বিক্রয়মূল্য সঠিক নয়";
    }

    if (!formData.customerName.trim()) {
      newErrors.customerName = "গ্রাহকের নাম আবশ্যক";
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "মোবাইল নম্বর আবশ্যক";
    } else if (!/^01[3-9]\d{8}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = "সঠিক মোবাইল নম্বর লিখুন";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const bookingData: Booking = {
        id: editBooking?.id || Date.now().toString(),
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: "", // Optional field
        passportNumber: "", // Optional field
        flightDate: formData.flightDate,
        route: formData.route,
        airline: formData.airline,
        costPrice: formData.costPrice,
        sellingPrice: formData.sellingPrice,
        paymentStatus: "pending",
        notes: formData.notes,
        createdAt: editBooking?.createdAt || new Date().toISOString(),
        updatedAt: editBooking ? new Date().toISOString() : undefined,
        pnrNumber: formData.pnrNumber,
        passengerCount: formData.passengerCount,
      };

      if (editBooking) {
        dataService.updateBooking(bookingData);
      } else {
        dataService.addBooking(bookingData);
      }

      toast({
        title: "সফল!",
        description: editBooking
          ? "টিকেট সফলভাবে আপডেট করা হয়েছে"
          : "নতুন টিকেট সফলভাবে ক্রয় করা হয়েছে",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "ত্রুটি!",
        description: editBooking ? "টিকেট আপডেট করতে সমস্যা হয়েছে" : "টিকেট ক্রয় করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
          <Ticket className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {editBooking ? "টিকেট আপডেট" : "নতুন টিকেট ক্রয়"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          সুবিধামতো কোন বাস কিংবা ট্রেন এর বুকিং এর সকল
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* PNR Number */}
            <div>
              <Label className="flex items-center text-gray-700 dark:text-gray-200 font-medium mb-2">
                <FileText className="w-4 h-4 mr-2" />
                PNR নম্বর *
              </Label>
              <Input
                placeholder="PNR নম্বর লিখুন"
                value={formData.pnrNumber}
                onChange={(e) => handleInputChange("pnrNumber", e.target.value)}
                className={cn(
                  "h-12 bg-white/50 dark:bg-gray-700/50",
                  errors.pnrNumber && "border-red-500"
                )}
              />
              {errors.pnrNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.pnrNumber}
                </p>
              )}
            </div>

            {/* Airlines */}
            <div>
              <Label className="flex items-center text-gray-700 dark:text-gray-200 font-medium mb-2">
                <Plane className="w-4 h-4 mr-2" />
                এয়ারলাইনস *
              </Label>
              <Select
                value={formData.airline}
                onValueChange={(value) => handleInputChange("airline", value)}
              >
                <SelectTrigger className={cn(
                  "h-12 bg-white/50 dark:bg-gray-700/50",
                  errors.airline && "border-red-500"
                )}>
                  <SelectValue placeholder="এয়ারলাইনস নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {airlines.map((airline) => (
                    <SelectItem key={airline} value={airline}>
                      {airline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.airline && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.airline}
                </p>
              )}
            </div>

            {/* Route */}
            <div>
              <Label className="flex items-center text-gray-700 dark:text-gray-200 font-medium mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                রুট *
              </Label>
              <Select
                value={formData.route}
                onValueChange={(value) => handleInputChange("route", value)}
              >
                <SelectTrigger className={cn(
                  "h-12 bg-white/50 dark:bg-gray-700/50",
                  errors.route && "border-red-500"
                )}>
                  <SelectValue placeholder="রুট নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route} value={route}>
                      {route}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.route && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.route}
                </p>
              )}
            </div>

            {/* Flight Date */}
            <div>
              <Label className="flex items-center text-gray-700 dark:text-gray-200 font-medium mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                ফ্লাইটের তারিখ *
              </Label>
              <Input
                type="date"
                value={formData.flightDate}
                onChange={(e) => handleInputChange("flightDate", e.target.value)}
                className={cn(
                  "h-12 bg-white/50 dark:bg-gray-700/50",
                  errors.flightDate && "border-red-500"
                )}
              />
              {errors.flightDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.flightDate}
                </p>
              )}
            </div>

            {/* Passenger Count */}
            <div>
              <Label className="flex items-center text-gray-700 dark:text-gray-200 font-medium mb-2">
                <User className="w-4 h-4 mr-2" />
                যাত্রী সংখ্যা *
              </Label>
              <Input
                type="number"
                min="1"
                value={formData.passengerCount}
                onChange={(e) => handleInputChange("passengerCount", parseInt(e.target.value) || 1)}
                className={cn(
                  "h-12 bg-white/50 dark:bg-gray-700/50",
                  errors.passengerCount && "border-red-500"
                )}
              />
              {errors.passengerCount && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.passengerCount}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Cost Price */}
            <div>
              <Label className="flex items-center text-gray-700 dark:text-gray-200 font-medium mb-2">
                <DollarSign className="w-4 h-4 mr-2" />
                ক্রয়মূল্য (টাকা) *
              </Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.costPrice || ""}
                onChange={(e) => handleInputChange("costPrice", parseFloat(e.target.value) || 0)}
                className={cn(
                  "h-12 bg-white/50 dark:bg-gray-700/50",
                  errors.costPrice && "border-red-500"
                )}
              />
              {errors.costPrice && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.costPrice}
                </p>
              )}
            </div>

            {/* Selling Price */}
            <div>
              <Label className="flex items-center text-gray-700 dark:text-gray-200 font-medium mb-2">
                <CreditCard className="w-4 h-4 mr-2" />
                বিক্রয় (টাকা) *
              </Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.sellingPrice || ""}
                onChange={(e) => handleInputChange("sellingPrice", parseFloat(e.target.value) || 0)}
                className={cn(
                  "h-12 bg-white/50 dark:bg-gray-700/50",
                  errors.sellingPrice && "border-red-500"
                )}
              />
              {errors.sellingPrice && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.sellingPrice}
                </p>
              )}
            </div>

            {/* Net Profit */}
            <div>
              <Label className="flex items-center text-gray-700 dark:text-gray-200 font-medium mb-2">
                <Calculator className="w-4 h-4 mr-2" />
                মেট বগড
              </Label>
              <div className={cn(
                "h-12 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md flex items-center",
                netProfit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                <span className="font-semibold">৳{netProfit.toLocaleString()}</span>
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <Label className="flex items-center text-gray-700 dark:text-gray-200 font-medium mb-2">
                <User className="w-4 h-4 mr-2" />
                গ্রাহকের নাম *
              </Label>
              <Input
                placeholder="গ্রাহকের নাম"
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className={cn(
                  "h-12 bg-white/50 dark:bg-gray-700/50",
                  errors.customerName && "border-red-500"
                )}
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.customerName}
                </p>
              )}
            </div>

            {/* Customer Mobile */}
            <div>
              <Label className="flex items-center text-gray-700 dark:text-gray-200 font-medium mb-2">
                <Phone className="w-4 h-4 mr-2" />
                গ্রাহকের মোবাইলের *
              </Label>
              <Input
                placeholder="মোবাইল/ইমেইল"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                className={cn(
                  "h-12 bg-white/50 dark:bg-gray-700/50",
                  errors.customerPhone && "border-red-500"
                )}
              />
              {errors.customerPhone && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.customerPhone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="mt-6">
          <Label className="flex items-center text-gray-700 dark:text-gray-200 font-medium mb-2">
            <FileText className="w-4 h-4 mr-2" />
            অতিরিক্ত নোট
          </Label>
          <Textarea
            placeholder="কোনো বিশেষ তথ্য বা নোট..."
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            className="bg-white/50 dark:bg-gray-700/50"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-8 py-3"
          >
            বাতিল
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {editBooking ? "আপডেট করা হচ্ছে..." : "ক্রয় করা হচ্ছে..."}
              </>
            ) : (
              <>
                <Ticket className="w-4 h-4 mr-2" />
                {editBooking ? "টিকেট আপডেট করুন" : "টিকেট ক্রয় করুন"}
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
