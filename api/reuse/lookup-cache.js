/**
 * Cache asynchronous lookups with bounded storage, expiry, and explicit refresh.
 * @example const lookup = createLookupCache(label => fetchRecord(label));
 * @param {(key: string) => Promise<unknown>} load Fetch an authoritative record.
 * @param {{limit?: number, ttl?: number, negativeTtl?: number, now?: () => number}} options Storage and lifetime settings.
 * @returns {(key: string, refresh?: boolean) => Promise<unknown>} Cached lookup.
 */
export function createLookupCache(
    load,
    { limit = 512, ttl = 86400000, negativeTtl = ttl, now = Date.now } = {},
) {
    if (!Number.isInteger(limit) || limit < 1 || ttl <= 0 || negativeTtl <= 0)
        throw new Error("invalid_lookup_cache_options");
    const cache = new Map();
    return async (key, refresh = false) => {
        const cached = cache.get(key);
        if (!refresh && cached && cached.expiresAt > now())
            return cached.request;
        const request = Promise.resolve().then(() => load(key));
        cache.set(key, { request, expiresAt: now() + ttl });
        if (cache.size > limit) cache.delete(cache.keys().next().value);
        try {
            const value = await request;
            if (value == null && cache.get(key)?.request === request)
                cache.get(key).expiresAt = now() + negativeTtl;
            return value;
        } catch (error) {
            if (cache.get(key)?.request === request) cache.delete(key);
            throw error;
        }
    };
}
