import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, LogOut, RefreshCw, Settings } from "lucide-react";
import TravelLoginForm from "@/components/travel/TravelLoginForm";
import TravelDashboard from "@/components/travel/TravelDashboard";
import Window from "@/components/Window";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs";
import NewBookingForm from "@/components/travel/NewBookingForm";
import BookingsList from "@/components/travel/BookingsList";
import ReportsSection from "@/components/travel/ReportsSection";
import DataExport from "@/components/travel/DataExport";
import Settings from "@/components/travel/Settings";
import PlaceholderPage from "@/components/PlaceholderPage";
import { cn } from "@/lib/utils";
import { User, Booking } from "@shared/travel-types";
import dataService from "@/services/dataService";

type AppState = "login" | "dashboard";

interface OpenWindow {
  id: string;
  title: string;
  component: React.ReactNode;
  isOpen: boolean;
  state: "popup" | "fullscreen" | "minimized";
  zIndex: number;
}

export default function TravelAgencyApp() {
  const [appState, setAppState] = useState<AppState>("login");
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAppState("dashboard");
    setBreadcrumbs([
      { label: "ড্যাশবোর্ড", path: "/dashboard", isActive: true },
    ]);
  };

  const handleLogout = () => {
    setUser(null);
    setAppState("login");
    setOpenWindows([]);
    setBreadcrumbs([]);
  };

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const openWindow = (
    id: string,
    title: string,
    component: React.ReactNode,
  ) => {
    const existingWindow = openWindows.find((w) => w.id === id);

    if (existingWindow) {
      // Bring existing window to front and restore if minimized
      setOpenWindows((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, isOpen: true, state: "popup", zIndex: nextZIndex }
            : w,
        ),
      );
      setNextZIndex((prev) => prev + 1);
    } else {
      // Create new window
      setOpenWindows((prev) => [
        ...prev,
        {
          id,
          title,
          component,
          isOpen: true,
          state: "popup",
          zIndex: nextZIndex,
        },
      ]);
      setNextZIndex((prev) => prev + 1);
    }
  };

  const closeWindow = (id: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
    // Refresh dashboard data when closing windows
    refreshData();
  };

  const maximizeWindow = (id: string) => {
    setOpenWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              state: w.state === "fullscreen" ? "popup" : "fullscreen",
              zIndex: nextZIndex,
            }
          : w,
      ),
    );
    setNextZIndex((prev) => prev + 1);
  };

  const handleDashboardCardClick = (cardId: string) => {
    const cardTitles: Record<string, string> = {
      "new-booking": "নতুন ব��কিং",
      "bookings-list": "বুকিং লিস্ট",
      "search-filter": "সার্চ ও ���িল্টার",
      reports: "রিপোর্ট",
      "export-data": "ডেটা এক��সপোর্ট",
      settings: "সেটিংস",
    };

    const title = cardTitles[cardId] || cardId;

    let component;
    switch (cardId) {
      case "new-booking":
        component = (
          <NewBookingForm
            onClose={() => closeWindow(cardId)}
            onSuccess={() => {
              closeWindow(cardId);
              refreshData();
            }}
          />
        );
        break;
      case "bookings-list":
        component = (
          <BookingsList
            onClose={() => closeWindow(cardId)}
            onEdit={(booking: Booking) => {
              // Open edit form (could be implemented similarly to new booking)
              closeWindow(cardId);
              openWindow(
                "edit-booking",
                "বুকিং এডিট করুন",
                <PlaceholderPage
                  title="বুকিং এডিট করুন"
                  description="এই ফিচারটি শীঘ্রই আস���ে!"
                  onBack={() => closeWindow("edit-booking")}
                />,
              );
            }}
          />
        );
        break;
      case "search-filter":
        component = (
          <BookingsList
            onClose={() => closeWindow(cardId)}
            onEdit={(booking: Booking) => {
              closeWindow(cardId);
            }}
          />
        );
        break;
      case "reports":
        component = (
          <ReportsSection
            onClose={() => closeWindow(cardId)}
            onExportData={() => {
              openWindow(
                "export-data",
                "ডেটা এক্সপোর্ট",
                <DataExport onClose={() => closeWindow("export-data")} />,
              );
            }}
          />
        );
        break;
      case "export-data":
        component = <DataExport onClose={() => closeWindow(cardId)} />;
        break;
      case "settings":
        component = <Settings onClose={() => closeWindow(cardId)} />;
        break;
      default:
        component = (
          <PlaceholderPage
            title={title}
            description="এই সেকশনটি শীঘ্রই আসছে!"
            onBack={() => closeWindow(cardId)}
          />
        );
    }

    openWindow(cardId, title, component);

    // Update breadcrumbs
    setBreadcrumbs([
      { label: "ড্যাশ���োর্ড", path: "/dashboard" },
      { label: title, path: `/${cardId}`, isActive: true },
    ]);
  };

  const handleBreadcrumbClick = (path: string) => {
    if (path === "/" || path === "/dashboard") {
      setBreadcrumbs([
        { label: "ড্যাশবোর্ড", path: "/dashboard", isActive: true },
      ]);
      setOpenWindows([]);
      refreshData();
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Check for fullscreen windows
  const hasFullscreenWindow = openWindows.some((w) => w.state === "fullscreen");

  if (appState === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 lg:p-6 relative overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0, 0.15, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
              className="absolute w-2 h-2 lg:w-3 lg:h-3 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Dark Mode Toggle */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="absolute top-4 lg:top-6 right-4 lg:right-6 p-3 lg:p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 lg:w-6 lg:h-6" />
          ) : (
            <Moon className="w-5 h-5 lg:w-6 lg:h-6" />
          )}
        </motion.button>

        {/* Login Form */}
        <TravelLoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Simple Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              এয়ার মুসাফির টিকেট ম্যানেজমেন্ট সিস্টেম
            </h1>
            {user && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                স্ব�����তম, {user.name}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 lg:space-x-3">
            {/* Refresh Button */}
            <button
              onClick={refreshData}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="রিফ্রেশ"
            >
              <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>

            {/* Settings Button - Direct Access */}
            <button
              onClick={() => handleDashboardCardClick("settings")}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="সেটিংস"
            >
              <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title={isDarkMode ? "লাইট মোড" : "ডার্ক মোড"}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 lg:w-5 lg:h-5" />
              ) : (
                <Moon className="w-4 h-4 lg:w-5 lg:h-5" />
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="mt-4">
            <Breadcrumbs
              items={breadcrumbs}
              onItemClick={handleBreadcrumbClick}
            />
          </div>
        )}
      </div>

      {/* Main Dashboard */}
      <div className="p-6">
        {user && (
          <TravelDashboard user={user} onCardClick={handleDashboardCardClick} />
        )}
      </div>

      {/* Simple Windows */}
      <AnimatePresence>
        {openWindows.map((window) => (
          <Window
            key={window.id}
            title={window.title}
            isOpen={window.isOpen}
            onClose={() => closeWindow(window.id)}
            width={900}
            height={700}
          >
            {window.component}
          </Window>
        ))}
      </AnimatePresence>
    </div>
  );
}
