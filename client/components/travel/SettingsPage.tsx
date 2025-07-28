import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings,
  User,
  Plane,
  MapPin,
  Download,
  Upload,
  Trash2,
  Plus,
  X,
  Save,
  Shield,
  Database,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { User as UserType, AIRLINES, ROUTES } from "@shared/travel-types";
import dataService from "@/services/dataService";
import { useTranslation } from "@/contexts/AppContext";

interface SettingsPageProps {
  user: UserType;
  onClose: () => void;
}

export default function SettingsPage({ user, onClose }: SettingsPageProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'users' | 'airlines' | 'routes' | 'data'>('users');
  const [newAirline, setNewAirline] = useState("");
  const [newRoute, setNewRoute] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDataBackup = () => {
    try {
      const bookings = dataService.getBookings();
      const users = dataService.getUsers();
      
      const backupData = {
        bookings,
        users: users.map(u => ({ ...u, password: '***' })), // Don't backup passwords
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `air-musafir-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      showMessage('ডেটা সফলভাবে ব্যাকআপ হয়েছে', 'success');
    } catch (error) {
      showMessage('ব্যাকআপ তৈরিতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleDataClear = () => {
    const confirmed = window.confirm(
      'আপনি কি নিশ্চিত যে সমস্ত ডেটা মুছে ফেলতে চান?\n\n' +
      'এটি মুছে ফেলবে:\n' +
      '• সব বুকিং ও কাস্টমার তথ্য\n' +
      '• সব ব্যালেন্স, প্রফিট ও রেভিনিউ\n' +
      '• সব হিস্টরি ও রেকর্ড\n' +
      '• সব সেটিংস ও কনফিগারেশন\n\n' +
      'এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না!'
    );

    if (confirmed) {
      const doubleConfirm = window.confirm(
        'শেষ নিশ্চিতকরণ: আপনি কি সত্যিই সব কিছু রিসেট করতে চান?\n\n' +
        'এটি সম্পূর্ণ নতুন অবস্থায় ফিরিয়ে নিয়ে ��াবে।'
      );

      if (doubleConfirm) {
        try {
          showMessage('সব ডেটা মুছে ফেলা হচ্ছে...', 'success');

          // Use the enhanced reset function
          setTimeout(() => {
            dataService.resetToFreshState();
          }, 1000);

        } catch (error) {
          showMessage('ডেটা মুছতে সমস্যা হয়েছে', 'error');
        }
      }
    }
  };

  const tabs = [
    { id: 'users' as const, label: 'ইউজার ম্যানেজমেন্ট', icon: Users },
    { id: 'airlines' as const, label: 'এয়ারলাইন', icon: Plane },
    { id: 'routes' as const, label: 'রুট', icon: MapPin },
    { id: 'data' as const, label: 'ডেটা ম্যানেজমেন্ট', icon: Database }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-folder-primary to-folder-secondary rounded-full flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">সেটিংস</h1>
            <p className="text-white/70">সিস্টেম কনফিগারেশন ও ম্যানেজমেন্ট</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </motion.div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            "mb-6 p-4 rounded-lg border",
            message.type === 'success' 
              ? "bg-green-500/20 border-green-400/50 text-green-200"
              : "bg-red-500/20 border-red-400/50 text-red-200"
          )}
        >
          {message.text}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <h2 className="text-lg font-semibold text-white mb-4">মেনু</h2>
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-folder-primary to-folder-secondary text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            
            {/* User Management Tab */}
            {activeTab === 'users' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>ইউজার ম্যানেজমেন্ট</span>
                </h3>

                {user.role === 'owner' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dataService.getUsers().map((u) => (
                        <div key={u.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-folder-primary to-folder-secondary rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{u.name}</p>
                              <p className="text-white/70 text-sm">
                                {u.role === 'owner' ? t('owner') : t('manager')} | {u.username}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4">
                      <p className="text-blue-200 text-sm">
                        <Shield className="w-4 h-4 inline mr-2" />
                        নতুন ইউজার যোগ করার জন্য ভবিষ্যতে আপডেট আসবে।
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4">
                    <p className="text-yellow-200">
                      <Shield className="w-4 h-4 inline mr-2" />
                      {t('onlyOwnerUserManagement')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Airlines Tab */}
            {activeTab === 'airlines' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                  <Plane className="w-5 h-5" />
                  <span>এয়ারলাইন ম্যানে���মেন্ট</span>
                </h3>

                <div className="space-y-6">
                  {/* Add New Airline */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-lg font-medium text-white mb-3">নতুন এয়ারলাইন যোগ করুন</h4>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newAirline}
                        onChange={(e) => setNewAirline(e.target.value)}
                        placeholder="এয়ারলাইনের নাম"
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-folder-primary/50"
                      />
                      <button
                        onClick={() => {
                          if (newAirline.trim()) {
                            showMessage('নতুন এয়ারলাইন যোগ করার জন্য ভবিষ্যতে আপডেট আসবে', 'success');
                            setNewAirline("");
                          }
                        }}
                        disabled={!newAirline.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>যোগ করুন</span>
                      </button>
                    </div>
                  </div>

                  {/* Current Airlines */}
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">বর্তমান এয়ারলাইনসমূহ</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {AIRLINES.map((airline, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between">
                          <span className="text-white text-sm">{airline}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Routes Tab */}
            {activeTab === 'routes' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>রুট ম্যানেজমেন্ট</span>
                </h3>

                <div className="space-y-6">
                  {/* Add New Route */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-lg font-medium text-white mb-3">নতুন রুট যোগ করুন</h4>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newRoute}
                        onChange={(e) => setNewRoute(e.target.value)}
                        placeholder="রুট (যেমন: ঢাকা - সিডনি)"
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-folder-primary/50"
                      />
                      <button
                        onClick={() => {
                          if (newRoute.trim()) {
                            showMessage('নতুন রুট যোগ করার জন্য ভবিষ্যতে আপডেট আসবে', 'success');
                            setNewRoute("");
                          }
                        }}
                        disabled={!newRoute.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>যোগ করুন</span>
                      </button>
                    </div>
                  </div>

                  {/* Current Routes */}
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">বর্তমান রুটসমূহ</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ROUTES.map((route, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between">
                          <span className="text-white text-sm">{route}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Management Tab */}
            {activeTab === 'data' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>ড���টা ম্যানেজমেন্ট</span>
                </h3>

                <div className="space-y-6">
                  {/* Data Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                      <div className="text-2xl font-bold text-white">{dataService.getBookings().length}</div>
                      <div className="text-white/70 text-sm">মোট বুকিং</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                      <div className="text-2xl font-bold text-white">{dataService.getUsers().length}</div>
                      <div className="text-white/70 text-sm">মোট ইউজার</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                      <div className="text-2xl font-bold text-white">
                        {(JSON.stringify(dataService.getBookings()).length / 1024).toFixed(2)} KB
                      </div>
                      <div className="text-white/70 text-sm">ডেটা সাইজ</div>
                    </div>
                  </div>

                  {/* Data Actions */}
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-lg font-medium text-white mb-3">ডেটা ব্যাকআপ</h4>
                      <p className="text-white/70 text-sm mb-4">
                        আপনার সমস্ত বুকিং ডেটা ব্যাকআপ করুন। এটি একটি JSON ফাইল ডাউনলোড করবে।
                      </p>
                      <button
                        onClick={handleDataBackup}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
                      >
                        <Download className="w-5 h-5" />
                        <span>ব্যাকআপ ডাউনলোড করুন</span>
                      </button>
                    </div>

                    {user.role === 'owner' && (
                      <div className="bg-red-500/10 rounded-lg p-4 border border-red-400/30">
                        <h4 className="text-lg font-medium text-red-200 mb-3">🔄 সম্পূর্ণ রিসেট</h4>
                        <div className="space-y-3 mb-4">
                          <p className="text-red-200/90 text-sm font-medium">
                            ⚠️ সতর্কতা: এই অপারেশনটি সব কিছু মুছে ফেলবে
                          </p>
                          <div className="text-red-200/70 text-xs space-y-1">
                            <div>• সব বুকিং ও কাস্টমার তথ্য</div>
                            <div>• সব ব্যালেন্স, প্রফিট ও রেভিনিউ ডেটা</div>
                            <div>• সব হিস্টরি ও রেকর্ড</div>
                            <div>• সব সেটিংস ও কনফিগারেশন</div>
                            <div>• টিকেট ইনভেন্টরি ও নোটিফিকেশন</div>
                          </div>
                          <p className="text-red-200/80 text-sm font-semibold">
                            🚨 এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না!
                          </p>
                        </div>
                        <button
                          onClick={handleDataClear}
                          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all border-2 border-red-400/50 hover:border-red-300"
                        >
                          <Trash2 className="w-5 h-5" />
                          <span>সম্পূর্ণ রিসেট করুন (নতুন শুরু)</span>
                        </button>
                        <p className="text-red-200/60 text-xs mt-2 text-center">
                          নতুনভাবে শুরু করার জন্য এই বাটন ব্যবহার করুন
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
}
