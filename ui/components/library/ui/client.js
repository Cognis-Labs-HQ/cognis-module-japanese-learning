import { apiFetch } from "/static/reuse/api-client.js";

const LIBRARY_API_BASE = "/api/v1/modules/study-language-ja/study/library";

export async function fetchLayers() {
    const response = await apiFetch(`${LIBRARY_API_BASE}/layers`);
    if (!response.ok) throw new Error("layers_failed");
    return (await response.json()).data;
}

export async function fetchEntries({ scope, scopeId, layer }) {
    const query = new URLSearchParams({ scope });
    if (scopeId) query.set("scopeId", scopeId);
    if (layer) query.set("layer", layer);
    const response = await apiFetch(`${LIBRARY_API_BASE}/entries?${query}`);
    if (!response.ok) throw new Error("entries_failed");
    return (await response.json()).data;
}

export async function createEntry(location, entry) {
    const response = await apiFetch(`${LIBRARY_API_BASE}/entries`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ location, entry }),
    });
    if (!response.ok) throw new Error("create_failed");
    return (await response.json()).data;
}
