import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Form, NavLink, Outlet, useLoaderData } from '@remix-run/react';

export async function loader({ context }: LoaderFunctionArgs) {
  const { customerAccount } = context;

  if (!(await customerAccount.isLoggedIn())) {
    return customerAccount.login();
  }

  const { data, errors } = await customerAccount.query(CUSTOMER_QUERY);

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return json({ customer: data.customer });
}

export default function AccountLayout() {
  const { customer } = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <div className="account-layout max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <h1 className="text-3xl font-bold mb-8">{heading}</h1>
          <nav className="flex flex-col space-y-2">
            <AccountNavLink to="/account">Overview</AccountNavLink>
            <AccountNavLink to="/account/orders">Orders</AccountNavLink>
            <AccountNavLink to="/account/address">Addresses</AccountNavLink>
            <Form method="post" action="/account/logout" className="pt-4">
              <button
                className="text-neutral-500 hover:text-black transition-colors"
                type="submit"
              >
                Logout
              </button>
            </Form>
          </nav>
        </aside>
        <main className="md:w-3/4">
          <Outlet context={{ customer }} />
        </main>
      </div>
    </div>
  );
}

function AccountNavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `block py-2 px-4 rounded-md transition-colors ${isActive
          ? 'bg-black text-white'
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

const CUSTOMER_QUERY = `#graphql
  query CustomerDetails {
    customer {
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
      defaultAddress {
        id
        formatted
      }
    }
  }
` as const;
