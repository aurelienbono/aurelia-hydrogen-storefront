# AURELIA — Premium Shopify Hydrogen v2

A high-performance, production-ready headless ecommerce storefront built with **Shopify Hydrogen v2** and **Remix**. Designed for premium fashion and lifestyle DTC brands.

## 🚀 Advanced Features

### 🔐 Customer Accounts (New API)
Full implementation of Shopify's modern OAuth-based Customer Account API:
- **Secure Authentication**: OAuth flow handling via `/account/login`, `/account/logout`, and `/account/callback`.
- **Protected Routes**: Middleware-style protection for `/account` and sub-routes.
- **Session Management**: Custom `HydrogenSession` utility using standard cookie storage.
- **Account Dashboard**: Integrated views for Orders, Addresses, and Profile details.

### 🌍 Global Infrastructure
- **Multi-market Support**: Automatic detection of locale, currency, and language based on URL patterns (e.g., `/en-us`, `/fr-fr`).
- **I18n Context**: Dynamic storefront client injection for localized pricing and content.
- **Feature Flags**: Server-side control over experimental features via `flags.server.ts`.
- **Preview Mode**: Native support for Shopify's Oxygen preview environments.

### ⚡ Performance & SEO
- **SWR Cache Strategy**: Optimized `stale-while-revalidate` layers for Products (1h), Collections (2h), and Metaobjects (Long).
- **SEO & JSON-LD**: Automatic generation of `Organization` and `Product` structured data.
- **Image Optimization**: Powered by Shopify's CDN with lazy loading and responsive `sizes` out of the box.
- **Streaming SSR**: Uses React Suspense and Remix defer for lightning-fast initial page loads.

### 📊 Intelligence
- **Server-side Tracking**: Built-in `ServerTracker` utility to capture events and page views without blocking the main request thread using `waitUntil`.

## 📂 Project Structure

```text
app/
├── components/     # UI Components (Header, Cart, Layout, SEO)
├── context/        # React Context (Cart, etc.)
├── graphql/        # GraphQL Fragments & Queries
├── lib/            # Core Logic (flags, market, session, tracking, seo)
├── routes/         # Remix Routes (Auth, Account, Products, Collections)
├── styles/         # Global & Utility CSS
└── server.ts       # Entry point for Oxygen / Cloudflare Workers
```

## 🛠 Getting Started

### 1. Requirements
Ensure you have the latest [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) installed.

### 2. Environment Setup
Copy `.env.example` to `.env` and fill in your Storefront API credentials:

```bash
SESSION_SECRET="your-secret"
PUBLIC_STORE_DOMAIN="your-store.myshopify.com"
PUBLIC_STOREFRONT_API_TOKEN="your-token"
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID="your-client-id"
```

### 3. Local Development

```bash
npm install     # Install dependencies
npm run codegen # Generate GraphQL types
npm run dev     # Start mini-Oxygen server
```

## 📜 Available Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Runs the app in development mode |
| `npm run build` | Builds the app for production (Oxygen) |
| `npm run codegen` | Syncs GraphQL types with your schema |
| `npm run preview`| Runs the production build locally |
| `npm run deploy` | Deploys the app to Shopify Oxygen |

---

*Note: For first-time Git setup, remember to run `git add .` before your first commit to track all files.*
