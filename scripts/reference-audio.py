"""Plan or package whole-reading audio for the Japanese reference catalog."""

import argparse, gzip, hashlib, json, pathlib

parser = argparse.ArgumentParser()
parser.add_argument("action", choices=["plan", "pack"])
parser.add_argument("--work", type=pathlib.Path, required=True)
parser.add_argument("--workers", type=int, default=4)
parser.add_argument(
    "--root", type=pathlib.Path, default=pathlib.Path(__file__).resolve().parent.parent
)
args = parser.parse_args()
root = args.root
work = args.work
if args.action == "plan":
    seed = json.loads((root / "data/audio/recordings.json").read_text())
    existing = {recording["text"] for recording in seed["recordings"]}
    readings = {}
    for shard in sorted((root / "data/reference").glob("*.json.gz")):
        for records in json.loads(gzip.decompress(shard.read_bytes())).values():
            for record in records:
                if not record["japanese"]:
                    continue
                reading = record["japanese"][0]["reading"]
                if reading in existing:
                    continue
                readings.setdefault(
                    reading,
                    {
                        "path": "audio/"
                        + hashlib.sha256(
                            ("kokoro-reference\0" + reading).encode()
                        ).hexdigest()
                        + ".mp3",
                        "text": reading,
                        "language": "ja",
                        "entries": [],
                    },
                )["entries"].append(record["slug"])
    plan = {"source": "elevenlabs", "recordings": list(readings.values())}
    work.mkdir(parents=True, exist_ok=True)
    (work / "inventory.json").write_text(
        json.dumps(plan, ensure_ascii=False, indent=4) + "\n"
    )
    for index in range(args.workers):
        (work / f"inventory-{index}.json").write_text(
            json.dumps(
                {**plan, "recordings": plan["recordings"][index :: args.workers]},
                ensure_ascii=False,
                indent=4,
            )
            + "\n"
        )
    print(
        json.dumps(
            {
                "event": "reference_audio_planned",
                "recordings": len(readings),
                "workers": args.workers,
            }
        )
    )
else:
    inventory = json.loads((work / "inventory.json").read_text())
    destination = root / "data/audio/reference"
    destination.mkdir(parents=True, exist_ok=True)
    index = {
        "source": inventory["source"],
        "processing": inventory["processing"],
        "voiceEnvironment": "ELEVENLABS_JA_VOICE_ID",
        "license": "LicenseRef-ElevenLabs-Terms",
        "records": {},
    }
    bank = bytearray()
    number = 0
    for recording in inventory["recordings"]:
        data = (work / "assets" / recording["path"]).read_bytes()
        if not data or len(data) > 524288:
            raise ValueError("invalid_reference_audio_recording")
        if len(bank) + len(data) > 524288:
            (destination / f"{number:04}.bin").write_bytes(bank)
            number += 1
            bank = bytearray()
        index["records"][recording["text"]] = {
            "file": f"{number:04}.bin",
            "offset": len(bank),
            "length": len(data),
        }
        bank.extend(data)
    if bank:
        (destination / f"{number:04}.bin").write_bytes(bank)
    bank_count = number + bool(bank)
    for filename in destination.glob("[0-9][0-9][0-9][0-9].bin"):
        if int(filename.stem) >= bank_count:
            filename.unlink()
    (destination / "index.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=4) + "\n"
    )
    print(
        json.dumps(
            {
                "event": "reference_audio_packed",
                "recordings": len(index["records"]),
                "banks": bank_count,
            }
        )
    )
