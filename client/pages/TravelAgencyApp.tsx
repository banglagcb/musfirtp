import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TravelLoginForm from "@/components/travel/TravelLoginForm";
import TravelDashboard from "@/components/travel/TravelDashboard";
import Modal from "@/components/Modal";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs";
import NewBookingForm from "@/components/travel/NewBookingForm";
import BookingsList from "@/components/travel/BookingsList";
import ReportsSection from "@/components/travel/ReportsSection";
import DataExport from "@/components/travel/DataExport";
import EditBookingForm from "@/components/travel/EditBookingForm";
import SettingsPage from "@/components/travel/SettingsPage";
import BulkTicketPurchaseForm from "@/components/travel/BulkTicketPurchaseForm";
import TicketInventoryDashboard from "@/components/travel/TicketInventoryDashboard";
import PlaceholderPage from "@/components/PlaceholderPage";
import AppHeader from "@/components/layout/AppHeader";
import { AppProvider, useApp, useTranslation } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import { User, Booking } from "@shared/travel-types";
import dataService from "@/services/dataService";

type AppState = "login" | "dashboard";

interface OpenModal {
  id: string;
  title: string;
  component: React.ReactNode;
  isOpen: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

function TravelAgencyAppInner() {
  const [appState, setAppState] = useState<AppState>("login");
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [openModals, setOpenModals] = useState<OpenModal[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize user session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("air_musafir_user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Validate user still exists in system
        const validUser = dataService.validateUser(
          userData.username,
          userData.password,
        );
        if (validUser) {
          setUser(validUser);
          setAppState("dashboard");
          setBreadcrumbs([
            { label: "ড্যাশবোর্ড", path: "/dashboard", isActive: true },
          ]);
        } else {
          localStorage.removeItem("air_musafir_user");
        }
      } catch (error) {
        localStorage.removeItem("air_musafir_user");
      }
    }
  }, []);

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
    // Save user session to localStorage
    localStorage.setItem(
      "air_musafir_user",
      JSON.stringify({
        username: loggedInUser.username,
        password: loggedInUser.password,
      }),
    );

    setUser(loggedInUser);
    setAppState("dashboard");
    setBreadcrumbs([
      { label: "ড্যাশবোর্ড", path: "/dashboard", isActive: true },
    ]);
  };

  const handleLogout = () => {
    // Remove user session from localStorage
    localStorage.removeItem("air_musafir_user");

    setUser(null);
    setAppState("login");
    setOpenModals([]);
    setBreadcrumbs([]);
  };

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const openModal = (
    id: string,
    title: string,
    component: React.ReactNode,
    size: "sm" | "md" | "lg" | "xl" | "full" = "lg",
  ) => {
    const existingModal = openModals.find((m) => m.id === id);

    if (existingModal) {
      // Bring existing modal to front
      setOpenModals((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isOpen: true } : m)),
      );
    } else {
      // Create new modal
      setOpenModals((prev) => [
        ...prev,
        {
          id,
          title,
          component,
          isOpen: true,
          size,
        },
      ]);
    }
  };

  const closeModal = (id: string) => {
    setOpenModals((prev) => prev.filter((m) => m.id !== id));
    // Refresh dashboard data when closing modals
    refreshData();
  };

  const handleDashboardCardClick = (cardId: string) => {
    const cardTitles: Record<string, string> = {
      "new-booking": "নতুন ব��কিং",
      "bookings-list": "বুকিং লিস্ট",
      "search-filter": "সার্চ ও ফিল্টার",
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
            user={user!}
            onClose={() => closeModal(cardId)}
            onSuccess={() => {
              closeModal(cardId);
              refreshData();
            }}
          />
        );
        break;
      case "bookings-list":
        component = (
          <BookingsList
            user={user!}
            onClose={() => closeModal(cardId)}
            onEdit={(booking: Booking) => {
              closeModal(cardId);
              openModal(
                "edit-booking",
                "বুকিং ��ডিট করুন",
                <EditBookingForm
                  booking={booking}
                  user={user!}
                  onClose={() => closeModal("edit-booking")}
                  onSuccess={() => {
                    closeModal("edit-booking");
                    refreshData();
                  }}
                />,
              );
            }}
          />
        );
        break;
      case "search-filter":
        component = (
          <BookingsList
            user={user!}
            onClose={() => closeModal(cardId)}
            onEdit={(booking: Booking) => {
              closeModal(cardId);
            }}
          />
        );
        break;
      case "reports":
        component = (
          <ReportsSection
            onClose={() => closeModal(cardId)}
            onExportData={() => {
              openModal(
                "export-data",
                "ডেটা এক্সপোর্ট",
                <DataExport onClose={() => closeModal("export-data")} />,
              );
            }}
          />
        );
        break;
      case "export-data":
        component = <DataExport onClose={() => closeModal(cardId)} />;
        break;
      case "ticket-inventory":
        component = (
          <TicketInventoryDashboard
            user={user!}
            onClose={() => closeModal(cardId)}
            onOpenPurchaseForm={() => {
              closeModal(cardId);
              openModal(
                "bulk-purchase",
                "বাল্ক টিকেট ক্রয়",
                <BulkTicketPurchaseForm
                  onClose={() => closeModal("bulk-purchase")}
                  onSuccess={() => {
                    closeModal("bulk-purchase");
                    refreshData();
                  }}
                />,
                "xl",
              );
            }}
          />
        );
        break;
      case "bulk-purchase":
        // Only allow admin/owner to access bulk purchase
        if (user?.role === "owner") {
          component = (
            <BulkTicketPurchaseForm
              onClose={() => closeModal(cardId)}
              onSuccess={() => {
                closeModal(cardId);
                refreshData();
              }}
            />
          );
        } else {
          component = (
            <PlaceholderPage
              title="অ্যাক্সেস নিষিদ্ধ"
              description="কেবল মালিক বাল্ক ট���কেট ক্রয় করতে পারেন"
              onBack={() => closeModal(cardId)}
            />
          );
        }
        break;
      case "settings":
        component = (
          <SettingsPage user={user!} onClose={() => closeModal(cardId)} />
        );
        break;
      default:
        component = (
          <PlaceholderPage
            title={title}
            description="এই সেকশনটি শীঘ্রই আসছে!"
            onBack={() => closeModal(cardId)}
          />
        );
    }

    const modalSize =
      cardId === "new-booking" || cardId === "edit-booking"
        ? "xl"
        : cardId === "settings"
          ? "full"
          : "lg";
    openModal(cardId, title, component, modalSize);

    // Update breadcrumbs
    setBreadcrumbs([
      { label: "ড্য���শ���োর্ড", path: "/dashboard" },
      { label: title, path: `/${cardId}`, isActive: true },
    ]);
  };

  const handleBreadcrumbClick = (path: string) => {
    if (path === "/" || path === "/dashboard") {
      setBreadcrumbs([
        { label: "ড্যাশবোর্ড", path: "/dashboard", isActive: true },
      ]);
      setOpenModals([]);
      refreshData();
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Header Controls */}
      <div className="fixed top-4 lg:top-6 right-4 lg:right-6 flex items-center space-x-2 lg:space-x-4 z-50">
        {/* Refresh Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={refreshData}
          className="p-2 lg:p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors shadow-lg"
        >
          <RefreshCw className="w-5 h-5 lg:w-6 lg:h-6" />
        </motion.button>

        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="p-2 lg:p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors shadow-lg"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 lg:w-6 lg:h-6" />
          ) : (
            <Moon className="w-5 h-5 lg:w-6 lg:h-6" />
          )}
        </motion.button>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="p-2 lg:p-3 bg-red-500/20 backdrop-blur-md rounded-full border border-red-400/50 text-red-200 hover:bg-red-500/30 transition-colors shadow-lg"
        >
          <LogOut className="w-5 h-5 lg:w-6 lg:h-6" />
        </motion.button>
      </div>

      {/* Enhanced Breadcrumbs */}
      {breadcrumbs.length > 0 && !isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 lg:top-6 left-4 lg:left-6 z-40"
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
        className="transition-all duration-500 will-change-transform"
      >
        {user && (
          <TravelDashboard user={user} onCardClick={handleDashboardCardClick} />
        )}
      </motion.div>

      {/* Modals */}
      {openModals.map((modal) => (
        <Modal
          key={modal.id}
          title={modal.title}
          isOpen={modal.isOpen}
          onClose={() => closeModal(modal.id)}
          size={modal.size}
        >
          {modal.component}
        </Modal>
      ))}

      {/* Enhanced Loading Animation Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, Math.random() * 300 - 150],
              y: [0, Math.random() * 300 - 150],
              opacity: [0, 0.08, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
            className="absolute w-3 h-3 lg:w-4 lg:h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Enhanced User Info Display */}
      {user && !isMobile && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-4 lg:bottom-6 left-4 lg:left-6 bg-white/10 backdrop-blur-md rounded-lg px-3 lg:px-4 py-2 lg:py-3 border border-white/20 z-40 shadow-lg"
        >
          <p className="text-white/70 text-sm lg:text-base">
            <span className="text-white font-medium">{user.name}</span> -{" "}
            {user.role === "owner" ? "মালিক" : "ম্যানেজার"}
          </p>
        </motion.div>
      )}

      {/* Mobile breadcrumbs at bottom */}
      {breadcrumbs.length > 0 && isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 left-4 right-4 z-40"
        >
          <Breadcrumbs
            items={breadcrumbs}
            onItemClick={handleBreadcrumbClick}
            className="text-sm"
          />
        </motion.div>
      )}
    </div>
  );
}
