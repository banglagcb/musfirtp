import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";

// Theme types
export type Theme = "light" | "dark";
export type Language = "bn" | "en";

// Context interfaces
interface AppContextType {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Language
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;

  // Performance
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Responsive
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// Language dictionaries
export const translations = {
  bn: {
    // Common
    close: "বন্ধ করুন",
    cancel: "বাতিল",
    save: "সেভ করুন",
    delete: "ডিলিট",
    edit: "এডিট",
    view: "���েখুন",
    print: "প্রিন্ট করু���",
    export: "এক্���প��র্ট",
    search: "সার্চ করুন",
    filter: "ফিল্টার",
    clear: "ক্লিয়ার",
    loading: "লোড হচ্ছে...",
    refresh: "রিফ্রেশ",

    // Navigation
    dashboard: "ড্যাশবোর্ড",
    bookings: "বুকিং লিস্ট",
    newBooking: "নত��ন ���ুকিং",
    inventory: "��িকেট ইনভেন্টরি",
    bulkPurchase: "বাল্ক টিকেট ক্রয়",
    reports: "রিপোর্ট",
    settings: "সেটিংস",
    quickActions: "দ্রুত অ্যাকশন",
    allBookings: "সব বুকিং",
    searchAction: "সার্চ করুন",
    searchAndFilter: "সার্চ ও ফিল্টার",
    dataExport: "ডেটা এক্সপোর্ট",

    // User
    owner: "মালিক",
    manager: "ম্যানেজার",
    welcome: "স্বাগতম",
    logout: "লগআউট",

    // Forms
    customerName: "গ্রাহকের নাম",
    mobile: "মোবাইল নম্বর",
    email: "ইমেইল ঠিকানা",
    passport: "পাস��োর্ট নম্ব��",
    flightDate: "ফ্লাইট তারিখ",
    route: "রুট",
    airline: "এয়ারলাইন",
    purchasePrice: "ক্রয়মূল্য",
    salePrice: "বিক্রয়মূল্য",
    paymentStatus: "পেমেন্ট স্ট্যাটাস",

    // Status
    paid: "পেইড",
    pending: "পেন্���িং",
    partial: "আংশিক",
    paidBookings: "পেইড বুকিং",
    partialPayments: "আংশিক পেমেন্��",
    pendingPayments: "��েন্ডিং পেমেন্ট",

    // Stats
    totalBookings: "মোট বুকিং",
    todayBookings: "আজকের বুকিং",
    totalRevenue: "মোট আয়",
    totalProfit: "মোট মুনাফা",

    // Theme & Language
    darkMode: "ডার্ক মোড",
    lightMode: "লাইট মোড",
    language: "ভাষা",
    english: "English",
    bengali: "বাংলা",
    switchToEnglish: "Switch to English",
    switchToBengali: "বাংলায় পরিবর্তন করুন",
    invalidCredentials: "ভুল ইউজারনেম বা পাসওয়ার্ড",

    // Additional interface text
    accessDenied: "অ্যাক্সেস নিষিদ্ধ",
    comingSoon: "শীঘ্রই আসছে",
    editBooking: "বুকিং এডিট করুন",
    viewBooking: "বুকিং দেখুন",
    bookingDate: "বুকিং তারিখ",
    bookingID: "বুকিং আইডি",
    viewOnly: "কেবল দেখার জন্য",
    accessDeniedMsg: "কেবল মালিক বাল্ক টিকেট ক্রয় করতে পারেন",
    redirectingToDashboard: "ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...",
    updateBookingError: "বুকিং আপডেট করতে সমস্যা হয়েছে",
    bookingSuccessful: "বুকিং সফল হয়েছে",
    deleteConfirm: "আপনি কি এই বুকিংটি মুছে ফেলতে চান?",
    deleteBookingPermission: "কেবল মালিক বুকিং ���ুছতে পারেন",
    totalBookingsFound: "মোট বুকিং পাওয়া গেছে",
    noBookingsFound: "কোনো বুকি�� পাওয়া যায়নি",
    bookingDetails: "বুকিং বিস্তারিত",
    saveBooking: "বুকিং সেভ করুন",
    addNewBooking: "নতুন বুকিং যোগ করুন",
    systemConfig: "সিস্টেম কনফিগারেশন",
    reportsAnalysis: "রিপোর্ট ও বিশ্লেষণ",
    salesProfitReports: "বিক্রয় ও মুনাফার রিপোর্ট",
    downloadBookingData: "বুকিং ডেটা ডাউনলোড",
    csvExcelDownload: "CSV/Excel ফাইলে ডাউনলোড করুন",
    customerInfo: "গ্রাহকের তথ্য",
    paymentInfo: "পেমেন্ট তথ্য",
    profitCalculation: "মুনাফা হিসাব",
    status: "স্ট্যাটাস",
    unknown: "অজানা",
    paidAmount: "পেইড পরিমাণ",
    filterAndRetry: "ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন",
    successfulLogin: "সফলভাবে ��গইন হয়েছে!",
    fillFlightInfo: "নতুন ফ্লাইট ��ুকিং এর তথ্য পূরণ করুন",
    saving: "সেভ হচ্ছে...",
    exportSuccessful: "সফলভ��বে এক্সপোর্ট হয়েছে!",
    exportError: "এক্সপোর্ট করতে সমস্যা হয়েছে!",
    exporting: "এক্সপোর্ট হচ্ছে...",
    exportInfo: "এক্সপোর্ট সম্পর্কে তথ্য",
    exportNote:
      "এক্সপোর্ট করা ফাইল CSV ফরম্যাটে হবে যা Microsoft Excel, Google Sheets এবং অন্যান্য স্প্রেডশিট অ্যাপ্লিকেশনে খোলা যাবে।",
    systemManagement: "সিস্টেম কনফিগারেশন ও ম্যানেজমেন্ট",
    totalBookingsStats: "মোট বুকিং",
    completeData: "সম্পূর্ণ ডেটা",
    exportAllBookings: "সকল বুকিং ডেটা এক্সপোর্ট করুন",
    filteredData: "ফিল্টার করা ডেটা",
    exportSpecificData: "নির্দিষ্ট সময়ে�� ডেটা এক্সপোর্ট করুন",
    filteredBookings: "ফিল্টার করা বুকিং",
    reportType: "রিপো���্ট ধরন",
    dailyReport: "এর দৈনিক রিপো��্ট",
    monthlyReport: "এর মাসিক রিপোর্ট",
    selectDateRange: "তারিখের রেঞ্জ নির্বাচন করুন",
    noBookingsInRange: "নির্বাচিত সময়ের মধ্যে কোনো বুকিং পাওয়া যায়নি",
    username: "ইউজারনেম",
    password: "পাসওয়ার্ড",
    demoLoginInfo: "ডেমো লগইন তথ্য:",
    ownerAccount: "মালিক:",
    managerAccount: "ম্যানেজার:",
    onlyOwnerUserManagement: "শুধুমাত্র মালিক ইউজার ম্যানেজমেন্ট করতে পারেন।",
    enterLoginCredentials: "আপনার লগইন তথ্য প্রবেশ করান",
    flightDateRequired: "ফ্লাইট তারিখ আবশ্যিক",
    customerInformation: "গ্রাহকের তথ্য",
    flightInformation: "ফ্লাইট তথ্য",
    passengerInfo: "যাত্রী তথ্য",
    additionalInfo: "অতিরিক্ত তথ্য",
    additionalNotes: "অতিরিক্ত তথ্য লিখুন...",
    additionalComments: "অতিরিক্ত ���থ্য বা মন্তব্য...",
    validityStart: "বৈধতার শুরুর তারিখ আবশ্যিক",
    validityEnd: "বৈধতার শ��ষ তারিখ আবশ্যিক",
    endDateAfterStart: "শেষ তারিখ শুরুর তারিখের চেয়ে পরে হতে হবে",
    validityPeriod: "বৈধতার শেষ",
    financialSummary: "আর্থিক সারসংক্ষেপ",
    printDate: "প্রিন্ট তারিখ:",
    dateFrom: "তারিখ থেকে",
    dateTo: "তারিখ পর্যন্ত",
    outOfStock: "স্টক শেষ",
    date: "তারিখ",
    profit: "মুনাফা",
    startDate: "শুরুর তারিখ",
    endDate: "শেষ তারিখ",
    includedFields: "অন্তর্ভুক্ত ফিল্ড সমূহ:",
    financialInfo: "আর্থিক তথ্য:",

    // Form validation errors
    customerNameRequired: "গ্রাহকের নাম আবশ্যিক",
    mobileRequired: "মোবাইল নম্বর আবশ্যিক",
    emailRequired: "ইমেইল আবশ্যিক",
    emailInvalid: "সঠিক ইমেইল ঠিকানা লিখুন",
    routeRequired: "রুট নির্বাচন করুন",
    airlineRequired: "এয়ারলাইন নির্বাচন করুন",
    purchasePriceRequired: "ক্রয়মূল্য আবশ্যিক",
    salePriceRequired: "বিক্রয়মূল্য আবশ্যিক",
    salePriceError: "বিক্রয়মূল্য ক্রয়মূল্যের চেয়ে বেশি হতে হবে",
    paidAmountError: "পেইড পরিমাণ বিক্রয়মূল্যের চেয়ে বেশি হতে পারে না",
    paidAmountRequired: "পেইড পরিমাণ আবশ্যিক",
    paidAmountRange:
      "পেইড পরিমাণ ০ এর চেয়ে বেশি এবং বিক্রয়মূল্যের চেয়ে কম হতে হবে",

    // Ticket Notifications
    ticketStockUpdate: "টিকেট স্টক আপডেট",
    availableTickets: "উপলব্ধ টিকেট",
    lowStockWarning: "স্টক কম! তাড়াতাড়ি বুক করুন",
    updated: "আপডেট: ",
    dhakaTo: "ঢাকা থেকে ",
  },
  en: {
    // Common
    close: "Close",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    print: "Print",
    export: "Export",
    search: "Search",
    filter: "Filter",
    clear: "Clear",
    loading: "Loading...",
    refresh: "Refresh",

    // Navigation
    dashboard: "Dashboard",
    bookings: "Bookings List",
    newBooking: "New Booking",
    inventory: "Ticket Inventory",
    bulkPurchase: "Bulk Purchase",
    reports: "Reports",
    settings: "Settings",
    quickActions: "Quick Actions",
    allBookings: "All Bookings",
    searchAction: "Search",
    searchAndFilter: "Search & Filter",
    dataExport: "Data Export",

    // User
    owner: "Owner",
    manager: "Manager",
    welcome: "Welcome",
    logout: "Logout",

    // Forms
    customerName: "Customer Name",
    mobile: "Mobile Number",
    email: "Email Address",
    passport: "Passport Number",
    flightDate: "Flight Date",
    route: "Route",
    airline: "Airline",
    purchasePrice: "Purchase Price",
    salePrice: "Sale Price",
    paymentStatus: "Payment Status",

    // Status
    paid: "Paid",
    pending: "Pending",
    partial: "Partial",
    paidBookings: "Paid Bookings",
    partialPayments: "Partial Payments",
    pendingPayments: "Pending Payments",

    // Stats
    totalBookings: "Total Bookings",
    todayBookings: "Today's Bookings",
    totalRevenue: "Total Revenue",
    totalProfit: "Total Profit",

    // Theme & Language
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    language: "Language",
    english: "English",
    bengali: "���াংলা",
    switchToEnglish: "Switch to English",
    switchToBengali: "বাংলায় পরিবর্তন করুন",
    invalidCredentials: "Invalid username or password",

    // Additional interface text
    accessDenied: "Access Denied",
    comingSoon: "Coming Soon",
    editBooking: "Edit Booking",
    viewBooking: "View Booking",
    bookingDate: "Booking Date",
    bookingID: "Booking ID",
    viewOnly: "View Only",
    accessDeniedMsg: "Only owner can purchase bulk tickets",
    redirectingToDashboard: "Redirecting to dashboard...",
    updateBookingError: "Error updating booking",
    bookingSuccessful: "Booking successful",
    deleteConfirm: "Are you sure you want to delete this booking?",
    deleteBookingPermission: "Only owner can delete bookings",
    totalBookingsFound: "Total bookings found",
    noBookingsFound: "No bookings found",
    bookingDetails: "Booking Details",
    saveBooking: "Save Booking",
    addNewBooking: "Add New Booking",
    systemConfig: "System Configuration",
    reportsAnalysis: "Reports & Analysis",
    salesProfitReports: "Sales and profit reports",
    downloadBookingData: "Download Booking Data",
    csvExcelDownload: "Download as CSV/Excel files",
    customerInfo: "Customer Information",
    paymentInfo: "Payment Information",
    profitCalculation: "Profit Calculation",
    status: "Status",
    unknown: "Unknown",
    paidAmount: "Paid Amount",
    filterAndRetry: "Change filters and try again",
    successfulLogin: "Login Successful!",
    fillFlightInfo: "Fill in new flight booking information",
    saving: "Saving...",
    exportSuccessful: "Export successful!",
    exportError: "Error exporting data!",
    exporting: "Exporting...",
    exportInfo: "Export Information",
    exportNote:
      "The exported file will be in CSV format which can be opened in Microsoft Excel, Google Sheets and other spreadsheet applications.",
    systemManagement: "System configuration & management",
    totalBookingsStats: "Total Bookings",
    completeData: "Complete Data",
    exportAllBookings: "Export all booking data",
    filteredData: "Filtered Data",
    exportSpecificData: "Export specific time period data",
    filteredBookings: "Filtered Bookings",
    reportType: "Report Type",
    dailyReport: "Daily Report",
    monthlyReport: "Monthly Report",
    selectDateRange: "Select date range",
    noBookingsInRange: "No bookings found in selected time period",
    username: "Username",
    password: "Password",
    demoLoginInfo: "Demo Login Info:",
    ownerAccount: "Owner:",
    managerAccount: "Manager:",
    onlyOwnerUserManagement: "Only owner can manage users.",
    enterLoginCredentials: "Enter your login credentials",
    flightDateRequired: "Flight date is required",
    customerInformation: "Customer Information",
    flightInformation: "Flight Information",
    passengerInfo: "Passenger Information",
    additionalInfo: "Additional Information",
    additionalNotes: "Write additional notes...",
    additionalComments: "Additional information or comments...",
    validityStart: "Validity start date is required",
    validityEnd: "Validity end date is required",
    endDateAfterStart: "End date must be after start date",
    validityPeriod: "Validity Period",
    financialSummary: "Financial Summary",
    printDate: "Print Date:",
    dateFrom: "Date From",
    dateTo: "Date To",
    outOfStock: "Out of Stock",
    date: "Date",
    profit: "Profit",
    startDate: "Start Date",
    endDate: "End Date",
    includedFields: "Included Fields:",
    financialInfo: "Financial Information:",

    // Form validation errors
    customerNameRequired: "Customer name is required",
    mobileRequired: "Mobile number is required",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email address",
    routeRequired: "Please select a route",
    airlineRequired: "Please select an airline",
    purchasePriceRequired: "Purchase price is required",
    salePriceRequired: "Sale price is required",
    salePriceError: "Sale price must be higher than purchase price",
    paidAmountError: "Paid amount cannot exceed sale price",
    paidAmountRequired: "Paid amount is required",
    paidAmountRange:
      "Paid amount must be greater than 0 and less than sale price",
  },
};

// Create context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("air_musafir_theme");
    return (saved as Theme) || "dark";
  });

  // Language state
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("air_musafir_language");
    return (saved as Language) || "bn";
  });

  // Performance state
  const [isLoading, setIsLoading] = useState(false);

  // Responsive states
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  // Memoized theme management functions
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("air_musafir_theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  // Memoized language management functions
  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("air_musafir_language", newLanguage);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "bn" ? "en" : "bn");
  }, [language, setLanguage]);

  // Responsive detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Initialize theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Initialize font based on language
  useEffect(() => {
    const body = document.body;
    if (language === "bn") {
      body.classList.add("font-bengali");
      body.classList.remove("font-english");
    } else {
      body.classList.add("font-english");
      body.classList.remove("font-bengali");
    }
  }, [language]);

  // Memoize context value to prevent unnecessary re-renders
  const value: AppContextType = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      language,
      setLanguage,
      toggleLanguage,
      isLoading,
      setIsLoading,
      isMobile,
      isTablet,
      isDesktop,
    }),
    [
      theme,
      setTheme,
      toggleTheme,
      language,
      setLanguage,
      toggleLanguage,
      isLoading,
      setIsLoading,
      isMobile,
      isTablet,
      isDesktop,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

// Translation hook
export const useTranslation = () => {
  try {
    const { language } = useApp();

    const t = (key: keyof typeof translations.bn): string => {
      return translations[language][key] || key;
    };

    return { t, language };
  } catch (error) {
    // Fallback when context is not available
    const t = (key: keyof typeof translations.bn): string => key;
    return { t, language: "bn" as Language };
  }
};
