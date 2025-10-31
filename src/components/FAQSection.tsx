'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useFAQs } from '@/hooks/useFAQs';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useHasMounted } from '@/hooks/useHasMounted';
import { CalCTAButton } from './CalCTAButton';
import { useFramerMotion } from '@/hooks/useFramerMotion';
import { fallbackMotion, FallbackAnimatePresence } from '@/utils/motionFallback';

export default function FAQSection() {
  const t = useTranslations('sections.faq');
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const hasMounted = useHasMounted();
  const framer = useFramerMotion();
  const MotionDiv = framer?.motion.div ?? fallbackMotion.div;
  const AnimatePresence = framer?.AnimatePresence ?? FallbackAnimatePresence;
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
    <section 
      className="relative isolate w-full bg-gradient-to-b from-black via-[#041109] to-black py-24 md:py-40 lg:py-48 overflow-hidden"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[8%] left-[8%] h-[480px] w-[520px] blur-3xl opacity-70"
          style={{
            background:
              'radial-gradient(ellipse 58% 42%, rgba(0, 255, 176, 0.8) 0%, rgba(0, 215, 107, 0.56) 52%, rgba(0, 184, 92, 0.25) 80%, transparent 92%)'
          }}
        />
        <div
          className="absolute top-[6%] right-[10%] h-[500px] w-[540px] blur-3xl opacity-62"
          style={{
            background:
              'radial-gradient(ellipse 58% 48%, rgba(110, 255, 210, 0.8) 0%, rgba(0, 215, 107, 0.5) 48%, rgba(0, 184, 92, 0.26) 72%, transparent 90%)'
          }}
        />
        <div
          className="absolute top-[44%] left-[22%] h-[420px] w-[420px] blur-3xl opacity-52"
          style={{
            background:
              'radial-gradient(ellipse 62% 44%, rgba(0, 215, 135, 0.68) 0%, rgba(0, 184, 92, 0.42) 58%, transparent 86%)'
          }}
        />
        <div
          className="absolute bottom-[24%] right-[24%] h-[420px] w-[440px] blur-3xl opacity-58"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 215, 125, 0.66) 0%, rgba(0, 184, 92, 0.4) 60%, transparent 86%)'
          }}
        />
        <div
          className="absolute bottom-[10%] left-[46%] h-[320px] w-[340px] blur-3xl opacity-50"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 255, 172, 0.6) 0%, rgba(0, 215, 107, 0.38) 55%, transparent 82%)'
          }}
        />
        <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-black via-[#03150df5] to-transparent opacity-100" />
        <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-black via-[#03150df5] to-transparent opacity-100" />
        <div className="absolute inset-y-0 left-0 w-[320px] bg-gradient-to-r from-black via-[#03150df5] to-transparent opacity-100" />
        <div className="absolute inset-y-0 right-0 w-[320px] bg-gradient-to-l from-black via-[#03150df5] to-transparent opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_56%,rgba(0,0,0,0.78)_100%)] opacity-80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.55),transparent_30%,transparent_70%,rgba(0,0,0,0.55))]" />
      </div>

      <div className="w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Left Column - Headline and CTA */}
          <div className="flex flex-col min-h-[420px] py-4">
            <div className="flex flex-1 flex-col justify-between gap-10">
              {/* Headline */}
              <MotionDiv
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h2 className="heading-main">
                  <div>{t('title.line1')}</div>
                  <div>{t('title.line2')}</div>
                </h2>
              </MotionDiv>

              {/* Bottom Section - CTA with text above button */}
              <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="flex justify-start items-end"
              >
                <div className="text-left max-w-md">
                  <p className="text-white/80 text-base md:text-lg lg:text-xl leading-relaxed mb-6 font-lato">
                    {t('cta.overline')}
                  </p>
                  <CalCTAButton>{t('cta.button')}</CalCTAButton>
                </div>
              </MotionDiv>
            </div>
          </div>

          {/* Right Column - FAQ Accordion */}
          <div className="space-y-4">
            <MotionDiv
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
                  <MotionDiv
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.1 * index,
                      ease: "easeOut" 
                    }}
                    className="relative"
                    itemScope
                    itemProp="mainEntity"
                    itemType="https://schema.org/Question"
                  >
                    <div className="relative bg-[#0B0B0B] rounded-3xl border border-white/10 overflow-hidden shadow-lg">
                      <meta itemProp="name" content={question} />
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
                          <MotionDiv
                            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00d76b] to-[#00b85c] flex items-center justify-center shadow-lg shadow-[#00d76b]/30"
                            whileHover={{ 
                              scale: prefersReducedMotion ? 1 : 1.05,
                              boxShadow: "0 8px 25px rgba(0, 215, 107, 0.4)"
                            }}
                            whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            <MotionDiv
                              animate={{ rotate: isOpen ? 45 : 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              {isOpen ? (
                                <X className="w-5 h-5 text-white" aria-hidden="true" />
                              ) : (
                                <Plus className="w-5 h-5 text-white" aria-hidden="true" />
                              )}
                            </MotionDiv>
                          </MotionDiv>
                        </div>
                      </button>

                      {/* Answer Panel */}
                      <AnimatePresence>
                        {isOpen && (
                          <MotionDiv
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
                            itemScope
                            itemProp="acceptedAnswer"
                            itemType="https://schema.org/Answer"
                          >
                            <div className="px-6 pb-6">
                              <div className="pt-2 border-t border-white/10">
                                <p className="text-white/80 text-base md:text-lg leading-relaxed pt-4" itemProp="text">
                                  {answer}
                                </p>
                              </div>
                            </div>
                          </MotionDiv>
                        )}
                      </AnimatePresence>
                    </div>
                  </MotionDiv>
                );
              })}
            </MotionDiv>
          </div>
        </div>
      </div>
    </section>
  );
}
