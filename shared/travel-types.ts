// Legacy Booking interface for backward compatibility
export interface LegacyBooking {
  id: string;
  customerName: string;
  mobile: string;
  passport: string;
  email: string;
  flightDate: string;
  route: string;
  airline: string;
  purchasePrice: number;
  salePrice: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  paidAmount: number;
  bookingDate: string;
  notes?: string;
}

// Modern Booking interface
export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  passportNumber?: string;
  flightDate: string;
  route: string;
  airline: string;
  costPrice: number;
  sellingPrice: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  pnrNumber?: string;
  passengerCount?: number;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'owner' | 'manager';
  name: string;
}

export interface DashboardStats {
  totalBookings: number;
  todayBookings: number;
  totalRevenue: number;
  totalProfit: number;
  pendingPayments: number;
  paidBookings: number;
  partialPayments: number;
}

export interface FilterOptions {
  customerName?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentStatus?: 'all' | 'paid' | 'pending' | 'partial';
  airline?: string;
}

export interface ReportData {
  date: string;
  totalBookings: number;
  totalRevenue: number;
  totalProfit: number;
  totalCost: number;
}

export const AIRLINES = [
  'Biman Bangladesh Airlines',
  'US-Bangla Airlines',
  'Novoair',
  'Emirates',
  'Qatar Airways',
  'Singapore Airlines',
  'Thai Airways',
  'Malaysia Airlines',
  'Turkish Airlines',
  'Etihad Airways',
  'Air Arabia',
  'Flydubai',
  'IndiGo',
  'Air India',
  'Spicejet'
];

export const ROUTES = [
  'ঢাকা - কক্সবাজার',
  'ঢাকা - চট্টগ্রাম',
  'ঢাকা - সিলেট',
  'ঢাকা - রাজশাহী',
  'ঢাকা - যশোর',
  'ঢাকা - দুবাই',
  'ঢাকা - দোহা',
  'ঢাকা - কুয়ালালামপুর',
  'ঢাকা - ব্যাংকক',
  'ঢাকা - সিঙ্গাপুর',
  'ঢাকা - কলকাতা',
  'ঢাকা - দিল্লি',
  'ঢাকা - মুম্বাই',
  'ঢাকা - চেন্নাই',
  'ঢাকা - ইস্তাম্বুল',
  'চট্টগ্রাম - দুবাই',
  'সিলেট - লন্ডন',
  'সিলেট - মানচেস্টার'
];
