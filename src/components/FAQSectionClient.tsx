'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Plus, X } from 'lucide-react';
import type { FAQ } from '@/types/faqs';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { CalCTAButton } from './CalCTAButton';
import AnimatedHeading from './AnimatedHeading';
import { useFramerMotion } from '@/hooks/useFramerMotion';
import { fallbackMotion, FallbackAnimatePresence } from '@/utils/motionFallback';
import AnimatedReveal from './AnimatedReveal';

interface FAQSectionCopy {
  titleLine1: string;
  titleLine2: string;
  ctaOverline: string;
  ctaButton: string;
  emptyState: string;
}

interface FAQSectionClientProps {
  locale: string;
  faqs: FAQ[];
  copy: FAQSectionCopy;
}

const resolveLocalized = (value: { cs: string; en: string }, locale: string) =>
  locale.startsWith('cs') ? value.cs ?? value.en : value.en ?? value.cs;

export default function FAQSectionClient({ locale, faqs, copy }: FAQSectionClientProps) {
  const prefersReducedMotion = useReducedMotion();
  const framer = useFramerMotion('idle');
  const MotionDiv = framer?.motion.div ?? fallbackMotion.div;
  const AnimatePresence = framer?.AnimatePresence ?? FallbackAnimatePresence;

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  const list = useMemo(() => faqs ?? [], [faqs]);

  const handleToggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle(index);
      return;
    }

    const lastIndex = list.length - 1;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = Math.min(index + 1, lastIndex);
      document.getElementById(`faq-button-${nextIndex}`)?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = Math.max(index - 1, 0);
      document.getElementById(`faq-button-${prevIndex}`)?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      document.getElementById('faq-button-0')?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      document.getElementById(`faq-button-${lastIndex}`)?.focus();
    }
  };

  useEffect(() => {
    if (openIndex === null || !accordionRef.current) {
      return;
    }

    const openItem = accordionRef.current.children[openIndex] as HTMLElement | undefined;
    if (!openItem) {
      return;
    }

    openItem.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
    });
  }, [openIndex, prefersReducedMotion]);

  return (
    <section
      className="relative isolate w-full bg-gradient-to-b from-black via-[#041109] to-black py-24 md:py-40 lg:py-48 overflow-hidden"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[8%] left-[8%] h-[480px] w-[520px] blur-3xl opacity-70"
          style={{
            background:
              'radial-gradient(ellipse 58% 42%, rgba(0, 255, 176, 0.8) 0%, rgba(0, 215, 107, 0.56) 52%, rgba(0, 184, 92, 0.25) 80%, transparent 92%)',
          }}
        />
        <div
          className="absolute top-[6%] right-[10%] h-[500px] w-[540px] blur-3xl opacity-62"
          style={{
            background:
              'radial-gradient(ellipse 58% 48%, rgba(110, 255, 210, 0.8) 0%, rgba(0, 215, 107, 0.5) 48%, rgba(0, 184, 92, 0.26) 72%, transparent 90%)',
          }}
        />
        <div
          className="absolute top-[44%] left-[22%] h-[420px] w-[420px] blur-3xl opacity-52"
          style={{
            background:
              'radial-gradient(ellipse 62% 44%, rgba(0, 215, 135, 0.68) 0%, rgba(0, 184, 92, 0.42) 58%, transparent 86%)',
          }}
        />
        <div
          className="absolute bottom-[24%] right-[24%] h-[420px] w-[440px] blur-3xl opacity-58"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 215, 125, 0.66) 0%, rgba(0, 184, 92, 0.4) 60%, transparent 86%)',
          }}
        />
        <div
          className="absolute bottom-[10%] left-[46%] h-[320px] w-[340px] blur-3xl opacity-50"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 255, 172, 0.6) 0%, rgba(0, 215, 107, 0.38) 55%, transparent 82%)',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-black via-[#03150df5] to-transparent opacity-100" />
        <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-black via-[#03150df5] to-transparent opacity-100" />
        <div className="absolute inset-y-0 left-0 w-[320px] bg-gradient-to-r from-black via-[#03150df5] to-transparent opacity-100" />
        <div className="absolute inset-y-0 right-0 w-[320px] bg-gradient-to-l from-black via-[#03150df5] to-transparent opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_56%,rgba(0,0,0,0.78)_100%)] opacity-80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.55),transparent_30%,transparent_70%,rgba(0,0,0,0.55))]" />
      </div>

      <div className="w-full max-w-[1780px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          <div className="flex flex-col min-h-[260px] md:min-h-[380px] py-2 md:py-4">
            <div className="flex flex-1 flex-col justify-start gap-6 md:gap-8 lg:gap-10">
              <AnimatedHeading as="h2" className="heading-main">
                <div>{copy.titleLine1}</div>
                <div>{copy.titleLine2}</div>
              </AnimatedHeading>

              <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="flex justify-start items-end mt-2"
              >
                <div className="text-left max-w-md">
                  <p className="text-white/80 text-base md:text-lg lg:text-xl leading-relaxed mb-4 md:mb-5 font-lato">
                    {copy.ctaOverline}
                  </p>
                  <CalCTAButton>{copy.ctaButton}</CalCTAButton>
                </div>
              </MotionDiv>
            </div>
          </div>

          <div className="space-y-4">
            {list.length === 0 ? (
              <p className="text-white/70 text-base md:text-lg">{copy.emptyState}</p>
            ) : (
              <MotionDiv
                ref={accordionRef}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                className="space-y-4"
              >
                {list.map((faq, index) => {
                  const isOpen = openIndex === index;
                  const question = resolveLocalized(faq.question, locale);
                  const answer = resolveLocalized(faq.answer, locale);

                  return (
                    <AnimatedReveal
                      key={faq.id}
                      direction="up"
                      delay={index * 0.12}
                      distance={160}
                      viewportAmount={0.55}
                      fade={false}
                      className="relative"
                      itemScope
                      itemProp="mainEntity"
                      itemType="https://schema.org/Question"
                    >
                      <div className="relative bg-[#0B0B0B] rounded-3xl border border-white/10 overflow-hidden shadow-lg">
                        <meta itemProp="name" content={question} />
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00d76b] to-[#00b85c] opacity-60" />
                        <button
                          id={`faq-button-${index}`}
                          onClick={() => handleToggle(index)}
                          onKeyDown={(event) => handleKeyDown(event, index)}
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
                                boxShadow: '0 8px 25px rgba(0, 215, 107, 0.4)',
                              }}
                              whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              <MotionDiv
                                animate={{ rotate: isOpen ? 45 : 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
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

                        <AnimatePresence>
                          {isOpen && (
                            <MotionDiv
                              id={`faq-panel-${index}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: prefersReducedMotion ? 0.1 : 0.3,
                                ease: 'easeInOut',
                              }}
                              className="overflow-hidden"
                              itemProp="acceptedAnswer"
                              itemScope
                              itemType="https://schema.org/Answer"
                            >
                              <div className="px-6 pb-6">
                                <p
                                  className="text-white/80 text-base md:text-lg leading-relaxed font-lato"
                                  itemProp="text"
                                >
                                  {answer}
                                </p>
                              </div>
                            </MotionDiv>
                          )}
                        </AnimatePresence>
                      </div>
                    </AnimatedReveal>
                  );
                })}
              </MotionDiv>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
