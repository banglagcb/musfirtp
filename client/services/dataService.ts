import {
  Booking,
  User,
  DashboardStats,
  FilterOptions,
  ReportData,
} from "@shared/travel-types";

class DataService {
  private static instance: DataService;
  private readonly BOOKINGS_KEY = "travel_bookings";
  private readonly USERS_KEY = "travel_users";

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
          id: "1",
          username: "admin",
          password: "admin123",
          role: "owner",
          name: "মালিক",
        },
        {
          id: "2",
          username: "manager",
          password: "manager123",
          role: "manager",
          name: "ম্যানেজার",
        },
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }

    // Initialize sample bookings if not exists
    const bookings = this.getBookings();
    if (bookings.length === 0) {
      const sampleBookings: Booking[] = [
        {
          id: "1",
          customerName: "মোহাম্মদ রহিম",
          customerPhone: "01712345678",
          customerEmail: "rahim@email.com",
          passportNumber: "BE1234567",
          flightDate: "2024-02-15",
          route: "ঢাকা - দুবাই",
          airline: "এমিরেটস",
          costPrice: 45000,
          sellingPrice: 50000,
          paymentStatus: "paid",
          notes: "ভাল গ্রাহক",
          createdAt: "2024-01-15T00:00:00.000Z",
          pnrNumber: "EM12345",
          passengerCount: 1,
        },
        {
          id: "2",
          customerName: "ফাতেমা খাতুন",
          customerPhone: "01812345678",
          customerEmail: "fatema@email.com",
          passportNumber: "BE2345678",
          flightDate: "2024-02-20",
          route: "ঢাকা - কক্সবাজার",
          airline: "বিমান বাংলাদেশ এয়ারলাইনস",
          costPrice: 8000,
          sellingPrice: 10000,
          paymentStatus: "partial",
          notes: "পার্শিয়াল পেমেন্ট",
          createdAt: "2024-01-20T00:00:00.000Z",
          pnrNumber: "BG67890",
          passengerCount: 1,
        },
        {
          id: "3",
          customerName: "আব্দুল করিম",
          customerPhone: "01912345678",
          customerEmail: "karim@email.com",
          passportNumber: "BE3456789",
          flightDate: "2024-02-25",
          route: "ঢাকা - চট্টগ্রাম",
          airline: "ইউএস-বাংলা এয়ারলাইনস",
          costPrice: 6000,
          sellingPrice: 7500,
          paymentStatus: "pending",
          notes: "পেমেন্ট বাকি",
          createdAt: "2024-01-25T00:00:00.000Z",
          pnrNumber: "UB54321",
          passengerCount: 1,
        },
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
    return (
      users.find(
        (user) => user.username === username && user.password === password,
      ) || null
    );
  }

  // Booking Management
  getBookings(): Booking[] {
    const bookings = localStorage.getItem(this.BOOKINGS_KEY);
    return bookings ? JSON.parse(bookings) : [];
  }

  getBookingById(id: string): Booking | null {
    const bookings = this.getBookings();
    return bookings.find((booking) => booking.id === id) || null;
  }

  addBooking(booking: Booking | Omit<Booking, "id" | "createdAt">): string {
    const bookings = this.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: "id" in booking ? booking.id : Date.now().toString(),
      createdAt:
        "createdAt" in booking ? booking.createdAt : new Date().toISOString(),
    };

    // Remove existing booking if it has an ID (for updates)
    if ("id" in booking && booking.id) {
      const index = bookings.findIndex((b) => b.id === booking.id);
      if (index !== -1) {
        bookings[index] = newBooking;
        localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
        return newBooking.id;
      }
    }

    bookings.push(newBooking);
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
    return newBooking.id;
  }

  updateBooking(booking: Booking): boolean {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === booking.id);
    if (index !== -1) {
      bookings[index] = { ...booking, updatedAt: new Date().toISOString() };
      localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
      return true;
    }
    return false;
  }

  updateBookingPartial(id: string, updatedBooking: Partial<Booking>): boolean {
    const bookings = this.getBookings();
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updatedBooking };
      localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
      return true;
    }
    return false;
  }

  deleteBooking(id: string): boolean {
    const bookings = this.getBookings();
    const filteredBookings = bookings.filter((booking) => booking.id !== id);
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
      bookings = bookings.filter((booking) =>
        booking.customerName
          .toLowerCase()
          .includes(filters.customerName!.toLowerCase()),
      );
    }

    if (filters.dateFrom) {
      bookings = bookings.filter(
        (booking) => booking.flightDate >= filters.dateFrom!,
      );
    }

    if (filters.dateTo) {
      bookings = bookings.filter(
        (booking) => booking.flightDate <= filters.dateTo!,
      );
    }

    if (filters.paymentStatus && filters.paymentStatus !== "all") {
      bookings = bookings.filter(
        (booking) => booking.paymentStatus === filters.paymentStatus,
      );
    }

    if (filters.airline) {
      bookings = bookings.filter(
        (booking) => booking.airline === filters.airline,
      );
    }

    return bookings;
  }

  // Dashboard Statistics
  getDashboardStats(): DashboardStats {
    const bookings = this.getBookings();
    const today = new Date().toISOString().split("T")[0];

    const todayBookings = bookings.filter((booking) => {
      const bookingDate = booking.createdAt
        ? new Date(booking.createdAt).toISOString().split("T")[0]
        : today;
      return bookingDate === today;
    });

    const paidBookings = bookings.filter(
      (booking) => booking.paymentStatus === "paid",
    );
    const pendingBookings = bookings.filter(
      (booking) => booking.paymentStatus === "pending",
    );
    const partialBookings = bookings.filter(
      (booking) => booking.paymentStatus === "partial",
    );

    const totalRevenue = bookings.reduce((sum, booking) => {
      if (booking.paymentStatus === "paid") {
        return sum + (booking.sellingPrice || 0);
      }
      if (booking.paymentStatus === "partial") {
        return sum + (booking.sellingPrice || 0) * 0.5; // Assume 50% paid for partial
      }
      return sum;
    }, 0);

    const totalCost = bookings.reduce((sum, booking) => {
      if (booking.paymentStatus === "paid") {
        return sum + (booking.costPrice || 0);
      }
      if (booking.paymentStatus === "partial") {
        return sum + (booking.costPrice || 0) * 0.5; // Assume 50% cost for partial
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
      partialPayments: partialBookings.length,
    };
  }

  // Reports
  getMonthlyReport(year: number, month: number): ReportData[] {
    const bookings = this.getBookings();
    const monthStr = month.toString().padStart(2, "0");
    const yearMonth = `${year}-${monthStr}`;

    const monthlyBookings = bookings.filter((booking) => {
      const bookingDate = booking.createdAt
        ? booking.createdAt.substring(0, 7)
        : yearMonth;
      return bookingDate === yearMonth;
    });

    const reportMap = new Map<string, ReportData>();

    monthlyBookings.forEach((booking) => {
      const date = booking.createdAt
        ? booking.createdAt.split("T")[0]
        : `${yearMonth}-01`;

      if (!reportMap.has(date)) {
        reportMap.set(date, {
          date,
          totalBookings: 0,
          totalRevenue: 0,
          totalProfit: 0,
          totalCost: 0,
        });
      }

      const report = reportMap.get(date)!;
      report.totalBookings++;

      if (booking.paymentStatus === "paid") {
        report.totalRevenue += booking.sellingPrice || 0;
        report.totalCost += booking.costPrice || 0;
        report.totalProfit +=
          (booking.sellingPrice || 0) - (booking.costPrice || 0);
      } else if (booking.paymentStatus === "partial") {
        const partialRevenue = (booking.sellingPrice || 0) * 0.5;
        const partialCost = (booking.costPrice || 0) * 0.5;
        report.totalRevenue += partialRevenue;
        report.totalCost += partialCost;
        report.totalProfit += partialRevenue - partialCost;
      }
    });

    return Array.from(reportMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }

  // Export Data
  exportToCSV(): string {
    const bookings = this.getBookings();
    const headers = [
      "PNR নম্বর",
      "গ্রাহকের নাম",
      "মোবাইল",
      "ইমেইল",
      "পাসপোর্ট",
      "ফ্লাইট তারিখ",
      "রুট",
      "এয়ারলাইন",
      "যাত্রী সংখ্যা",
      "ক্রয়মূল্য",
      "বিক্রয়মূল্য",
      "মুনাফা",
      "পেমেন্ট স্ট্যাটাস",
      "বুকিং তারিখ",
      "নোট",
    ];

    const csvContent = [
      headers.join(","),
      ...bookings.map((booking) => {
        const profit = (booking.sellingPrice || 0) - (booking.costPrice || 0);
        return [
          booking.pnrNumber || "",
          booking.customerName,
          booking.customerPhone,
          booking.customerEmail || "",
          booking.passportNumber || "",
          booking.flightDate,
          booking.route,
          booking.airline,
          booking.passengerCount || 1,
          booking.costPrice || 0,
          booking.sellingPrice || 0,
          profit,
          booking.paymentStatus === "paid"
            ? "পেইড"
            : booking.paymentStatus === "pending"
              ? "পেন্ডিং"
              : "আংশিক",
          booking.createdAt
            ? new Date(booking.createdAt).toLocaleDateString("bn-BD")
            : "",
          booking.notes || "",
        ].join(",");
      }),
    ].join("\n");

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
