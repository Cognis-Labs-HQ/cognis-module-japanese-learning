"""Exercise ElevenLabs transport, reading fidelity, and safe generation failures."""

import array
import importlib.util
import io
import json
import os
import pathlib
import tempfile
import sys
import types
import unittest
import urllib.error
from unittest.mock import patch

sys.dont_write_bytecode = True

specification = importlib.util.spec_from_file_location(
    "synthesis",
    pathlib.Path(__file__).resolve().parents[1] / "scripts/synthesize-audio.py",
)
synthesis = importlib.util.module_from_spec(specification)
specification.loader.exec_module(synthesis)


class SynthesisTests(unittest.TestCase):
    def test_readings_and_cache_are_bound_to_voice_and_request(self):
        for language, recording in [
            ("en", {"text": "read", "phonemes": "riːd"}),
            ("ja", {"text": "にほん"}),
        ]:
            with self.subTest(
                language=language
            ), tempfile.TemporaryDirectory() as directory:
                root = pathlib.Path(directory)
                requests = []
                pcm = array.array("h", [0] * 100 + [10000] * 2400 + [0] * 100)

                def open_request(request, timeout):
                    requests.append(request)
                    response = io.BytesIO(b"x" * 200)
                    response.headers = {"content-type": "audio/mpeg"}
                    return response

                def convert(arguments, **options):
                    if "capture_output" in options:
                        return types.SimpleNamespace(stdout=pcm.tobytes())
                    encoded = array.array("h", options["input"])
                    self.assertEqual(list(encoded[:4800]), [0] * 4800)
                    self.assertEqual(list(encoded[-4320:]), [0] * 4320)
                    pathlib.Path(arguments[-1]).write_bytes(b"encoded")

                with patch.dict(
                    os.environ, {"ELEVENLABS_API_KEY": "fixture-secret"}
                ), patch.object(
                    synthesis.urllib.request, "urlopen", open_request
                ), patch.object(
                    synthesis.subprocess, "run", convert
                ):
                    for voice in ["fixture-voice", "fixture-voice", "other-voice"]:
                        synthesis.synthesize(
                            recording,
                            language,
                            voice,
                            "fixture-model",
                            root,
                            root / "audio.mp3",
                        )
                self.assertEqual(len(requests), 2)
                payload = json.loads(requests[0].data)
                if language == "en":
                    self.assertIn('alphabet="ipa"', payload["text"])
                    self.assertIn("ɹiːd", payload["text"])
                else:
                    self.assertEqual(payload["text"], "にほん")
                    self.assertEqual(payload["language_code"], "ja")
                self.assertEqual((root / "audio.mp3").read_bytes(), b"encoded")

    def test_authentication_failure_is_safe_and_does_not_replace_existing_audio(self):
        with tempfile.TemporaryDirectory() as directory:
            root = pathlib.Path(directory)
            destination = root / "existing.mp3"
            destination.write_bytes(b"original")
            error = urllib.error.HTTPError(
                "https://api.elevenlabs.io", 401, "fixture-secret", {}, None
            )
            with patch.dict(
                os.environ, {"ELEVENLABS_API_KEY": "fixture-secret"}
            ), patch.object(synthesis.urllib.request, "urlopen", side_effect=error):
                with self.assertRaisesRegex(RuntimeError, "^elevenlabs_http_401$"):
                    synthesis.synthesize(
                        {"text": "test"},
                        "en",
                        "fixture-voice",
                        "fixture-model",
                        root,
                        destination,
                    )
            self.assertEqual(destination.read_bytes(), b"original")


if __name__ == "__main__":
    unittest.main()
