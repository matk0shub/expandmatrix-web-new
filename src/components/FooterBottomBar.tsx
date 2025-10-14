'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Heart, Code } from 'lucide-react';
import LocaleSwitcher from './LocaleSwitcher';

export default function FooterBottomBar() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <motion.div 
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      {/* Copyright with animated heart */}
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <p className="text-white/60 text-sm font-lato">
          © {year} ExpandMatrix
        </p>
        <motion.div
          className="text-[#00d76b]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart className="w-4 h-4" />
        </motion.div>
      </motion.div>

      {/* Links and locale switcher */}
      <div className="flex items-center gap-6">
        {/* Legal links */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <Link 
            href={`/${locale}/privacy`} 
            className="group relative text-white/70 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-[#00d76b]/40 rounded-lg px-2 py-1 transition-all duration-300"
          >
            <span className="relative z-10 text-sm font-lato">{t('links.privacy')}</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00d76b] to-[#00b85c] group-hover:w-full transition-all duration-500 ease-out" />
          </Link>
          <Link 
            href={`/${locale}/terms`} 
            className="group relative text-white/70 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-[#00d76b]/40 rounded-lg px-2 py-1 transition-all duration-300"
          >
            <span className="relative z-10 text-sm font-lato">{t('links.terms')}</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00d76b] to-[#00b85c] group-hover:w-full transition-all duration-500 ease-out" />
          </Link>
        </motion.div>

        {/* Locale switcher */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          <LocaleSwitcher />
        </motion.div>
      </div>

      {/* Creative note */}
      <motion.div 
        className="flex items-center gap-2 text-white/40 text-xs font-lato"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Code className="w-3 h-3" />
        <span>Made with precision and innovation</span>
      </motion.div>
    </motion.div>
  );
}


