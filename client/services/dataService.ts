import { Booking, User, DashboardStats, FilterOptions, ReportData } from '@shared/travel-types';

class DataService {
  private static instance: DataService;
  private readonly BOOKINGS_KEY = 'travel_bookings';
  private readonly USERS_KEY = 'travel_users';

  private constructor() {
    this.initializeDefaultData();
  }

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private initializeDefaultData() {
    // Initialize default users if not exists
    const users = this.getUsers();
    if (users.length === 0) {
      const defaultUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          password: 'admin123',
          role: 'owner',
          name: 'মালিক'
        },
        {
          id: '2',
          username: 'manager',
          password: 'manager123',
          role: 'manager',
          name: 'ম্যানেজার'
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }

    // Initialize sample bookings if not exists
    const bookings = this.getBookings();
    if (bookings.length === 0) {
      const sampleBookings: Booking[] = [
        {
          id: '1',
          customerName: 'মোহাম্মদ রহিম',
          mobile: '01712345678',
          passport: 'BE1234567',
          email: 'rahim@email.com',
          flightDate: '2024-02-15',
          route: 'ঢাকা - দুবাই',
          airline: 'Emirates',
          purchasePrice: 45000,
          salePrice: 50000,
          paymentStatus: 'paid',
          paidAmount: 50000,
          bookingDate: '2024-01-15',
          notes: 'ভাল গ্রাহক'
        },
        {
          id: '2',
          customerName: 'ফাতেমা খাতুন',
          mobile: '01812345678',
          passport: 'BE2345678',
          email: 'fatema@email.com',
          flightDate: '2024-02-20',
          route: 'ঢাকা - কক্সবাজার',
          airline: 'Biman Bangladesh Airlines',
          purchasePrice: 8000,
          salePrice: 10000,
          paymentStatus: 'partial',
          paidAmount: 5000,
          bookingDate: '2024-01-20'
        },
        {
          id: '3',
          customerName: 'আব্দুল করিম',
          mobile: '01912345678',
          passport: 'BE3456789',
          email: 'karim@email.com',
          flightDate: '2024-02-25',
          route: 'ঢাকা - চট্টগ্রাম',
          airline: 'US-Bangla Airlines',
          purchasePrice: 6000,
          salePrice: 7500,
          paymentStatus: 'pending',
          paidAmount: 0,
          bookingDate: '2024-01-25'
        }
      ];
      localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(sampleBookings));
    }
  }

  // User Management
  getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  validateUser(username: string, password: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.username === username && user.password === password) || null;
  }

  // Booking Management
  getBookings(): Booking[] {
    const bookings = localStorage.getItem(this.BOOKINGS_KEY);
    return bookings ? JSON.parse(bookings) : [];
  }

  getBookingById(id: string): Booking | null {
    const bookings = this.getBookings();
    return bookings.find(booking => booking.id === id) || null;
  }

  addBooking(booking: Omit<Booking, 'id' | 'bookingDate'>): Booking {
    const bookings = this.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      bookingDate: new Date().toISOString().split('T')[0]
    };
    bookings.push(newBooking);
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
    return newBooking;
  }

  updateBooking(id: string, updatedBooking: Partial<Booking>): boolean {
    const bookings = this.getBookings();
    const index = bookings.findIndex(booking => booking.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updatedBooking };
      localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
      return true;
    }
    return false;
  }

  deleteBooking(id: string): boolean {
    const bookings = this.getBookings();
    const filteredBookings = bookings.filter(booking => booking.id !== id);
    if (filteredBookings.length !== bookings.length) {
      localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(filteredBookings));
      return true;
    }
    return false;
  }

  // Search and Filter
  searchBookings(filters: FilterOptions): Booking[] {
    let bookings = this.getBookings();

    if (filters.customerName) {
      bookings = bookings.filter(booking => 
        booking.customerName.toLowerCase().includes(filters.customerName!.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      bookings = bookings.filter(booking => booking.flightDate >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      bookings = bookings.filter(booking => booking.flightDate <= filters.dateTo!);
    }

    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      bookings = bookings.filter(booking => booking.paymentStatus === filters.paymentStatus);
    }

    if (filters.airline) {
      bookings = bookings.filter(booking => booking.airline === filters.airline);
    }

    return bookings;
  }

  // Dashboard Statistics
  getDashboardStats(): DashboardStats {
    const bookings = this.getBookings();
    const today = new Date().toISOString().split('T')[0];

    const todayBookings = bookings.filter(booking => booking.bookingDate === today);
    const paidBookings = bookings.filter(booking => booking.paymentStatus === 'paid');
    const pendingBookings = bookings.filter(booking => booking.paymentStatus === 'pending');
    const partialBookings = bookings.filter(booking => booking.paymentStatus === 'partial');

    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.paidAmount, 0);
    const totalCost = bookings.reduce((sum, booking) => {
      if (booking.paymentStatus === 'paid') return sum + booking.purchasePrice;
      if (booking.paymentStatus === 'partial') {
        const percentage = booking.paidAmount / booking.salePrice;
        return sum + (booking.purchasePrice * percentage);
      }
      return sum;
    }, 0);

    return {
      totalBookings: bookings.length,
      todayBookings: todayBookings.length,
      totalRevenue,
      totalProfit: totalRevenue - totalCost,
      pendingPayments: pendingBookings.length,
      paidBookings: paidBookings.length,
      partialPayments: partialBookings.length
    };
  }

  // Reports
  getMonthlyReport(year: number, month: number): ReportData[] {
    const bookings = this.getBookings();
    const monthStr = month.toString().padStart(2, '0');
    const yearMonth = `${year}-${monthStr}`;
    
    const monthlyBookings = bookings.filter(booking => 
      booking.bookingDate.startsWith(yearMonth)
    );

    const reportMap = new Map<string, ReportData>();

    monthlyBookings.forEach(booking => {
      const date = booking.bookingDate;
      
      if (!reportMap.has(date)) {
        reportMap.set(date, {
          date,
          totalBookings: 0,
          totalRevenue: 0,
          totalProfit: 0,
          totalCost: 0
        });
      }

      const report = reportMap.get(date)!;
      report.totalBookings++;
      
      if (booking.paymentStatus === 'paid') {
        report.totalRevenue += booking.salePrice;
        report.totalCost += booking.purchasePrice;
        report.totalProfit += (booking.salePrice - booking.purchasePrice);
      } else if (booking.paymentStatus === 'partial') {
        report.totalRevenue += booking.paidAmount;
        const percentage = booking.paidAmount / booking.salePrice;
        const partialCost = booking.purchasePrice * percentage;
        report.totalCost += partialCost;
        report.totalProfit += (booking.paidAmount - partialCost);
      }
    });

    return Array.from(reportMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  // Export Data
  exportToCSV(): string {
    const bookings = this.getBookings();
    const headers = [
      'গ্রাহকের নাম',
      'মোবাইল',
      'পাসপোর্ট',
      'ইমেইল',
      'ফ্লাইট তারিখ',
      'রুট',
      'এয়ারলাইন',
      'ক্রয়মূল্য',
      'বিক্রয়মূল্য',
      'পেমেন��ট স্ট্যাটাস',
      'পেইড পরিমাণ',
      'বুকিং তারিখ',
      'নোট'
    ];

    const csvContent = [
      headers.join(','),
      ...bookings.map(booking => [
        booking.customerName,
        booking.mobile,
        booking.passport,
        booking.email,
        booking.flightDate,
        booking.route,
        booking.airline,
        booking.purchasePrice,
        booking.salePrice,
        booking.paymentStatus === 'paid' ? 'পেইড' : 
        booking.paymentStatus === 'pending' ? 'পেন্ডিং' : 'আংশিক',
        booking.paidAmount,
        booking.bookingDate,
        booking.notes || ''
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  // Clear all data (for testing purposes)
  clearAllData(): void {
    localStorage.removeItem(this.BOOKINGS_KEY);
    localStorage.removeItem(this.USERS_KEY);
    this.initializeDefaultData();
  }
}

export default DataService.getInstance();
