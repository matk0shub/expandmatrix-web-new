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
      <div className="relative backdrop-blur-xl bg-white/15 border border-white/30 rounded-3xl p-8 min-w-[320px] max-w-[420px] shadow-2xl">
        <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          AI Impact Overview
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <table className="w-full">
            <tbody>
              {metrics.map((metric, index) => (
                <motion.tr
                  key={`${metric.label}-${index}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.4,
                    delay: prefersReducedMotion ? 0 : index * 0.08
                  }}
                  className="border-b border-white/5 last:border-b-0"
                >
                  <td className="px-5 py-4 align-top">
                    <span className="text-sm font-medium text-white/80 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
                      {metric.label}
                    </span>
                  </td>
                  <motion.td
                    className="px-5 py-4 text-right text-lg font-semibold text-white drop-shadow-[0_0_12px_rgba(0,0,0,0.6)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.5,
                      delay: prefersReducedMotion ? 0 : index * 0.08 + 0.15
                    }}
                  >
                    {metric.value}
                  </motion.td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Subtle glow effect */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-blue-500/10"
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
