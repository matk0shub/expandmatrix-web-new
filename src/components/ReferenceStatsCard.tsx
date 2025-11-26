'use client';

import { useFramerMotion } from '@/hooks/useFramerMotion';
import { fallbackMotion } from '@/utils/motionFallback';

interface ReferenceStatsCardProps {
  metrics: Array<{
    label: string;
    value: string;
  }>;
  prefersReducedMotion: boolean;
  heading: string;
}

export default function ReferenceStatsCard({
  metrics,
  prefersReducedMotion,
  heading,
}: ReferenceStatsCardProps) {
  const framer = useFramerMotion('idle');
  const MotionDiv = framer?.motion.div ?? fallbackMotion.div;
  const MotionTr = framer?.motion.tr ?? fallbackMotion.tr;
  const MotionTd = framer?.motion.td ?? fallbackMotion.td;

  if (!metrics.length) return null;

  return (
    <MotionDiv
      className="relative z-10 w-full max-w-full lg:max-w-[540px]"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: 'easeOut',
      }}
    >
      <div className="relative w-full min-w-0 rounded-2xl border border-white/30 bg-white/12 p-4 shadow-2xl backdrop-blur-lg sm:p-5 lg:rounded-3xl lg:p-8">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 sm:text-xs">
          {heading}
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          {/* Mobile grid */}
          <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 lg:hidden">
            {metrics.map((metric, index) => (
              <MotionDiv
                key={`${metric.label}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.3,
                  delay: prefersReducedMotion ? 0 : index * 0.05,
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-3"
              >
                <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/70 sm:text-xs">
                  {metric.label}
                </div>
                <div className="text-xl font-semibold text-white leading-tight mt-1 sm:text-2xl">
                  {metric.value}
                </div>
              </MotionDiv>
            ))}
          </div>

          {/* Desktop table */}
          <table className="w-full hidden lg:table">
            <tbody>
              {metrics.map((metric, index) => (
                <MotionTr
                  key={`${metric.label}-${index}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.4,
                    delay: prefersReducedMotion ? 0 : index * 0.08
                  }}
                  className="border-b border-white/5 last:border-b-0"
                >
                  <td className="px-6 py-5 align-top">
                    <span className="text-sm font-medium text-white/80 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
                      {metric.label}
                    </span>
                  </td>
                  <MotionTd
                    className="px-6 py-5 text-right text-lg font-semibold text-white drop-shadow-[0_0_12px_rgba(0,0,0,0.6)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.5,
                      delay: prefersReducedMotion ? 0 : index * 0.08 + 0.15
                    }}
                  >
                    {metric.value}
                  </MotionTd>
                </MotionTr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Subtle glow effect */}
        <MotionDiv
          className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-blue-500/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 1,
            delay: prefersReducedMotion ? 0 : 0.3
          }}
        />
      </div>
    </MotionDiv>
  );
}
