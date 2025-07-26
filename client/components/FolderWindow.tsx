import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Square, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode, useState, useEffect } from "react";

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
}

export default function FolderWindow({
  children,
  title,
  isOpen,
  onClose,
  initialState = "popup",
  className,
  showControls = true,
  zIndex = 50
}: FolderWindowProps) {
  const [windowState, setWindowState] = useState<WindowState>(initialState);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleMaximize = () => {
    setWindowState(windowState === "fullscreen" ? "popup" : "fullscreen");
  };

  const handleMinimize = () => {
    setWindowState("minimized");
  };

  const handleRestore = () => {
    setWindowState("popup");
  };

  // Enhanced animation variants with center origin
  const backdropVariants = {
    hidden: { 
      opacity: 0,
      backdropFilter: "blur(0px)"
    },
    visible: { 
      opacity: 1,
      backdropFilter: "blur(8px)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      backdropFilter: "blur(0px)",
      transition: {
        duration: 0.2
      }
    }
  };

  const windowVariants = {
    popup: {
      scale: 1,
      x: "-50%",
      y: "-50%",
      width: "min(90vw, 800px)",
      height: "min(85vh, 600px)",
      borderRadius: "20px",
      left: "50%",
      top: "50%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8
      }
    },
    fullscreen: {
      scale: 1,
      x: 0,
      y: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: "0px",
      left: 0,
      top: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8
      }
    },
    minimized: {
      scale: 0.05,
      x: "-50%",
      y: "400px",
      width: "min(90vw, 800px)",
      height: "min(85vh, 600px)",
      borderRadius: "20px",
      left: "50%",
      top: "50%",
      opacity: 0.3,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 35,
        mass: 0.6
      }
    }
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      y: 100,
      filter: "blur(20px)",
      rotateX: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.8,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -50,
      filter: "blur(10px)",
      rotateX: -10,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence onExitComplete={() => setIsVisible(false)}>
      {isOpen && (
        <>
          {/* Enhanced Backdrop */}
          {windowState !== "fullscreen" && windowState !== "minimized" && (
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/30"
              style={{ zIndex: zIndex - 1 }}
              onClick={() => windowState === "popup" && onClose()}
            />
          )}

          {/* Enhanced Window */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed bg-gradient-to-br from-folder-popup/98 to-folder-popup/95 backdrop-blur-xl",
              "border border-white/30 shadow-2xl shadow-black/50",
              windowState === "minimized" && "pointer-events-none",
              "overflow-hidden",
              className
            )}
            style={{ 
              zIndex,
              transformOrigin: "center center"
            }}
            drag={windowState === "popup" && showControls}
            dragMomentum={false}
            dragElastic={0.1}
            dragConstraints={{
              left: -window.innerWidth/2 + 100,
              right: window.innerWidth/2 - 100,
              top: -window.innerHeight/2 + 100,
              bottom: window.innerHeight/2 - 100
            }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            whileDrag={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)"
            }}
          >
            <motion.div
              variants={windowVariants}
              animate={windowState}
              className="w-full h-full flex flex-col"
              style={{
                minHeight: windowState === "popup" ? "400px" : "100%",
                maxHeight: windowState === "popup" ? "90vh" : "100%"
              }}
            >
              {/* Enhanced Window Header */}
              {showControls && (
                <motion.div
                  variants={contentVariants}
                  className={cn(
                    "flex items-center justify-between p-4 lg:p-6 border-b border-white/20",
                    "bg-gradient-to-r from-folder-primary/15 to-folder-secondary/15",
                    isDragging && "cursor-grabbing",
                    "backdrop-blur-sm"
                  )}
                  style={{ cursor: windowState === "popup" ? "grab" : "default" }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-folder-primary to-folder-secondary opacity-80" />
                    <h3 className="text-lg lg:text-xl font-semibold text-foreground truncate max-w-xs lg:max-w-md">
                      {title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Enhanced Minimize Button */}
                    <motion.button
                      whileHover={{ 
                        scale: 1.15, 
                        backgroundColor: "rgba(255, 193, 7, 0.25)",
                        rotate: 180
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={windowState === "minimized" ? handleRestore : handleMinimize}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-yellow-500/80 flex items-center justify-center hover:bg-yellow-500 transition-all duration-200 shadow-lg"
                    >
                      <Minus className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                    </motion.button>

                    {/* Enhanced Maximize/Restore Button */}
                    <motion.button
                      whileHover={{ 
                        scale: 1.15, 
                        backgroundColor: "rgba(40, 167, 69, 0.25)",
                        rotate: windowState === "fullscreen" ? -180 : 180
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleMaximize}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-green-500/80 flex items-center justify-center hover:bg-green-500 transition-all duration-200 shadow-lg"
                    >
                      {windowState === "fullscreen" ? (
                        <Minimize2 className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                      ) : (
                        <Maximize2 className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                      )}
                    </motion.button>

                    {/* Enhanced Close Button */}
                    <motion.button
                      whileHover={{ 
                        scale: 1.15, 
                        backgroundColor: "rgba(220, 53, 69, 0.25)",
                        rotate: 90
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-all duration-200 shadow-lg"
                    >
                      <X className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Window Content */}
              <motion.div 
                variants={contentVariants}
                className="flex-1 overflow-auto"
                style={{
                  scrollBehavior: "smooth",
                  scrollbarWidth: "thin"
                }}
              >
                <div className="min-h-full">
                  {children}
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-inherit bg-gradient-to-r from-folder-primary/10 via-transparent to-folder-secondary/10 opacity-0 pointer-events-none"
              animate={{
                opacity: windowState === "popup" ? [0, 0.5, 0] : 0
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Resize Handles for popup mode */}
            {windowState === "popup" && showControls && (
              <>
                {/* Corner resize handles */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-white/20 rounded-tl-lg cursor-se-resize opacity-0 hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-white/20 rounded-tr-lg cursor-sw-resize opacity-0 hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 right-0 w-4 h-4 bg-white/20 rounded-bl-lg cursor-ne-resize opacity-0 hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 left-0 w-4 h-4 bg-white/20 rounded-br-lg cursor-nw-resize opacity-0 hover:opacity-100 transition-opacity" />
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
