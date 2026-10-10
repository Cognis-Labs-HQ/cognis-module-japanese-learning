const USER_AGENT =
    "Cognis-Japanese-Learning (+https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning)";
const ERROR_CODES = new Set([
    "jisho_request_failed",
    "jisho_response_invalid",
    "jisho_kanji_response_invalid",
]);

export async function requestJisho(fetchImplementation, url, accept) {
    const response = await fetchImplementation(url, {
        headers: { accept, "user-agent": USER_AGENT },
        signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
        const error = new Error("jisho_request_failed");
        if (Number.isInteger(response.status))
            error.httpStatus = response.status;
        throw error;
    }
    return response;
}

export function jishoFailureDetails(error) {
    return {
        errorName: error?.name ?? "Error",
        errorCode: ERROR_CODES.has(error?.message)
            ? error.message
            : "jisho_transport_failed",
        ...(Number.isInteger(error?.httpStatus)
            ? { httpStatus: error.httpStatus }
            : {}),
    };
}
