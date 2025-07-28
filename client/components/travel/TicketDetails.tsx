import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plane,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  CreditCard,
  DollarSign,
  Printer,
  X,
  CheckCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Booking } from "@shared/travel-types";

interface TicketDetailsProps {
  booking: Booking;
  onClose: () => void;
}

export default function TicketDetails({
  booking,
  onClose,
}: TicketDetailsProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setTimeout(() => setIsPrinting(false), 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "সম্পূর্ণ পেইড";
      case "partial":
        return "আংশিক পেইড";
      case "pending":
        return "পেমেন্ট বাকি";
      default:
        return "অজানা";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "partial":
        return "text-yellow-600 bg-yellow-100";
      case "pending":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #ticket-print-area,
          #ticket-print-area * {
            visibility: visible;
          }
          #ticket-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
          }
          .no-print {
            display: none !important;
          }
          .print-page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            color: black;
            font-size: 12pt;
            line-height: 1.5;
          }
          .print-header {
            border-bottom: 3px solid #333;
            margin-bottom: 20px;
            padding-bottom: 15px;
          }
          .print-logo {
            font-size: 32pt;
            font-weight: bold;
            color: #1e40af;
            text-align: center;
            margin-bottom: 10px;
          }
          .print-section {
            margin-bottom: 20px;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 8px;
          }
          .print-section-title {
            font-size: 16pt;
            font-weight: bold;
            color: #1e40af;
            border-bottom: 1px solid #ddd;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .print-field {
            margin-bottom: 8px;
          }
          .print-field-label {
            font-weight: bold;
            color: #555;
          }
          .print-field-value {
            color: #333;
            margin-left: 5px;
          }
          .print-footer {
            position: fixed;
            bottom: 20mm;
            left: 20mm;
            right: 20mm;
            border-top: 2px solid #333;
            padding-top: 10px;
            text-align: center;
            font-style: italic;
            color: #666;
          }
        }
      `}</style>

      {/* Screen View */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header Controls */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-300" />
              <div>
                <h1 className="text-2xl font-bold">টিকেট বিস্তারিত</h1>
                <p className="text-blue-100">
                  বুকিং সফল হয়েছে - বুকিং আইডি: {booking.id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrint}
                disabled={isPrinting}
                className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 text-white hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                {isPrinting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Printer className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Printer className="w-5 h-5" />
                )}
                <span>{isPrinting ? "প্রিন্ট হচ্ছে..." : "প্রিন্ট করুন"}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Ticket Content - Both Screen and Print */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div id="ticket-print-area" className="print-page p-8">
              {/* Print Header */}
              <div className="print-header text-center mb-8">
                <div className="print-logo">Air-Musafir</div>
                <p className="text-gray-600 text-lg">ট্রাভেল এজেন্সি</p>
                <p className="text-gray-500">ফ্লাইট টিকেট বিস্তারিত</p>
              </div>

              {/* Flight Information */}
              <div className="print-section bg-blue-50 border-blue-200">
                <h2 className="print-section-title flex items-center space-x-2">
                  <Plane className="w-6 h-6" />
                  <span>ফ্লাইট তথ্য</span>
                </h2>
                <div className="print-grid">
                  <div className="print-field">
                    <span className="print-field-label">রুট:</span>
                    <span className="print-field-value text-lg font-semibold">
                      {booking.route}
                    </span>
                  </div>
                  <div className="print-field">
                    <span className="print-field-label">এয়ারলাইন:</span>
                    <span className="print-field-value text-lg font-semibold">
                      {booking.airline}
                    </span>
                  </div>
                  <div className="print-field">
                    <span className="print-field-label">ফ্লাইট তারিখ:</span>
                    <span className="print-field-value text-lg font-semibold">
                      {formatDate(booking.flightDate)}
                    </span>
                  </div>
                  <div className="print-field">
                    <span className="print-field-label">বুকিং তারিখ:</span>
                    <span className="print-field-value">
                      {formatDate(booking.bookingDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="print-section bg-green-50 border-green-200">
                <h2 className="print-section-title flex items-center space-x-2">
                  <User className="w-6 h-6" />
                  <span>যাত্রী তথ্য</span>
                </h2>
                <div className="print-grid">
                  <div className="print-field">
                    <span className="print-field-label">নাম:</span>
                    <span className="print-field-value text-lg font-semibold">
                      {booking.customerName}
                    </span>
                  </div>
                  <div className="print-field">
                    <span className="print-field-label">পাসপোর্��:</span>
                    <span className="print-field-value font-semibold">
                      {booking.passport}
                    </span>
                  </div>
                  <div className="print-field">
                    <span className="print-field-label">মোবাইল:</span>
                    <span className="print-field-value">{booking.mobile}</span>
                  </div>
                  <div className="print-field">
                    <span className="print-field-label">ইমেইল:</span>
                    <span className="print-field-value">{booking.email}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="print-section bg-yellow-50 border-yellow-200">
                <h2 className="print-section-title flex items-center space-x-2">
                  <DollarSign className="w-6 h-6" />
                  <span>পেমেন্ট তথ্য</span>
                </h2>
                <div className="print-grid">
                  <div className="print-field">
                    <span className="print-field-label">টিকেট মূল্য:</span>
                    <span className="print-field-value text-xl font-bold text-blue-600">
                      {formatCurrency(booking.salePrice)}
                    </span>
                  </div>
                  <div className="print-field">
                    <span className="print-field-label">পেইড পরিমাণ:</span>
                    <span className="print-field-value text-xl font-bold text-green-600">
                      {formatCurrency(booking.paidAmount)}
                    </span>
                  </div>
                  <div className="print-field">
                    <span className="print-field-label">বকেয়া:</span>
                    <span className="print-field-value text-xl font-bold text-red-600">
                      {formatCurrency(booking.salePrice - booking.paidAmount)}
                    </span>
                  </div>
                  <div className="print-field">
                    <span className="print-field-label">
                      পেমেন্ট স্ট্যাটাস:
                    </span>
                    <span
                      className={cn(
                        "print-field-value px-3 py-1 rounded-full text-sm font-semibold",
                        getPaymentStatusColor(booking.paymentStatus),
                      )}
                    >
                      {getPaymentStatusText(booking.paymentStatus)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {booking.notes && (
                <div className="print-section bg-gray-50 border-gray-200">
                  <h2 className="print-section-title flex items-center space-x-2">
                    <FileText className="w-6 h-6" />
                    <span>অতিরিক্ত তথ্য</span>
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {booking.notes}
                  </p>
                </div>
              )}

              {/* Important Notes */}
              <div className="print-section bg-red-50 border-red-200">
                <h2 className="print-section-title text-red-600">
                  গুরুত্বপূর্ণ নির্দেশনা
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>ফ্লাইটের কমপক্ষে ২ ঘন্টা আগে এয়ারপোর্টে পৌঁছান</li>
                  <li>পাসপোর্ট এবং ভিসা সাথে রাখুন</li>
                  <li>
                    টিকেটের যেকোনো পরিবর্তনের জন���য আমাদের সাথে যোগাযোগ করুন
                  </li>
                  <li>এই টিকেটটি প্রিন্ট করে সাথে রাখুন</li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="print-section bg-blue-50 border-blue-200">
                <h2 className="print-section-title">যোগাযোগ</h2>
                <div className="text-center">
                  <p className="text-lg font-semibold text-blue-600 mb-2">
                    Air-Musafir ট্রাভেল এজেন্সি
                  </p>
                  <p className="text-gray-600">
                    যেকোনো সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন
                  </p>
                  <p className="text-gray-600 mt-2">
                    ধন্যবাদ আমাদের সেবা গ্রহণ করার জন্য!
                  </p>
                </div>
              </div>

              {/* Print Footer */}
              <div className="print-footer">
                <p>
                  © {new Date().getFullYear()} Air-Musafir ট্রাভেল এজেন্সি -
                  সকল অধিকার সংরক্ষিত
                </p>
                <p>প্রিন্ট তারিখ: {formatDate(new Date().toISOString())}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
