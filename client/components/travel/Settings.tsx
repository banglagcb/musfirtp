import { useState } from "react";
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
    companyName: "এয়ার মুসাফির টিকেট ম্যানেজমেন্ট সিস্টেম",
    companyAddress: "ঢাকা, বাংলাদেশ",
    companyPhone: "01XXXXXXXXX",
    companyEmail: "info@airmusafir.com",
    currency: "BDT",
    dateFormat: "DD/MM/YYYY",
    notifications: true,
    autoBackup: false,
    darkMode: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: "general", label: "সাধারণ", icon: SettingsIcon },
    { id: "company", label: "কোম্পানি তথ্য", icon: User },
    { id: "security", label: "নিরাপত্তা", icon: Shield },
    { id: "data", label: "ডেটা ম্যানেজমেন্ট", icon: Database },
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save settings to localStorage
      localStorage.setItem("app_settings", JSON.stringify(settings));

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
          description: "সব ডেটা সফলভাবে মুছে ফেলা হয়েছে",
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
              <div>
                <Label>মুদ্রা</Label>
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
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>তারিখ ফরম্যাট</Label>
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

              <div className="flex items-center justify-between">
                <Label>নোটিফিকেশন</Label>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("notifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>অটো ব্যাকআপ</Label>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) =>
                    handleSettingChange("autoBackup", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>ডার্ক মোড</Label>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) =>
                    handleSettingChange("darkMode", checked)
                  }
                />
              </div>
            </div>
          </div>
        );

      case "company":
        return (
          <div className="space-y-4">
            <div>
              <Label>কোম্পানির নাম</Label>
              <Input
                value={settings.companyName}
                onChange={(e) =>
                  handleSettingChange("companyName", e.target.value)
                }
              />
            </div>

            <div>
              <Label>ঠিকানা</Label>
              <Input
                value={settings.companyAddress}
                onChange={(e) =>
                  handleSettingChange("companyAddress", e.target.value)
                }
              />
            </div>

            <div>
              <Label>ফ���ন নম্বর</Label>
              <Input
                value={settings.companyPhone}
                onChange={(e) =>
                  handleSettingChange("companyPhone", e.target.value)
                }
              />
            </div>

            <div>
              <Label>ইমেইল</Label>
              <Input
                type="email"
                value={settings.companyEmail}
                onChange={(e) =>
                  handleSettingChange("companyEmail", e.target.value)
                }
              />
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

            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                পাসওয়ার্ড পরিবর্তন করুন
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="w-4 h-4 mr-2" />
                সিকিউরিটি লগ দেখুন
              </Button>
            </div>
          </div>
        );

      case "data":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">ডেটা ব্যাকআপ</h4>
                <Button
                  onClick={handleExportData}
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  সব ডেটা এক্সপোর্ট করুন
                </Button>
              </div>

              <div>
                <h4 className="font-medium mb-2">ডেটা ইমপোর্ট</h4>
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
                <h4 className="font-medium mb-2 text-red-600">বিপজ্জনক কাজ</h4>
                <Button
                  variant="destructive"
                  onClick={handleClearData}
                  className="w-full justify-start"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  সব ডেটা মুছে ফেলুন
                </Button>
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
                  <span>{tab.label}</span>
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
