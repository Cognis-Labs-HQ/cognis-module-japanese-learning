"""Rank canonical readings from common standalone words and aligned compound evidence."""

import collections, functools, gzip, json, pathlib, re, xml.etree.ElementTree as ET
import argparse, hashlib

parser = argparse.ArgumentParser()
parser.add_argument("--dictionary", type=pathlib.Path, required=True)
parser.add_argument("--kanji-dictionary", type=pathlib.Path, required=True)
parser.add_argument("--output", type=pathlib.Path, required=True)
parser.add_argument("--content-root", type=pathlib.Path)
args = parser.parse_args()
root = ET.parse(gzip.open(args.kanji_dictionary)).getroot()
hira = lambda text: "".join(
    chr(ord(c) - 0x60) if 0x30A1 <= ord(c) <= 0x30F6 else c for c in text
)
readings = {}
for character in root.findall("character"):
    readings[character.findtext("literal")] = list(
        dict.fromkeys(
            hira(r.text).split(".")[0].replace("-", "").replace(" ", "")
            for r in character.findall("reading_meaning/rmgroup/reading")
            if r.attrib.get("r_type") in ["ja_on", "ja_kun"]
        )
    )
voiced = dict(
    zip(
        "かきくけこさしすせそたちつてとはひふへほ",
        "がぎぐげござじずぜぞだぢづでどばびぶべぼ",
    )
)
for word in readings:
    options = []
    for reading in readings[word]:
        if not reading:
            continue
        variants = [reading]
        if reading[0] in voiced:
            variants.append(voiced[reading[0]] + reading[1:])
        if reading[-1] in "くきちつ":
            variants.extend(v[:-1] + "っ" for v in variants[:])
        options.extend((variant, reading) for variant in dict.fromkeys(variants))
    readings[word] = options
scores = collections.defaultdict(collections.Counter)
standalone = collections.defaultdict(list)
entry_number = 0


def align(form, reading):
    @functools.lru_cache(None)
    def visit(position, offset):
        if position == len(form):
            return [()] if offset == len(reading) else []
        char = form[position]
        if char == "々" and position:
            char = form[position - 1]
        options = readings.get(char, [(hira(char), None)])
        result = []
        for spoken, canonical in options:
            if reading.startswith(spoken, offset):
                for tail in visit(position + 1, offset + len(spoken)):
                    result.append((((char, canonical),) if canonical else ()) + tail)
                    if len(result) >= 8:
                        return result
        return result

    return visit(0, 0)


matched = 0
for _, entry in ET.iterparse(gzip.open(args.dictionary), events=["end"]):
    if entry.tag != "entry":
        continue
    entry_number += 1
    spelling_elements = entry.findall("k_ele")
    spellings = {
        value.findtext("keb"): [priority.text for priority in value.findall("ke_pri")]
        for value in spelling_elements
    }
    has_preferred_spelling = any(spellings.values())
    forms = list(spellings)
    positions = [value.text for value in entry.findall("sense/pos")]
    lexical = any(
        value == "pronoun" or value.startswith("noun (common)") for value in positions
    )
    for reading in entry.findall("r_ele"):
        priorities = [v.text for v in reading.findall("re_pri")]
        nf = min([int(v[2:]) for v in priorities if v.startswith("nf")] + [50])
        common = any(v in ["ichi1", "news1", "spec1"] for v in priorities)
        if nf == 50 and not common:
            continue
        weight = 1000 / (2 ** (nf / 3)) if nf < 50 else 1
        restrictions = [v.text for v in reading.findall("re_restr")]
        for form in forms:
            if (
                not form
                or len(form) > 15
                or (restrictions and form not in restrictions)
            ):
                continue
            if has_preferred_spelling and not spellings[form]:
                continue
            if len(form) == 1 and form in readings and common and lexical:
                standalone[form].append(
                    ((nf, entry_number), hira(reading.findtext("reb")))
                )
            paths = align(form, hira(reading.findtext("reb")))
            if not paths:
                continue
            matched += 1
            for path in paths:
                for character, canonical in path:
                    scores[character][canonical] += weight / len(paths)
    entry.clear()
ranking = {
    kanji: list(
        dict.fromkeys(
            [reading for _, reading in sorted(standalone.get(kanji, []))]
            + [reading for reading, _ in count.most_common()]
        )
    )
    for kanji, count in scores.items()
}
for kanji, values in standalone.items():
    if kanji not in ranking:
        ranking[kanji] = list(dict.fromkeys(reading for _, reading in sorted(values)))
preferred = json.loads(
    (
        pathlib.Path(__file__).resolve().parent.parent
        / "data/library/primary-readings.json"
    ).read_text()
)
for character, reading in preferred.items():
    if not any(canonical == reading for _, canonical in readings.get(character, [])):
        raise ValueError("invalid_preferred_reading")
    ranking[character] = [reading] + [
        value for value in ranking.get(character, []) if value != reading
    ]

if args.content_root:
    for filename in sorted((args.content_root / "alt-characters").glob("*.json")):
        cards = json.loads(filename.read_text())
        for card in cards:
            original = card["fields"]["pronunciation"]
            priorities = ranking.get(card["label"], [])
            ordered = sorted(
                original,
                key=lambda value: (
                    priorities.index(value) if value in priorities else 10000
                ),
            )
            if ordered == original:
                continue
            for relation, groups in card.get("referenceGroups", {}).items():
                if len(groups) == len(original):
                    card["referenceGroups"][relation] = [
                        groups[original.index(reading)] for reading in ordered
                    ]
            card["fields"]["pronunciation"] = ordered
        filename.write_text(json.dumps(cards, ensure_ascii=False, indent=4) + "\n")
args.output.write_text(json.dumps(ranking, ensure_ascii=False, indent=4) + "\n")
print(
    json.dumps(
        {
            "event": "pronunciation_ranking_generated",
            "alignedForms": matched,
            "characters": len(ranking),
            "sourceSha256": hashlib.sha256(args.dictionary.read_bytes()).hexdigest(),
        }
    )
)
