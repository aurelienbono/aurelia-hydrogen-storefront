import { useLocation } from '@remix-run/react';
import { organizationJsonLd } from '~/lib/seo';

export function GlobalJsonLd({ siteName }: { siteName: string }) {
    const location = useLocation();
    const url = `https://aurelia.com${location.pathname}`;

    const jsonLd = organizationJsonLd(siteName, url);

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(jsonLd),
            }}
        />
    );
}
