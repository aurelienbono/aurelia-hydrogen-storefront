import { type ActionFunctionArgs, type LoaderFunctionArgs } from '@shopify/remix-oxygen';

export async function loader({ context }: LoaderFunctionArgs) {
    return context.customerAccount.logout();
}

export async function action({ context }: ActionFunctionArgs) {
    return context.customerAccount.logout();
}
