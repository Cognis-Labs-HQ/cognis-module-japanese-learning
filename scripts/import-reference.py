"""Compile a licensed reference dictionary into deterministic, lazy lookup shards."""

import argparse, collections, gzip, hashlib, json, pathlib, re, xml.etree.ElementTree as ET, unicodedata

parser = argparse.ArgumentParser()
parser.add_argument("--source", type=pathlib.Path, required=True)
parser.add_argument("--priorities", type=pathlib.Path)
parser.add_argument(
    "--root", type=pathlib.Path, default=pathlib.Path(__file__).resolve().parent.parent
)
args = parser.parse_args()
root = args.root
language = json.loads((root / "data/audio/voice.json").read_text())["language"]
shards = collections.defaultdict(lambda: collections.defaultdict(list))
count = 0
coverage = {
    "recordsWithPronunciation": 0,
    "recordsWithoutPronunciation": 0,
    "recordsWithoutMeanings": 0,
    "graphRepresentable": 0,
}
normalize = lambda value: unicodedata.normalize(
    "NFKC" if language == "ja" else "NFC", value
).lower()


def add(label, record):
    global count
    spoken = bool(
        record.get("phonetics") if language == "en" else record.get("japanese")
    )
    meanings = bool(
        record["meanings"][0]["definitions"]
        if language == "en"
        else record["senses"][0]["english_definitions"]
    )
    coverage[
        "recordsWithPronunciation" if spoken else "recordsWithoutPronunciation"
    ] += 1
    coverage["recordsWithoutMeanings"] += not meanings
    if language == "en":
        coverage["graphRepresentable"] += bool(
            re.fullmatch(r"[A-Za-z]+(?: [A-Za-z]+)*", label) and len(label) <= 100
        )
    key = normalize(label)
    shard = hashlib.sha256(key.encode()).hexdigest()[:2]
    shards[shard][key].append(record)
    count += 1


if language == "en":
    lexicon = ET.parse(gzip.open(args.source)).getroot().find("Lexicon")
    definitions = {
        e.attrib["id"]: [d.text for d in e.findall("Definition") if d.text]
        for e in lexicon.findall("Synset")
    }
    parts = {
        "n": "noun",
        "v": "verb",
        "a": "adjective",
        "s": "adjective",
        "r": "adverb",
    }
    for entry in lexicon.findall("LexicalEntry"):
        lemma = entry.find("Lemma")
        label = lemma.attrib["writtenForm"]
        pronunciations = sorted(
            lemma.findall("Pronunciation"),
            key=lambda p: p.attrib.get("variety") != "GB",
        )
        senses = [
            {"definition": value}
            for sense in entry.findall("Sense")
            for value in definitions.get(sense.attrib["synset"], [])
        ]
        record = {
            "word": label,
            "phonetics": [
                {"text": "/" + p.text.strip("/") + "/"}
                for p in pronunciations
                if p.text
            ],
            "meanings": [
                {
                    "partOfSpeech": parts.get(lemma.attrib["partOfSpeech"], "noun"),
                    "definitions": senses,
                }
            ],
            "license": {
                "name": "CC BY 4.0",
                "url": "https://creativecommons.org/licenses/by/4.0/",
            },
        }
        add(label, record)
    source = {
        "id": "open-english-wordnet",
        "url": "https://en-word.net/",
        "license": "CC-BY-4.0",
        "attribution": "Open English WordNet contributors",
    }
else:
    priorities = json.loads(args.priorities.read_text()) if args.priorities else {}
    if args.source.name.endswith(".xml.gz"):
        resource = ET.parse(gzip.open(args.source)).getroot()
        characters = {}
        for character in resource.findall("character"):
            group = character.find("reading_meaning/rmgroup")
            if group is None:
                group = ET.Element("rmgroup")

            def hiragana(text):
                return "".join(
                    chr(ord(value) - 0x60) if 0x30A1 <= ord(value) <= 0x30F6 else value
                    for value in text
                )

            metadata = {}
            for field, element in [
                ("strokes", "misc/stroke_count"),
                ("grade", "misc/grade"),
                ("freq", "misc/freq"),
            ]:
                text = character.findtext(element)
                if text:
                    metadata[field] = int(text)
            characters[character.findtext("literal")] = {
                **metadata,
                "readings_on": [
                    hiragana(reading.text)
                    for reading in group.findall("reading")
                    if reading.attrib.get("r_type") == "ja_on"
                ],
                "readings_kun": [
                    reading.text
                    for reading in group.findall("reading")
                    if reading.attrib.get("r_type") == "ja_kun"
                ],
                "readings_nanori": [
                    value.text
                    for value in character.findall("reading_meaning/nanori")
                    if value.text
                ],
                "meanings": [
                    meaning.text
                    for meaning in group.findall("meaning")
                    if not meaning.attrib.get("m_lang")
                ],
            }
    else:
        characters = json.loads(args.source.read_text())
    for label, value in characters.items():
        readings = list(
            dict.fromkeys(
                r.split(".")[0].strip("- ").replace(" ", "")
                for r in value.get("readings_kun", [])
                + value.get("readings_on", [])
                + value.get("readings_nanori", [])
                if r
            )
        )
        ranked = priorities.get(label, [])
        readings.sort(
            key=lambda reading: ranked.index(reading) if reading in ranked else 10000
        )
        record = {
            "slug": label,
            "japanese": [{"word": label, "reading": reading} for reading in readings],
            "senses": [
                {
                    "english_definitions": value.get("meanings", []),
                    "parts_of_speech": [],
                }
            ],
            "kanji": {
                "readings": {
                    "kun": value.get("readings_kun", []),
                    "on": value.get("readings_on", []),
                    "nanori": value.get("readings_nanori", []),
                },
                "meanings": value.get("meanings", []),
                "details": {
                    key: value[key]
                    for key in ["strokes", "grade", "freq"]
                    if value.get(key) is not None
                },
            },
        }
        add(label, record)
    source = {
        "id": "kanjidic2",
        "url": "https://www.edrdg.org/wiki/index.php/KANJIDIC_Project",
        "downloadUrl": "https://www.edrdg.org/kanjidic/kanjidic2.xml.gz",
        "license": "EDRDG Electronic Dictionary Licence",
        "attribution": "Electronic Dictionary Research and Development Group",
    }
destination = root / "data/reference"
destination.mkdir(parents=True, exist_ok=True)
files = []
for shard, records in sorted(shards.items()):
    raw = json.dumps(
        dict(sorted(records.items())), ensure_ascii=False, separators=(",", ":")
    ).encode()
    data = gzip.compress(raw, mtime=0)
    name = shard + ".json.gz"
    (destination / name).write_bytes(data)
    files.append(
        {"path": name, "sha256": hashlib.sha256(data).hexdigest(), "keys": len(records)}
    )
labels = {
    "en": "Reference Dictionary",
    "de": "Referenzwörterbuch",
    "id": "Kamus Referensi",
    "ja": "参照辞書",
}
manifest = {
    "language": language,
    "records": count,
    "keys": sum(f["keys"] for f in files),
    "source": {
        **source,
        "sha256": hashlib.sha256(args.source.read_bytes()).hexdigest(),
    },
    "metadata": {"labels": labels},
    "shards": files,
    "coverage": coverage,
}
(destination / "manifest.json").write_text(
    json.dumps(manifest, ensure_ascii=False, indent=4) + "\n"
)
print(
    json.dumps(
        {
            "event": "reference_catalog_generated",
            "language": language,
            "records": count,
            "keys": manifest["keys"],
        }
    )
)
