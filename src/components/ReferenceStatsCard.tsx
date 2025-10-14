'use client';

import { motion } from 'framer-motion';

interface ReferenceStatsCardProps {
  metrics: Array<{
    label: string;
    value: string;
  }>;
  prefersReducedMotion: boolean;
}

export default function ReferenceStatsCard({
  metrics,
  prefersReducedMotion,
}: ReferenceStatsCardProps) {
  if (!metrics.length) return null;

  return (
    <motion.div
      className="absolute top-1/2 right-8 transform -translate-y-1/2 z-20"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: 'easeOut' 
      }}
    >
      <div className="backdrop-blur-xl bg-white/15 border border-white/30 rounded-2xl p-6 min-w-[280px] max-w-[320px] shadow-2xl">
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={`${metric.label}-${index}`}
              className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.4,
                delay: prefersReducedMotion ? 0 : index * 0.1 
              }}
            >
              <span className="text-sm text-gray-200 font-medium drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
                {metric.label}
              </span>
              <motion.span
                className="text-lg font-bold text-white text-right drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 0.6,
                  delay: prefersReducedMotion ? 0 : index * 0.1 + 0.2 
                }}
              >
                {metric.value}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* Subtle glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: prefersReducedMotion ? 0 : 1,
            delay: prefersReducedMotion ? 0 : 0.3 
          }}
        />
      </div>
    </motion.div>
  );
}
