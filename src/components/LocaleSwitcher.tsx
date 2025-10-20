'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <button 
      onClick={() => switchLocale(locale === 'cs' ? 'en' : 'cs')}
      className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30"
      aria-label={`Switch to ${locale === 'cs' ? 'English' : 'Czech'}`}
    >
      {locale === 'cs' ? 'EN' : 'CS'}
    </button>
  );
}
