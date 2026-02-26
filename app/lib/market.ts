export interface Market {
  country: string;
  language: string;
  currency: string;
  name: string;
}

export const MARKETS: Market[] = [
  { country: 'US', language: 'EN', currency: 'USD', name: 'United States' },
  { country: 'GB', language: 'EN', currency: 'GBP', name: 'United Kingdom' },
  { country: 'EU', language: 'EN', currency: 'EUR', name: 'European Union' },
  { country: 'FR', language: 'FR', currency: 'EUR', name: 'France' },
  { country: 'DE', language: 'DE', currency: 'EUR', name: 'Germany' },
];

export function getMarketFromUrl(url: URL): Market {
  const hostname = url.hostname;
  const pathname = url.pathname;

  // Check for /en-us, /fr-fr, etc.
  const marketMatch = pathname.match(/^\/([a-z]{2})-([a-z]{2})(\/|$)/i);
  if (marketMatch) {
    const [, language, country] = marketMatch;
    const market = MARKETS.find(
      (m) =>
        m.language.toLowerCase() === language &&
        m.country.toLowerCase() === country,
    );
    if (market) return market;
  }

  // Check subdomain: us.store.com, uk.store.com
  const subdomain = hostname.split('.')[0]?.toLowerCase();
  const subdomainMarket = MARKETS.find(
    (m) => m.country.toLowerCase() === subdomain,
  );
  if (subdomainMarket) return subdomainMarket;

  return MARKETS[0];
}

export function formatPrice(
  amount: string,
  currency: string,
  locale = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(parseFloat(amount));
}
