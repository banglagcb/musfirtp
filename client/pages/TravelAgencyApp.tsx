import { useState, useEffect, useCallback, memo } from "react";
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
import { AppProvider, useApp, useTranslation, AppContext } from "@/contexts/AppContext";
import { useContext } from "react";
import { cn } from "@/lib/utils";
import { User, Booking } from "@shared/travel-types";
import dataService from "@/services/dataService";
import { PerformanceMonitor, analyzeBundleUsage } from "@/utils/performance";
import { registerServiceWorker } from "@/utils/serviceWorker";

type AppState = "login" | "dashboard";

interface OpenModal {
  id: string;
  title: string;
  component: React.ReactNode;
  isOpen: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

function TravelAgencyAppInner() {
  // Safely check context availability
  const appContext = useContext(AppContext);

  if (!appContext) {
    return <div>Loading context...</div>;
  }

  // Now we can safely use the hooks
  const { isMobile, isTablet, theme, setIsLoading } = appContext;
  const { t, language } = useTranslation();

  const [appState, setAppState] = useState<AppState>("login");
  const [user, setUser] = useState<User | null>(null);
  const [openModals, setOpenModals] = useState<OpenModal[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize user session on component mount
  useEffect(() => {
    // Performance monitoring for app initialization
    const monitor = PerformanceMonitor.getInstance();
    const endTimer = monitor.startTimer("app-initialization");

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
            { label: t("dashboard"), path: "/dashboard", isActive: true },
          ]);
        } else {
          localStorage.removeItem("air_musafir_user");
        }
      } catch (error) {
        localStorage.removeItem("air_musafir_user");
      }
    }

    // Bundle analysis and service worker registration in production
    if (process.env.NODE_ENV === "production") {
      setTimeout(() => analyzeBundleUsage(), 1000);
      registerServiceWorker();
    }

    return endTimer;
  }, []);

  // Memoized login handler for better performance
  const handleLoginSuccess = useCallback((loggedInUser: User) => {
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
      { label: t("dashboard"), path: "/dashboard", isActive: true },
    ]);
  }, []);

  // Memoized logout handler
  const handleLogout = useCallback(() => {
    // Remove user session from localStorage
    localStorage.removeItem("air_musafir_user");

    setUser(null);
    setAppState("login");
    setOpenModals([]);
    setBreadcrumbs([]);
  }, []);

  // Memoized refresh handler
  const refreshData = useCallback(() => {
    setIsLoading(true);
    setRefreshTrigger((prev) => prev + 1);
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
      "new-booking": t("newBooking"),
      "bookings-list": t("bookings"),
      "search-filter": t("searchAndFilter"),
      reports: t("reports"),
      "export-data": t("dataExport"),
      settings: t("settings"),
      "ticket-inventory": t("inventory"),
      "bulk-purchase": t("bulkPurchase"),
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
                language === "bn" ? "বুকিং এডিট করুন" : "Edit Booking",
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
                t("dataExport"),
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
                t("bulkPurchase"),
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
              title={language === "bn" ? "অ্যাক্সেস নিষ��দ্ধ" : "Access Denied"}
              description={
                language === "bn"
                  ? "কেবল মালিক বাল্ক টিকেট ক্রয় করতে পারেন"
                  : "Only owner can purchase bulk tickets"
              }
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
            description={
              language === "bn"
                ? "এই সেকশনটি শীঘ্রই আসছে!"
                : "This section is coming soon!"
            }
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
      { label: t("dashboard"), path: "/dashboard" },
      { label: title, path: `/${cardId}`, isActive: true },
    ]);
  };

  const handleBreadcrumbClick = (path: string) => {
    if (path === "/" || path === "/dashboard") {
      setBreadcrumbs([
        { label: t("dashboard"), path: "/dashboard", isActive: true },
      ]);
      setOpenModals([]);
      refreshData();
    }
  };

  if (appState === "login") {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center p-4 lg:p-6 relative overflow-hidden transition-colors duration-300",
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
        )}
      >
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0">
          {[...Array(isMobile ? 15 : 30)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0, theme === "dark" ? 0.15 : 0.1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
              className={cn(
                "absolute w-2 h-2 lg:w-3 lg:h-3 rounded-full",
                theme === "dark" ? "bg-white" : "bg-purple-500",
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Login Form */}
        <TravelLoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen relative overflow-hidden transition-colors duration-300",
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
      )}
    >
      {/* App Header */}
      <AppHeader
        user={user!}
        onLogout={handleLogout}
        onRefresh={refreshData}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
      />

      {/* Enhanced Breadcrumbs */}
      {breadcrumbs.length > 0 && !isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-4 lg:left-6 z-40"
        >
          <Breadcrumbs
            items={breadcrumbs}
            onItemClick={handleBreadcrumbClick}
          />
        </motion.div>
      )}

      {/* Main Dashboard */}
      <main className="pt-16">
        {" "}
        {/* Account for fixed header */}
        <motion.div
          key={refreshTrigger} // Force re-render when data changes
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="transition-all duration-500 will-change-transform"
        >
          {user && (
            <TravelDashboard
              user={user}
              onCardClick={handleDashboardCardClick}
            />
          )}
        </motion.div>
      </main>

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
            {user.role === "owner" ? t("owner") : t("manager")}
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

// Export component wrapped with providers
export default function TravelAgencyApp() {
  return (
    <AppProvider>
      <TravelAgencyAppInner />
    </AppProvider>
  );
}
