"""Generate declared seed recordings locally with Piper or Open JTalk."""
import argparse
import io
import json
import pathlib
import subprocess
import tempfile
import wave

parser = argparse.ArgumentParser()
parser.add_argument("--root", type=pathlib.Path, default=pathlib.Path(__file__).resolve().parent.parent)
parser.add_argument("--english-model", type=pathlib.Path)
args = parser.parse_args()
root = args.root
plan_path = root / "data/audio/recordings.json"
plan = json.loads(plan_path.read_text())
language = json.loads((root / "data/audio/voice.json").read_text())["language"]
if language == "en":
    if not args.english_model:
        parser.error("english_voice_model_required")
    import onnxruntime
    onnxruntime.disable_telemetry_events()
    from piper import PiperVoice
    voice = PiperVoice.load(args.english_model)
    options = onnxruntime.SessionOptions()
    options.intra_op_num_threads = 2
    options.inter_op_num_threads = 1
    voice.session = onnxruntime.InferenceSession(str(args.english_model), sess_options=options, providers=["CPUExecutionProvider"])
    plan["source"] = "piper-ljspeech"
    plan["voiceAttribution"] = "Piper LJSpeech high; LJ Speech dataset recordings are public domain."
else:
    import numpy
    import pyopenjtalk
    plan["source"] = "open-jtalk-mei"
    plan["voiceAttribution"] = "HTS Voice Mei, MMDAgent Project Team, Nagoya Institute of Technology; CC BY 3.0."
for index, recording in enumerate(plan["recordings"]):
    destination = root / "data/library/assets" / recording["path"]
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.is_file() and destination.stat().st_size:
        continue
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as output:
        if language == "en":
            if recording.get("phonemes"):
                import numpy
                samples = voice.phoneme_ids_to_audio(voice.phonemes_to_ids(list(recording["phonemes"])))
                output.setnchannels(1)
                output.setsampwidth(2)
                output.setframerate(voice.config.sample_rate)
                output.writeframes(numpy.clip(samples * 32767, -32768, 32767).astype(numpy.int16).tobytes())
            else:
                voice.synthesize_wav(recording["text"], output)
        else:
            samples, sample_rate = pyopenjtalk.tts(recording["text"])
            output.setnchannels(1)
            output.setsampwidth(2)
            output.setframerate(sample_rate)
            output.writeframes(numpy.clip(samples, -32768, 32767).astype(numpy.int16).tobytes())
    with tempfile.NamedTemporaryFile(suffix=".wav") as temporary:
        temporary.write(buffer.getvalue())
        temporary.flush()
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", temporary.name, "-codec:a", "libmp3lame", "-b:a", "64k", "-y", str(destination)], check=True)
    if index % 25 == 0:
        print(json.dumps({"event": "audio_synthesis_progress", "language": language, "completed": index + 1, "total": len(plan["recordings"])}), flush=True)
plan_path.write_text(json.dumps(plan, ensure_ascii=False, indent=4) + "\n")
print(json.dumps({"event": "audio_synthesis_complete", "language": language, "recordings": len(plan["recordings"])}), flush=True)
