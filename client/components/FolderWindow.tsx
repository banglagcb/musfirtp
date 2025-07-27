import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2, Square, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode, useState, useEffect, forwardRef, useRef } from "react";

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
  onMaximize?: () => void;
  onMinimize?: () => void;
  resizable?: boolean;
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
      onMinimize,
      resizable = true,
    },
    ref,
  ) => {
    const [windowState, setWindowState] = useState<WindowState>(initialState);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 900, height: 700 });
    const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
    const windowRef = useRef<HTMLDivElement>(null);
    
    const [viewportSize, setViewportSize] = useState({
      width: typeof window !== 'undefined' ? window.innerWidth : 1024,
      height: typeof window !== 'undefined' ? window.innerHeight : 768
    });

    useEffect(() => {
      setWindowState(initialState);
    }, [initialState]);

    // Monitor viewport changes
    useEffect(() => {
      const handleResize = () => {
        setViewportSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }
    }, []);

    // Auto-center window when opening
    useEffect(() => {
      if (isOpen && windowState === "popup") {
        const centerX = (viewportSize.width - windowSize.width) / 2;
        const centerY = (viewportSize.height - windowSize.height) / 2;
        setWindowPosition({ x: centerX, y: centerY });
      }
    }, [isOpen, viewportSize, windowSize, windowState]);

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

    // Enhanced backdrop variants
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
          ease: [0.4, 0, 0.2, 1],
        },
      },
      exit: {
        opacity: 0,
        backdropFilter: "blur(0px)",
        transition: {
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        },
      },
    };

    // Windows-style container variants
    const containerVariants = {
      hidden: {
        opacity: 0,
        scale: 0.9,
        y: 20,
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25,
          duration: 0.4,
        },
      },
      fullscreen: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.5,
        },
      },
      minimized: {
        opacity: 0,
        scale: 0.8,
        y: 50,
        transition: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        },
      },
      exit: {
        opacity: 0,
        scale: 0.9,
        y: -10,
        transition: {
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        },
      },
    };

    // Dynamic styles with Windows-like behavior
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
        case "minimized":
          return {
            ...baseStyles,
            top: viewportSize.height - 100,
            left: 20,
            width: "300px",
            height: "60px",
            borderRadius: "8px",
            transform: "none",
          };
        default: // popup
          const safeWidth = Math.min(windowSize.width, viewportSize.width - 40);
          const safeHeight = Math.min(windowSize.height, viewportSize.height - 40);
          
          return {
            ...baseStyles,
            top: Math.max(20, Math.min(windowPosition.y, viewportSize.height - safeHeight - 20)),
            left: Math.max(20, Math.min(windowPosition.x, viewportSize.width - safeWidth - 20)),
            width: `${safeWidth}px`,
            height: `${safeHeight}px`,
            borderRadius: "12px",
            transform: "none",
          };
      }
    };

    if (!isOpen) return null;

    return (
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Enhanced Backdrop */}
            {(windowState === "popup" || windowState === "fullscreen") && (
              <motion.div
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 bg-black/30"
                style={{ zIndex: zIndex - 1 }}
                onClick={windowState === "popup" ? onClose : undefined}
              />
            )}

            {/* Main Window with Windows-style design */}
            <motion.div
              ref={windowRef}
              variants={containerVariants}
              initial="hidden"
              animate={windowState}
              exit="exit"
              className={cn(
                // Windows-style window design
                "bg-white/95 dark:bg-gray-900/95",
                "backdrop-blur-xl border border-gray-300/50 dark:border-gray-600/50",
                "shadow-2xl shadow-black/20",
                "overflow-hidden",
                // Windows-style rounded corners
                windowState === "fullscreen" ? "rounded-none" : "rounded-xl",
                // Enhanced visual effects
                "ring-1 ring-white/20",
                className,
              )}
              style={{
                ...getWindowStyles(),
                minHeight: windowState === "minimized" ? "60px" : windowState === "popup" ? "400px" : "100%",
                willChange: "transform, opacity",
              }}
              drag={windowState === "popup" && showControls && !isDragging && !isResizing}
              dragMomentum={false}
              dragElastic={0}
              dragConstraints={{
                left: 0,
                right: viewportSize.width - windowSize.width,
                top: 0,
                bottom: viewportSize.height - windowSize.height,
              }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(_, info) => {
                setIsDragging(false);
                setWindowPosition({
                  x: Math.max(0, windowPosition.x + info.offset.x),
                  y: Math.max(0, windowPosition.y + info.offset.y),
                });
              }}
              whileDrag={windowState === "popup" ? {
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                zIndex: zIndex + 10,
              } : {}}
              layout={windowState !== "popup"}
            >
              {/* Windows-style Title Bar */}
              {showControls && windowState !== "minimized" && (
                <motion.div
                  className={cn(
                    "flex items-center justify-between px-4 py-3",
                    "border-b border-gray-200/50 dark:border-gray-700/50",
                    "bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50",
                    "backdrop-blur-sm",
                    isDragging && "cursor-grabbing",
                  )}
                  style={{
                    cursor: windowState === "popup" && !isDragging ? "grab" : "default",
                  }}
                >
                  {/* Window Icon & Title */}
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                      {title}
                    </h3>
                  </div>

                  {/* Windows-style Control Buttons */}
                  <div className="flex items-center space-x-1">
                    {/* Minimize Button */}
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleMinimize}
                      className="w-12 h-8 rounded-sm flex items-center justify-center transition-colors hover:bg-gray-200/50 dark:hover:bg-gray-600/50"
                      title="Minimize"
                    >
                      <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </motion.button>

                    {/* Maximize/Restore Button */}
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleMaximize}
                      className="w-12 h-8 rounded-sm flex items-center justify-center transition-colors hover:bg-gray-200/50 dark:hover:bg-gray-600/50"
                      title={windowState === "fullscreen" ? "Restore Down" : "Maximize"}
                    >
                      {windowState === "fullscreen" ? (
                        <Square className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                      ) : (
                        <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      )}
                    </motion.button>

                    {/* Close Button */}
                    <motion.button
                      whileHover={{ backgroundColor: "#e81123", color: "white" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="w-12 h-8 rounded-sm flex items-center justify-center transition-colors hover:bg-red-600"
                      title="Close"
                    >
                      <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Minimized State */}
              {windowState === "minimized" && (
                <motion.div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer"
                  onClick={handleRestore}
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded bg-gradient-to-r from-blue-500 to-purple-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {title}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Window Content */}
              {windowState !== "minimized" && (
                <motion.div
                  className="flex-1 overflow-auto bg-white/50 dark:bg-gray-900/50"
                  style={{
                    height: showControls ? "calc(100% - 56px)" : "100%",
                    scrollBehavior: "smooth",
                  }}
                >
                  <div className="min-h-full w-full p-6">{children}</div>
                </motion.div>
              )}

              {/* Resize Handles for popup mode */}
              {windowState === "popup" && resizable && showControls && (
                <>
                  {/* Bottom-right corner resize handle */}
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity"
                    style={{
                      background: "linear-gradient(-45deg, transparent 40%, #666 40%, #666 60%, transparent 60%)",
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setIsResizing(true);
                      
                      const startSize = { ...windowSize };
                      const startPos = { x: e.clientX, y: e.clientY };
                      
                      const handleMouseMove = (e: MouseEvent) => {
                        const deltaX = e.clientX - startPos.x;
                        const deltaY = e.clientY - startPos.y;
                        
                        setWindowSize({
                          width: Math.max(400, Math.min(viewportSize.width - 40, startSize.width + deltaX)),
                          height: Math.max(300, Math.min(viewportSize.height - 40, startSize.height + deltaY)),
                        });
                      };
                      
                      const handleMouseUp = () => {
                        setIsResizing(false);
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  />
                </>
              )}

              {/* Windows-style status indicator */}
              {windowState === "popup" && isDragging && (
                <motion.div
                  className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 bg-black/80 text-white rounded backdrop-blur-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  Moving Window
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  },
);

FolderWindow.displayName = "FolderWindow";

export default FolderWindow;
