"""Generate seeded pronunciation locally with the multilingual Kokoro model."""

import argparse
import json
import pathlib
import subprocess
import tempfile
import wave

parser = argparse.ArgumentParser()
parser.add_argument(
    "--root", type=pathlib.Path, default=pathlib.Path(__file__).resolve().parent.parent
)
parser.add_argument("--model", type=pathlib.Path, required=True)
parser.add_argument("--voices", type=pathlib.Path, required=True)
parser.add_argument("--force", action="store_true")
parser.add_argument("--inventory", type=pathlib.Path)
parser.add_argument("--assets", type=pathlib.Path)
parser.add_argument("--threads", type=int, default=2)
args = parser.parse_args()
import numpy
import onnxruntime

onnxruntime.disable_telemetry_events()
from kokoro_onnx import Kokoro

options = onnxruntime.SessionOptions()
options.intra_op_num_threads = args.threads
options.inter_op_num_threads = 1
session = onnxruntime.InferenceSession(
    str(args.model), sess_options=options, providers=["CPUExecutionProvider"]
)
voice = Kokoro.from_session(session, str(args.voices))
root = args.root
plan_path = args.inventory or root / "data/audio/recordings.json"
plan = json.loads(plan_path.read_text())
configuration = json.loads((root / "data/audio/voice.json").read_text())
language = configuration["language"]
if language == "ja":
    from misaki.ja import JAG2P

    phonemize = JAG2P()
plan["source"] = "kokoro-multilingual"
plan["voiceAttribution"] = (
    "Kokoro multilingual model, hexgrad and contributors; Apache License 2.0."
)
plan["processing"] = {
    "voice": "bf_emma" if language == "en" else "jf_alpha",
    "speed": 0.9,
    "bitrate": "128k",
    "leadInMs": 200,
    "tailMs": 180,
}
for index, recording in enumerate(plan["recordings"]):
    destination = (args.assets or root / "data/library/assets") / recording["path"]
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.is_file() and destination.stat().st_size and not args.force:
        continue
    phonemes = (
        recording.get("phonemes")
        if language == "en"
        else phonemize(recording["text"])[0]
    )
    if language == "en" and phonemes:
        phonemes = phonemes.replace("r", "ɹ").replace("g", "ɡ")
    samples, rate = voice.create(
        phonemes or recording["text"],
        voice=plan["processing"]["voice"],
        speed=0.9,
        lang="en-gb",
        is_phonemes=bool(phonemes),
    )
    peak = max(float(numpy.max(numpy.abs(samples))), 0.001)
    samples = samples * min(3.0, 0.82 / peak)
    samples = numpy.concatenate(
        [numpy.zeros(round(rate * 0.2)), samples, numpy.zeros(round(rate * 0.18))]
    )
    fade = min(round(rate * 0.01), len(samples) // 2)
    samples[:fade] *= numpy.linspace(0, 1, fade)
    samples[-fade:] *= numpy.linspace(1, 0, fade)
    with tempfile.NamedTemporaryFile(suffix=".wav") as temporary:
        with wave.open(temporary.name, "wb") as output:
            output.setnchannels(1)
            output.setsampwidth(2)
            output.setframerate(rate)
            output.writeframes(
                numpy.clip(samples * 32767, -32768, 32767).astype(numpy.int16).tobytes()
            )
        subprocess.run(
            [
                "ffmpeg",
                "-hide_banner",
                "-loglevel",
                "error",
                "-i",
                temporary.name,
                "-ar",
                "24000",
                "-codec:a",
                "libmp3lame",
                "-b:a",
                "128k",
                "-y",
                str(destination),
            ],
            check=True,
        )
    if index % 25 == 0:
        print(
            json.dumps(
                {
                    "event": "audio_synthesis_progress",
                    "language": language,
                    "completed": index + 1,
                    "total": len(plan["recordings"]),
                }
            ),
            flush=True,
        )
plan_path.write_text(json.dumps(plan, ensure_ascii=False, indent=4) + "\n")
print(
    json.dumps(
        {
            "event": "audio_synthesis_complete",
            "language": language,
            "recordings": len(plan["recordings"]),
        }
    ),
    flush=True,
)
