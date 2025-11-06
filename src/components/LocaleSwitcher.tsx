'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LocaleSwitcher() {
  const fallbackLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const localeFromPath = pathname?.match(/^\/(cs|en)(?:\/|$)/)?.[1] as 'cs' | 'en' | undefined;
  const currentLocale = localeFromPath ?? (fallbackLocale as 'cs' | 'en' | undefined) ?? 'en';
  const nextLocale = currentLocale === 'cs' ? 'en' : 'cs';

  const switchLocale = (newLocale: string) => {
    const currentPath = pathname ?? '/';
    const normalizedPath = currentPath.replace(/^\/(cs|en)/, '');
    const targetPath = `/${newLocale}${normalizedPath}` || `/${newLocale}`;

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;

    router.push(targetPath);
    router.refresh();
  };

  return (
    <button 
      onClick={() => switchLocale(nextLocale)}
      className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30"
      aria-label={`Switch to ${nextLocale === 'cs' ? 'Czech' : 'English'}`}
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
