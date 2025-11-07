'use client';

import { ArrowRight } from 'lucide-react';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
  useCallback,
} from 'react';

import { useCalEmbed } from '@/hooks/useCalEmbed';

const BASE_CLASSES =
  'group relative inline-flex items-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-[#00d76b] to-[#00b85c] text-white font-semibold rounded-full hover:from-[#00e673] hover:to-[#00d76b] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-sm md:text-base cursor-pointer font-lato focus:outline-none focus:ring-4 focus:ring-[#00d76b]/50 disabled:cursor-wait disabled:opacity-80';

const LoaderIndicator = () => (
  <span
    aria-hidden="true"
    className="relative flex h-4 w-4 items-center justify-center md:h-5 md:w-5"
  >
    <span className="absolute h-full w-full rounded-md border border-white/20 opacity-75 animate-ping" />
    <span className="relative h-2.5 w-2.5 rounded-md bg-white/90 animate-pulse md:h-3 md:w-3" />
  </span>
);

type CalCTAButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'children'> & {
  children: ReactNode;
  showIcon?: boolean;
};

export const CalCTAButton = forwardRef<HTMLButtonElement, CalCTAButtonProps>(
  (
    {
      children,
      className,
      showIcon = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const { status, openCal } = useCalEmbed();
    const composedClassName = className ? `${BASE_CLASSES} ${className}` : BASE_CLASSES;
    const isOpening = status === 'opening';

    const handleClick = useCallback(
      async (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        await openCal();
      },
      [onClick, openCal]
    );

    return (
      <button
        ref={ref}
        type="button"
        className={composedClassName}
        aria-busy={isOpening}
        disabled={isOpening}
        onClick={handleClick}
        {...props}
      >
        <span className="relative z-10 uppercase tracking-wide">{children}</span>
        {showIcon && !isOpening && (
          <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
        )}
        {showIcon && isOpening && <LoaderIndicator />}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-[#00d76b]/20 to-[#00b85c]/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
      </button>
    );
  }
);

CalCTAButton.displayName = 'CalCTAButton';
