/**
 * Shot lists — the fast-cut visual layer (Brainosophic-style, ~2–3s/shot).
 *
 * The narration + per-scene timing (script.ts / narration.json) are unchanged;
 * each scene's duration is split across these shots with hard cuts. Images are
 * real CC-licensed photos from Openverse (scripts/fetch-images.ts), shown on a
 * white canvas with Ken Burns motion + bold word labels.
 *
 * Shot kinds:
 *   image     — a CC photo (q = Openverse search), optional bold word label
 *   word      — a big kinetic text card on white
 *   evidence  — the accurate paper quote-zoom (keep; weighted heavier)
 *   three     — a meaningful three.js 3D moment
 */
export type Motion = "in" | "out" | "left" | "right" | "up" | "down";

export type Shot =
  | { kind: "image"; id: string; q: string; label?: string; sub?: string; motion?: Motion; full?: boolean; weight?: number }
  | { kind: "word"; text: string; sub?: string; weight?: number }
  | { kind: "evidence"; sourceId: string; weight?: number }
  | { kind: "three"; variant: "globe" | "constellation" | "brain"; label?: string; weight?: number };

const img = (id: string, q: string, label?: string, motion: Motion = "in", full = false): Shot => ({
  kind: "image",
  id,
  q,
  label,
  motion,
  full,
});

