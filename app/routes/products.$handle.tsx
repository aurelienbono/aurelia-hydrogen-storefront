import { useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { ProductForm } from '~/components/ProductForm';
import { ProductImageGallery } from '~/components/ProductImageGallery';
import { SizeGuide } from '~/components/SizeGuide';
import { useCartContext } from '~/context/CartContext';
import { productJsonLd } from '~/lib/seo';
import { productCache } from '~/lib/cache';
import { ProductQuery } from '~/graphql/queries/product';

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  const { storefront } = context;
  const { handle } = params;
  const url = new URL(request.url);

  const selectedOptions = Array.from(url.searchParams.entries()).map(
    ([name, value]) => ({ name, value }),
  );

  const { product } = await storefront.query(ProductQuery, {
    variables: { handle: handle!, selectedOptions },
    cache: productCache(),
  });

  if (!product) {
    throw new Response('Product not found', { status: 404 });
  }

  return {
    product,
    url: url.origin + url.pathname + url.search,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.product) return [];
  const product = data.product;
  return [
    { title: product.seo?.title ?? product.title },
    { name: 'description', content: product.seo?.description ?? product.description ?? '' },
    { property: 'og:title', content: product.title },
    { property: 'og:image', content: product.featuredImage?.url },
    { property: 'og:url', content: data.url },
  ];
};

export default function ProductPage() {
  const { product, url } = useLoaderData<typeof loader>();
  const { addToCart } = useCartContext();

  const jsonLd = productJsonLd(
    product,
    url,
    product.variants?.nodes?.map((v) => ({
      id: v.id,
      price: v.price!,
      availableForSale: v.availableForSale,
    })),
  );

  const sizeGuide = product.metafields?.find((m) => m.key === 'size_guide')?.value;
  const badge = product.metafields?.find((m) => m.key === 'badge')?.value;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <Suspense fallback={<ImageSkeleton />}>
            <ProductImageGallery
              images={product.images?.nodes ?? []}
              featuredImage={product.featuredImage}
            />
          </Suspense>

          <div>
            {badge && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-black text-white uppercase tracking-wider mb-2">
                {badge}
              </span>
            )}
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              {product.vendor}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mt-1">{product.title}</h1>
            {product.descriptionHtml && (
              <div
                className="mt-4 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}

            <Suspense fallback={<ProductFormSkeleton />}>
              <div className="mt-8">
                <ProductForm
                  product={product}
                  variants={product.variants?.nodes ?? []}
                  onAddToCart={addToCart}
                />
              </div>
            </Suspense>

            <SizeGuide content={sizeGuide} />
          </div>
        </div>
      </div>
    </>
  );
}

function ImageSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-square bg-neutral-200 animate-pulse" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-16 h-16 bg-neutral-200 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function ProductFormSkeleton() {
  return (
    <div className="mt-8 space-y-4 animate-pulse">
      <div className="h-10 bg-neutral-200 w-1/3" />
      <div className="flex gap-2">
        <div className="h-10 bg-neutral-200 w-16" />
        <div className="h-10 bg-neutral-200 w-16" />
        <div className="h-10 bg-neutral-200 w-16" />
      </div>
      <div className="h-12 bg-neutral-200 w-full" />
    </div>
  );
}
