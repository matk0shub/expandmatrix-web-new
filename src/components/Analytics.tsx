import Script from 'next/script';

/**
 * Privacy-friendly analytics. Only renders when both env vars are set so the
 * default build stays tracking-free. Plausible is the default; if you want
 * Umami instead, swap the script URL.
 *
 * Set in Netlify UI:
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=expandmatrix.com
 *   NEXT_PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js   # optional
 */
export default function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? 'https://plausible.io/js/script.js';

  return (
    <Script
      defer
      data-domain={domain}
      src={src}
      strategy="afterInteractive"
    />
  );
}
