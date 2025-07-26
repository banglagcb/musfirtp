import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Folder, Minimize2 } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import Dashboard from "@/components/Dashboard";
import FolderWindow from "@/components/FolderWindow";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs";
import ReportsPage from "@/components/pages/ReportsPage";
import PlaceholderPage from "@/components/PlaceholderPage";
import { cn } from "@/lib/utils";

type AppState = "login" | "dashboard";

interface OpenWindow {
  id: string;
  title: string;
  component: React.ReactNode;
  isOpen: boolean;
  state: "popup" | "fullscreen" | "minimized";
  zIndex: number;
}

export default function FolderApp() {
  const [appState, setAppState] = useState<AppState>("login");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);

  // Initialize dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleLoginSuccess = () => {
    setAppState("dashboard");
    setBreadcrumbs([{ label: "Dashboard", path: "/dashboard", isActive: true }]);
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
  };

  const handleDashboardCardClick = (cardId: string) => {
    const cardTitles: Record<string, string> = {
      analytics: "Analytics",
      settings: "Settings",
      messages: "Messages",
      users: "Users",
      reports: "Reports",
      calendar: "Calendar",
      security: "Security",
      performance: "Performance"
    };

    const title = cardTitles[cardId] || cardId;
    
    let component;
    if (cardId === "reports") {
      component = <ReportsPage onSubPageClick={(subPageId) => handleReportsSubPage(subPageId)} />;
    } else {
      component = <PlaceholderPage title={title} onBack={() => closeWindow(cardId)} />;
    }

    openWindow(cardId, title, component);
    
    // Update breadcrumbs
    setBreadcrumbs([
      { label: "Dashboard", path: "/dashboard" },
      { label: title, path: `/${cardId}`, isActive: true }
    ]);
  };

  const handleReportsSubPage = (subPageId: string) => {
    const subPageTitles: Record<string, string> = {
      sales: "Sales Reports",
      analytics: "Analytics Reports", 
      financial: "Financial Reports"
    };

    const title = subPageTitles[subPageId] || subPageId;
    const component = <PlaceholderPage title={title} onBack={() => closeWindow(`reports-${subPageId}`)} />;
    
    openWindow(`reports-${subPageId}`, title, component);
    
    // Update breadcrumbs for nested navigation
    setBreadcrumbs([
      { label: "Dashboard", path: "/dashboard" },
      { label: "Reports", path: "/reports" },
      { label: title, path: `/reports/${subPageId}`, isActive: true }
    ]);
  };

  const handleBreadcrumbClick = (path: string) => {
    if (path === "/") {
      setAppState("dashboard");
      setBreadcrumbs([{ label: "Dashboard", path: "/dashboard", isActive: true }]);
      setOpenWindows([]);
    } else if (path === "/dashboard") {
      setBreadcrumbs([{ label: "Dashboard", path: "/dashboard", isActive: true }]);
      setOpenWindows([]);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Minimized windows dock
  const minimizedWindows = openWindows.filter(w => w.state === "minimized");

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
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Dark Mode Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors z-50"
      >
        {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </motion.button>

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "transition-all duration-500",
          openWindows.some(w => w.state === "fullscreen") ? "blur-sm scale-95" : ""
        )}
      >
        <Dashboard onCardClick={handleDashboardCardClick} />
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

      {/* Minimized Windows Dock */}
      {minimizedWindows.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            {minimizedWindows.map((window) => (
              <motion.button
                key={window.id}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpenWindows(prev => prev.map(w => 
                  w.id === window.id 
                    ? { ...w, state: "popup", zIndex: nextZIndex }
                    : w
                ))}
                className="p-3 bg-gradient-to-r from-folder-primary to-folder-secondary rounded-xl text-white shadow-glow flex items-center space-x-2"
              >
                <Folder className="w-5 h-5" />
                <span className="text-sm font-medium">{window.title}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

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
    </div>
  );
}
