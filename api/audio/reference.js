import { open, readFile } from "node:fs/promises";
import path from "node:path";

/** Banks keep thousands of complete pronunciations in bounded packaged files. */
export function createReferenceAudioReader(directory) {
    let inventory;
    return async (text, signal) => {
        signal?.throwIfAborted();
        inventory ??= readFile(path.join(directory, "index.json"), "utf8")
            .then(JSON.parse)
            .catch((error) => {
                inventory = undefined;
                throw error;
            });
        const records = (await inventory).records;
        const record = Object.hasOwn(records, text) ? records[text] : undefined;
        if (!record) throw new Error("audio_not_found");
        if (
            !/^\d{4}\.bin$/.test(record.file) ||
            !Number.isSafeInteger(record.offset) ||
            !Number.isSafeInteger(record.length) ||
            record.offset < 0 ||
            record.length < 3 ||
            record.offset + record.length > 524288
        )
            throw new Error("invalid_audio_asset");
        signal?.throwIfAborted();
        const file = await open(path.join(directory, record.file), "r");
        try {
            const metadata = await file.stat();
            if (
                !metadata.isFile() ||
                metadata.size > 524288 ||
                record.offset + record.length > metadata.size
            )
                throw new Error("invalid_audio_asset");
            const data = new Uint8Array(record.length);
            const { bytesRead } = await file.read(
                data,
                0,
                data.length,
                record.offset,
            );
            signal?.throwIfAborted();
            if (
                bytesRead !== data.length ||
                !(
                    String.fromCharCode(...data.subarray(0, 3)) === "ID3" ||
                    (data[0] === 0xff && (data[1] & 0xe0) === 0xe0)
                )
            )
                throw new Error("invalid_audio_asset");
            return { mediaType: "audio/mpeg", data };
        } finally {
            await file.close();
        }
    };
}
