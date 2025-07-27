import { motion } from "framer-motion";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface WindowProps {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  width?: number;
  height?: number;
}

export default function Window({
  children,
  title,
  isOpen,
  onClose,
  className,
  width = 800,
  height = 600,
}: WindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen) return null;

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <>
      {/* Simple backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 shadow-xl z-50",
          isMaximized
            ? "inset-0 rounded-none"
            : "top-20 left-1/4 -translate-x-1/2",
          className,
        )}
        style={
          !isMaximized ? { width: `${width}px`, height: `${height}px` } : {}
        }
      >
        {/* Window Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
            {title}
          </h3>

          <div className="flex items-center space-x-2">
            {/* Maximize Button */}
            <button
              onClick={handleMaximize}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
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
              className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded"
              title="Close"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-auto h-full">
          <div
            className="h-full"
            style={{
              height: isMaximized ? "calc(100vh - 60px)" : `${height - 60}px`,
            }}
          >
            {children}
          </div>
        </div>
      </motion.div>
    </>
  );
}
