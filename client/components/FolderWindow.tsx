import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Square, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

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

  const handleMaximize = () => {
    setWindowState(windowState === "fullscreen" ? "popup" : "fullscreen");
  };

  const handleMinimize = () => {
    setWindowState("minimized");
  };

  const variants = {
    popup: {
      scale: 1,
      x: 0,
      y: 0,
      width: "auto",
      height: "auto",
      borderRadius: "20px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    fullscreen: {
      scale: 1,
      x: 0,
      y: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: "0px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    minimized: {
      scale: 0.1,
      y: 500,
      opacity: 0.3,
      transition: {
        duration: 0.3
      }
    }
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      filter: "blur(10px)"
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
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      filter: "blur(10px)",
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          {windowState !== "fullscreen" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              style={{ zIndex: zIndex - 1 }}
              onClick={() => windowState === "popup" && onClose()}
            />
          )}

          {/* Window */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed bg-gradient-to-br from-folder-popup/95 to-folder-popup/90 backdrop-blur-xl",
              "border border-white/20 shadow-folder",
              windowState === "fullscreen" ? "inset-0" : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              windowState === "minimized" && "pointer-events-none",
              className
            )}
            style={{ 
              zIndex,
              maxWidth: windowState === "popup" ? "90vw" : "100vw",
              maxHeight: windowState === "popup" ? "90vh" : "100vh"
            }}
            drag={windowState === "popup" && showControls}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            whileDrag={{ scale: 1.02 }}
          >
            <motion.div
              variants={variants}
              animate={windowState}
              className="w-full h-full flex flex-col overflow-hidden"
            >
              {/* Window Header */}
              {showControls && (
                <motion.div
                  className={cn(
                    "flex items-center justify-between p-4 border-b border-white/10",
                    "bg-gradient-to-r from-folder-primary/10 to-folder-secondary/10",
                    isDragging && "cursor-grabbing"
                  )}
                  style={{ cursor: windowState === "popup" ? "grab" : "default" }}
                >
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {title}
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    {/* Minimize */}
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 193, 7, 0.2)" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleMinimize}
                      className="w-6 h-6 rounded-full bg-yellow-500/80 flex items-center justify-center hover:bg-yellow-500 transition-colors"
                    >
                      <Minus className="w-3 h-3 text-white" />
                    </motion.button>

                    {/* Maximize/Restore */}
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(40, 167, 69, 0.2)" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleMaximize}
                      className="w-6 h-6 rounded-full bg-green-500/80 flex items-center justify-center hover:bg-green-500 transition-colors"
                    >
                      {windowState === "fullscreen" ? (
                        <Minimize2 className="w-3 h-3 text-white" />
                      ) : (
                        <Maximize2 className="w-3 h-3 text-white" />
                      )}
                    </motion.button>

                    {/* Close */}
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(220, 53, 69, 0.2)" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Window Content */}
              <div className="flex-1 overflow-auto">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
