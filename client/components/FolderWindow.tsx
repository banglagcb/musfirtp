import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode, useState, useEffect, forwardRef } from "react";

export type WindowState = "popup" | "fullscreen";

interface FolderWindowProps {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  initialState?: WindowState;
  className?: string;
  showControls?: boolean;
  zIndex?: number;
  onMaximize?: () => void;
}

const FolderWindow = forwardRef<HTMLDivElement, FolderWindowProps>(
  (
    {
      children,
      title,
      isOpen,
      onClose,
      initialState = "popup",
      className,
      showControls = true,
      zIndex = 50,
      onMaximize,
    },
    ref,
  ) => {
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

    // Enhanced backdrop variants for smoother transitions
    const backdropVariants = {
      hidden: {
        opacity: 0,
        backdropFilter: "blur(0px)",
      },
      visible: {
        opacity: 1,
        backdropFilter: "blur(12px)",
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smooth easing
        },
      },
      exit: {
        opacity: 0,
        backdropFilter: "blur(0px)",
        transition: {
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    };

    // Smoother container variants
    const containerVariants = {
      hidden: {
        opacity: 0,
        scale: 0.85,
        y: 40,
        filter: "blur(8px)",
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8,
          duration: 0.5,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.9,
        y: -20,
        filter: "blur(4px)",
        transition: {
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    };

    // Content variants for staggered animation
    const contentVariants = {
      hidden: { opacity: 0, y: 15 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.1,
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    };

    // Dynamic styles with smooth transitions and safe positioning
    const getWindowStyles = () => {
      const baseStyles = {
        position: "fixed" as const,
        zIndex,
      };

      switch (windowState) {
        case "fullscreen":
          return {
            ...baseStyles,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            borderRadius: "0px",
            transform: "none",
          };
        default: // popup
          return {
            ...baseStyles,
            top: "50%",
            left: "50%",
            width: "min(90vw, 900px)",
            height: "min(85vh, 700px)",
            borderRadius: "24px",
            transform: "translate(-50%, -50%)",
            maxWidth: "calc(100vw - 40px)",
            maxHeight: "calc(100vh - 40px)",
          };
      }
    };

    if (!isOpen) return null;

    return (
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Enhanced Backdrop - only show for popup mode */}
            {windowState === "popup" && (
              <motion.div
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/30"
                style={{ zIndex: zIndex - 1 }}
                onClick={onClose}
              />
            )}

            {/* Main Window with enhanced animations */}
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "bg-gradient-to-br from-white/98 to-white/95 dark:from-gray-900/98 dark:to-gray-800/95",
                "backdrop-blur-2xl border border-white/40 dark:border-gray-700/60",
                "shadow-2xl shadow-black/25",
                "overflow-hidden",
                className,
              )}
              style={{
                ...getWindowStyles(),
                minHeight: windowState === "popup" ? "400px" : "100%",
                maxHeight: windowState === "popup" ? "85vh" : "100%",
                willChange: "transform, opacity", // Performance optimization
                containIntrinsicSize: "auto auto", // Better layout containment
              }}
              drag={windowState === "popup" && showControls && !isDragging}
              dragMomentum={false}
              dragElastic={0.02}
              dragConstraints={{
                left: -window.innerWidth / 2 + 250,
                right: window.innerWidth / 2 - 250,
                top: -window.innerHeight / 2 + 150,
                bottom: window.innerHeight / 2 - 150,
              }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              whileDrag={{
                scale: 1.02,
                boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.4)",
                zIndex: zIndex + 10,
                transition: { duration: 0.2 },
              }}
              transition={{
                type: "spring",
                stiffness: windowState === "fullscreen" ? 280 : 320,
                damping: windowState === "fullscreen" ? 25 : 30,
                mass: 0.8,
              }}
              layout
            >
              {/* Enhanced Window Header */}
              {showControls && (
                <motion.div
                  variants={contentVariants}
                  className={cn(
                    "flex items-center justify-between p-5 lg:p-6",
                    "border-b border-white/30 dark:border-gray-700/60",
                    "bg-gradient-to-r from-blue-500/8 via-purple-500/8 to-pink-500/8",
                    "backdrop-blur-sm",
                    isDragging && "cursor-grabbing",
                  )}
                  style={{
                    cursor:
                      windowState === "popup" && !isDragging
                        ? "grab"
                        : "default",
                  }}
                >
                  {/* Enhanced Title Section */}
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 1, 0.8],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate max-w-xs lg:max-w-lg">
                      {title}
                    </h3>
                  </div>

                  {/* Enhanced Control Buttons */}
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    {/* Maximize/Restore Button */}
                    <motion.button
                      whileHover={{
                        scale: 1.25,
                        backgroundColor: "rgba(34, 197, 94, 0.9)",
                        boxShadow: "0 8px 25px rgba(34, 197, 94, 0.4)",
                        rotate: 180,
                      }}
                      whileTap={{ scale: 0.85 }}
                      onClick={handleMaximize}
                      className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-emerald-500/80 hover:bg-emerald-500 flex items-center justify-center transition-all duration-300 shadow-xl border-2 border-emerald-400/60"
                      title={
                        windowState === "fullscreen" ? "Restore" : "Maximize"
                      }
                    >
                      <motion.div
                        animate={{
                          rotate: windowState === "fullscreen" ? 180 : 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                      >
                        {windowState === "fullscreen" ? (
                          <Minimize2 className="w-5 h-5 lg:w-6 lg:h-6 text-white drop-shadow-lg" />
                        ) : (
                          <Maximize2 className="w-5 h-5 lg:w-6 lg:h-6 text-white drop-shadow-lg" />
                        )}
                      </motion.div>
                    </motion.button>

                    {/* Close Button */}
                    <motion.button
                      whileHover={{
                        scale: 1.25,
                        backgroundColor: "rgba(239, 68, 68, 0.9)",
                        boxShadow: "0 8px 25px rgba(239, 68, 68, 0.4)",
                        rotate: 90,
                      }}
                      whileTap={{ scale: 0.85 }}
                      onClick={onClose}
                      className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-all duration-300 shadow-xl border-2 border-red-400/60"
                      title="Close"
                    >
                      <motion.div
                        whileHover={{
                          rotate: 90,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                      >
                        <X className="w-5 h-5 lg:w-6 lg:h-6 text-white drop-shadow-lg" />
                      </motion.div>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Window Content */}
              <motion.div
                variants={contentVariants}
                className="flex-1 overflow-auto"
                style={{
                  height: showControls ? "calc(100% - 80px)" : "100%",
                  scrollBehavior: "smooth",
                }}
              >
                <div className="min-h-full w-full">{children}</div>
              </motion.div>

              {/* Enhanced State Indicator */}
              <motion.div
                className="absolute top-3 right-3 text-xs px-3 py-1 bg-black/30 text-white rounded-full backdrop-blur-sm"
                animate={{
                  opacity: isDragging ? 1 : 0,
                  scale: isDragging ? 1 : 0.8,
                }}
                transition={{ duration: 0.2 }}
              >
                {windowState === "fullscreen" ? "Fullscreen" : "Window"}
              </motion.div>

              {/* Enhanced Resize Handle for popup mode */}
              {windowState === "popup" && showControls && (
                <motion.div
                  className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-br from-blue-500/40 to-purple-500/40 hover:from-blue-500/60 hover:to-purple-500/60 cursor-se-resize opacity-0 hover:opacity-100 transition-all duration-300 rounded-tl-2xl"
                  whileHover={{ scale: 1.2 }}
                />
              )}

              {/* Enhanced Ambient Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-inherit bg-gradient-to-r from-blue-500/3 via-purple-500/3 to-pink-500/3 opacity-0 pointer-events-none"
                animate={{
                  opacity: windowState === "popup" ? [0, 0.5, 0] : 0,
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Enhanced Border Glow */}
              <motion.div
                className="absolute inset-0 rounded-inherit"
                style={{
                  background:
                    "linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent, rgba(168, 85, 247, 0.1), transparent)",
                  backgroundSize: "400% 400%",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  },
);

FolderWindow.displayName = "FolderWindow";

export default FolderWindow;
