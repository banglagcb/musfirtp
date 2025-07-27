import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, User, Lock, CheckCircle, XCircle, Loader2, Plane, Sun, Moon, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import dataService from "@/services/dataService";
import { User as UserType } from "@shared/travel-types";
import { useApp, useTranslation } from "@/contexts/AppContext";

interface TravelLoginFormProps {
  onLoginSuccess: (user: UserType) => void;
}

export default function TravelLoginForm({ onLoginSuccess }: TravelLoginFormProps) {
  const { theme, toggleTheme, language, toggleLanguage, isMobile } = useApp();
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Real-time username validation
  useEffect(() => {
    if (username === "") {
      setUsernameValid(null);
    } else {
      setUsernameValid(username.length >= 3);
    }
  }, [username]);

  // Real-time password validation
  useEffect(() => {
    if (password === "") {
      setPasswordValid(null);
    } else {
      setPasswordValid(password.length >= 6);
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameValid || !passwordValid) return;

    setIsLoading(true);
    setError("");
    
    // Simulate login API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = dataService.validateUser(username, password);
    
    if (user) {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Trigger success animation then transition to dashboard
      setTimeout(() => {
        onLoginSuccess(user);
      }, 1000);
    } else {
      setIsLoading(false);
      setError("ভুল ইউজারনেম বা পাসওয়ার্ড");
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center justify-center space-y-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-white"
        >
          সফলভাবে লগইন হয়েছে!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/70"
        >
          ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md mx-auto relative"
    >
      {/* Theme and Language Controls */}
      <div className="absolute -top-4 right-0 flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleLanguage}
          className={cn(
            "p-2 backdrop-blur-md rounded-full border transition-colors",
            theme === 'dark'
              ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
              : "bg-white/20 border-gray-300/50 text-gray-700 hover:bg-white/40"
          )}
          title={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
        >
          <Globe className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className={cn(
            "p-2 backdrop-blur-md rounded-full border transition-colors",
            theme === 'dark'
              ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
              : "bg-white/20 border-gray-300/50 text-gray-700 hover:bg-white/40"
          )}
          title={theme === 'dark' ? t('lightMode') : t('darkMode')}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Header with travel theme */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-r from-folder-primary to-folder-secondary rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Plane className="w-10 h-10 text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "text-4xl font-bold mb-2",
            theme === 'dark' ? "text-white" : "text-gray-800"
          )}
        >
          Air-Musafir
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "text-2xl font-semibold mb-2",
            theme === 'dark' ? "text-white/90" : "text-gray-700"
          )}
        >
          {language === 'bn' ? 'ট্রাভেল ম্যানেজমেন্ট সিস্টেম' : 'Travel Management System'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={cn(
            theme === 'dark' ? "text-white/70" : "text-gray-600"
          )}
        >
          {language === 'bn' ? 'আপনার লগইন তথ্য প্রবেশ করান' : 'Enter your login credentials'}
        </motion.p>
      </div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Username Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-white/50" />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ইউজারনেম"
            className={cn(
              "w-full pl-10 pr-12 py-4 bg-white/10 backdrop-blur-md border rounded-xl",
              "text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300",
              usernameValid === null && "border-white/20 focus:ring-folder-primary/50",
              usernameValid === true && "border-neon-green focus:ring-neon-green/50",
              usernameValid === false && "border-red-400 focus:ring-red-400/50"
            )}
          />
          <AnimatePresence>
            {username && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {usernameValid ? (
                  <CheckCircle className="h-5 w-5 text-neon-green" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Password Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-white/50" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="পাসওয়ার্ড"
            className={cn(
              "w-full pl-10 pr-20 py-4 bg-white/10 backdrop-blur-md border rounded-xl",
              "text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300",
              passwordValid === null && "border-white/20 focus:ring-folder-primary/50",
              passwordValid === true && "border-neon-green focus:ring-neon-green/50",
              passwordValid === false && "border-red-400 focus:ring-red-400/50"
            )}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
            <AnimatePresence>
              {password && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  {passwordValid ? (
                    <CheckCircle className="h-5 w-5 text-neon-green" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-white/50 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-red-500/20 border border-red-400/50 rounded-lg"
            >
              <p className="text-red-200 text-sm text-center">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!usernameValid || !passwordValid || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full py-4 rounded-xl font-semibold text-white transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-folder-primary",
            usernameValid && passwordValid
              ? "bg-gradient-to-r from-folder-primary to-folder-secondary hover:from-folder-secondary hover:to-folder-accent shadow-glow"
              : "bg-white/20 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>লগ���ন হচ্ছে...</span>
            </div>
          ) : (
            "লগইন করুন"
          )}
        </motion.button>
      </motion.form>

      {/* Demo Credentials */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
      >
        <p className="text-sm text-white/60 mb-2">ডেমো লগ��ন তথ্য:</p>
        <div className="grid grid-cols-1 gap-2">
          <div>
            <p className="text-sm text-white/80"><strong>মালিক:</strong> admin / admin123</p>
          </div>
          <div>
            <p className="text-sm text-white/80"><strong>ম্যানেজার:</strong> manager / manager123</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
