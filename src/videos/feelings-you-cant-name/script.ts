/**
 * "Every Feeling You Can't Name, Explained" — 10+ minute script.
 *
 * Every scene that states a fact carries a `sourceId` from evidence/sources.json;
 * EvidenceZoom shows the real paper zoomed to the exact quote (or an honest
 * CitationCard for paywalled sources). Claims were re-verified — see CORRECTIONS.md.
 *
 * Durations come from the real Edge TTS (Brian) narration (narration.json);
 * `estSec` is only a fallback used before the voiceover is generated.
 */
import type { AccentKey } from "../../lib/theme";

export type SceneType =
  | "cold-open"
  | "peep"
  | "coco"
  | "evidence"
  | "wordcards"
  | "bigtext"
  | "outro";

/** Open Peeps `face` variants used as emotions (passed straight to DiceBear). */
export type Emotion =
  | "explaining" | "calm" | "concerned" | "concernedFear" | "smile" | "smileBig"
  | "awe" | "fear" | "solemn" | "cheeky" | "serious" | "lovingGrin1" | "tired"
  | "suspicious" | "eyesClosed" | "cute";

export type Cue = { text: string; from: number; dur: number };

export type RawScene = {
  id: string;
  type: SceneType;
  estSec: number;
  accent: AccentKey;
  sourceId?: string;
  emotion?: Emotion;
  peepSeed?: string;
  coco?: string; // key into the committed Coco Material set
  title?: string;
  subtitle?: string;
  bigText?: string[];
  words?: { word: string; lang: string; meaning: string; coco?: string }[];
  narration: string;
  cues: Cue[];
};

export type Scene = RawScene & { durationSec: number; durationFrames: number };

