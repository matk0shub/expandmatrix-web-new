'use client';

import { ArrowRight } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

const BASE_CLASSES =
  'group relative inline-flex items-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-[#00d76b] to-[#00b85c] text-white font-semibold rounded-full hover:from-[#00e673] hover:to-[#00d76b] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-sm md:text-base cursor-pointer font-lato focus:outline-none focus:ring-4 focus:ring-[#00d76b]/50';

type CalCTAButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'children'> & {
  children: ReactNode;
  showIcon?: boolean;
};

export const CalCTAButton = forwardRef<HTMLButtonElement, CalCTAButtonProps>(
  ({ children, className, showIcon = true, ...props }, ref) => {
    const composedClassName = className ? `${BASE_CLASSES} ${className}` : BASE_CLASSES;

    return (
      <button
        ref={ref}
        type="button"
        data-cal-namespace="strategy"
        data-cal-link="team/em-core/strategy"
        data-cal-origin="https://meet.expandmatrix.com"
        data-cal-config='{"layout":"month_view"}'
        className={composedClassName}
        style={{ border: 'none', outline: 'none' }}
        {...props}
      >
        <span className="relative z-10 uppercase tracking-wide">{children}</span>
        {showIcon && (
          <ArrowRight className="relative z-10 w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
        )}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00d76b]/20 to-[#00b85c]/20 opacity-0 transition-opacity duration-300 blur-xl group-hover:opacity-100" />
      </button>
    );
  }
);

CalCTAButton.displayName = 'CalCTAButton';
