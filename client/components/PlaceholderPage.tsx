import { motion } from "framer-motion";
import { Folder, ArrowLeft, Sparkles } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
  onBack?: () => void;
}

export default function PlaceholderPage({ 
  title, 
  description = "This section is coming soon! Continue prompting to have this page filled out.",
  onBack 
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 25 }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* Animated Folder Icon */}
        <motion.div
          animate={{ 
            rotateY: [0, 15, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <Folder className="w-32 h-32 text-folder-primary/50" />
            <motion.div
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Sparkles className="w-8 h-8 text-neon-purple" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-white/70 mb-8 leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0, 0.3, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              className={`absolute w-4 h-4 rounded-full bg-gradient-to-r ${
                i % 3 === 0 ? 'from-neon-blue to-neon-purple' :
                i % 3 === 1 ? 'from-neon-purple to-neon-pink' :
                'from-neon-pink to-neon-blue'
              }`}
              style={{
                left: `${10 + (i * 15)}%`,
                top: `${20 + (i * 10)}%`
              }}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 inline-block"
        >
          <p className="text-white/80 mb-4">
            Ready to build this section? Continue the conversation to add:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-white/60">
            <div>• Interactive components</div>
            <div>• Data visualizations</div>
            <div>• Custom workflows</div>
            <div>• Advanced features</div>
          </div>
        </motion.div>

        {/* Back Button */}
        {onBack && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="mt-8 px-6 py-3 bg-gradient-to-r from-folder-primary to-folder-secondary rounded-xl text-white font-medium shadow-glow flex items-center space-x-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
