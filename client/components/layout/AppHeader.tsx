import React from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Globe,
  LogOut,
  RefreshCw,
  Menu,
  X,
  Activity,
} from "lucide-react";
import { useApp, useTranslation } from "@/contexts/AppContext";
import { User } from "@shared/travel-types";
import { cn } from "@/lib/utils";
import { usePerformanceMonitor } from "@/components/PerformanceMonitor";

interface AppHeaderProps {
  user: User;
  onLogout: () => void;
  onRefresh: () => void;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export default function AppHeader({
  user,
  onLogout,
  onRefresh,
  isMobileMenuOpen = false,
  onToggleMobileMenu,
}: AppHeaderProps) {
  const { theme, toggleTheme, language, toggleLanguage, isMobile } = useApp();
  const { t } = useTranslation();
  const { showMonitor, PerformanceDashboard } = usePerformanceMonitor();

  // Get font class based on language
  const fontClass = language === 'bn' ? 'font-bengali' : 'font-english';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border-b border-white/20 dark:border-gray-700/30 ${fontClass}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AM</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Air-Musafir
            </span>
          </motion.div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* User Info */}
            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20 dark:border-gray-700/30">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{user.name}</span> -{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {user.role === "owner" ? t("owner") : t("manager")}
                </span>
              </p>
            </div>

            {/* Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="p-2 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-lg border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors"
              title={
                language === "bn"
                  ? "Switch to English"
                  : "বাংলায় পরিবর্তন করুন"
              }
            >
              <Globe className="w-5 h-5" />
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-lg border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors"
              title={theme === "dark" ? t("lightMode") : t("darkMode")}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            {/* Performance Monitor Button (only in development) */}
            {process.env.NODE_ENV === "development" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={showMonitor}
                className="p-2 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-lg border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors"
                title="Performance Monitor"
              >
                <Activity className="w-5 h-5" />
              </motion.button>
            )}

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              className="p-2 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-lg border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="p-2 bg-red-500/20 dark:bg-red-900/30 backdrop-blur-md rounded-lg border border-red-400/30 dark:border-red-700/30 text-red-600 dark:text-red-400 hover:bg-red-500/30 dark:hover:bg-red-900/50 transition-colors"
              title={t("logout")}
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          {isMobile && onToggleMobileMenu && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleMobileMenu}
              className="p-2 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-lg border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/20 dark:border-gray-700/30 py-4"
          >
            <div className="space-y-3">
              {/* User Info */}
              <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-lg p-3 border border-white/20 dark:border-gray-700/30">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{user.name}</span> -{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    {user.role === "owner" ? t("owner") : t("manager")}
                  </span>
                </p>
              </div>

              {/* Mobile Controls */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleLanguage}
                  className="p-3 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-lg border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm">
                    {language === "bn" ? t("english") : t("bengali")}
                  </span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="p-3 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-lg border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-center space-x-2"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                  <span className="text-sm">
                    {theme === "dark" ? t("lightMode") : t("darkMode")}
                  </span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onRefresh}
                  className="p-3 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-lg border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span className="text-sm">Refresh</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogout}
                  className="p-3 bg-red-500/20 dark:bg-red-900/30 backdrop-blur-md rounded-lg border border-red-400/30 dark:border-red-700/30 text-red-600 dark:text-red-400 hover:bg-red-500/30 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">{t("logout")}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Performance Monitor */}
      <PerformanceDashboard />
    </motion.header>
  );
}
