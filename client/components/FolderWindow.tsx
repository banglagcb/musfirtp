import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Square, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode, useState, useEffect, forwardRef } from "react";

export type WindowState = "popup" | "fullscreen" | "minimized";

interface FolderWindowProps {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  initialState?: WindowState;
  className?: string;
  showControls?: boolean;
  zIndex?: number;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export default function FolderWindow({
  children,
  title,
  isOpen,
  onClose,
  initialState = "popup",
  className,
  showControls = true,
  zIndex = 50,
  onMinimize,
  onMaximize,
}: FolderWindowProps) {
  const [windowState, setWindowState] = useState<WindowState>(initialState);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setWindowState(initialState);
  }, [initialState]);

  const handleMaximize = () => {
    const newState = windowState === "fullscreen" ? "popup" : "fullscreen";
    setWindowState(newState);
    if (onMaximize) {
      onMaximize();
    }
  };

  const handleMinimize = () => {
    setWindowState("minimized");
    if (onMinimize) {
      onMinimize();
    }
  };

  const handleRestore = () => {
    setWindowState("popup");
  };

  // Backdrop variants
  const backdropVariants = {
    hidden: {
      opacity: 0,
      backdropFilter: "blur(0px)",
    },
    visible: {
      opacity: 1,
      backdropFilter: "blur(8px)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      backdropFilter: "blur(0px)",
      transition: {
        duration: 0.2,
      },
    },
  };

  // Main container variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.7,
      y: 50,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -30,
      filter: "blur(8px)",
      transition: {
        duration: 0.25,
        ease: "easeIn",
      },
    },
  };

  // Content variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // Dynamic styles based on window state
  const getWindowStyles = () => {
    switch (windowState) {
      case "fullscreen":
        return {
          position: "fixed" as const,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          borderRadius: "0px",
          transform: "none",
        };
      case "minimized":
        return {
          position: "fixed" as const,
          top: "50%",
          left: "50%",
          width: "400px",
          height: "300px",
          borderRadius: "20px",
          transform: "translate(-50%, -50%) scale(0.1)",
          opacity: 0.3,
          pointerEvents: "none" as const,
        };
      default: // popup
        return {
          position: "fixed" as const,
          top: "50%",
          left: "50%",
          width: "min(90vw, 900px)",
          height: "min(85vh, 700px)",
          borderRadius: "20px",
          transform: "translate(-50%, -50%)",
        };
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop - only show for popup mode */}
          {windowState === "popup" && (
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              style={{ zIndex: zIndex - 1 }}
              onClick={onClose}
            />
          )}

          {/* Main Window */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "bg-gradient-to-br from-white/95 to-white/90 dark:from-gray-900/95 dark:to-gray-800/90",
              "backdrop-blur-xl border border-white/30 dark:border-gray-700/50",
              "shadow-2xl shadow-black/20",
              "overflow-hidden",
              className,
            )}
            style={{
              ...getWindowStyles(),
              zIndex,
              minHeight: windowState === "popup" ? "400px" : "100%",
              maxHeight: windowState === "popup" ? "90vh" : "100%",
            }}
            drag={windowState === "popup" && showControls && !isDragging}
            dragMomentum={false}
            dragElastic={0.1}
            dragConstraints={{
              left: -window.innerWidth / 2 + 200,
              right: window.innerWidth / 2 - 200,
              top: -window.innerHeight / 2 + 100,
              bottom: window.innerHeight / 2 - 100,
            }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            whileDrag={{
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
              zIndex: zIndex + 10,
            }}
            transition={{
              type: "spring",
              stiffness: windowState === "fullscreen" ? 200 : 300,
              damping: windowState === "fullscreen" ? 20 : 25,
            }}
          >
            {/* Window Header */}
            {showControls && (
              <motion.div
                variants={contentVariants}
                className={cn(
                  "flex items-center justify-between p-4 lg:p-5",
                  "border-b border-white/20 dark:border-gray-700/50",
                  "bg-gradient-to-r from-purple-500/10 to-blue-500/10",
                  "backdrop-blur-sm",
                  isDragging && "cursor-grabbing",
                )}
                style={{
                  cursor:
                    windowState === "popup" && !isDragging ? "grab" : "default",
                }}
              >
                {/* Title Section */}
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white truncate max-w-xs lg:max-w-md">
                    {title}
                  </h3>
                  {windowState === "minimized" && (
                    <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 rounded-full">
                      Minimized
                    </span>
                  )}
                </div>

                {/* Control Buttons */}
                <div className="flex items-center space-x-2 lg:space-x-3">
                  {/* Minimize Button */}
                  <motion.button
                    whileHover={{
                      scale: 1.2,
                      backgroundColor: "rgba(255, 193, 7, 0.8)",
                      boxShadow: "0 4px 15px rgba(255, 193, 7, 0.4)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={
                      windowState === "minimized"
                        ? handleRestore
                        : handleMinimize
                    }
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-yellow-500/70 hover:bg-yellow-500 flex items-center justify-center transition-all duration-200 shadow-lg border border-yellow-400/50"
                    title={windowState === "minimized" ? "Restore" : "Minimize"}
                  >
                    <motion.div
                      animate={{
                        rotate: windowState === "minimized" ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Minus className="w-4 h-4 lg:w-5 lg:h-5 text-white drop-shadow-sm" />
                    </motion.div>
                  </motion.button>

                  {/* Maximize/Restore Button */}
                  <motion.button
                    whileHover={{
                      scale: 1.2,
                      backgroundColor: "rgba(40, 167, 69, 0.8)",
                      boxShadow: "0 4px 15px rgba(40, 167, 69, 0.4)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleMaximize}
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-green-500/70 hover:bg-green-500 flex items-center justify-center transition-all duration-200 shadow-lg border border-green-400/50"
                    title={
                      windowState === "fullscreen" ? "Restore" : "Maximize"
                    }
                  >
                    <motion.div
                      animate={{
                        rotate: windowState === "fullscreen" ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {windowState === "fullscreen" ? (
                        <Minimize2 className="w-4 h-4 lg:w-5 lg:h-5 text-white drop-shadow-sm" />
                      ) : (
                        <Maximize2 className="w-4 h-4 lg:w-5 lg:h-5 text-white drop-shadow-sm" />
                      )}
                    </motion.div>
                  </motion.button>

                  {/* Close Button */}
                  <motion.button
                    whileHover={{
                      scale: 1.2,
                      backgroundColor: "rgba(220, 53, 69, 0.8)",
                      boxShadow: "0 4px 15px rgba(220, 53, 69, 0.4)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-red-500/70 hover:bg-red-500 flex items-center justify-center transition-all duration-200 shadow-lg border border-red-400/50"
                    title="Close"
                  >
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-4 h-4 lg:w-5 lg:h-5 text-white drop-shadow-sm" />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Window Content */}
            <motion.div
              variants={contentVariants}
              className="flex-1 overflow-auto"
              style={{
                height: showControls ? "calc(100% - 70px)" : "100%",
                scrollBehavior: "smooth",
              }}
            >
              <div className="min-h-full w-full">{children}</div>
            </motion.div>

            {/* Window State Indicator */}
            <motion.div
              className="absolute top-2 right-2 text-xs px-2 py-1 bg-black/20 text-white rounded-full opacity-0"
              animate={{
                opacity: isDragging ? 1 : 0,
              }}
            >
              {windowState}
            </motion.div>

            {/* Resize Handles for popup mode */}
            {windowState === "popup" && showControls && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-500/30 hover:bg-gray-500/50 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity rounded-tl-lg" />
            )}

            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-inherit bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 opacity-0 pointer-events-none"
              animate={{
                opacity: windowState === "popup" ? [0, 0.3, 0] : 0,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
