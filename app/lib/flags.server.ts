export interface FeatureFlags {
    newCheckout: boolean;
    premiumSearch: boolean;
    wishlist: boolean;
    referralSystem: boolean;
}

export const DEFAULT_FLAGS: FeatureFlags = {
    newCheckout: false,
    premiumSearch: true,
    wishlist: true,
    referralSystem: false,
};

/**
 * Get feature flags based on environment or session
 */
export function getFeatureFlags(env: Env, request: Request): FeatureFlags {
    // Logic to override flags via query param for testing: ?flag_newCheckout=true
    const url = new URL(request.url);
    const flags = { ...DEFAULT_FLAGS };

    Object.keys(flags).forEach((key) => {
        const param = url.searchParams.get(`flag_${key}`);
        if (param !== null) {
            (flags as any)[key] = param === 'true';
        }
    });

    return flags;
}
