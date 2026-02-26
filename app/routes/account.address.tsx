import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';

export async function loader({ context }: LoaderFunctionArgs) {
    const { customerAccount } = context;

    const { data, errors } = await customerAccount.query(CUSTOMER_ADDRESSES_QUERY);

    if (errors?.length || !data?.customer) {
        throw new Error('Customer addresses not found');
    }

    return json({ customer: data.customer });
}

export default function AccountAddresses() {
    const { customer } = useLoaderData<typeof loader>();
    const totalAddresses = customer.addresses.nodes.length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Addresses</h2>
                <button className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-neutral-800 transition-colors">
                    Add New Address
                </button>
            </div>

            {totalAddresses > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {customer.addresses.nodes.map((address: any) => (
                        <div
                            key={address.id}
                            className="border rounded-lg p-6 relative bg-white shadow-sm"
                        >
                            {address.id === customer.defaultAddress?.id && (
                                <span className="absolute top-4 right-4 bg-neutral-100 text-neutral-600 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
                                    Default
                                </span>
                            )}
                            <div className="space-y-1">
                                {address.formatted.map((line: string) => (
                                    <p key={line} className="text-neutral-700">
                                        {line}
                                    </p>
                                ))}
                            </div>
                            <div className="mt-6 flex gap-4">
                                <button className="text-sm font-medium text-neutral-600 hover:text-black underline-offset-4 hover:underline">
                                    Edit
                                </button>
                                <button className="text-sm font-medium text-red-600 hover:text-red-700 underline-offset-4 hover:underline">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border rounded-lg p-12 text-center shadow-sm">
                    <p className="text-neutral-500">You haven't saved any addresses yet.</p>
                </div>
            )}
        </div>
    );
}

const CUSTOMER_ADDRESSES_QUERY = `#graphql
  query CustomerAddresses {
    customer {
      defaultAddress {
        id
      }
      addresses(first: 10) {
        nodes {
          id
          formatted
        }
      }
    }
  }
` as const;