const RAW: RawScene[] = [
  // ───────────────────────── COLD OPEN ─────────────────────────
  {
    id: "open-1",
    type: "cold-open",
    estSec: 17,
    accent: "fear",
    emotion: "awe",
    peepSeed: "narrator",
    title: "Every Feeling You Can't Name",
    narration:
      "Think of the last time you felt something strange. Not happy. Not sad. Something in between that you couldn't quite put into words. Maybe it was standing in your childhood bedroom, now a storage room, feeling two opposite things at once. There's a decent chance you've never had a single word for that feeling — and that is doing more to you than you think.",
    cues: [
      { text: "Think of a feeling you couldn't name.", from: 0.4, dur: 4 },
      { text: "Not happy. Not sad. Something in between.", from: 5.0, dur: 4 },
      { text: "You never had a word for it.", from: 12.5, dur: 3.5 },
    ],
  },
  {
    id: "open-2",
    type: "bigtext",
    estSec: 11,
    accent: "anger",
    bigText: ["You've felt", "ALL of these.", "You just never", "got to name them."],
    narration:
      "This is a video about the feelings you've had but could never name. And here's the twist: the ones you can't name are the ones that quietly run your life. By the end, you'll have the words — and the science is genuinely wild.",
    cues: [
      { text: "The feelings you can't name…", from: 0.3, dur: 3 },
      { text: "…are the ones that run your life.", from: 3.6, dur: 4 },
    ],
  },

  {
    id: "micro-list",
    type: "bigtext",
    estSec: 26,
    accent: "sadness",
    bigText: ["A Sunday-evening sadness.", "The hum of an empty hotel room.", "Grief for a friendship", "nobody ruined."],
    narration:
      "Here are a few of them. The quiet melancholy that arrives on a Sunday evening for no reason. The specific emptiness of a hotel room in a city where nobody knows you. The ache of a song from a summer that is never coming back. The strange grief of simply outgrowing a friendship, where nobody did anything wrong. You have felt these. They are completely real. And most of them have no name in English.",
    cues: [
      { text: "A Sunday-evening sadness…", from: 0.5, dur: 3.5 },
      { text: "You've felt these. They're real.", from: 18.0, dur: 4 },
      { text: "Most have no name in English.", from: 22.5, dur: 3 },
    ],
  },

  // ───────────────────────── ACT 1 — THE PROBLEM ─────────────────────────
  {
    id: "vocab",
    type: "coco",
    estSec: 16,
    accent: "sadness",
    emotion: "explaining",
    peepSeed: "narrator",
    coco: "child",
    narration:
      "As kids, most of us are handed about five emotion words. Happy. Sad. Angry. Scared. Surprised. Five crayons to color an entire inner world. So when something more complicated shows up — the ache of missing a place that no longer exists, the warmth of a stranger's kindness — we reach for the nearest crayon and call it 'good' or 'bad'. But vague feelings are hard to handle. And psychologists found that's not a small problem.",
    cues: [
      { text: "As kids we get ~5 emotion words.", from: 0.4, dur: 4 },
      { text: "Five crayons for a whole inner world.", from: 5.2, dur: 4 },
      { text: "Vague feelings are hard to handle.", from: 14.0, dur: 2.5 },
    ],
  },
  {
    id: "problem-big",
    type: "bigtext",
    estSec: 8,
    accent: "fear",
    bigText: ["If you can't name it,", "you can't tame it.", "So — how many", "feelings are there?"],
    narration:
      "If you can't name a feeling, you can't really work with it. Which raises the obvious question science decided to actually answer: how many feelings are there?",
    cues: [
      { text: "So how many feelings ARE there?", from: 0.5, dur: 4 },
    ],
  },

  // ───────────────────────── ACT 2 — THE MAP ─────────────────────────
  {
    id: "cowen",
    type: "evidence",
    estSec: 18,
    accent: "awe",
    sourceId: "cowen-keltner-2017",
    narration:
      "In 2017, two researchers, Alan Cowen and Dacher Keltner, ran a massive study. They showed 853 people over two thousand short videos — snakes, births, sunsets, awkward moments — and asked exactly how each one made them feel. The answer wasn't the five basic emotions. It wasn't six. It took twenty-seven distinct categories of feeling to describe human experience — and they don't sit in neat boxes. They blend into each other like colors on a wheel.",
    cues: [
      { text: "Cowen & Keltner, PNAS 2017.", from: 0.5, dur: 3.5 },
      { text: "853 people · 2,185 emotional videos.", from: 4.5, dur: 4 },
      { text: "Not 5. Not 6. Twenty-seven.", from: 12.0, dur: 3.5 },
    ],
  },
  {
    id: "jackson",
    type: "evidence",
    estSec: 17,
    accent: "calm",
    sourceId: "jackson-2019",
    narration:
      "And this isn't just an English or Western thing. In 2019, a team in the journal Science compared emotion words across 2,474 languages. Cultures carve up feeling in surprisingly different ways — in some languages, 'anxiety' and 'grief' are close cousins; in others, 'anger' and 'envy' overlap. But underneath all that variation, two universal dials appeared in every language: is this feeling good or bad, and does it leave you calm or activated. A shared human skeleton, dressed differently everywhere.",
    cues: [
      { text: "Jackson et al., Science 2019.", from: 0.5, dur: 3 },
      { text: "2,474 languages compared.", from: 5.0, dur: 3.5 },
      { text: "Universal: good↔bad · calm↔activated.", from: 11.5, dur: 4 },
    ],
  },

  // ───────────────────────── ACT 3 — WHY NAMING MATTERS ─────────────────────────
  {
    id: "names-big",
    type: "bigtext",
    estSec: 8,
    accent: "joy",
    bigText: ["A name is not", "just a label.", "A name is", "a tool."],
    narration:
      "Here's where it gets practical. Because a precise name for a feeling isn't just a label — it turns out to be a tool. And the people who have more of these tools live measurably different lives.",
    cues: [
      { text: "A precise name is a TOOL.", from: 0.5, dur: 4 },
    ],
  },
  {
    id: "barrett",
    type: "evidence",
    estSec: 17,
    accent: "joy",
    sourceId: "barrett-2001",
    narration:
      "Psychologist Lisa Feldman Barrett calls this skill 'emotional granularity' — how finely you can distinguish what you feel. In a two-week study, she found that people who could tell their negative emotions apart — who felt specifically 'resentful' or 'lonely' rather than just 'bad' — regulated those emotions better. And the effect was strongest exactly when they needed it most: when the feeling was intense.",
    cues: [
      { text: "Emotional granularity (Barrett).", from: 0.5, dur: 3.5 },
      { text: "Tell feelings apart → handle them better.", from: 5.5, dur: 4.5 },
      { text: "Strongest when the feeling is intense.", from: 12.5, dur: 3.5 },
    ],
  },
  {
    id: "kashdan-strat",
    type: "evidence",
    estSec: 14,
    accent: "awe",
    sourceId: "kashdan-2015-strategies",
    narration:
      "How much better? When researchers tracked people day by day, those who were skilled at distinguishing their negative feelings used nearly thirty percent more strategies to actually deal with them. Same situation, same stress — but a bigger toolbox, just from having more precise words.",
    cues: [
      { text: "~30% more coping strategies.", from: 0.5, dur: 4 },
      { text: "Same stress — bigger toolbox.", from: 9.0, dur: 3.5 },
    ],
  },
  {
    id: "kashdan-costs",
    type: "evidence",
    estSec: 18,
    accent: "anger",
    sourceId: "kashdan-2015-costs",
    coco: "argument",
    narration:
      "And when people lack those words, the costs are real. Reviewing the research, Kashdan and colleagues found that people low in emotional granularity drink more alcohol when they're stressed, and lash out harder when provoked. In fact, people who could finely label their anger were twenty to fifty percent less likely to retaliate aggressively against someone who hurt them. The words you have literally change what you do.",
    cues: [
      { text: "Low granularity = higher cost.", from: 0.5, dur: 3.5 },
      { text: "20–50% less likely to retaliate.", from: 9.5, dur: 4 },
      { text: "Your words change your actions.", from: 15.0, dur: 3 },
    ],
  },
  {
    id: "alexithymia",
    type: "evidence",
    estSec: 16,
    accent: "sadness",
    sourceId: "salminen-1999",
    coco: "confused",
    narration:
      "For some people, this goes further. There's a trait called alexithymia — literally, 'no words for emotions'. These are people who feel the body's signals, the racing heart, the tension, but genuinely can't identify the emotion behind them. And it's not rare. In a study of over twelve hundred adults, about thirteen percent qualified — and men were almost twice as likely as women.",
    cues: [
      { text: "Alexithymia: 'no words for emotions'.", from: 0.5, dur: 4 },
      { text: "~13% of adults. Men ~2× women.", from: 10.5, dur: 4 },
    ],
  },
  {
    id: "lieberman",
    type: "evidence",
    estSec: 18,
    accent: "fear",
    sourceId: "lieberman-2007",
    coco: "brain",
    narration:
      "So what actually happens in the brain when you name a feeling? In a landmark brain-imaging study, Matthew Lieberman had people look at angry and fearful faces. When they just looked, the amygdala — the brain's threat alarm — lit up. But when they put a word to the emotion, labeling it 'angry' or 'afraid', that alarm went quieter, and a thoughtful region behind the forehead switched on instead. Naming the feeling turned down the fire.",
    cues: [
      { text: "Lieberman et al., 2007.", from: 0.5, dur: 3 },
      { text: "Name the emotion → amygdala quiets.", from: 9.5, dur: 4.5 },
      { text: "'Name it to tame it' — for real.", from: 15.0, dur: 3 },
    ],
  },
  {
    id: "torre",
    type: "evidence",
    estSec: 14,
    accent: "calm",
    sourceId: "torre-lieberman-2018",
    narration:
      "And the beautiful part: this works quietly. Later research calls affect labeling an 'implicit' form of emotion regulation — it calms you down even though it doesn't feel like effort, and even when you don't realize it's working. You're not suppressing the feeling. You're just giving it a name, and the name does the work.",
    cues: [
      { text: "Naming = effortless regulation.", from: 0.5, dur: 4 },
      { text: "Not suppressing — just naming.", from: 9.0, dur: 4 },
    ],
  },

  // ───────────────────────── ACT 4 — THE TOUR ─────────────────────────
  {
    id: "tour-big",
    type: "bigtext",
    estSec: 9,
    accent: "nostalgia",
    bigText: ["Now —", "the feelings", "you've had but", "never named."],
    narration:
      "So let's actually do it. Let's give names to feelings you have definitely had — maybe this week — but never had a word for. Watch how many of these you recognize.",
    cues: [
      { text: "Feelings you've had… but never named.", from: 0.5, dur: 4 },
    ],
  },
  {
    id: "kama-muta",
    type: "evidence",
    estSec: 19,
    accent: "nostalgia",
    sourceId: "zickfeld-2019",
    coco: "reunion",
    narration:
      "That warm rush in your chest when soldiers come home, when a crowd sings together, when a stranger does something unexpectedly kind — the feeling that pushes tears into your eyes even though nothing sad is happening. Scientists named it kama muta, an old Sanskrit phrase meaning 'moved by love'. In a study spanning nineteen nations and fifteen languages, over three thousand people reported the same signature: warmth in the chest, moist eyes, goosebumps. You've felt it. Now you have the word.",
    cues: [
      { text: "That warm, teary 'being moved' feeling…", from: 0.4, dur: 4 },
      { text: "It has a name: KAMA MUTA.", from: 9.0, dur: 3.5 },
      { text: "19 nations · 15 languages · 3,542 people.", from: 13.0, dur: 4 },
    ],
  },
  {
    id: "frisson",
    type: "evidence",
    estSec: 16,
    accent: "fear",
    sourceId: "grewe-2009",
    coco: "music",
    narration:
      "Then there's that shiver down your spine when a song hits the perfect note — the chills. The scientific word is frisson, and it is not just in your head. When researchers wired people up and played them their favorite music, the chills showed up as real, measurable spikes — in skin conductance, and in heart rate — peaking at the exact second the music swelled.",
    cues: [
      { text: "Chills from music = FRISSON.", from: 0.4, dur: 3.5 },
      { text: "Grewe et al., 2009.", from: 4.5, dur: 2.5 },
      { text: "Real spikes in skin & heart rate.", from: 10.5, dur: 4 },
    ],
  },
  {
    id: "frisson-openness",
    type: "evidence",
    estSec: 11,
    accent: "fear",
    sourceId: "colver-2016",
    narration:
      "And if you get these chills a lot, it might say something about you. People high in the personality trait 'openness to experience' — the curious, imaginative, deeply-absorbed types — feel frisson more often than anyone else.",
    cues: [
      { text: "High 'Openness' → more chills.", from: 0.5, dur: 4 },
      { text: "Colver & El-Alayli, 2016.", from: 7.0, dur: 3 },
    ],
  },
  {
    id: "awe",
    type: "evidence",
    estSec: 17,
    accent: "awe",
    sourceId: "keltner-haidt-2003",
    coco: "mountain",
    narration:
      "And then there's the big one — the feeling of standing in front of something vast. A mountain range. A cathedral. The night sky when you're far from the city. Researchers Keltner and Haidt defined awe with two ingredients: a sense of vastness, something far bigger than you — and a need for accommodation, the feeling that your mind has to stretch and update just to take it in.",
    cues: [
      { text: "Feeling tiny before something vast = AWE.", from: 0.4, dur: 4 },
      { text: "Vastness + a mind forced to stretch.", from: 10.5, dur: 4.5 },
    ],
  },
  {
    id: "awe-smallself",
    type: "evidence",
    estSec: 14,
    accent: "awe",
    sourceId: "piff-2015",
    narration:
      "And awe does something remarkable. Across experiments with more than two thousand people, awe shrank the ego — researchers call it the 'small self' — and people who'd just felt it became noticeably more generous and helpful afterward. Feeling small, it turns out, can make us kinder.",
    cues: [
      { text: "Awe shrinks the ego: the 'small self'.", from: 0.5, dur: 4 },
      { text: "…and makes us kinder. (Piff, 2015)", from: 8.5, dur: 4 },
    ],
  },
  {
    id: "untranslatable",
    type: "wordcards",
    estSec: 20,
    accent: "calm",
    sourceId: "lomas-2016",
    words: [
      { word: "Iktsuarpok", lang: "Inuit", meaning: "the restless urge to keep checking if someone's arriving", coco: "waiting" },
      { word: "Wabi-sabi", lang: "Japanese", meaning: "finding beauty in things imperfect and impermanent", coco: "nature" },
      { word: "Sisu", lang: "Finnish", meaning: "grit that kicks in after you're already past your limit", coco: "climbing" },
      { word: "Gigil", lang: "Tagalog", meaning: "the urge to squeeze something unbearably cute", coco: "heart" },
    ],
    narration:
      "And if English leaves you short, other languages have been naming these feelings for centuries. A researcher named Tim Lomas went looking, and in his first sweep alone catalogued 216 'untranslatable' words for feelings English simply doesn't have. Iktsuarpok — the restless itch of waiting for someone to arrive. Wabi-sabi — beauty in things imperfect and fading. Sisu — the grit that shows up after you're already spent. Gigil — the urge to squeeze something unbearably cute. His list has since grown past a thousand.",
    cues: [
      { text: "216 'untranslatable' feeling-words.", from: 0.5, dur: 4 },
      { text: "Lomas, 2016 — now 1,000+.", from: 16.5, dur: 3 },
    ],
  },

  {
    id: "sonder-aside",
    type: "peep",
    estSec: 28,
    accent: "fear",
    emotion: "serious",
    peepSeed: "narrator",
    narration:
      "Now, a quick but important honesty check. You may have seen beautiful words floating around online — like 'sonder', the realization that every stranger has a life as vivid and complicated as your own. I genuinely love these. But they come from a poetry project called the Dictionary of Obscure Sorrows, invented by a writer named John Koenig. They are art, not science. So I'm keeping them clearly separate from the peer-reviewed research in this video — because on a channel like this, accuracy matters.",
    cues: [
      { text: "Honesty check: 'sonder' is not science.", from: 0.5, dur: 4.5 },
      { text: "It's poetry (John Koenig) — beautiful, but art.", from: 13.0, dur: 4.5 },
      { text: "Accuracy matters here.", from: 24.0, dur: 3 },
    ],
  },

  // ───────────────────────── ACT 5 — THE PAYOFF ─────────────────────────
  {
    id: "hoemann",
    type: "evidence",
    estSec: 16,
    accent: "joy",
    sourceId: "hoemann-2021",
    narration:
      "Now the best news of all. If granularity is a skill, can you actually build it? In 2021, researchers had people log their feelings in the moment, day after day, for a few weeks. And measurably, their emotional granularity went up. You can genuinely get better at feeling — just by paying closer attention and reaching for more precise words.",
    cues: [
      { text: "Can you train granularity? Yes.", from: 0.5, dur: 4 },
      { text: "Hoemann et al., 2021.", from: 5.0, dur: 2.5 },
      { text: "Track feelings → granularity rises.", from: 10.5, dur: 4 },
    ],
  },
  {
    id: "practice",
    type: "coco",
    estSec: 16,
    accent: "joy",
    emotion: "smile",
    peepSeed: "narrator",
    coco: "writing",
    narration:
      "So here's your homework, and it's simple. Next time a feeling hits, don't settle for 'good' or 'bad' or 'fine'. Pause and ask: is this closer to disappointment, or to grief? Is this anxiety, or is it actually excitement wearing a disguise? Name it as precisely as you can. Borrow a word from another language if you need to. Each time you do, you hand yourself one more tool — and you take a little power back from the feeling.",
    cues: [
      { text: "Don't settle for 'good' or 'bad'.", from: 0.5, dur: 4 },
      { text: "Name it as precisely as you can.", from: 9.0, dur: 4 },
    ],
  },

  {
    id: "build-skill",
    type: "coco",
    estSec: 30,
    accent: "awe",
    emotion: "explaining",
    peepSeed: "narrator",
    coco: "brain",
    narration:
      "If you want to actually build this skill, three things help. One: when a feeling hits, try to name it two layers deeper. Not just 'bad', but 'rejected', or 'overlooked', or 'restless'. Two: collect words — steal them from other languages, from books, from this video. Every new word is a finer brush. And three: check your body. A tight chest, a warm face, a knot in your stomach — then ask what feeling that signal belongs to. Granularity isn't a gift you're born with. It's a muscle you train.",
    cues: [
      { text: "1. Name it two layers deeper.", from: 2.0, dur: 4 },
      { text: "2. Collect words — finer brushes.", from: 14.0, dur: 4 },
      { text: "3. Read your body's signals.", from: 22.0, dur: 4 },
    ],
  },
  {
    id: "recap",
    type: "bigtext",
    estSec: 24,
    accent: "joy",
    bigText: ["kama muta · frisson · awe", "the small self · sisu", "wabi-sabi · iktsuarpok", "— now they're yours."],
    narration:
      "So let's count what you're walking away with. Kama muta. Frisson. Awe, and the small self. Iktsuarpok. Sisu. Wabi-sabi. Emotional granularity. Alexithymia. Affect labeling. That's ten new words for feelings you've had your entire life — ten new brushes for painting a far more detailed inner world.",
    cues: [
      { text: "Ten new words for old feelings.", from: 0.5, dur: 4 },
      { text: "Ten new brushes for your inner world.", from: 18.0, dur: 4 },
    ],
  },

  // ───────────────────────── OUTRO ─────────────────────────
  {
    id: "outro",
    type: "outro",
    estSec: 14,
    accent: "awe",
    emotion: "lovingGrin1",
    peepSeed: "narrator",
    narration:
      "So no — you were never 'too emotional', and you were never broken. You were just under-worded. The feelings were always there. Now you've got names for them, and naming, as we've seen, is quietly powerful. If any of these finally gave a name to something you've felt, subscribe — because the next one names even more. Thanks for watching.",
    cues: [
      { text: "You weren't broken. You were under-worded.", from: 0.4, dur: 4 },
      { text: "Subscribe — the next one names more.", from: 9.0, dur: 3.5 },
    ],
  },
];

// Real per-scene audio durations from `npm run voiceover` (Edge TTS, Brian).
import narration from "./narration.json";
const FPS = 30;
const narrationMap = narration as Record<string, { audioSec: number; frames: number }>;

export const SCENES: Scene[] = RAW.map((raw) => {
  const n = narrationMap[raw.id];
  const durationFrames = n ? n.frames : Math.round(raw.estSec * FPS);
  const durationSec = durationFrames / FPS;
  const scale = n ? n.audioSec / raw.estSec : 1;
  const cues = raw.cues.map((c) => ({ ...c, from: c.from * scale, dur: c.dur * scale }));
  return { ...raw, durationFrames, durationSec, cues };
});

export const TOTAL_SEC = SCENES.reduce((a, s) => a + s.durationSec, 0);
export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + s.durationFrames, 0);
