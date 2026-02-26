import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, Link } from '@remix-run/react';
import type { OrderCardFragment } from 'customer-accountapi.generated';

export async function loader({ context }: LoaderFunctionArgs) {
    const { customerAccount } = context;

    const { data, errors } = await customerAccount.query(CUSTOMER_ORDERS_QUERY);

    if (errors?.length || !data?.customer) {
        throw new Error('Customer orders not found');
    }

    return json({ orders: data.customer.orders });
}

export default function AccountOrders() {
    const { orders } = useLoaderData<typeof loader>();

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Order History</h2>
            {orders.nodes.length > 0 ? (
                <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                                >
                                    Order
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                                >
                                    Date
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                                >
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                            {orders.nodes.map((order: any) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            to={`/account/orders/${btoa(order.id)}`}
                                            className="text-black font-medium hover:underline"
                                        >
                                            #{order.number}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                        {new Date(order.processedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.financialStatus === 'PAID'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-neutral-100 text-neutral-800'
                                                }`}
                                        >
                                            {order.financialStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                        {order.totalPrice.amount} {order.totalPrice.currencyCode}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white border rounded-lg p-12 text-center shadow-sm">
                    <p className="text-neutral-500 mb-4">You haven't placed any orders yet.</p>
                    <Link
                        to="/"
                        className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-neutral-800 transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            )}
        </div>
    );
}

const CUSTOMER_ORDERS_QUERY = `#graphql
  query CustomerOrders {
    customer {
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          number
          processedAt
          financialStatus
          totalPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
` as const;
