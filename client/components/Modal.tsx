import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode, useState, useEffect, useRef } from "react";
import { useApp } from "@/contexts/AppContext";

interface ModalProps {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showControls?: boolean;
}

export default function Modal({
  children,
  title,
  isOpen,
  onClose,
  className,
  size = "lg",
  showControls = true,
}: ModalProps) {
  const { language } = useApp();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get font class based on language
  const fontClass = language === "bn" ? "font-bengali" : "font-english";

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle scroll detection
  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    const handleScroll = () => {
      setIsScrolled(contentEl.scrollTop > 10);
    };

    contentEl.addEventListener("scroll", handleScroll);
    return () => contentEl.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Get modal size classes
  const getSizeClasses = () => {
    if (isMaximized) {
      return "w-screen h-screen max-w-none max-h-none rounded-none m-0";
    }

    switch (size) {
      case "sm":
        return "w-full max-w-md max-h-[80vh] mx-4";
      case "md":
        return "w-full max-w-lg max-h-[80vh] mx-4";
      case "lg":
        return "w-full max-w-4xl max-h-[85vh] mx-4";
      case "xl":
        return "w-full max-w-6xl max-h-[90vh] mx-4";
      case "full":
        return "w-[95vw] h-[95vh] max-w-none max-h-none";
      default:
        return "w-full max-w-4xl max-h-[85vh] mx-4";
    }
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden",
                "border border-gray-200 dark:border-gray-700",
                "flex flex-col relative",
                getSizeClasses(),
                className,
                fontClass,
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {showControls && (
                <div
                  className={cn(
                    "flex items-center justify-between p-4 border-b transition-all duration-200",
                    isScrolled
                      ? "border-gray-300 dark:border-gray-600 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm"
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
                  )}
                >
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-4">
                    {title}
                  </h2>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {/* Maximize Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleMaximize}
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title={isMaximized ? "Restore" : "Maximize"}
                    >
                      {isMaximized ? (
                        <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      ) : (
                        <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      )}
                    </motion.button>

                    {/* Close Button */}
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#dc2626" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 rounded-lg hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-colors"
                      title="Close"
                    >
                      <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Content */}
              <div
                ref={contentRef}
                className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
              >
                {children}
              </div>

              {/* Scroll to top button */}
              <AnimatePresence>
                {isScrolled && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="absolute bottom-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg z-10"
                    title="Scroll to top"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Modal size indicator */}
              {process.env.NODE_ENV === "development" && (
                <div className="absolute top-2 left-2 text-xs px-2 py-1 bg-black/50 text-white rounded">
                  {isMaximized ? "Maximized" : size}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
