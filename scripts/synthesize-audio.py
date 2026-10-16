"""Render pronunciation inventories with configured ElevenLabs voices and FFmpeg."""

import argparse
import array
import concurrent.futures
import hashlib
import html
import json
import os
import pathlib
import subprocess
import tempfile
import time
import urllib.error
import urllib.request


def synthesize(recording, language, voice_id, model, cache, destination):
    text = recording["text"]
    if language == "en" and recording.get("phonemes"):
        phonemes = recording["phonemes"].replace("r", "ɹ").replace("g", "ɡ")
        text = (
            '<phoneme alphabet="ipa" ph="'
            + html.escape(phonemes, quote=True)
            + '">'
            + html.escape(text)
            + "</phoneme>"
        )
    payload = {
        "text": text,
        "model_id": model,
        "voice_settings": {"stability": 0.65, "similarity_boost": 0.75, "speed": 0.9},
    }
    if language == "ja":
        payload["language_code"] = "ja"
    body = json.dumps(payload, ensure_ascii=False).encode()
    digest = hashlib.sha256(voice_id.encode() + b"\0" + body).hexdigest()
    raw = cache / (digest + ".mp3")
    if not raw.is_file():
        request = urllib.request.Request(
            "https://api.elevenlabs.io/v1/text-to-speech/"
            + voice_id
            + "?output_format=mp3_44100_128",
            data=body,
            headers={
                "xi-api-key": os.environ["ELEVENLABS_API_KEY"],
                "content-type": "application/json",
                "accept": "audio/mpeg",
            },
        )
        for attempt in range(5):
            try:
                with urllib.request.urlopen(request, timeout=120) as response:
                    if not response.headers.get("content-type", "").startswith(
                        "audio/"
                    ):
                        raise RuntimeError("unexpected_audio_content_type")
                    data = response.read(2 * 1024 * 1024 + 1)
                if not 100 < len(data) <= 2 * 1024 * 1024:
                    raise RuntimeError("invalid_audio_size")
                with tempfile.NamedTemporaryFile(dir=cache) as temporary:
                    pathlib.Path(temporary.name).write_bytes(data)
                    pathlib.Path(temporary.name).replace(raw)
                break
            except urllib.error.HTTPError as error:
                if error.code not in [429, 500, 502, 503, 504] or attempt == 4:
                    raise RuntimeError("elevenlabs_http_" + str(error.code)) from None
                print(
                    json.dumps(
                        {
                            "event": "audio_request_retry",
                            "status": error.code,
                            "attempt": attempt + 1,
                        }
                    ),
                    flush=True,
                )
                time.sleep(min(30, 2 ** (attempt + 1)))
    decoded = subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(raw),
            "-ar",
            "24000",
            "-ac",
            "1",
            "-f",
            "s16le",
            "-",
        ],
        check=True,
        capture_output=True,
    ).stdout
    samples = array.array("h", decoded)
    audible = [index for index, sample in enumerate(samples) if abs(sample) > 100]
    if not audible:
        raise RuntimeError("empty_pronunciation")
    samples = samples[max(0, audible[0] - 480) : audible[-1] + 481]
    gain = min(3.0, (32767 * 0.82) / max(map(abs, samples)))
    normalized = array.array("h", (round(sample * gain) for sample in samples))
    padded = array.array("h", [0]) * 4800 + normalized + array.array("h", [0]) * 4320
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        suffix=".mp3", dir=destination.parent
    ) as temporary:
        subprocess.run(
            [
                "ffmpeg",
                "-hide_banner",
                "-loglevel",
                "error",
                "-f",
                "s16le",
                "-ar",
                "24000",
                "-ac",
                "1",
                "-i",
                "-",
                "-codec:a",
                "libmp3lame",
                "-b:a",
                "128k",
                "-y",
                temporary.name,
            ],
            input=padded.tobytes(),
            check=True,
        )
        pathlib.Path(temporary.name).replace(destination)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--root",
        type=pathlib.Path,
        default=pathlib.Path(__file__).resolve().parent.parent,
    )
    parser.add_argument("--inventory", type=pathlib.Path)
    parser.add_argument("--assets", type=pathlib.Path)
    parser.add_argument("--cache", type=pathlib.Path, required=True)
    parser.add_argument("--workers", type=int, default=3)
    args = parser.parse_args()
    inventory = args.inventory or args.root / "data/audio/recordings.json"
    plan = json.loads(inventory.read_text())
    language = json.loads((args.root / "data/audio/voice.json").read_text())["language"]
    variable = "ELEVENLABS_" + language.upper() + "_VOICE_ID"
    voice_id = os.environ[variable]
    if not voice_id or not os.environ["ELEVENLABS_API_KEY"]:
        raise RuntimeError("missing_elevenlabs_configuration")
    model = "eleven_turbo_v2" if language == "en" else "eleven_multilingual_v2"
    args.cache.mkdir(parents=True, exist_ok=True)
    assets = args.assets or args.root / "data/library/assets"
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = [
            executor.submit(
                synthesize,
                recording,
                language,
                voice_id,
                model,
                args.cache,
                assets / recording["path"],
            )
            for recording in plan["recordings"]
        ]
        for count, future in enumerate(concurrent.futures.as_completed(futures), 1):
            future.result()
            if count % 25 == 0 or count == len(futures):
                print(
                    json.dumps(
                        {
                            "event": "audio_synthesis_progress",
                            "language": language,
                            "completed": count,
                            "total": len(futures),
                        }
                    ),
                    flush=True,
                )
    plan["source"] = "elevenlabs"
    plan["voiceAttribution"] = (
        "Generated with ElevenLabs; use and distribution are subject to the ElevenLabs account terms."
    )
    plan["processing"] = {
        "model": model,
        "voiceEnvironment": variable,
        "speed": 0.9,
        "stability": 0.65,
        "similarityBoost": 0.75,
        "bitrate": "128k",
        "leadInMs": 200,
        "tailMs": 180,
        "peakLimit": 0.82,
    }
    inventory.write_text(json.dumps(plan, ensure_ascii=False, indent=4) + "\n")


if __name__ == "__main__":
    main()
