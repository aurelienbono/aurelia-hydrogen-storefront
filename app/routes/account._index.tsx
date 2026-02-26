import { useOutletContext } from '@remix-run/react';
import type { CustomerFragment } from 'customer-accountapi.generated';

export default function AccountIndex() {
    const { customer } = useOutletContext<{ customer: CustomerFragment }>();

    return (
        <div className="space-y-8">
            <section>
                <h2 className="text-xl font-bold mb-4">Profile Details</h2>
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-neutral-500">First Name</p>
                            <p className="font-medium">{customer.firstName || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Last Name</p>
                            <p className="font-medium">{customer.lastName || 'Not set'}</p>
                        </div>
                        <div className="sm:col-span-2">
                            <p className="text-sm text-neutral-500">Email Address</p>
                            <p className="font-medium">{customer.emailAddress?.emailAddress}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4">Default Address</h2>
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    {customer.defaultAddress ? (
                        <div className="space-y-2">
                            {customer.defaultAddress.formatted.map((line: string) => (
                                <p key={line} className="text-neutral-700">
                                    {line}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p className="text-neutral-500 italic">No default address set.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
