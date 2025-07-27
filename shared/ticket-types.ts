export interface TicketInventory {
  id: string;
  route: string;
  airline: string;
  flightClass: 'Economy' | 'Business' | 'First';
  purchasePrice: number; // এডমিনের কেনা দাম
  suggestedSalePrice: number; // সাজেস্টেড বিক্রয় দাম
  totalTickets: number; // মোট টিকেট সংখ্যা
  availableTickets: number; // বিক্রয়ের জন্য উপলব্ধ টিকেট
  lockedTickets: number; // লক করা টিকেট (এডমিন কর্তৃক)
  soldTickets: number; // বিক্রিত টিকেট
  country: string; // গন্তব্য দেশ
  validFrom: string; // টিকেট ব্যবহারের শুরুর তারিখ
  validTo: string; // টিকেট ব্যবহারের শেষ তারিখ
  purchaseDate: string; // কেনার তারিখ
  supplier: string; // কার কাছ থেকে কিনেছেন
  isLocked: boolean; // এডমিন কর্তৃক লক করা হয়েছে কিনা
  notes?: string;
}

export interface BulkTicketPurchase {
  route: string;
  airline: string;
  flightClass: 'Economy' | 'Business' | 'First';
  country: string;
  quantity: number;
  purchasePrice: number;
  suggestedSalePrice: number;
  supplier: string;
  validFrom: string;
  validTo: string;
  notes?: string;
}

export interface TicketInventoryStats {
  totalPurchasedTickets: number;
  totalAvailableTickets: number;
  totalLockedTickets: number;
  totalSoldTickets: number;
  totalInvestment: number; // মোট বিনিয়োগ
  potentialRevenue: number; // সম্ভাব্য আয়
  actualRevenue: number; // প্রকৃত আয়
  countryWiseStats: { [country: string]: CountryStats };
}

export interface CountryStats {
  country: string;
  totalTickets: number;
  availableTickets: number;
  lockedTickets: number;
  soldTickets: number;
  investment: number;
  revenue: number;
}

export const COUNTRIES = [
  'বাংলাদেশ',
  'ভারত', 
  'পাকিস্তান',
  'নেপাল',
  'শ্রীলঙ্কা',
  'মালদ্বীপ',
  'থাইল্যান্ড',
  'মালয়েশিয়া',
  'সিঙ্গাপুর',
  'ইন্দোনেশিয়া',
  'সংযুক্ত আরব আমিরাত',
  'সৌদি আরব',
  'কাতার',
  'কুয়েত',
  'ওমান',
  'যুক্তরাজ্য',
  'যুক্তরাষ্ট্র',
  'কানাডা',
  'অস্ট্রেলিয়া',
  'জার্মানি',
  'ফ্রান্স',
  'ইতালি',
  'তুরস্ক',
  'চীন',
  'জাপান',
  'দক্ষিণ কোরিয়া'
];

export const FLIGHT_CLASSES = [
  { value: 'Economy', label: 'ইকোনমি' },
  { value: 'Business', label: 'বিজনেস' },
  { value: 'First', label: 'ফার্স্ট ক্লাস' }
];

export const SUPPLIERS = [
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
  'Spicejet',
  'বড় এজেন্ট - ঢাকা',
  'বড় এজেন্ট - চট্টগ্রাম',
  'বড় এজেন্ট - সিলেট',
  'আন্তর্জাতিক সাপ্লায়ার'
];
