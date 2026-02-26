import {
  createStorefrontClient,
  createCartHandler,
  cartGetIdDefault,
  cartSetIdDefault,
  createCustomerAccountClient,
} from '@shopify/hydrogen';
import {
  createRequestHandler,
  getStorefrontHeaders,
} from '@shopify/remix-oxygen';
import { HydrogenSession } from '~/lib/session.server';
import { getMarketFromUrl } from '~/lib/market';
import { getFeatureFlags } from '~/lib/flags.server';
import { ServerTracker } from '~/lib/tracking.server';
import type { AppLoadContext } from '@shopify/remix-oxygen';

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const waitUntil = executionContext.waitUntil.bind(executionContext);
      const [cache, session] = await Promise.all([
        caches.open('hydrogen'),
        HydrogenSession.init(request, [env.SESSION_SECRET]),
      ]);

      const url = new URL(request.url);
      const market = getMarketFromUrl(url);
      const flags = getFeatureFlags(env, request);
      const tracker = new ServerTracker(request, env);

      // Track page view server-side
      waitUntil(tracker.trackPageView());

      const { storefront } = createStorefrontClient({
        cache,
        waitUntil,
        i18n: { language: market.language as any, country: market.country as any },
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontHeaders: getStorefrontHeaders(request),
        storefrontId: env.PUBLIC_STOREFRONT_ID,
        requestGroupId: request.headers.get('request-id'),
      });

      const customerAccount = createCustomerAccountClient({
        waitUntil,
        request,
        session,
        customerAccountId: env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
        customerAccountUrl: env.PUBLIC_CUSTOMER_ACCOUNT_API_URL,
      });

      const cartHandler = createCartHandler({
        storefront,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault(),
        customerAccount,
      });

      const handleRequest = createRequestHandler({
        build: await import('./build/server/index.js'),
        mode: process.env.NODE_ENV as 'development' | 'production',
        getLoadContext: (): AppLoadContext => ({
          env,
          storefront,
          customerAccount,
          cart: cartHandler,
          session,
          waitUntil,
          market,
          flags,
          tracker,
        }),
      });

      return await handleRequest(request);
    } catch (error) {
      console.error(error);
      return new Response('An error occurred', { status: 500 });
    }
  },
};

type Env = {
  SESSION_SECRET: string;
  PUBLIC_STOREFRONT_API_TOKEN: string;
  PRIVATE_STOREFRONT_API_TOKEN: string;
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_STOREFRONT_ID: string;
  PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: string;
  PUBLIC_CUSTOMER_ACCOUNT_API_URL: string;
};


