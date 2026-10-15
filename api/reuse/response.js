/** Read a Fetch response without buffering more than the byte limit. */
export async function readBoundedText(response, maxBytes = 1_000_000) {
    const declaredLength = Number(response.headers?.get("content-length"));
    if (declaredLength > maxBytes) {
        await response.body?.cancel();
        throw new Error("response_too_large");
    }
    if (!response.body) return "";
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const chunks = [];
    let received = 0;
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            received += value.byteLength;
            if (received > maxBytes) {
                await reader.cancel();
                throw new Error("response_too_large");
            }
            chunks.push(decoder.decode(value, { stream: true }));
        }
        chunks.push(decoder.decode());
        return chunks.join("");
    } finally {
        reader.releaseLock();
    }
}
