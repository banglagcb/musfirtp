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
    view: "দেখুন",
    print: "প্রিন্ট করুন",
    export: "এক্সপ��র্ট",
    search: "সার্চ করুন",
    filter: "ফিল্টার",
    clear: "ক্লিয়ার",
    loading: "লোড হচ্ছে...",

    // Navigation
    dashboard: "ড্যাশবোর্ড",
    bookings: "বুকিং লিস্ট",
    newBooking: "নতুন ���ুকিং",
    inventory: "টিকেট ইনভেন্টরি",
    bulkPurchase: "বাল্ক টিকেট ক্রয়",
    reports: "রিপোর্ট",
    settings: "সেটিংস",
    quickActions: "দ্রুত অ্যাকশন",
    allBookings: "সব বুকিং",
    searchAction: "সার্চ করুন",

    // User
    owner: "মালিক",
    manager: "ম্যানেজার",
    welcome: "স্বাগতম",
    logout: "লগআউট",

    // Forms
    customerName: "গ্রাহকের নাম",
    mobile: "মোবাইল নম্বর",
    email: "ইমেইল ঠিকানা",
    passport: "পাসপোর্ট নম্বর",
    flightDate: "ফ্লাইট তারিখ",
    route: "রুট",
    airline: "এয়ারলাইন",
    purchasePrice: "ক্রয়মূল্য",
    salePrice: "বিক্রয়মূল্য",
    paymentStatus: "পেমেন্ট স্ট্যাটাস",

    // Status
    paid: "পেইড",
    pending: "পেন্ডিং",
    partial: "আংশিক",
    paidBookings: "পেইড বুকিং",
    partialPayments: "আংশিক পেমেন্ট",
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
    bengali: "বাংলা",
  },
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

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
  const { language } = useApp();

  const t = (key: keyof typeof translations.bn): string => {
    return translations[language][key] || key;
  };

  return { t, language };
};
