import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, LogOut, RefreshCw } from "lucide-react";
import TravelLoginForm from "@/components/travel/TravelLoginForm";
import TravelDashboard from "@/components/travel/TravelDashboard";
import FolderWindow from "@/components/FolderWindow";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs";
import NewBookingForm from "@/components/travel/NewBookingForm";
import BookingsList from "@/components/travel/BookingsList";
import ReportsSection from "@/components/travel/ReportsSection";
import DataExport from "@/components/travel/DataExport";
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

  // Initialize dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAppState("dashboard");
    setBreadcrumbs([{ label: "ড্যাশবোর্ড", path: "/dashboard", isActive: true }]);
  };

  const handleLogout = () => {
    setUser(null);
    setAppState("login");
    setOpenWindows([]);
    setBreadcrumbs([]);
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const openWindow = (id: string, title: string, component: React.ReactNode) => {
    const existingWindow = openWindows.find(w => w.id === id);
    
    if (existingWindow) {
      // Bring existing window to front
      setOpenWindows(prev => prev.map(w => 
        w.id === id 
          ? { ...w, isOpen: true, state: "popup", zIndex: nextZIndex }
          : w
      ));
      setNextZIndex(prev => prev + 1);
    } else {
      // Create new window
      setOpenWindows(prev => [...prev, {
        id,
        title,
        component,
        isOpen: true,
        state: "popup",
        zIndex: nextZIndex
      }]);
      setNextZIndex(prev => prev + 1);
    }
  };

  const closeWindow = (id: string) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
    // Refresh dashboard data when closing windows
    refreshData();
  };

  const handleDashboardCardClick = (cardId: string) => {
    const cardTitles: Record<string, string> = {
      "new-booking": "নতুন বুকিং",
      "bookings-list": "বুকিং লিস্ট", 
      "search-filter": "সার্চ ও ফিল্টার",
      "reports": "রিপোর্ট",
      "export-data": "ডেটা এক্সপোর্ট",
      "settings": "সেটিংস"
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
              openWindow("edit-booking", "বুকিং এডিট করুন", 
                <PlaceholderPage 
                  title="বুকিং এডিট করুন" 
                  description="এই ফিচারটি শীঘ্রই আসছে!" 
                  onBack={() => closeWindow("edit-booking")} 
                />
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
              openWindow("export-data", "ডেটা এক্সপোর্ট", 
                <DataExport onClose={() => closeWindow("export-data")} />
              );
            }}
          />
        );
        break;
      case "export-data":
        component = (
          <DataExport onClose={() => closeWindow(cardId)} />
        );
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
      { label: "ড্যাশবোর্ড", path: "/dashboard" },
      { label: title, path: `/${cardId}`, isActive: true }
    ]);
  };

  const handleBreadcrumbClick = (path: string) => {
    if (path === "/" || path === "/dashboard") {
      setBreadcrumbs([{ label: "ড্যাশবোর্ড", path: "/dashboard", isActive: true }]);
      setOpenWindows([]);
      refreshData();
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (appState === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 0.1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
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
          className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </motion.button>

        {/* Login Form */}
        <TravelLoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Header Controls */}
      <div className="fixed top-6 right-6 flex items-center space-x-4 z-50">
        {/* Refresh Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={refreshData}
          className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          <RefreshCw className="w-6 h-6" />
        </motion.button>

        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </motion.button>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="p-3 bg-red-500/20 backdrop-blur-md rounded-full border border-red-400/50 text-red-200 hover:bg-red-500/30 transition-colors"
        >
          <LogOut className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 left-6 z-40"
        >
          <Breadcrumbs 
            items={breadcrumbs} 
            onItemClick={handleBreadcrumbClick}
          />
        </motion.div>
      )}

      {/* Main Dashboard */}
      <motion.div
        key={refreshTrigger} // Force re-render when data changes
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "transition-all duration-500",
          openWindows.some(w => w.state === "fullscreen") ? "blur-sm scale-95" : ""
        )}
      >
        {user && <TravelDashboard user={user} onCardClick={handleDashboardCardClick} />}
      </motion.div>

      {/* Folder Windows */}
      <AnimatePresence>
        {openWindows.map((window) => (
          <FolderWindow
            key={window.id}
            title={window.title}
            isOpen={window.isOpen}
            onClose={() => closeWindow(window.id)}
            initialState={window.state}
            zIndex={window.zIndex}
          >
            {window.component}
          </FolderWindow>
        ))}
      </AnimatePresence>

      {/* Loading Animation Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0, 0.05, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
            className="absolute w-3 h-3 bg-gradient-to-r from-folder-primary to-folder-secondary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* User Info Display */}
      {user && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-6 left-6 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20 z-40"
        >
          <p className="text-white/70 text-sm">
            <span className="text-white font-medium">{user.name}</span> - {user.role === 'owner' ? 'মালিক' : 'ম্যানেজার'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
