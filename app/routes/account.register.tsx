import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';

export async function loader({ context }: LoaderFunctionArgs) {
    // New Customer Accounts handles registration on the same page as login
    return context.customerAccount.login();
}
