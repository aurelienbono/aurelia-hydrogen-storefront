import { Link, useLoaderData, useSearchParams } from '@remix-run/react';
import { Suspense } from 'react';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { ProductCard } from '~/components/ProductCard';
import { collectionJsonLd } from '~/lib/seo';
import { collectionCache } from '~/lib/cache';
import { CollectionQuery } from '~/graphql/queries/collection';

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  const { storefront } = context;
  const { handle } = params;
  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor') ?? undefined;
  const sortKey = (url.searchParams.get('sort') as any) ?? 'COLLECTION_DEFAULT';

  const { collection } = await storefront.query(CollectionQuery, {
    variables: {
      handle: handle!,
      first: 24,
      after: cursor,
      sortKey,
    },
    cache: collectionCache(),
  });

  if (!collection) {
    throw new Response('Collection not found', { status: 404 });
  }

  return {
    collection,
    url: url.origin + url.pathname,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.collection) return [];
  const c = data.collection;
  return [
    { title: c.seo?.title ?? c.title },
    { name: 'description', content: c.seo?.description ?? c.description ?? '' },
    { property: 'og:title', content: c.title },
    { property: 'og:url', content: data.url },
  ];
};

export default function CollectionPage() {
  const { collection, url } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const jsonLd = collectionJsonLd(collection, url);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">{collection.title}</h1>
          {collection.description && (
            <p className="mt-2 text-neutral-600 max-w-2xl">
              {collection.description}
            </p>
          )}
        </header>

        <Suspense fallback={<ProductsGridSkeleton />}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {collection.products?.nodes?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Suspense>

        {collection.products?.pageInfo?.hasNextPage && (
          <div className="mt-12 text-center">
            <Link
              to={`?cursor=${collection.products.pageInfo.endCursor}`}
              className="inline-block px-6 py-3 border border-black font-medium hover:bg-black hover:text-white transition-colors"
            >
              Load More
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-neutral-200" />
          <div className="mt-3 h-4 bg-neutral-200 w-3/4" />
          <div className="mt-2 h-4 bg-neutral-200 w-1/2" />
        </div>
      ))}
    </div>
  );
}
