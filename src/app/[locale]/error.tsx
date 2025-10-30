'use client';

import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,215,107,0.15),transparent_60%)]" aria-hidden="true" />
      <div className="relative text-center max-w-md mx-auto px-6 py-12 rounded-3xl border border-white/10 backdrop-blur-sm bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <h1 className="text-6xl font-bold mb-4 text-[var(--brand-primary)] drop-shadow-[0_0_30px_rgba(0,215,107,0.35)]">500</h1>
        <h2 className="text-2xl mb-6 font-semibold">
          {t('error.title', { default: 'Něco se pokazilo' })}
        </h2>
        <p className="text-gray-300 mb-10 leading-relaxed">
          {t('error.description', { 
            default: 'Omlouváme se, došlo k neočekávané chybě. Zkuste prosím obnovit stránku.' 
          })}
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] text-black font-semibold py-3 px-8 rounded-full transition-all duration-300 w-full shadow-[0_0_25px_rgba(0,215,107,0.35)]"
          >
            {t('error.tryAgain', { default: 'Zkusit znovu' })}
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 w-full border border-white/10"
          >
            {t('error.goHome', { default: 'Zpět na hlavní stránku' })}
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && error.message && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-gray-400 hover:text-gray-300 mb-2">
              Technické detaily (pouze pro vývojáře)
            </summary>
            <pre className="bg-gray-900 p-4 rounded-lg text-sm text-red-400 overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
