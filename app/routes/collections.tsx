import { Link, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Image } from '@shopify/hydrogen';
import { CollectionsListQuery } from '~/graphql/queries/collections';
import { collectionCache } from '~/lib/cache';

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;

  const { collections } = await storefront.query(CollectionsListQuery, {
    variables: { first: 50 },
    cache: collectionCache(),
  });

  return {
    collections: collections?.nodes ?? [],
    pageInfo: collections?.pageInfo,
  };
}

export const meta: MetaFunction = () => [
  { title: 'Collections | Premium Fashion' },
  { name: 'description', content: 'Browse our collections of premium fashion and lifestyle products.' },
];

export default function CollectionsPage() {
  const { collections } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">Collections</h1>
        <p className="mt-2 text-neutral-600 max-w-2xl">
          Discover our curated collections of premium fashion and lifestyle products.
        </p>
      </header>

      <Suspense fallback={<CollectionsGridSkeleton />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {collections.map((collection: any) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.handle}`}
              className="group block"
              prefetch="viewport"
            >
              <div className="relative overflow-hidden aspect-[4/3] bg-neutral-100">
                {collection.image ? (
                  <Image
                    data={collection.image}
                    aspectRatio="4/3"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    No image
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h2 className="font-semibold text-lg group-hover:underline">
                  {collection.title}
                </h2>
                {collection.description && (
                  <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                    {collection.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Suspense>
    </div>
  );
}

function CollectionsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/3] bg-neutral-200" />
          <div className="mt-3 h-5 bg-neutral-200 w-3/4" />
          <div className="mt-2 h-4 bg-neutral-200 w-full" />
          <div className="mt-1 h-4 bg-neutral-200 w-2/3" />
        </div>
      ))}
    </div>
  );
}
