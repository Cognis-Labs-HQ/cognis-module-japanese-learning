import assert from "node:assert/strict";
import test from "node:test";
import { readBoundedText } from "../reuse/response.js";

test("response bounds cancel streams before declared oversized bodies are read", async () => {
    let cancelled = false;
    const response = new Response(
        new ReadableStream({
            cancel() {
                cancelled = true;
            },
        }),
        { headers: { "content-length": "100" } },
    );
    await assert.rejects(readBoundedText(response, 4), /response_too_large/);
    assert.equal(cancelled, true);
});

test("response bounds apply to streamed bytes and cancel without reading remaining chunks", async () => {
    let cancelled = false;
    let pulls = 0;
    const response = new Response(
        new ReadableStream(
            {
                pull(controller) {
                    pulls++;
                    controller.enqueue(new Uint8Array(5));
                },
                cancel() {
                    cancelled = true;
                },
            },
            { highWaterMark: 0 },
        ),
    );
    await assert.rejects(readBoundedText(response, 4), /response_too_large/);
    assert.equal(cancelled, true);
    assert.equal(pulls, 1);
});

test("bounded text decodes UTF-8 characters split between chunks", async () => {
    const bytes = new TextEncoder().encode("日本語");
    const response = new Response(
        new ReadableStream({
            start(controller) {
                controller.enqueue(bytes.slice(0, 2));
                controller.enqueue(bytes.slice(2));
                controller.close();
            },
        }),
    );
    assert.equal(await readBoundedText(response, bytes.length), "日本語");
});