export const SHOTS: Record<string, Shot[]> = {
  "open-1": [
    img("car-window-rain", "rainy car window night", undefined, "in", true),
    img("childhood-bedroom", "empty bedroom window light", undefined, "left"),
    img("storage-boxes", "cardboard boxes storage room", undefined, "in"),
    img("person-window-think", "person looking out window", undefined, "up"),
    { kind: "word", text: "a feeling with no name" },
    img("old-photographs", "old photographs memories nostalgia", undefined, "in"),
  ],
  "open-2": [
    { kind: "word", text: "You've felt ALL of these." },
    img("crowd-faces", "crowd of people faces street", undefined, "right", true),
    img("brain-lightbulb", "human mind concept abstract", undefined, "in"),
    { kind: "word", text: "they quietly run your life" },
  ],
  "micro-list": [
    img("sunday-evening", "empty street evening", "Sunday evening", "in"),
    img("hotel-room", "empty hotel room bed", "a far-away room", "left"),
    img("vinyl-record", "vinyl record", "a song from a lost summer", "in"),
    img("two-friends-apart", "two friends walking away apart", "an outgrown friendship", "right"),
    { kind: "word", text: "You've felt these. They're real." },
  ],
  "vocab": [
    img("child-crayons", "child drawing with crayons", undefined, "in"),
    img("five-crayons", "five colored crayons on white", "5 crayons", "left"),
    img("kid-upset", "child crying emotion", undefined, "in"),
    img("color-wheel-paint", "colorful paint palette many colors", undefined, "right"),
    { kind: "word", text: "Vague feelings are hard to handle." },
  ],
  "problem-big": [
    { kind: "word", text: "If you can't name it,", sub: "you can't tame it." },
    img("tangled-string", "tangled rope", undefined, "in"),
    { kind: "word", text: "So — how many feelings are there?" },
  ],
  "cowen": [
    img("movie-audience", "cinema audience", undefined, "in"),
    img("many-faces-grid", "many people portraits", undefined, "left"),
    { kind: "evidence", sourceId: "cowen-keltner-2017", weight: 4 },
    { kind: "three", variant: "constellation", label: "27 emotions, blended like colors", weight: 2 },
  ],
  "jackson": [
    img("world-languages", "world map languages abstract", undefined, "in"),
    { kind: "three", variant: "globe", label: "2,474 languages", weight: 3 },
    { kind: "evidence", sourceId: "jackson-2019", weight: 4 },
  ],
  "names-big": [
    { kind: "word", text: "A name is not just a label.", sub: "A name is a TOOL." },
    img("toolbox", "toolbox tools organized", undefined, "in"),
  ],
  "barrett": [
    img("mixing-desk", "audio mixer", undefined, "in"),
    { kind: "word", text: "emotional granularity" },
    { kind: "evidence", sourceId: "barrett-2001", weight: 4 },
  ],
  "kashdan-strat": [
    img("swiss-army", "pocket knife", "a bigger toolbox", "in"),
    { kind: "evidence", sourceId: "kashdan-2015-strategies", weight: 4 },
  ],
  "kashdan-costs": [
    img("argument-two", "couple arguing", undefined, "in"),
    img("glass-whiskey", "glass of whiskey alcohol bar", undefined, "left"),
    { kind: "evidence", sourceId: "kashdan-2015-costs", weight: 4 },
  ],
  "alexithymia": [
    img("blank-face", "serious face portrait", undefined, "in"),
    img("racing-heart", "heart rate monitor", undefined, "right"),
    { kind: "evidence", sourceId: "salminen-1999", weight: 3 },
  ],
  "lieberman": [
    img("angry-face", "angry face expression portrait", undefined, "in"),
    { kind: "evidence", sourceId: "lieberman-2007", weight: 4 },
    { kind: "three", variant: "brain", label: "name it → the amygdala quiets", weight: 2 },
  ],
  "torre": [
    img("calm-breathing", "person meditating", undefined, "in"),
    { kind: "word", text: "name it to tame it" },
    { kind: "evidence", sourceId: "torre-lieberman-2018", weight: 3 },
  ],
  "tour-big": [
    { kind: "word", text: "Now —", sub: "the feelings you've had but never named." },
    img("open-road", "open road horizon journey", undefined, "in", true),
  ],
  "kama-muta": [
    img("soldier-homecoming", "soldier reunion family hug", undefined, "in"),
    img("crowd-singing", "crowd singing concert together", undefined, "left"),
    img("stranger-kindness", "helping hand", undefined, "in"),
    { kind: "word", text: "KAMA MUTA", sub: "moved by love" },
    { kind: "evidence", sourceId: "zickfeld-2019", weight: 3 },
  ],
  "frisson": [
    img("headphones-music", "headphones listening", undefined, "in"),
    img("goosebumps-skin", "skin arm hair", "the chills", "left"),
    { kind: "word", text: "FRISSON" },
    { kind: "evidence", sourceId: "grewe-2009", weight: 3 },
  ],
  "frisson-openness": [
    img("curious-imagination", "imagination creativity dreaming abstract", undefined, "in"),
    { kind: "evidence", sourceId: "colver-2016", weight: 3 },
  ],
  "awe": [
    img("mountains-vast", "vast mountain range landscape", undefined, "in", true),
    img("cathedral-interior", "grand cathedral interior ceiling", undefined, "up"),
    img("night-sky-stars", "starry night sky milky way", undefined, "in", true),
    { kind: "word", text: "AWE", sub: "vastness + a mind forced to stretch" },
    { kind: "evidence", sourceId: "keltner-haidt-2003", weight: 3 },
  ],
  "awe-smallself": [
    img("tiny-person-landscape", "person standing grand canyon", "the small self", "out", true),
    img("helping-volunteer", "volunteers helping community", undefined, "in"),
    { kind: "evidence", sourceId: "piff-2015", weight: 3 },
  ],
  "untranslatable": [
    img("world-map-old", "old world map vintage", undefined, "in"),
    { kind: "word", text: "Iktsuarpok", sub: "the itch of waiting for someone to arrive" },
    { kind: "word", text: "Wabi-sabi", sub: "beauty in imperfect, fading things" },
    { kind: "word", text: "Sisu", sub: "grit that shows up after you're spent" },
    { kind: "word", text: "Gigil", sub: "the urge to squeeze something cute" },
    { kind: "evidence", sourceId: "lomas-2016", weight: 2 },
  ],
  "sonder-aside": [
    img("crowd-blur-street", "blurred crowd busy street motion", undefined, "right", true),
    { kind: "word", text: "'sonder' is poetry,", sub: "not peer-reviewed science." },
    img("open-book-poetry", "open book pages poetry", undefined, "in"),
    { kind: "word", text: "Accuracy matters here." },
  ],
  "hoemann": [
    img("journal-writing", "person writing journal diary", undefined, "in"),
    img("growth-plant", "small plant growing sprout", "a trainable skill", "up"),
    { kind: "evidence", sourceId: "hoemann-2021", weight: 3 },
  ],
  "practice": [
    img("person-reflecting", "person thoughtful reflecting quiet", undefined, "in"),
    { kind: "word", text: "disappointment? or grief?" },
    { kind: "word", text: "anxiety? or excitement?" },
    img("notebook-pen", "notebook and pen writing desk", undefined, "left"),
  ],
  "build-skill": [
    { kind: "word", text: "1. Name it two layers deeper." },
    img("layers-onion", "layers concept depth abstract", undefined, "in"),
    { kind: "word", text: "2. Collect words." },
    img("dictionary-pages", "dictionary pages words book", undefined, "left"),
    { kind: "word", text: "3. Read your body." },
    { kind: "three", variant: "brain", label: "granularity is a muscle", weight: 2 },
  ],
  "recap": [
    { kind: "word", text: "kama muta · frisson · awe" },
    { kind: "word", text: "sisu · wabi-sabi · iktsuarpok" },
    { kind: "three", variant: "constellation", label: "now they're yours", weight: 2 },
  ],
  "outro": [
    img("sunrise-hope", "sunrise horizon hope new day", undefined, "in", true),
    { kind: "word", text: "You weren't broken.", sub: "You were under-worded." },
    { kind: "word", text: "▶ Subscribe" },
  ],
};

/** All unique images needed, for the fetch pipeline. */
export const IMAGE_SPECS: { id: string; q: string }[] = (() => {
  const seen = new Map<string, string>();
  for (const shots of Object.values(SHOTS)) {
    for (const s of shots) {
      if (s.kind === "image" && !seen.has(s.id)) seen.set(s.id, s.q);
    }
  }
  return [...seen.entries()].map(([id, q]) => ({ id, q }));
})();
