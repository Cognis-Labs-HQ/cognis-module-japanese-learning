/**
 * Cache asynchronous lookups with bounded storage, expiry, and explicit refresh.
 * @example const lookup = createLookupCache(label => fetchRecord(label));
 * @param {(key: string) => Promise<unknown>} load Fetch an authoritative record.
 * @param {{limit?: number, ttl?: number}} options Storage and lifetime settings.
 * @returns {(key: string, refresh?: boolean) => Promise<unknown>} Cached lookup.
 */
export function createLookupCache(load, { limit = 512, ttl = 86400000 } = {}) {
    const cache = new Map();
    return async (key, refresh = false) => {
        const cached = cache.get(key);
        if (!refresh && cached && cached.expiresAt > Date.now())
            return cached.request;
        const request = Promise.resolve().then(() => load(key));
        cache.set(key, { request, expiresAt: Date.now() + ttl });
        if (cache.size > limit) cache.delete(cache.keys().next().value);
        try {
            return await request;
        } catch (error) {
            if (cache.get(key)?.request === request) cache.delete(key);
            throw error;
        }
    };
}
