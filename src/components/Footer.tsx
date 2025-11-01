'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { CalCTAButton } from './CalCTAButton';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer.cta');

  return (
    <footer
      className="bg-[var(--brand-bg)] text-[15px] text-[var(--brand-fg)] antialiased md:text-base [--brand-accent:#00d76b] [--brand-bg:#040404] [--brand-fg:#f7f9fb] [--container-max:1780px] [--gap-x:24px] [--gap-y:28px]"
      aria-labelledby="site-footer-heading"
    >
      <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-10 px-6 py-12 md:gap-12 md:px-12 md:py-16 xl:px-0">
        <h2 id="site-footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="grid gap-x-[var(--gap-x)] gap-y-[var(--gap-y)] text-center md:grid-cols-3">
          <div className="flex flex-col items-center gap-3 md:items-start md:text-left">
            <span className="text-sm uppercase tracking-[0.32em] opacity-70">
              E-mail
            </span>
            <a
              href="mailto:info@expandmatrix.com"
              className="text-3xl font-semibold tracking-tight text-[var(--brand-fg)] transition-transform transition-colors duration-200 hover:text-[var(--brand-accent)] hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)] sm:text-[32px]"
            >
              info@expandmatrix.com
            </a>
          </div>

          <div className="flex items-center justify-center gap-[calc(var(--gap-x)/1.5)]">
            <a
              href="https://www.instagram.com/expandmatrix"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[var(--brand-fg)] transition duration-200 hover:brightness-110 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm11 1a1 1 0 100 2 1 1 0 000-2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/expandmatrix"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[var(--brand-fg)] transition duration-200 hover:brightness-110 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13 3h4a1 1 0 010 2h-3v3h3a1 1 0 01.98 1.197l-.5 3A1 1 0 0115.5 13H14v8a1 1 0 01-1 1h-2a1 1 0 01-1-1v-8H8a1 1 0 01-1-.803l-.5-3A1 1 0 017.48 8H10V6a3 3 0 013-3z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/expandmatrix"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[var(--brand-fg)] transition duration-200 hover:brightness-110 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM4 9h3v12H4zM10 9h2.88v1.71h.04c.4-.75 1.37-1.54 2.83-1.54C18.36 9.17 20 10.66 20 13.42V21h-3v-7.06c0-1.68-.6-2.83-2.1-2.83-1.14 0-1.82.77-2.12 1.51-.11.27-.14.65-.14 1.03V21h-3z" />
              </svg>
            </a>
          </div>

          <div className="flex flex-col items-center gap-4 md:items-end md:text-right">
            <span className="text-sm uppercase tracking-[0.32em] opacity-70">
              {t('label')}
            </span>
            <CalCTAButton className="md:self-end">
              {t('primary')}
            </CalCTAButton>
          </div>
        </div>

        <div
          className="h-px w-full bg-white/10"
          role="presentation"
        />

        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:gap-[var(--gap-x)]">
          <nav
            aria-label="Footer links"
            className="flex flex-col items-center gap-4 md:flex-row md:gap-[var(--gap-x)]"
          >
            <Link
              href="/terms"
              className="rounded-full px-3 py-2 text-[var(--brand-fg)] opacity-80 transition duration-200 hover:opacity-100 hover:underline hover:underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
            >
              Obchodní podmínky
            </Link>
            <Link
              href="/gdpr"
              className="rounded-full px-3 py-2 text-[var(--brand-fg)] opacity-80 transition duration-200 hover:opacity-100 hover:underline hover:underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
            >
              GDPR
            </Link>
            <Link
              href="/cookies"
              className="rounded-full px-3 py-2 text-[var(--brand-fg)] opacity-80 transition duration-200 hover:opacity-100 hover:underline hover:underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
            >
              Cookies
            </Link>
          </nav>

          <p className="text-sm opacity-70 md:text-right">
            Copyright © {currentYear} Expand Matrix s.r.o.
          </p>
        </div>
      </div>
    </footer>
  );
}
