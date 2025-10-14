'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Twitter, Mail } from 'lucide-react';
import ScrambleText from './ScrambleText';

type Props = {
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
};

export default function FooterBrand({ instagramUrl, linkedinUrl, twitterUrl }: Props) {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <div className="max-w-md">
      {/* Logo with animated glow effect */}
      <motion.div className="footer-brand-item">
        <Link 
          href={`/${locale}`} 
          className="group relative inline-flex items-center gap-4 focus:outline-none focus:ring-4 focus:ring-[#00d76b]/40 rounded-xl p-2 -m-2 transition-all duration-300"
        >
          {/* Glowing background on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00d76b]/10 to-[#00d76b]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
          
          {/* Logo with pulse effect */}
          <div className="relative">
            <Image 
              src="/logo.svg" 
              alt="ExpandMatrix" 
              width={48} 
              height={48} 
              priority 
              className="relative z-10 transition-transform duration-300 group-hover:scale-110"
            />
            {/* Pulsing glow ring */}
            <div className="footer-glow-pulse absolute inset-0 rounded-full bg-[#00d76b]/20 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          {/* Brand name with scramble effect */}
          <div className="relative z-10">
            <ScrambleText
              text="EXPAND MATRIX"
              className="text-white text-xl font-bold tracking-wider font-lato"
              applyScramble={false}
              trigger="hover"
              speed={0.8}
              range={[65, 125]}
            />
          </div>
        </Link>
      </motion.div>

      {/* Animated tagline */}
      <motion.div 
        className="footer-brand-item mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <p className="text-white/90 text-base leading-relaxed font-lato">
          {t('brand.tagline')}
        </p>
      </motion.div>

      {/* Contact email with animated underline */}
      <motion.div 
        className="footer-brand-item mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <a
          href="mailto:info@expandmatrix.com"
          className="group relative inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#00d76b]/40 rounded-lg p-2 -m-2"
        >
          <Mail className="w-5 h-5 text-[#00d76b] group-hover:text-[#00d76b] transition-colors duration-300" />
          <span className="font-medium">info@expandmatrix.com</span>
          {/* Animated underline */}
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00d76b] to-[#00b85c] group-hover:w-full transition-all duration-500 ease-out" />
        </a>
      </motion.div>

      {/* Social links with advanced hover effects */}
      <motion.div 
        className="footer-brand-item mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="flex items-center gap-3" aria-label={t('brand.socialAria')}>
          {instagramUrl && (
            <motion.a 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className="group relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00d76b]/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00d76b]/40"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram className="w-5 h-5 text-white group-hover:text-[#00d76b] transition-colors duration-300" />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-[#00d76b]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            </motion.a>
          )}
          {linkedinUrl && (
            <motion.a 
              href={linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn"
              className="group relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00d76b]/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00d76b]/40"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin className="w-5 h-5 text-white group-hover:text-[#00d76b] transition-colors duration-300" />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-[#00d76b]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            </motion.a>
          )}
          {twitterUrl && (
            <motion.a 
              href={twitterUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Twitter"
              className="group relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00d76b]/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00d76b]/40"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Twitter className="w-5 h-5 text-white group-hover:text-[#00d76b] transition-colors duration-300" />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-[#00d76b]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            </motion.a>
          )}
        </div>
      </motion.div>

      {/* Subtle brand statement */}
      <motion.div 
        className="footer-brand-item mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="relative">
          <div className="w-12 h-px bg-gradient-to-r from-[#00d76b] to-transparent mb-4" />
          <p className="text-white/60 text-sm font-lato italic">
            &ldquo;We build AI agents, websites and AI implementations.&rdquo;
          </p>
        </div>
      </motion.div>
    </div>
  );
}


