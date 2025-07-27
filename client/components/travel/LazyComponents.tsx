import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/AppContext";

// Lazy load all travel components for better code splitting
export const LazyBookingsList = lazy(() => import("./BookingsList"));
export const LazyNewBookingForm = lazy(() => import("./NewBookingForm"));
export const LazyEditBookingForm = lazy(() => import("./EditBookingForm"));
export const LazyTicketDetails = lazy(() => import("./TicketDetails"));
export const LazyTicketInventoryDashboard = lazy(
  () => import("./TicketInventoryDashboard"),
);
export const LazyBulkTicketPurchaseForm = lazy(
  () => import("./BulkTicketPurchaseForm"),
);
export const LazyReportsSection = lazy(() => import("./ReportsSection"));
export const LazyDataExport = lazy(() => import("./DataExport"));
export const LazySettingsPage = lazy(() => import("./SettingsPage"));

// High-performance loading component
function LoadingSpinner() {
  const { theme } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className={cn(
          "flex items-center space-x-3 p-6 rounded-xl backdrop-blur-md border",
          theme === "dark"
            ? "bg-white/10 border-white/20 text-white"
            : "bg-white/80 border-gray-200 text-gray-800",
        )}
      >
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-lg font-medium">লোড হচ্ছে...</span>
      </motion.div>
    </motion.div>
  );
}

// HOC for lazy component wrapper with error boundary
export function withLazyLoading<P extends object>(
  LazyComponent: React.LazyExoticComponent<React.ComponentType<P>>,
  fallback?: React.ReactNode,
) {
  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Preload utility for critical components
export const preloadComponents = {
  bookingsList: () => import("./BookingsList"),
  newBookingForm: () => import("./NewBookingForm"),
  editBookingForm: () => import("./EditBookingForm"),
  ticketDetails: () => import("./TicketDetails"),
  ticketInventory: () => import("./TicketInventoryDashboard"),
  bulkPurchase: () => import("./BulkTicketPurchaseForm"),
  reports: () => import("./ReportsSection"),
  dataExport: () => import("./DataExport"),
  settings: () => import("./SettingsPage"),
};

// Intelligent preloader that loads components based on user interaction
export function useIntelligentPreload() {
  const preloadComponent = (componentName: keyof typeof preloadComponents) => {
    // Only preload in production and when the browser is idle
    if (
      process.env.NODE_ENV === "production" &&
      "requestIdleCallback" in window
    ) {
      requestIdleCallback(() => {
        preloadComponents[componentName]();
      });
    }
  };

  return { preloadComponent };
}

// Performance-optimized exports
export const BookingsList = withLazyLoading(LazyBookingsList);
export const NewBookingForm = withLazyLoading(LazyNewBookingForm);
export const EditBookingForm = withLazyLoading(LazyEditBookingForm);
export const TicketDetails = withLazyLoading(LazyTicketDetails);
export const TicketInventoryDashboard = withLazyLoading(
  LazyTicketInventoryDashboard,
);
export const BulkTicketPurchaseForm = withLazyLoading(
  LazyBulkTicketPurchaseForm,
);
export const ReportsSection = withLazyLoading(LazyReportsSection);
export const DataExport = withLazyLoading(LazyDataExport);
export const SettingsPage = withLazyLoading(LazySettingsPage);
