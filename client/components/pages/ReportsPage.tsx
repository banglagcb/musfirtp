import { motion } from "framer-motion";
import { FileText, Download, Filter, Search, Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportsPageProps {
  onSubPageClick: (pageId: string) => void;
}

const reportCategories = [
  {
    id: "sales",
    title: "Sales Reports",
    description: "Revenue, conversion rates, and sales performance",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    reportCount: 12
  },
  {
    id: "analytics",
    title: "Analytics Reports",
    description: "User behavior, traffic, and engagement metrics",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    reportCount: 8
  },
  {
    id: "financial",
    title: "Financial Reports",
    description: "Revenue, expenses, and profit analysis",
    icon: Calendar,
    color: "from-purple-500 to-pink-500",
    reportCount: 15
  }
];

export default function ReportsPage({ onSubPageClick }: ReportsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Reports</h1>
        <p className="text-white/70">Generate and manage your business reports</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Search reports..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-folder-primary/50"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </motion.button>
      </motion.div>

      {/* Report Categories */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {reportCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            whileHover={{ 
              scale: 1.05,
              y: -10,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSubPageClick(category.id)}
            className="group cursor-pointer bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            <div className={cn(
              "w-12 h-12 rounded-xl mb-4 flex items-center justify-center",
              `bg-gradient-to-r ${category.color}`
            )}>
              <category.icon className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2">
              {category.title}
            </h3>
            <p className="text-white/70 text-sm mb-4">
              {category.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">
                {category.reportCount} reports
              </span>
              <motion.div
                className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-white">Recent Reports</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-folder-primary to-folder-secondary rounded-lg text-white text-sm font-medium shadow-glow"
          >
            View All
          </motion.button>
        </div>

        <div className="space-y-3">
          {["Q4 Sales Summary", "Monthly Analytics", "User Engagement Report"].map((report, index) => (
            <motion.div
              key={report}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-white/70" />
                <span className="text-white">{report}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Download className="w-4 h-4 text-white" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
