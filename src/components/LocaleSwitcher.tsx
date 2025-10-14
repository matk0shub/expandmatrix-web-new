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
      className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 text-sm font-medium cursor-pointer"
    >
      {locale === 'cs' ? 'EN' : 'CS'}
    </button>
  );
}
