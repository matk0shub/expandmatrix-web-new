'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Plus, X } from 'lucide-react';
import { useFAQs } from '@/hooks/useFAQs';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useHasMounted } from '@/hooks/useHasMounted';

export default function FAQSection() {
  const t = useTranslations('sections.faq');
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const hasMounted = useHasMounted();
  const { faqs, loading, error } = useFAQs({ locale, featuredOnly: true });
  
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle(index);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = Math.min(index + 1, faqs.length - 1);
      const nextButton = document.getElementById(`faq-button-${nextIndex}`);
      nextButton?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = Math.max(index - 1, 0);
      const prevButton = document.getElementById(`faq-button-${prevIndex}`);
      prevButton?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      const firstButton = document.getElementById('faq-button-0');
      firstButton?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      const lastButton = document.getElementById(`faq-button-${faqs.length - 1}`);
      lastButton?.focus();
    }
  };

  // Scroll into view when opening an accordion item
  useEffect(() => {
    if (openIndex !== null && accordionRef.current) {
      const openItem = accordionRef.current.children[openIndex] as HTMLElement;
      if (openItem) {
        openItem.scrollIntoView({ 
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [openIndex, prefersReducedMotion]);

  if (!hasMounted || loading) {
    return (
      <section className="relative w-full bg-black py-24 md:py-40 lg:py-48">
        <div className="w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0">
          <div className="text-center">
            <div className="text-white text-2xl">{t('loading')}</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-full bg-black py-24 md:py-40 lg:py-48">
        <div className="w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0">
          <div className="text-center">
            <div className="text-red-400 text-2xl">{t('error')}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-black py-24 md:py-40 lg:py-48 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/4 w-[600px] h-[400px] rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(ellipse, rgba(0, 215, 107, 0.3) 0%, rgba(0, 184, 92, 0.2) 50%, transparent 80%)'
          }}
        />
      </div>

      <div className="w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Left Column - Headline and CTA */}
          <div className="flex flex-col min-h-[420px] py-4">
            <div className="flex flex-1 flex-col justify-between gap-10">
              <div className="space-y-6">
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="heading-main">
                <div>{t('title.line1')}</div>
                <div>{t('title.line2')}</div>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-white/80 text-lg md:text-xl leading-relaxed max-w-xl"
            >
              {t('cta.overline')}
            </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="pt-2"
              >
                <button
                  data-cal-namespace="strategy"
                  data-cal-link="team/em-core/strategy"
                  data-cal-origin="https://meet.expandmatrix.com"
                  data-cal-config='{"layout":"month_view"}'
                  className="group relative inline-flex items-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-[#00d76b] to-[#00b85c] text-white font-semibold rounded-full hover:from-[#00e673] hover:to-[#00d76b] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-sm md:text-base cursor-pointer font-lato focus:outline-none focus:ring-4 focus:ring-[#00d76b]/50"
                >
                  <span className="uppercase tracking-wide">
                    {t('cta.button')}
                  </span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00d76b]/20 to-[#00b85c]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Right Column - FAQ Accordion */}
          <div className="space-y-4">
            <motion.div
              ref={accordionRef}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="space-y-4"
            >
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                const question = locale === 'cs' ? faq.question.cs : faq.question.en;
                const answer = locale === 'cs' ? faq.answer.cs : faq.answer.en;

                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.1 * index,
                      ease: "easeOut" 
                    }}
                    className="relative"
                  >
                    <div className="relative bg-[#0B0B0B] rounded-2xl border border-white/10 overflow-hidden shadow-lg">
                      {/* Left edge accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00d76b] to-[#00b85c] opacity-60" />
                      
                      {/* Question Button */}
                      <button
                        id={`faq-button-${index}`}
                        onClick={() => handleToggle(index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00d76b]/50 focus:ring-inset"
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${index}`}
                      >
                        <h3 className="text-white text-lg md:text-xl font-medium pr-4">
                          {question}
                        </h3>
                        <div className="relative flex-shrink-0">
                          <motion.div
                            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00d76b] to-[#00b85c] flex items-center justify-center shadow-lg shadow-[#00d76b]/30"
                            whileHover={{ 
                              scale: prefersReducedMotion ? 1 : 1.05,
                              boxShadow: "0 8px 25px rgba(0, 215, 107, 0.4)"
                            }}
                            whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            <motion.div
                              animate={{ rotate: isOpen ? 45 : 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              {isOpen ? (
                                <X className="w-5 h-5 text-white" aria-hidden="true" />
                              ) : (
                                <Plus className="w-5 h-5 text-white" aria-hidden="true" />
                              )}
                            </motion.div>
                          </motion.div>
                        </div>
                      </button>

                      {/* Answer Panel */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            id={`faq-panel-${index}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ 
                              height: "auto", 
                              opacity: 1 
                            }}
                            exit={{ 
                              height: 0, 
                              opacity: 0 
                            }}
                            transition={{ 
                              duration: prefersReducedMotion ? 0.1 : 0.3,
                              ease: "easeInOut" 
                            }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6">
                              <div className="pt-2 border-t border-white/10">
                                <p className="text-white/80 text-base md:text-lg leading-relaxed pt-4">
                                  {answer}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}