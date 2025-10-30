'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,215,107,0.15),transparent_60%)]" aria-hidden="true" />
          <div className="relative text-center max-w-md mx-auto px-6 py-12 rounded-3xl border border-white/10 backdrop-blur-sm bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <h1 className="text-6xl font-bold mb-4 text-[var(--brand-primary)] drop-shadow-[0_0_30px_rgba(0,215,107,0.35)]">
              500
            </h1>
            <h2 className="text-2xl mb-6 font-semibold">Něco se pokazilo</h2>
            <p className="text-gray-300 mb-10 leading-relaxed">
              Omlouváme se, došlo k neočekávané chybě.
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center w-full sm:w-auto bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] text-black font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(0,215,107,0.35)]"
            >
              Zkusit znovu
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
