import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/AppContext";

export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onItemClick: (path: string) => void;
  className?: string;
}

export default function Breadcrumbs({ items, onItemClick, className }: BreadcrumbsProps) {
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  if (items.length === 0) return null;

  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex items-center space-x-2 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20",
        className
      )}
    >
      {/* Home Icon */}
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onItemClick("/")}
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      >
        <Home className="w-4 h-4 text-white" />
      </motion.button>

      {items.map((item, index) => (
        <motion.div
          key={item.path}
          variants={itemVariants}
          className="flex items-center space-x-2"
        >
          {/* Separator */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <ChevronRight className="w-4 h-4 text-white/50" />
          </motion.div>

          {/* Breadcrumb Item */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onItemClick(item.path)}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              item.isActive
                ? "bg-gradient-to-r from-folder-primary to-folder-secondary text-white shadow-glow"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
            disabled={item.isActive}
          >
            {item.label}
          </motion.button>
        </motion.div>
      ))}
    </motion.nav>
  );
}
