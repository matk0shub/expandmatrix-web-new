'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import ScrambleText from './ScrambleText';

type FormValues = { email: string; consent: boolean };

export default function FooterNewsletter() {
  const t = useTranslations('footer.newsletter');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setError, clearErrors } = useForm<FormValues>({
    defaultValues: { email: '', consent: false },
  });


  // Animated input underline effect
  useEffect(() => {
    if (!inputRef.current) return;

    const input = inputRef.current;
    const underline = input.parentElement?.querySelector('.input-underline') as HTMLElement;
    
    if (!underline) return;

    const updateUnderline = () => {
      if (input.value.length > 0) {
        gsap.to(underline, { scaleX: 1, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.to(underline, { scaleX: 0, duration: 0.3, ease: 'power2.out' });
      }
    };

    input.addEventListener('input', updateUnderline);
    input.addEventListener('focus', () => {
      gsap.to(underline, { scaleX: 1, duration: 0.3, ease: 'power2.out' });
    });
    input.addEventListener('blur', updateUnderline);

    return () => {
      input.removeEventListener('input', updateUnderline);
      input.removeEventListener('focus', updateUnderline);
      input.removeEventListener('blur', updateUnderline);
    };
  }, []);

  // Button glow effect
  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    
    const handleMouseEnter = () => {
      gsap.to(button, {
        boxShadow: '0 0 20px rgba(0, 215, 107, 0.4)',
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        boxShadow: '0 0 0px rgba(0, 215, 107, 0)',
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      setStatus('loading');
      setMessage('');
      clearErrors();
      
      // Simple email validation
      const emailValid = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(data.email);
      if (!emailValid) {
        setError('email', { type: 'validate', message: t('emailError') });
        setStatus('idle');
        return;
      }
      if (!data.consent) {
        setError('consent', { type: 'validate', message: 'required' });
        setStatus('idle');
        return;
      }
      
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, locale, consent: data.consent }),
      });
      
      if (!res.ok) throw new Error('Request failed');
      await res.json();
      
      setStatus('success');
      setMessage(t('success'));
      reset();
    } catch {
      setStatus('error');
      setMessage(t('error'));
    } finally {
      setStatus('idle');
    }
  };

  return (
    <section aria-labelledby="newsletter-heading" className="w-full max-w-md">
      {/* Animated header with scramble effect */}
      <motion.div className="footer-newsletter-item">
        <h2 id="newsletter-heading" className="text-white font-semibold text-base tracking-wide mb-2">
          <ScrambleText
            text={t('title')}
            className="font-lato"
            applyScramble={false}
            trigger="mount"
            speed={0.8}
            range={[65, 125]}
          />
        </h2>
        <p className="text-white/80 text-sm mb-6 font-lato">{t('helper')}</p>
      </motion.div>

      {/* Premium form with animated elements */}
      <motion.div 
        className="footer-newsletter-item"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4" aria-live="polite">
          {/* Email input with animated underline */}
          <div className="relative">
            <label htmlFor="newsletter-email" className="sr-only">{t('emailLabel')}</label>
            <div className="relative">
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={t('emailPlaceholder')}
                {...register('email')}
                ref={(e) => {
                  inputRef.current = e;
                  register('email').ref(e);
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'newsletter-email-error' : undefined}
                className="w-full h-12 px-4 pl-12 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[#00d76b]/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              {/* Animated underline */}
              <div className="input-underline absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00d76b] to-[#00b85c] scale-x-0 origin-left" />
            </div>
            {errors.email && (
              <motion.p 
                id="newsletter-email-error" 
                className="mt-2 text-sm text-red-400 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="w-4 h-4" />
                {t('emailError')}
              </motion.p>
            )}
          </div>

          {/* Premium CTA button */}
          <motion.button
            ref={buttonRef}
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full h-12 px-6 rounded-xl bg-gradient-to-r from-[#00d76b] to-[#00b85c] text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#00d76b]/40 transition-all duration-300 overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00e673] to-[#00d76b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Button content */}
            <div className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('loading')}</span>
                </>
              ) : (
                <>
                  <span>{t('cta')}</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    →
                  </motion.div>
                </>
              )}
            </div>
          </motion.button>

          {/* Consent checkbox with enhanced styling */}
          <motion.div 
            className="flex items-start gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="relative">
              <input
                id="newsletter-consent"
                type="checkbox"
                {...register('consent')}
                aria-invalid={!!errors.consent}
                className="w-5 h-5 mt-0.5 rounded border-white/30 bg-transparent text-[#00d76b] focus:ring-[#00d76b] focus:ring-offset-0 focus:ring-2"
              />
              {errors.consent && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse" />
              )}
            </div>
            <label htmlFor="newsletter-consent" className="text-white/70 text-xs leading-5 font-lato">
              {t('consentText.before')} 
              <a 
                href={`/${locale}/privacy`} 
                className="underline decoration-[#00d76b] underline-offset-2 hover:text-white transition-colors duration-300"
              >
                {t('consentText.link')}
              </a> 
              {t('consentText.after')}
            </label>
          </motion.div>
        </form>
      </motion.div>

      {/* Status messages with animations */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            className="footer-newsletter-item mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-300 text-sm font-medium">{t('success')}</p>
            </div>
          </motion.div>
        )}
        
        {status === 'error' && (
          <motion.div
            className="footer-newsletter-item mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300 text-sm font-medium">{t('error')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden live region for screen readers */}
      <div className="sr-only" aria-live="polite">{message}</div>
    </section>
  );
}


