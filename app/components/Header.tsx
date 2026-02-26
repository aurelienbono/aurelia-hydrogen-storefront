import { Link, useRouteLoaderData } from '@remix-run/react';

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}

export function Header({ cartCount = 0, onCartClick }: HeaderProps) {
  const rootData = useRouteLoaderData<{ isLoggedIn: boolean }>('root');
  const isLoggedIn = rootData?.isLoggedIn;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="text-xl font-bold tracking-tight">
            AURELIA
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/collections"
              className="text-sm font-medium text-neutral-600 hover:text-black"
            >
              Collections
            </Link>
            <Link
              to="/collections/all"
              className="text-sm font-medium text-neutral-600 hover:text-black"
            >
              Shop All
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/account"
              className="text-sm font-medium text-neutral-600 hover:text-black"
            >
              {isLoggedIn ? 'Account' : 'Login'}
            </Link>
            <button
              type="button"
              onClick={onCartClick}
              className="relative p-2 text-neutral-600 hover:text-black"
              aria-label={`Cart with ${cartCount} items`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-medium bg-black text-white rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

