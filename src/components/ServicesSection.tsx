import { getTranslations } from 'next-intl/server';
import clsx from 'clsx';
import type { CSSProperties } from 'react';

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
            <ServiceCard key={service.key} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const controlId = `service-card-${service.key}-${index}`;

  return (
    <div className="relative">
      <input
        type="checkbox"
        id={controlId}
        className="peer sr-only"
        aria-label={service.title}
      />
      <label
        htmlFor={controlId}
        className={clsx(
          'group relative w-full cursor-pointer',
          'min-h-[260px] md:min-h-[320px] lg:min-h-[360px]',
          'rounded-3xl bg-gradient-to-br from-black/98 via-black/95 to-black/90',
          'backdrop-blur-2xl transition-all duration-500',
          'focus-within:ring-2 focus-within:ring-[#00d76b]/40 focus-within:ring-offset-4 focus-within:ring-offset-black',
          'hover:scale-[1.02]',
        )}
      >
        <CardGlow index={index} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-white/[0.02] rounded-3xl pointer-events-none mix-blend-normal" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent opacity-50 rounded-3xl pointer-events-none mix-blend-normal" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-40 rounded-3xl pointer-events-none mix-blend-normal" />
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/[0.04] to-transparent opacity-30 rounded-3xl pointer-events-none mix-blend-normal" />
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-[#00d76b] to-[#00b85c] opacity-60 rounded-b-3xl" />

        <div
          className={clsx(
            'relative z-10',
            'p-6 sm:p-8 md:p-10 lg:p-12',
            'h-full flex flex-col items-center justify-center text-center gap-4',
          )}
        >
          <div className="absolute top-6 left-6 z-30 text-lg sm:text-xl md:text-2xl text-white/70 font-medium font-lato">
            {service.number}
          </div>
          <div className="absolute top-6 right-6 z-30">
            <div
              className={clsx(
                'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-green-500 flex items-center justify-center transition-all duration-300',
                'group-hover:bg-green-400 group-hover:scale-110',
                'peer-checked:bg-green-400 peer-checked:scale-110',
              )}
            >
              <PlusIcon className="transition-transform duration-300 group-hover:rotate-90 peer-checked:rotate-90" />
            </div>
            <div
              className={clsx(
                'absolute inset-0 rounded-full bg-green-500/50 blur-xl opacity-0 transition-opacity duration-300',
                'group-hover:opacity-100 peer-checked:opacity-100',
              )}
            />
          </div>

          <h3
            className={clsx(
              'heading-secondary m-0 max-w-[90%] text-center text-lg sm:text-xl md:text-2xl leading-tight sm:leading-snug md:leading-snug transition-opacity duration-500',
              'group-hover:opacity-0 peer-checked:opacity-0',
            )}
          >
            {service.title}
          </h3>

          <p
            className={clsx(
              'm-0 max-w-[90%] text-white/90 text-sm sm:text-base md:text-lg leading-relaxed font-lato font-medium text-center transition-all duration-500',
              'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0',
              'peer-checked:opacity-100 peer-checked:translate-y-0',
            )}
          >
            {service.description}
          </p>
        </div>
      </label>
    </div>
  );
}

function CardGlow({ index }: { index: number }) {
  const delay = `${(index % 3) * 0.45}s`;
  const duration = `${2.4 + (index % 4) * 0.5}s`;
  return (
    <div
      className="absolute inset-0 rounded-3xl animate-border-glow pointer-events-none"
      style={{ '--glow-delay': delay, '--glow-duration': duration } as CSSProperties}
      aria-hidden
    />
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
