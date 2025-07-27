import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X, User, Phone, Mail, Passport, Calendar, MapPin, Plane, DollarSign, CreditCard, AlertCircle, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import dataService from "@/services/dataService";
import { Booking } from "@shared/travel-types";
import { cn } from "@/lib/utils";

interface NewBookingFormProps {
  onClose: () => void;
  onSuccess: () => void;
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
  "ইউএস-বাংলা এয়ারলাইনস"
];

const paymentStatuses = [
  { value: "paid", label: "পরিশোধিত", color: "text-green-600" },
  { value: "partial", label: "আংশিক পরিশোধিত", color: "text-yellow-600" },
  { value: "pending", label: "অপেক্ষমাণ", color: "text-red-600" }
];

export default function NewBookingForm({ onClose, onSuccess }: NewBookingFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Booking>>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    passportNumber: "",
    flightDate: "",
    route: "",
    airline: "",
    costPrice: 0,
    sellingPrice: 0,
    paymentStatus: "pending",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formSections = [
    {
      title: "গ্রাহক তথ্য",
      icon: User,
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      fields: [
        { key: "customerName", label: "গ্রাহকের পূর্ণ নাম", type: "input", icon: User, required: true, placeholder: "যেমন: আহমেদ রহমান" },
        { key: "customerPhone", label: "মোবাইল নম্বর", type: "input", icon: Phone, required: true, placeholder: "01XXXXXXXXX" },
        { key: "customerEmail", label: "ইমেইল ঠিকানা", type: "input", icon: Mail, placeholder: "example@email.com" },
        { key: "passportNumber", label: "পাসপোর্ট নম্বর", type: "input", icon: Passport, placeholder: "A12345678" },
      ],
    },
    {
      title: "ফ্লাইট তথ্য",
      icon: Plane,
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      fields: [
        { key: "flightDate", label: "ফ্লাইট তারিখ", type: "date", icon: Calendar, required: true },
        { key: "route", label: "রুট", type: "input", icon: MapPin, required: true, placeholder: "যেমন: ঢাকা - দুবাই" },
        { key: "airline", label: "এয়ারলাইন", type: "select", icon: Plane, required: true, options: airlines },
      ],
    },
    {
      title: "মূল্য ও পেমেন্ট",
      icon: DollarSign,
      color: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-500/10 to-amber-500/10",
      fields: [
        { key: "costPrice", label: "ক্রয়মূল্য (৳)", type: "number", icon: DollarSign, required: true, placeholder: "৫০০০০" },
        { key: "sellingPrice", label: "বিক্রয়মূল্য (৳)", type: "number", icon: DollarSign, required: true, placeholder: "৫৫০০০" },
        { key: "paymentStatus", label: "পেমেন্ট স্ট্যাটাস", type: "select", icon: CreditCard, required: true, options: paymentStatuses },
      ],
    },
  ];

  const profit = (formData.sellingPrice || 0) - (formData.costPrice || 0);
  const profitPercentage = formData.costPrice ? ((profit / formData.costPrice) * 100).toFixed(1) : "0";

  const validateStep = (stepIndex: number) => {
    const section = formSections[stepIndex];
    const stepErrors: Record<string, string> = {};

    section.fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.key as keyof Booking];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          stepErrors[field.key] = `${field.label} আবশ্যক`;
        }
      }

      // Additional validations
      if (field.key === "customerPhone" && formData.customerPhone) {
        if (!/^01[3-9]\d{8}$/.test(formData.customerPhone)) {
          stepErrors.customerPhone = "সঠিক মোবাইল নম্বর লিখুন";
        }
      }

      if (field.key === "customerEmail" && formData.customerEmail) {
        if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
          stepErrors.customerEmail = "সঠিক ইমেইল ঠিকানা লিখুন";
        }
      }

      if (field.key === "costPrice" && formData.costPrice && formData.costPrice <= 0) {
        stepErrors.costPrice = "ক্রয়মূল্য ০ এর চেয়ে বেশি হতে হবে";
      }

      if (field.key === "sellingPrice" && formData.sellingPrice && formData.sellingPrice <= 0) {
        stepErrors.sellingPrice = "বিক্রয়মূল্য ০ এর চেয়ে বেশি হতে হবে";
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < formSections.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const newBooking: Booking = {
        id: Date.now().toString(),
        customerName: formData.customerName!,
        customerPhone: formData.customerPhone!,
        customerEmail: formData.customerEmail || "",
        passportNumber: formData.passportNumber || "",
        flightDate: formData.flightDate!,
        route: formData.route!,
        airline: formData.airline!,
        costPrice: formData.costPrice!,
        sellingPrice: formData.sellingPrice!,
        paymentStatus: formData.paymentStatus as "paid" | "partial" | "pending",
        notes: formData.notes || "",
        createdAt: new Date().toISOString(),
      };

      dataService.addBooking(newBooking);
      
      toast({
        title: "সফল!",
        description: "নতুন বুকিং সফলভাবে যোগ করা হয়েছে",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "ত্রুটি!",
        description: "বুকিং যোগ করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSection = formSections[currentStep];

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800 p-6">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={cn(
              "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mr-4",
              currentSection.color
            )}
          >
            <currentSection.icon className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">নতুন বুকিং</h2>
            <p className="text-gray-600 dark:text-gray-300">পূর্ণ তথ্য দিয়ে বুকিং তৈরি করুন</p>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          {formSections.map((section, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{
                  scale: index === currentStep ? 1.2 : index <= currentStep ? 1 : 0.8,
                  backgroundColor: index <= currentStep ? "#10b981" : "#d1d5db"
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
              >
                {index + 1}
              </motion.div>
              {index < formSections.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: index < currentStep ? 1 : 0 }}
                  className="w-12 h-1 bg-green-500 mx-2 origin-left"
                />
              )}
            </div>
          ))}
        </div>

        <motion.h3
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-semibold text-gray-700 dark:text-gray-200"
        >
          {currentSection.title}
        </motion.h3>
      </motion.div>

      {/* Enhanced Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 mb-8",
            "border border-gray-200/50 dark:border-gray-700/50",
            "bg-gradient-to-br", currentSection.bgGradient
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentSection.fields.map((field) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                <Label
                  htmlFor={field.key}
                  className="flex items-center text-gray-700 dark:text-gray-200 font-medium"
                >
                  <field.icon className="w-5 h-5 mr-2 text-gray-500" />
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>

                {field.type === "input" && (
                  <Input
                    id={field.key}
                    placeholder={field.placeholder}
                    value={formData[field.key as keyof Booking] || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className={cn(
                      "h-12 bg-white/50 dark:bg-gray-700/50",
                      errors[field.key] && "border-red-500"
                    )}
                  />
                )}

                {field.type === "date" && (
                  <Input
                    id={field.key}
                    type="date"
                    value={formData[field.key as keyof Booking] || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className={cn(
                      "h-12 bg-white/50 dark:bg-gray-700/50",
                      errors[field.key] && "border-red-500"
                    )}
                  />
                )}

                {field.type === "number" && (
                  <Input
                    id={field.key}
                    type="number"
                    placeholder={field.placeholder}
                    value={formData[field.key as keyof Booking] || ""}
                    onChange={(e) => handleInputChange(field.key, parseFloat(e.target.value) || 0)}
                    className={cn(
                      "h-12 bg-white/50 dark:bg-gray-700/50",
                      errors[field.key] && "border-red-500"
                    )}
                  />
                )}

                {field.type === "select" && field.key === "airline" && (
                  <Select
                    value={formData.airline || ""}
                    onValueChange={(value) => handleInputChange("airline", value)}
                  >
                    <SelectTrigger className={cn(
                      "h-12 bg-white/50 dark:bg-gray-700/50",
                      errors[field.key] && "border-red-500"
                    )}>
                      <SelectValue placeholder="এয়ারলাইন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {airlines.map((airline) => (
                        <SelectItem key={airline} value={airline}>
                          {airline}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {field.type === "select" && field.key === "paymentStatus" && (
                  <Select
                    value={formData.paymentStatus || ""}
                    onValueChange={(value) => handleInputChange("paymentStatus", value)}
                  >
                    <SelectTrigger className={cn(
                      "h-12 bg-white/50 dark:bg-gray-700/50",
                      errors[field.key] && "border-red-500"
                    )}>
                      <SelectValue placeholder="পেমেন্ট স্ট্যাটাস নির্বাচ��� করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <span className={status.color}>{status.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {errors[field.key] && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center text-red-500 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors[field.key]}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Profit Calculator */}
          {currentStep === 2 && formData.costPrice && formData.sellingPrice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl border border-green-200/50 dark:border-green-700/50"
            >
              <div className="flex items-center mb-4">
                <Calculator className="w-6 h-6 text-green-600 mr-2" />
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">মুনাফা হিসাব</h4>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">মুনাফা</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    profit >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    ৳{profit.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">মুনাফার হার</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    profit >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {profitPercentage}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">মোট বিক্রয়</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ৳{(formData.sellingPrice || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notes field on last step */}
          {currentStep === formSections.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-3"
            >
              <Label className="flex items-center text-gray-700 dark:text-gray-200 font-medium">
                অতিরিক্ত মন্তব্য (ঐচ্ছিক)
              </Label>
              <Textarea
                placeholder="বিশেষ কোনো তথ্য বা মন্তব্য..."
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="bg-white/50 dark:bg-gray-700/50"
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onClose : handlePrevious}
          className="flex items-center space-x-2 px-6 py-3"
        >
          <X className="w-5 h-5" />
          <span>{currentStep === 0 ? "বাতিল" : "পূর্ববর্তী"}</span>
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ধাপ {currentStep + 1} / {formSections.length}
          </p>
        </div>

        <Button
          onClick={handleNext}
          disabled={isSubmitting}
          className={cn(
            "flex items-center space-x-2 px-6 py-3",
            "bg-gradient-to-r", currentSection.color,
            "hover:shadow-lg transition-all duration-300"
          )}
        >
          {currentStep === formSections.length - 1 ? (
            <>
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
            </>
          ) : (
            <>
              <span>পরবর্তী</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
