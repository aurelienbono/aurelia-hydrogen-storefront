import { Link } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { Suspense } from 'react';
import { useLoaderData } from '@remix-run/react';
import { ProductCard } from '~/components/ProductCard';
import { productCache } from '~/lib/cache';
import { CollectionQuery } from '~/graphql/queries/collection';

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { storefront } = context;

  const { collection } = await storefront.query(CollectionQuery, {
    variables: {
      handle: 'frontpage',
      first: 12,
    },
    cache: productCache(),
  });

  return {
    collection: collection ?? { products: { nodes: [] } },
  };
}

export default function HomePage() {
  const { collection } = useLoaderData<typeof loader>();

  return (
    <div>
      <section className="relative aspect-[21/9] bg-neutral-100 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Premium Fashion
          </h1>
          <p className="mt-4 text-lg text-neutral-600 max-w-xl mx-auto">
            Crafted for the discerning. Discover our latest collection.
          </p>
          <Link
            to="/collections/all"
            className="inline-block mt-6 px-8 py-3 bg-black text-white font-medium hover:bg-neutral-800 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold mb-8">Featured</h2>
        <Suspense fallback={<ProductsGridSkeleton />}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {collection?.products?.nodes?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Suspense>
      </section>
    </div>
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
          <div className="mt-2 h-4 bg-neutral-200 w-1/4" />
        </div>
      ))}
    </div>
  );
}
