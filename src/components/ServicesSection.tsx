import { getTranslations } from 'next-intl/server';
import clsx from 'clsx';

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
  const defaultOpen = index === 0;

  return (
    <details
      className={clsx(
        'group relative w-full overflow-hidden',
        'min-h-[260px] md:min-h-[320px] lg:min-h-[360px]',
        'rounded-3xl bg-gradient-to-br from-black/95 via-black/98 to-black/99',
        'border border-white/10 shadow-[0_35px_120px_rgba(0,0,0,0.6)]',
        'backdrop-blur-2xl transition-all duration-500',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d76b]/40 focus-visible:ring-offset-4 focus-visible:ring-offset-black',
        'hover:scale-[1.02] hover:rotate-[0.35deg]',
      )}
      defaultOpen={defaultOpen}
    >
      <CardBackgroundLayers />

      <summary
        className={clsx(
          'relative z-10 list-none cursor-pointer',
          'p-6 sm:p-8 md:p-10 lg:p-12',
          'flex flex-col items-center justify-center gap-4 text-center text-balance',
          '[&::-webkit-details-marker]:hidden',
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
              'group-open:bg-green-400 group-open:scale-110',
            )}
          >
            <PlusIcon className="transition-transform duration-300 group-hover:rotate-90 group-open:rotate-90" />
          </div>
          <div
            className={clsx(
              'absolute inset-0 rounded-full bg-green-500/50 blur-xl opacity-0 transition-opacity duration-300',
              'group-hover:opacity-100 group-open:opacity-100',
            )}
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-3">
          <h3
            className={clsx(
              'text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight transition-opacity duration-500',
              'group-hover:opacity-0 group-open:opacity-0',
            )}
          >
            {service.title}
          </h3>
          <div className="h-1 w-20 rounded-full bg-gradient-to-r from-[#00d76b] to-[#00b85c] opacity-80 transition-opacity duration-500 group-hover:opacity-0 group-open:opacity-0" />
        </div>
      </summary>

      <div
        className={clsx(
          'relative z-10 px-6 sm:px-8 md:px-10 lg:px-12 pb-8 text-center',
          'text-white/90 text-sm sm:text-base md:text-lg leading-relaxed font-lato font-medium',
          'opacity-0 translate-y-2 transition-all duration-500',
          'group-open:opacity-100 group-open:translate-y-0',
        )}
      >
        {service.description}
      </div>
    </details>
  );
}

function CardBackgroundLayers() {
  return (
    <>
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-white/[0.02] pointer-events-none mix-blend-normal" />
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/[0.04] to-transparent opacity-40 pointer-events-none mix-blend-normal" />
      <div className="absolute inset-0 rounded-3xl border border-white/10 opacity-80 pointer-events-none" />
      <div className="absolute inset-0 rounded-3xl animate-border-glow pointer-events-none" />
      <div className="absolute inset-0 rounded-3xl bg-white/0 transition-all duration-500 pointer-events-none group-hover:bg-white/[0.02] group-hover:backdrop-blur-sm peer-checked:bg-white/[0.02]" />
      <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-[#00d76b] to-[#00b85c] opacity-80 rounded-b-3xl" />
    </>
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
