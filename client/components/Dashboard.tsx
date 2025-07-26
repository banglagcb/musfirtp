import { motion } from "framer-motion";
import { 
  BarChart3, 
  Settings, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  FileText,
  Calendar,
  Shield,
  Zap,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  stats?: {
    value: string;
    change: string;
    trend: "up" | "down";
  };
}

interface DashboardProps {
  onCardClick: (cardId: string) => void;
}

const dashboardCards: DashboardCard[] = [
  {
    id: "analytics",
    title: "Analytics",
    description: "View detailed performance metrics and insights",
    icon: BarChart3,
    color: "from-neon-blue to-neon-purple",
    gradient: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
    stats: {
      value: "2.4K",
      change: "+12.5%",
      trend: "up"
    }
  },
  {
    id: "settings",
    title: "Settings",
    description: "Configure your application preferences",
    icon: Settings,
    color: "from-neon-purple to-neon-pink",
    gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
  },
  {
    id: "messages",
    title: "Messages",
    description: "Manage conversations and notifications",
    icon: MessageSquare,
    color: "from-neon-green to-neon-blue",
    gradient: "bg-gradient-to-br from-green-500/20 to-blue-500/20",
    stats: {
      value: "147",
      change: "+23",
      trend: "up"
    }
  },
  {
    id: "users",
    title: "Users",
    description: "Manage user accounts and permissions",
    icon: Users,
    color: "from-neon-pink to-neon-purple",
    gradient: "bg-gradient-to-br from-pink-500/20 to-purple-500/20",
    stats: {
      value: "1.2K",
      change: "+8.2%",
      trend: "up"
    }
  },
  {
    id: "reports",
    title: "Reports",
    description: "Generate and view detailed reports",
    icon: FileText,
    color: "from-orange-500 to-red-500",
    gradient: "bg-gradient-to-br from-orange-500/20 to-red-500/20",
  },
  {
    id: "calendar",
    title: "Calendar",
    description: "Schedule and manage your events",
    icon: Calendar,
    color: "from-green-500 to-teal-500",
    gradient: "bg-gradient-to-br from-green-500/20 to-teal-500/20",
  },
  {
    id: "security",
    title: "Security",
    description: "Monitor security and access controls",
    icon: Shield,
    color: "from-red-500 to-pink-500",
    gradient: "bg-gradient-to-br from-red-500/20 to-pink-500/20",
  },
  {
    id: "performance",
    title: "Performance",
    description: "Track system performance metrics",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    gradient: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20",
    stats: {
      value: "99.9%",
      change: "+0.1%",
      trend: "up"
    }
  }
];

export default function Dashboard({ onCardClick }: DashboardProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/70">Welcome to your interactive folder-style workspace</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
            <TrendingUp className="w-8 h-8 text-neon-green" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Active Sessions</p>
              <p className="text-2xl font-bold text-white">456</p>
            </div>
            <Globe className="w-8 h-8 text-neon-blue" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Uptime</p>
              <p className="text-2xl font-bold text-white">99.9%</p>
            </div>
            <Zap className="w-8 h-8 text-neon-purple" />
          </div>
        </div>
      </motion.div>

      {/* Dashboard Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {dashboardCards.map((card) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05,
              y: -10,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCardClick(card.id)}
            className={cn(
              "relative group cursor-pointer rounded-2xl p-6 border border-white/20",
              "bg-white/10 backdrop-blur-md hover:bg-white/15",
              "transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25",
              "overflow-hidden"
            )}
          >
            {/* Background Gradient */}
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              card.gradient
            )} />

            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={cn(
                  "w-12 h-12 rounded-xl mb-4 flex items-center justify-center",
                  `bg-gradient-to-r ${card.color}`
                )}
              >
                <card.icon className="w-6 h-6 text-white" />
              </motion.div>

              {/* Title & Description */}
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white transition-colors">
                {card.title}
              </h3>
              <p className="text-white/70 text-sm mb-4 group-hover:text-white/90 transition-colors">
                {card.description}
              </p>

              {/* Stats */}
              {card.stats && (
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    {card.stats.value}
                  </span>
                  <span className={cn(
                    "text-sm font-medium",
                    card.stats.trend === "up" ? "text-neon-green" : "text-red-400"
                  )}>
                    {card.stats.change}
                  </span>
                </div>
              )}

              {/* Hover Effect Indicator */}
              <motion.div
                className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
