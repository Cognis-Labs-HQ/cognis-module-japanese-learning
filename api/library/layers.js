export const LIBRARY_LAYERS = [
    "alphabet",
    "alt_characters",
    "definitions",
    "words",
    "sentences",
    "exercises",
    "workouts",
    "routines",
    "collections",
];

const ALLOWED_REFERENCE_LAYERS = {
    alphabet: [],
    alt_characters: ["alphabet"],
    definitions: [],
    words: ["alphabet", "alt_characters", "definitions"],
    sentences: ["words", "definitions"],
    exercises: [
        "alphabet",
        "alt_characters",
        "definitions",
        "words",
        "sentences",
    ],
    workouts: ["exercises"],
    routines: ["exercises", "workouts"],
    collections: LIBRARY_LAYERS.filter((layer) => layer !== "collections"),
};

export function isLibraryLayer(value) {
    return LIBRARY_LAYERS.includes(value);
}

export function allowedReferenceLayers(layer) {
    return ALLOWED_REFERENCE_LAYERS[layer];
}

export function validateReferenceLayers(layer, references, referencedLayers) {
    const allowed = new Set(allowedReferenceLayers(layer));
    for (const reference of references) {
        const referencedLayer = referencedLayers.get(reference.entryId);
        if (!referencedLayer) throw new Error("reference_not_found");
        if (!allowed.has(referencedLayer)) {
            throw new Error(`invalid_reference:${layer}:${referencedLayer}`);
        }
    }
}
