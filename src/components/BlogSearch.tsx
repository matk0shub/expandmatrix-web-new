'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useRef, useTransition } from 'react';

interface BlogSearchProps {
  placeholder: string;
  defaultValue?: string;
}

export default function BlogSearch({ placeholder, defaultValue = '' }: BlogSearchProps) {
  const router = useRouter();
  const locale = useLocale();
  const [, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      startTransition(() => {
        const url = value
          ? `/${locale}/blog?q=${encodeURIComponent(value)}`
          : `/${locale}/blog`;
        router.push(url);
      });
    }, 400);
  };

  return (
    <div className="relative w-full max-w-lg">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
        size={18}
        aria-hidden="true"
      />
      <input
        type="search"
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-full border border-white/15 bg-white/5 py-3 pl-11 pr-5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#00d76b]/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-[#00d76b]/20"
      />
    </div>
  );
}
