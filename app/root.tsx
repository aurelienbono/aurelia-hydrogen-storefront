import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import type { LinksFunction, LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Layout } from '~/components/Layout';
import { GlobalJsonLd } from '~/components/Seo';

import styles from '~/styles/app.css?url';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  {
    rel: 'preconnect',
    href: 'https://cdn.shopify.com',
  },
  {
    rel: 'preconnect',
    href: 'https://shopify.com',
  },
];

export async function loader({ context }: LoaderFunctionArgs) {
  const { cart, customerAccount, market, flags } = context;
  const [cartData, isLoggedIn] = await Promise.all([
    cart.get(),
    customerAccount.isLoggedIn(),
  ]);

  return {
    cart: cartData,
    isLoggedIn,
    market,
    flags,
  };
}


export default function App() {
  const { market } = useLoaderData<typeof loader>();

  return (
    <html lang={market?.language?.toLowerCase() || 'en'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Meta />
        <Links />
        <GlobalJsonLd siteName="AURELIA" />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

