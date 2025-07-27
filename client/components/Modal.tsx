import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode, useState, useEffect } from "react";

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
  const [isMaximized, setIsMaximized] = useState(false);

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

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  // Get modal size classes
  const getSizeClasses = () => {
    if (isMaximized) {
      return "w-screen h-screen max-w-none max-h-none rounded-none";
    }
    
    switch (size) {
      case "sm":
        return "w-full max-w-md max-h-[80vh]";
      case "md":
        return "w-full max-w-lg max-h-[80vh]";
      case "lg":
        return "w-full max-w-4xl max-h-[85vh]";
      case "xl":
        return "w-full max-w-6xl max-h-[90vh]";
      case "full":
        return "w-[95vw] h-[95vh] max-w-none max-h-none";
      default:
        return "w-full max-w-4xl max-h-[85vh]";
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden",
                "border border-gray-200 dark:border-gray-700",
                "flex flex-col",
                getSizeClasses(),
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {showControls && (
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {title}
                  </h2>
                  
                  <div className="flex items-center space-x-2">
                    {/* Maximize Button */}
                    <button
                      onClick={handleMaximize}
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title={isMaximized ? "Restore" : "Maximize"}
                    >
                      {isMaximized ? (
                        <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      ) : (
                        <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      )}
                    </button>

                    {/* Close Button */}
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                      title="Close"
                    >
                      <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
