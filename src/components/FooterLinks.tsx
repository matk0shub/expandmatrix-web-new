'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import * as Collapsible from '@radix-ui/react-accordion';
import { useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterLinkGroup = {
  groupTitle: string;
  order: number;
  links: FooterLink[];
};

type Props = {
  groups: FooterLinkGroup[];
};

export default function FooterLinks({ groups }: Props) {
  const locale = useLocale();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 w-full">
      {/* Desktop/Tablet columns with advanced animations */}
      <div className="hidden sm:grid sm:col-span-2 xl:col-span-3 grid-cols-2 xl:grid-cols-3 gap-8">
        {groups.sort((a, b) => a.order - b.order).map((group, groupIndex) => (
          <motion.div 
            key={group.groupTitle}
            className="footer-link-group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.05, duration: 0.4 }}
          >
            {/* Group title with animated underline */}
            <div className="relative mb-6">
              <h3 className="text-white font-bold text-sm tracking-wider uppercase font-lato">
                {group.groupTitle}
              </h3>
              <motion.div 
                className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-[#00d76b] to-[#00b85c]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: groupIndex * 0.05 + 0.2, duration: 0.3 }}
              />
            </div>
            
            {/* Links with staggered animations */}
            <ul className="space-y-3">
              {group.links.map((link, linkIndex) => (
                    <motion.li 
                      key={`${group.groupTitle}-${link.label}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: groupIndex * 0.05 + linkIndex * 0.02 + 0.2, 
                        duration: 0.3 
                      }}
                    >
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative text-white/70 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-[#00d76b]/40 rounded-lg px-2 py-1 inline-block transition-all duration-300"
                    >
                      <span className="relative z-10">{link.label}</span>
                      {/* Animated background on hover */}
                      <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Animated underline */}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00d76b] to-[#00b85c] group-hover:w-full transition-all duration-500 ease-out" />
                    </a>
                  ) : (
                    <Link
                      href={`/${locale}${link.href}`}
                      className="group relative text-white/70 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-[#00d76b]/40 rounded-lg px-2 py-1 inline-block transition-all duration-300"
                    >
                      <span className="relative z-10">{link.label}</span>
                      {/* Animated background on hover */}
                      <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Animated underline */}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00d76b] to-[#00b85c] group-hover:w-full transition-all duration-500 ease-out" />
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Mobile accordion with enhanced animations */}
      <div className="sm:hidden">
        <Collapsible.Root type="single" collapsible>
          {groups.sort((a, b) => a.order - b.order).map((group) => (
            <Collapsible.Item 
              key={group.groupTitle} 
              value={group.groupTitle} 
              className="border-b border-white/10 last:border-b-0"
            >
              <Collapsible.Header>
                <Collapsible.Trigger className="group w-full text-left py-4 text-white font-semibold flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#00d76b]/40 rounded-lg px-2 -mx-2">
                  <span className="font-lato tracking-wide">{group.groupTitle}</span>
                  <motion.div
                    className="text-white/60 group-hover:text-white transition-colors duration-300"
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </Collapsible.Trigger>
              </Collapsible.Header>
              <Collapsible.Content className="pb-4">
                <motion.ul 
                  className="space-y-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {group.links.map((link, linkIndex) => (
                    <motion.li 
                      key={`${group.groupTitle}-${link.label}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: linkIndex * 0.05, duration: 0.3 }}
                    >
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative text-white/70 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-[#00d76b]/40 rounded-lg px-2 py-1 inline-block transition-all duration-300"
                        >
                          <span className="relative z-10">{link.label}</span>
                          {/* Animated background on hover */}
                          <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {/* Animated underline */}
                          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00d76b] to-[#00b85c] group-hover:w-full transition-all duration-500 ease-out" />
                        </a>
                      ) : (
                        <Link
                          href={`/${locale}${link.href}`}
                          className="group relative text-white/70 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-[#00d76b]/40 rounded-lg px-2 py-1 inline-block transition-all duration-300"
                        >
                          <span className="relative z-10">{link.label}</span>
                          {/* Animated background on hover */}
                          <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {/* Animated underline */}
                          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00d76b] to-[#00b85c] group-hover:w-full transition-all duration-500 ease-out" />
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              </Collapsible.Content>
            </Collapsible.Item>
          ))}
        </Collapsible.Root>
      </div>
    </div>
  );
}


