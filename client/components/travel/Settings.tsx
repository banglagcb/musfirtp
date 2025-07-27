import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Database,
  Download,
  Upload,
  Trash2,
  Save,
  AlertTriangle,
  CheckCircle,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  Key,
  Lock,
  Palette,
  Globe,
  Clock,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  FileText,
  Printer,
  Bell,
  Archive,
  HardDrive,
  Calendar,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import dataService from "@/services/dataService";
import { cn } from "@/lib/utils";

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    // General Settings
    currency: "BDT",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12",
    language: "bn",
    notifications: true,
    autoBackup: false,
    darkMode: true,
    soundEffects: true,
    autoSave: true,
    
    // Company Information
    companyName: "এয়ার মুসাফির টিকেট ম্যানেজমেন্ট সিস্টেম",
    companyAddress: "ঢাকা, বাংলাদেশ",
    companyPhone: "01XXXXXXXXX",
    companyEmail: "info@airmusafir.com",
    companyWebsite: "www.airmusafir.com",
    companyLogo: "",
    tradeLicense: "",
    taxNumber: "",
    
    // Security Settings
    sessionTimeout: "30",
    passwordExpiry: "90",
    twoFactorAuth: false,
    loginAttempts: "5",
    
    // Printing & Export
    defaultPrintFormat: "A4",
    includeCompanyLogo: true,
    watermark: false,
    
    // System Settings
    dataRetention: "365",
    backupFrequency: "weekly",
    emailNotifications: true,
    smsNotifications: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const tabs = [
    { id: "general", label: "সাধারণ", icon: SettingsIcon },
    { id: "company", label: "কোম্পানি তথ্য", icon: Building },
    { id: "security", label: "নিরাপত্তা", icon: Shield },
    { id: "printing", label: "প্রিন্টিং ও এক্সপোর্ট", icon: Printer },
    { id: "notifications", label: "নোটিফিকেশন", icon: Bell },
    { id: "data", label: "ডেটা ম্যানেজমেন্ট", icon: Database },
  ];

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("app_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save settings to localStorage
      localStorage.setItem("app_settings", JSON.stringify(settings));
      
      // Apply dark mode setting immediately
      if (settings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      toast({
        title: "সফল!",
        description: "সেটিংস সফলভাবে সংরক্ষিত হয়েছে",
      });
    } catch (error) {
      toast({
        title: "ত্রুটি!",
        description: "সেটিংস সংরক্ষণে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "ত্রুটি!",
        description: "নতুন পাসওয়ার্ড ও নিশ্চিতকরণ পাসওয়ার্ড মিলছে না",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "ত্রুটি!",
        description: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, this would be an API call
      localStorage.setItem("user_password", newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast({
        title: "সফল!",
        description: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে",
      });
    } catch (error) {
      toast({
        title: "ত্রুটি!",
        description: "পাসওয়ার্ড পরিবর্তনে সমস্যা হয়েছে",
        variant: "destructive",
      });
    }
  };

  const handleResetSettings = () => {
    if (confirm("আপনি কি নিশ্চিত যে সব সেটিংস রিসেট করতে চান?")) {
      localStorage.removeItem("app_settings");
      window.location.reload();
    }
  };

  const handleExportData = () => {
    try {
      const bookings = dataService.getBookings();
      const dataBlob = new Blob([JSON.stringify(bookings, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `air_musafir_backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "সফল!",
        description: "ডেটা সফলভাবে এক্সপোর্ট করা হয়েছে",
      });
    } catch (error) {
      toast({
        title: "ত্রুটি!",
        description: "ডেটা এক্সপোর্ট করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          // Clear existing data and import new data
          localStorage.removeItem("travel_bookings");
          importedData.forEach((booking) => {
            dataService.addBooking(booking);
          });

          toast({
            title: "সফল!",
            description: `${importedData.length}টি বুকিং সফলভাবে ইমপোর্ট করা হয়েছে`,
          });
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        toast({
          title: "ত্রুটি!",
          description: "ফাইলটি সঠিক ফরম্যাটে নেই",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (
      confirm(
        "আপনি কি নিশ্চিত যে সব ডেটা মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।",
      )
    ) {
      try {
        localStorage.removeItem("travel_bookings");
        toast({
          title: "সফল!",
          description: "সব ডেটা সফল���াবে মুছে ফেলা হয়েছে",
        });
      } catch (error) {
        toast({
          title: "ত্রুটি!",
          description: "ডেটা মুছতে সমস্যা হয়েছে",
          variant: "destructive",
        });
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>মুদ্রা</span>
                  </Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) =>
                      handleSettingChange("currency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BDT">টাকা (BDT)</SelectItem>
                      <SelectItem value="USD">ডলার (USD)</SelectItem>
                      <SelectItem value="EUR">ইউরো (EUR)</SelectItem>
                      <SelectItem value="INR">রুপি (INR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center space-x-2">
                    <Languages className="w-4 h-4" />
                    <span>ভাষা</span>
                  </Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) =>
                      handleSettingChange("language", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bn">বাংলা</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>তারিখ ফরম্যাট</span>
                  </Label>
                  <Select
                    value={settings.dateFormat}
                    onValueChange={(value) =>
                      handleSettingChange("dateFormat", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>সময় ফরম্যাট</span>
                  </Label>
                  <Select
                    value={settings.timeFormat}
                    onValueChange={(value) =>
                      handleSettingChange("timeFormat", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">১২ ঘন্টা</SelectItem>
                      <SelectItem value="24">২৪ ঘন্টা</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>ইন্টারফেস সেটিংস</span>
                </h4>
                
                <div className="flex items-center justify-between">
                  <Label>ডার্ক মোড</Label>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) =>
                      handleSettingChange("darkMode", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>অটো সেভ</Label>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) =>
                      handleSettingChange("autoSave", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>সাউন্ড ইফেক্ট</Label>
                  <Switch
                    checked={settings.soundEffects}
                    onCheckedChange={(checked) =>
                      handleSettingChange("soundEffects", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "company":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>কোম্পানির নাম</span>
                </Label>
                <Input
                  value={settings.companyName}
                  onChange={(e) =>
                    handleSettingChange("companyName", e.target.value)
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>ঠিকানা</span>
                </Label>
                <Textarea
                  value={settings.companyAddress}
                  onChange={(e) =>
                    handleSettingChange("companyAddress", e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div>
                <Label className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>ফোন নম্বর</span>
                </Label>
                <Input
                  value={settings.companyPhone}
                  onChange={(e) =>
                    handleSettingChange("companyPhone", e.target.value)
                  }
                />
              </div>

              <div>
                <Label className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>ইমেইল</span>
                </Label>
                <Input
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) =>
                    handleSettingChange("companyEmail", e.target.value)
                  }
                />
              </div>

              <div>
                <Label className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>ওয়েবসাইট</span>
                </Label>
                <Input
                  value={settings.companyWebsite}
                  onChange={(e) =>
                    handleSettingChange("companyWebsite", e.target.value)
                  }
                />
              </div>

              <div>
                <Label className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>ট্রেড লাইসেন্স</span>
                </Label>
                <Input
                  value={settings.tradeLicense}
                  onChange={(e) =>
                    handleSettingChange("tradeLicense", e.target.value)
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label>কোম্পানি লোগো URL</Label>
                <Input
                  value={settings.companyLogo}
                  onChange={(e) =>
                    handleSettingChange("companyLogo", e.target.value)
                  }
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                  নিরাপত্তা সতর্কতা
                </h4>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                আপনার ডেটার নিরাপত্তার জন্য নিয়মিত ব্যাকআপ নিন এবং শক্তিশালী
                পাসওয়ার্ড ব্যবহার করুন।
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4 flex items-center space-x-2">
                  <Key className="w-4 h-4" />
                  <span>পাসওয়ার্ড পরিবর্তন</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <Label>বর্তমান পাসওয়ার্ড</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>নতুন পাসওয়ার্ড</Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>নিশ্চিতকরণ পাসওয়ার্ড</Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  <Button onClick={handlePasswordChange} className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    পাসওয়ার্ড পরিবর্তন করুন
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">নিরাপত্তা সেটিংস</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>সেশন টাইমআউট (মিনিট)</Label>
                      <Select
                        value={settings.sessionTimeout}
                        onValueChange={(value) =>
                          handleSettingChange("sessionTimeout", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">১৫ মিনিট</SelectItem>
                          <SelectItem value="30">৩০ মিনিট</SelectItem>
                          <SelectItem value="60">১ ঘন্টা</SelectItem>
                          <SelectItem value="120">২ ঘন্টা</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>লগইন প্রচেষ্টার সীমা</Label>
                      <Select
                        value={settings.loginAttempts}
                        onValueChange={(value) =>
                          handleSettingChange("loginAttempts", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">৩ বার</SelectItem>
                          <SelectItem value="5">৫ বার</SelectItem>
                          <SelectItem value="10">১০ বার</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>টু-ফ্যাক্টর অথেন্টিকেশন</Label>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        handleSettingChange("twoFactorAuth", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "printing":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Printer className="w-4 h-4" />
                <span>প্রিন্টিং সেটিংস</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>ডিফল্ট প্রিন্ট ফরম্যাট</Label>
                  <Select
                    value={settings.defaultPrintFormat}
                    onValueChange={(value) =>
                      handleSettingChange("defaultPrintFormat", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4</SelectItem>
                      <SelectItem value="A5">A5</SelectItem>
                      <SelectItem value="Letter">Letter</SelectItem>
                      <SelectItem value="Thermal">Thermal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>কোম্পানি লোগো অন্তর্ভুক্ত করুন</Label>
                  <Switch
                    checked={settings.includeCompanyLogo}
                    onCheckedChange={(checked) =>
                      handleSettingChange("includeCompanyLogo", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>ওয়াটারমার্ক</Label>
                  <Switch
                    checked={settings.watermark}
                    onCheckedChange={(checked) =>
                      handleSettingChange("watermark", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>নোটিফিকেশন সেটিংস</span>
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>সিস্টেম নোটিফিকেশন</Label>
                    <p className="text-sm text-gray-500">সাধারণ সিস্টেম আপডেট ও সতর্কতা</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("notifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>ইমেইল নোটিফিকেশন</Label>
                    <p className="text-sm text-gray-500">গুরুত্বপূর্ণ আপডেটের জন্য ইমেইল</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("emailNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS নোটিফিকেশন</Label>
                    <p className="text-sm text-gray-500">জরুরি সতর্কতার জন্য SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("smsNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>অটো ব্যাকআপ</Label>
                    <p className="text-sm text-gray-500">স্বয়ংক্রিয় ডেটা ব্যাকআপ</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) =>
                      handleSettingChange("autoBackup", checked)
                    }
                  />
                </div>
              </div>

              {settings.autoBackup && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <Label>ব্যাকআপের ফ্রিকোয়েন্সি</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) =>
                      handleSettingChange("backupFrequency", value)
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">প্রতিদিন</SelectItem>
                      <SelectItem value="weekly">সাপ্তাহিক</SelectItem>
                      <SelectItem value="monthly">মাসিক</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        );

      case "data":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>ডেটা ব্যাকআপ</span>
                </h4>
                <Button
                  onClick={handleExportData}
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  সব ডেটা এক্সপোর্ট করুন
                </Button>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>ডেটা ইমপোর্ট</span>
                </h4>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-file"
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    document.getElementById("import-file")?.click()
                  }
                  className="w-full justify-start"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  ডেটা ইমপোর্ট করুন
                </Button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  <HardDrive className="w-4 h-4" />
                  <span>ডেটা পরিচালনা</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <Label>ডেটা ধরে রাখার সময় (দিন)</Label>
                    <Select
                      value={settings.dataRetention}
                      onValueChange={(value) =>
                        handleSettingChange("dataRetention", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">৯০ দিন</SelectItem>
                        <SelectItem value="180">১৮০ দিন</SelectItem>
                        <SelectItem value="365">১ বছর</SelectItem>
                        <SelectItem value="730">২ বছর</SelectItem>
                        <SelectItem value="-1">স্থায়ী</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2 text-red-600 flex items-center space-x-2">
                  <Trash2 className="w-4 h-4" />
                  <span>বিপজ্জনক কাজ</span>
                </h4>
                <div className="space-y-3">
                  <Button
                    variant="destructive"
                    onClick={handleClearData}
                    className="w-full justify-start"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    সব ডেটা মুছে ফেলুন
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleResetSettings}
                    className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    সেটিংস রিসেট করুন
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              সেটিংস
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              সিস্টেম কনফিগারেশন ও পছন্দসমূহ
            </p>
          </div>
        </div>

        <Button variant="outline" onClick={onClose}>
          <X className="w-4 h-4 mr-2" />
          বন্ধ
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                    activeTab === tab.id
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            {renderTabContent()}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                সংরক্ষণ করুন
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
