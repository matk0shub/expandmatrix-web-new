import { getTranslations } from 'next-intl/server';
import clsx from 'clsx';
import type { CSSProperties } from 'react';

import AnimatedReveal from './AnimatedReveal';
import GlassCardOverlays from './GlassCardOverlays';

interface ServicesSectionProps {
  locale: string;
}

type ServiceItem = {
  key: string;
  number: string;
  title: string;
  description: string;
};

const PlusIcon = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={clsx('h-5 w-5 text-white', className)}
    aria-hidden="true"
  >
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default async function ServicesSection({ locale }: ServicesSectionProps) {
  const t = await getTranslations({ locale, namespace: 'sections.services' });

  const services: ServiceItem[] = [
    {
      key: 'ai-agents',
      number: t('services.ai-agents.number'),
      title: t('services.ai-agents.title'),
      description: t('services.ai-agents.description'),
    },
    {
      key: 'web-development',
      number: t('services.web-development.number'),
      title: t('services.web-development.title'),
      description: t('services.web-development.description'),
    },
    {
      key: 'ai-implementation',
      number: t('services.ai-implementation.number'),
      title: t('services.ai-implementation.title'),
      description: t('services.ai-implementation.description'),
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-black py-24 md:py-40 lg:py-48">
      <BackgroundOrnaments />
      <div className="w-full max-w-[1780px] mx-auto relative px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24">
        <div className="mb-20 lg:mb-32">
          <div className="relative inline-block mb-8">
            <h2 className="heading-main text-balance">{t('title')}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {services.map((service, index) => (
            <AnimatedReveal
              key={service.key}
              className="relative w-full"
              direction="up"
              distance={220}
              delay={index * 0.12}
              viewportAmount={0.5}
              fade={false}
            >
              <ServiceCard service={service} index={index} />
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const controlId = `service-card-${service.key}-${index}`;
  const defaultChecked = index === 0;
  const glowDelay = index * 0.45;
  const glowDuration = `${3 + index * 0.4}s`;
  return (
    <div className="group/card relative w-full">
      <input
        type="checkbox"
        id={controlId}
        className="sr-only"
        defaultChecked={defaultChecked}
        aria-label={service.title}
      />
      <label
        htmlFor={controlId}
        className={clsx(
          'group relative block overflow-hidden cursor-pointer rounded-3xl',
          'bg-gradient-to-br from-black/95 via-black/98 to-black/99 backdrop-blur-2xl',
          'shadow-[0_35px_120px_rgba(0,0,0,0.55)] transition-all duration-500',
          'focus-visible:ring-2 focus-visible:ring-[#00d76b]/40 focus-visible:ring-offset-4 focus-visible:ring-offset-black',
          'hover:scale-[1.02] hover:rotate-[0.15deg]',
          'min-h-[260px] md:min-h-[320px] lg:min-h-[360px] px-6 py-10 sm:px-8 sm:py-12',
        )}
      >
        <GlassCardOverlays
          gradientOrder="rounded-first"
          glowStyle={
            {
              '--glow-delay': glowDelay ? `${glowDelay}s` : undefined,
              '--glow-duration': glowDuration,
            } as CSSProperties
          }
          accentOpacity="opacity-80"
          hoverOverlay
        />
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between px-1 pb-4 sm:px-0">
            <div className="text-white/70 font-lato text-lg sm:text-xl md:text-2xl font-semibold">
              {service.number}
            </div>
            <span
              className={clsx(
                'inline-flex items-center justify-center rounded-full bg-green-500 transition-all duration-300',
                'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12',
                'group-hover:bg-green-400 group-hover:scale-110',
                'touch:group-has-[input:checked]/card:bg-green-400 touch:group-has-[input:checked]/card:scale-110',
              )}
            >
              <PlusIcon className="transition-transform duration-300 group-hover:rotate-90 touch:group-has-[input:checked]/card:rotate-90" />
            </span>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-6 sm:px-8 text-center text-balance">
            <div
              className={clsx(
                'absolute inset-0 flex items-center justify-center px-4 text-center text-balance',
                'translate-y-14 sm:translate-y-16 lg:translate-y-20',
              )}
            >
              <h3
                className={clsx(
                  'w-full max-w-[24ch] text-center text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mx-auto',
                  'transition-opacity duration-500 group-hover:opacity-0 touch:group-has-[input:checked]/card:opacity-0',
                )}
              >
                {service.title}
              </h3>
            </div>
            <div
              className={clsx(
                'absolute inset-0 flex items-center justify-center px-4 text-center text-balance',
                'translate-y-14 sm:translate-y-16 lg:translate-y-20',
              )}
            >
              <p
                className={clsx(
                  'w-full max-w-[32ch] text-white/90 text-sm sm:text-base md:text-lg leading-relaxed font-lato font-medium mx-auto',
                  'opacity-0 scale-95 transition-all duration-500',
                  'group-hover:opacity-100 group-hover:scale-100',
                  'touch:group-has-[input:checked]/card:opacity-100 touch:group-has-[input:checked]/card:scale-100',
                )}
              >
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
}

function BackgroundOrnaments() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute top-[5%] left-[8%] w-[550px] h-[420px] blur-3xl opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 55% 45%, rgba(0, 255, 120, 0.8) 0%, rgba(0, 215, 107, 0.6) 40%, rgba(0, 184, 92, 0.3) 70%, transparent 85%)',
        }}
      />
      <div
        className="absolute top-[10%] right-[5%] w-[600px] h-[450px] blur-3xl opacity-65"
        style={{
          background:
            'radial-gradient(ellipse 50% 50%, rgba(0, 255, 120, 0.85) 0%, rgba(0, 215, 107, 0.65) 35%, rgba(0, 184, 92, 0.4) 65%, transparent 80%)',
        }}
      />
      <div
        className="absolute top-1/2 left-[2%] w-[420px] h-[360px] blur-3xl opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 60% 40%, rgba(0, 184, 92, 0.7) 0%, rgba(0, 215, 107, 0.5) 50%, transparent 75%)',
        }}
      />
      <div
        className="absolute bottom-[15%] right-[8%] w-[480px] h-[380px] blur-3xl opacity-55"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 215, 107, 0.7) 0%, rgba(0, 255, 120, 0.5) 45%, rgba(0, 184, 92, 0.3) 70%, transparent 85%)',
        }}
      />
      <div
        className="absolute bottom-[8%] left-[15%] w-[350px] h-[300px] blur-3xl opacity-45"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 255, 120, 0.6) 0%, rgba(0, 215, 107, 0.4) 55%, transparent 75%)',
        }}
      />
      <div
        className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[400px] h-[320px] blur-3xl opacity-45"
        style={{
          background:
            'radial-gradient(ellipse 45% 55%, rgba(0, 215, 107, 0.6) 0%, rgba(0, 184, 92, 0.4) 50%, transparent 75%)',
        }}
      />
      <div className="absolute top-1/5 left-3/4 w-1 h-1 bg-green-400 rounded-full opacity-60 animate-ping shadow-lg shadow-green-400" />
      <div className="absolute top-2/3 left-1/5 w-2 h-2 bg-green-500 rounded-full opacity-40 animate-ping shadow-lg shadow-green-500" />
      <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-green-400 rounded-full opacity-50 animate-ping shadow-lg shadow-green-400" />
    </div>
  );
}
