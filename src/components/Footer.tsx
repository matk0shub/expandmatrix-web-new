"use client";

import { useEffect, useState, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import FooterBrand from './FooterBrand';
import FooterLinks, { type FooterLinkGroup } from './FooterLinks';
import FooterNewsletter from './FooterNewsletter';
import FooterBottomBar from './FooterBottomBar';

type GSAPTimeline = gsap.core.Timeline;

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  // Scroll progress for future parallax effects (currently unused)
  // const { scrollYProgress } = useScroll({
  //   target: footerRef,
  //   offset: ["start end", "end end"]
  // });

  const [groups, setGroups] = useState<FooterLinkGroup[]>([]);
  const [social, setSocial] = useState<{ instagram?: string; linkedin?: string; twitter?: string }>({});

  // Parallax transforms for background elements (currently unused but kept for future enhancements)
  // const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  // const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.4]);

  // Simplified animations for better performance
  const { ref: brandRef } = useGSAPAnimation({
    selector: '.footer-brand-item',
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    stagger: 0.1,
    duration: 0.6,
    ease: 'power2.out'
  });

  const { ref: linksRef } = useGSAPAnimation({
    selector: '.footer-link-group',
    from: { opacity: 0, y: 15 },
    to: { opacity: 1, y: 0 },
    stagger: 0.05,
    duration: 0.5,
    ease: 'power2.out'
  });

  const { ref: newsletterRef } = useGSAPAnimation({
    selector: '.footer-newsletter-item',
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    stagger: 0.1,
    duration: 0.6,
    ease: 'power2.out'
  });

  // Convert refs to proper div refs
  const brandDivRef = brandRef as React.RefObject<HTMLDivElement>;
  const linksDivRef = linksRef as React.RefObject<HTMLDivElement>;
  const newsletterDivRef = newsletterRef as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [linksRes, socialRes] = await Promise.all([
          fetch(`/api/footer-links?locale=${locale}`),
          fetch(`/api/site-settings?locale=${locale}`),
        ]);
        if (!mounted) return;
        if (linksRes.ok) {
          const data = await linksRes.json();
          setGroups(data.groups || []);
        }
        if (socialRes.ok) {
          const data = await socialRes.json();
          setSocial(data.social || {});
        }
      } catch {
        // silent fail; footer still renders
      }
    };
    fetchData();
    return () => { mounted = false };
  }, [locale]);

  // Animated separator line effect
  useEffect(() => {
    if (prefersReducedMotion) return;

    let timeline: GSAPTimeline | null = null;
    let isCancelled = false;

    (async () => {
      const { gsap } = await import('gsap');
      if (isCancelled) {
        return;
      }

      timeline = gsap.timeline({ delay: 0.5 });
      timeline.fromTo(
        '.footer-separator',
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1.2, ease: 'power3.out' }
      );

      timeline.to(
        '.footer-glow-pulse',
        {
          opacity: 0.8,
          duration: 2,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1,
        },
        '-=0.5'
      );
    })();

    return () => {
      isCancelled = true;
      timeline?.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <footer 
      ref={footerRef}
      className="relative w-full overflow-hidden bg-black"
      role="contentinfo"
      aria-label={t('nav')}
    >
      {/* Simplified background for better performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
        
        {/* Simple brand green accent */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#00d76b]/5 via-transparent to-[#00d76b]/10" />
      </div>

      {/* Main footer content */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        whileInView={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-8 py-20 md:py-24"
      >
        {/* Animated separator line */}
        <div className="footer-separator w-full h-px bg-gradient-to-r from-transparent via-[#00d76b]/30 to-transparent mb-16 md:mb-20 origin-left" />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20">
          {/* Brand section */}
          <div className="lg:col-span-4">
            <div ref={brandDivRef}>
              <FooterBrand 
                instagramUrl={social.instagram} 
                linkedinUrl={social.linkedin} 
                twitterUrl={social.twitter} 
              />
            </div>
          </div>

          {/* Navigation links */}
          <div className="lg:col-span-5">
            <div ref={linksDivRef}>
              <FooterLinks groups={groups} />
            </div>
          </div>

          {/* Newsletter section */}
          <div className="lg:col-span-3">
            <div ref={newsletterDivRef}>
              <FooterNewsletter />
            </div>
          </div>
        </div>

        {/* Bottom section with separator */}
        <div className="mt-16 md:mt-20">
          <div className="footer-separator w-full h-px bg-gradient-to-r from-transparent via-[#00d76b]/20 to-transparent mb-8 origin-left" />
          <FooterBottomBar />
        </div>
      </motion.div>

    </footer>
  );
}
