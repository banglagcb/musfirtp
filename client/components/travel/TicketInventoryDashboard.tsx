import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  TrendingUp,
  Lock,
  Unlock,
  ShoppingCart,
  DollarSign,
  Globe,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Download,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TicketInventory, TicketInventoryStats } from "@shared/ticket-types";
import { User } from "@shared/travel-types";
import ticketInventoryService from "@/services/ticketInventoryService";

interface TicketInventoryDashboardProps {
  user: User;
  onClose: () => void;
  onOpenPurchaseForm: () => void;
}

export default function TicketInventoryDashboard({
  user,
  onClose,
  onOpenPurchaseForm,
}: TicketInventoryDashboardProps) {
  const [inventory, setInventory] = useState<TicketInventory[]>([]);
  const [stats, setStats] = useState<TicketInventoryStats | null>(null);
  const [showPurchasePrices, setShowPurchasePrices] = useState(
    user.role === "owner",
  );
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [lockingTicket, setLockingTicket] = useState<string | null>(null);
  const [lockQuantity, setLockQuantity] = useState<number>(1);

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = () => {
    const inventoryData = ticketInventoryService.getInventory();
    const statsData = ticketInventoryService.getInventoryStats();

    // Filter based on user role
    const filteredInventory =
      user.role === "owner"
        ? inventoryData
        : inventoryData.filter((item) => !item.isLocked);

    setInventory(filteredInventory);
    setStats(statsData);
  };

  const handleLockTickets = async (inventoryId: string, quantity: number) => {
    if (user.role !== "owner") return;

    const success = ticketInventoryService.lockTickets(inventoryId, quantity);
    if (success) {
      loadInventoryData();
      setLockingTicket(null);
      setLockQuantity(1);
    }
  };

  const handleUnlockTickets = async (inventoryId: string, quantity: number) => {
    if (user.role !== "owner") return;

    const success = ticketInventoryService.unlockTickets(inventoryId, quantity);
    if (success) {
      loadInventoryData();
    }
  };

  const handleDeleteInventory = async (inventoryId: string) => {
    if (user.role !== "owner") return;

    if (window.confirm("আপনি কি নিশ্চিত যে এই ইনভেন্টরিটি মুছে ফেলতে চান?")) {
      const success = ticketInventoryService.deleteInventory(inventoryId);
      if (success) {
        loadInventoryData();
      }
    }
  };

  const exportInventory = () => {
    const csvContent = ticketInventoryService.exportInventoryToCSV();
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ticket-inventory-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredInventory =
    selectedCountry === "all"
      ? inventory
      : inventory.filter((item) => item.country === selectedCountry);

  const countries = [...new Set(inventory.map((item) => item.country))];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            টিকেট ইনভেন্টরি
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            আপনার টিকেট স্টক ম্যানেজমেন্ট
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {user.role === "owner" && (
            <>
              <button
                onClick={() => setShowPurchasePrices(!showPurchasePrices)}
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={
                  showPurchasePrices ? "ক্রয় মূল্য লুকান" : "ক্রয় মূল্য দেখান"
                }
              >
                {showPurchasePrices ? (
                  <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              <button
                onClick={exportInventory}
                className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                title="এক্সপোর্ট করুন"
              >
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </button>

              <button
                onClick={onOpenPurchaseForm}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>নতুন ক্রয়</span>
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Stats Overview */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  মোট টিকেট
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalPurchasedTickets}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  উপলব্ধ
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalAvailableTickets}
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-500" />
            </div>
          </div>

          {user.role === "owner" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    মোট বিনিয়োগ
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(stats.totalInvestment)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  বিক্রিত
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.totalSoldTickets}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Country Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center space-x-4">
          <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">সব দেশ</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Inventory Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  রুট
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  এয়ারলাইন
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  দেশ
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  ক্লাস
                </th>
                {showPurchasePrices && user.role === "owner" && (
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                    ক্রয় মূল্য
                  </th>
                )}
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  বিক্রয় মূল্য
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  উপলব্ধ
                </th>
                {user.role === "owner" && (
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                    লক
                  </th>
                )}
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  বিক্রিত
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  স্ট্যাটাস
                </th>
                {user.role === "owner" && (
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                    অ্যাকশন
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {item.route}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {item.airline}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {item.country}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {item.flightClass === "Economy"
                      ? "ইকোনমি"
                      : item.flightClass === "Business"
                        ? "বিজনেস"
                        : "ফার্স্ট ক্লাস"}
                  </td>
                  {showPurchasePrices && user.role === "owner" && (
                    <td className="px-6 py-4 text-sm font-medium text-red-600 dark:text-red-400">
                      ৳{item.purchasePrice.toLocaleString()}
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm font-medium text-green-600 dark:text-green-400">
                    ৳{item.suggestedSalePrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-600 dark:text-blue-400">
                    {item.availableTickets}
                  </td>
                  {user.role === "owner" && (
                    <td className="px-6 py-4 text-sm font-bold text-orange-600 dark:text-orange-400">
                      {item.lockedTickets}
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm font-bold text-green-600 dark:text-green-400">
                    {item.soldTickets}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {item.isLocked && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded-full flex items-center space-x-1">
                          <Lock className="w-3 h-3" />
                          <span>লক</span>
                        </span>
                      )}
                      {item.availableTickets === 0 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 text-xs rounded-full">
                          স্টক শেষ
                        </span>
                      )}
                      {item.availableTickets > 0 && !item.isLocked && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full">
                          উপলব্ধ
                        </span>
                      )}
                    </div>
                  </td>
                  {user.role === "owner" && (
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {/* Lock/Unlock */}
                        {lockingTicket === item.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="1"
                              max={item.availableTickets}
                              value={lockQuantity}
                              onChange={(e) =>
                                setLockQuantity(parseInt(e.target.value) || 1)
                              }
                              className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                            <button
                              onClick={() =>
                                handleLockTickets(item.id, lockQuantity)
                              }
                              className="p-1 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded hover:bg-orange-200 dark:hover:bg-orange-900/40 transition-colors"
                              title="লক করুন"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setLockingTicket(null)}
                              className="p-1 bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-900/40 transition-colors"
                              title="বাতিল"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setLockingTicket(item.id)}
                            disabled={item.availableTickets === 0}
                            className="p-1 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded hover:bg-orange-200 dark:hover:bg-orange-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="টিকেট লক করুন"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        )}

                        {/* Unlock */}
                        {item.lockedTickets > 0 && (
                          <button
                            onClick={() =>
                              handleUnlockTickets(item.id, item.lockedTickets)
                            }
                            className="p-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                            title="সব টিকেট আনলক করুন"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteInventory(item.id)}
                          className="p-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              কোনো টিকেট ইনভেন্টরি নেই
            </p>
            {user.role === "owner" && (
              <button
                onClick={onOpenPurchaseForm}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                প্রথম টিকেট ক্রয় করুন
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
