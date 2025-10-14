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
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold mb-4 text-purple-400">500</h1>
        <h2 className="text-2xl mb-8 font-semibold">
          {t('error.title', { default: 'Něco se pokazilo' })}
        </h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          {t('error.description', { 
            default: 'Omlouváme se, došlo k neočekávané chybě. Zkuste prosím obnovit stránku.' 
          })}
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 w-full"
          >
            {t('error.tryAgain', { default: 'Zkusit znovu' })}
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 w-full"
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
