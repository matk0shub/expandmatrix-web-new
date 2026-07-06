import SiteNavbar from '@/components/SiteNavbar';

const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-full bg-white/[0.04] ${className}`} />
);

export default function BlogPostLoading() {
  return (
    <>
      <SiteNavbar variant="page" />
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-[1780px] px-6 pb-4 pt-32 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24">
          <SkeletonBlock className="h-8 w-36" />
        </div>

        <article className="mx-auto max-w-[1780px] px-6 pb-24 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24">
          <header className="mx-auto max-w-3xl space-y-5 pb-12 pt-8 text-center">
            <SkeletonBlock className="mx-auto h-12 w-full max-w-2xl sm:h-14" />
            <SkeletonBlock className="mx-auto h-12 w-4/5 max-w-xl sm:h-14" />
            <SkeletonBlock className="mx-auto h-4 w-3/4 max-w-lg" />
            <SkeletonBlock className="mx-auto h-4 w-40" />
          </header>

          <div className="mx-auto mb-12 aspect-[16/9] w-full max-w-4xl animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />

          <div className="mx-auto max-w-3xl space-y-4">
            {[
              'w-full',
              'w-11/12',
              'w-full',
              'w-5/6',
              'w-3/4',
              'w-full',
              'w-10/12',
            ].map((widthClass, index) => (
              <SkeletonBlock key={index} className={`h-4 ${widthClass}`} />
            ))}
          </div>
        </article>
      </main>
    </>
  );
}
