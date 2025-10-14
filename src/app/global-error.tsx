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
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4">500</h1>
            <h2 className="text-2xl mb-8">Něco se pokazilo</h2>
            <p className="text-gray-400 mb-8">
              Omlouváme se, došlo k neočekávané chybě.
            </p>
            <button
              onClick={reset}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300"
            >
              Zkusit znovu
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
