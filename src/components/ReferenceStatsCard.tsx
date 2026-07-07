import type { ReferenceMetric } from '@/types/references';

interface ReferenceStatsCardProps {
  metrics: ReferenceMetric[];
  heading: string;
}

export default function ReferenceStatsCard({
  metrics,
  heading,
}: ReferenceStatsCardProps) {
  if (!metrics.length) return null;

  return (
    <div className="w-full">
      <div className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
        {heading}
      </div>

      <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
        {metrics.map((metric, index) => (
          <div
            key={`${metric.label}-${index}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 sm:px-5"
          >
            <div className="text-3xl font-black leading-none text-[#00d76b] lg:text-4xl">
              {metric.value}
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/60">
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
