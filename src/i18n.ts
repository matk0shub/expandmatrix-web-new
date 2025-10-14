import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'cs'];

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming `locale` parameter is valid
  let locale = await requestLocale;
  
  // Ensure locale is valid
  if (!locale || !locales.includes(locale)) {
    locale = 'en'; // default to English
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
