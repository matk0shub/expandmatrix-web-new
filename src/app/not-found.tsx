import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-8">Stránka nenalezena</h2>
        <p className="text-gray-400 mb-8">
          Omlouváme se, ale stránka kterou hledáte neexistuje.
        </p>
        <Link 
          href="/en" 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300"
        >
          Zpět na hlavní stránku
        </Link>
      </div>
    </div>
  );
}


