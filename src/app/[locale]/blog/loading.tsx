import SiteNavbar from '@/components/SiteNavbar';

const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-full bg-white/[0.04] ${className}`} />
);

const CardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
    <div className="h-48 w-full animate-pulse bg-white/[0.04]" />
    <div className="space-y-3 p-5">
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonBlock className="h-4 w-4/5" />
      <SkeletonBlock className="h-4 w-2/3" />
      <div className="space-y-2 pt-2">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-5/6" />
      </div>
    </div>
  </div>
);

export default function BlogLoading() {
  return (
    <>
      <SiteNavbar variant="page" />
      <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-[1780px] px-6 pb-10 pt-32 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24">
        <div className="space-y-5">
          <SkeletonBlock className="h-12 w-56 sm:h-14 sm:w-72" />
          <SkeletonBlock className="h-4 w-full max-w-xl" />
          <SkeletonBlock className="h-4 w-4/5 max-w-lg" />
          <div className="pt-3">
            <SkeletonBlock className="h-12 w-full max-w-lg" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1780px] px-6 pb-28 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24">
        <SkeletonBlock className="mb-8 h-7 w-44" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </section>
      </main>
    </>
  );
}
