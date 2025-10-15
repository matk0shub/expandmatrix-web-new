import localFont from 'next/font/local';

// Centralized font configuration ensures consistent fallbacks and font-display
// settings across both server and client components while letting Next.js
// preload the required font files.
export const lato = localFont({
  src: [
    {
      path: '../../public/fonts/lato-v25-latin-300.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/lato-v25-latin-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/lato-v25-latin-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-lato',
  preload: true,
});
