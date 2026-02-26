import { useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { Image } from '@shopify/hydrogen';
import { MetaobjectQuery } from '~/graphql/queries/metaobject';
import { staticCache } from '~/lib/cache';

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const { type, handle } = params;

  const { metaobject } = await storefront.query(MetaobjectQuery, {
    variables: { type: type!, handle: handle! },
    cache: staticCache(),
  });

  if (!metaobject) {
    throw new Response('Metaobject not found', { status: 404 });
  }

  return { metaobject };
}

export default function MetaobjectPage() {
  const { metaobject } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <article className="prose prose-lg max-w-none">
        {metaobject.fields?.map((field: any) => (
          <div key={field.key}>
            {field.type === 'single_line_text_field' && (
              <p>{field.value}</p>
            )}
            {field.type === 'multi_line_text_field' && (
              <div dangerouslySetInnerHTML={{ __html: field.value }} />
            )}
            {field.reference?.image && (
              <Image
                data={field.reference.image}
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            )}
          </div>
        ))}
      </article>
    </div>
  );
}
