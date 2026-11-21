/**
 * Narration + timing for "Every Feeling You Can't Name, Explained".
 *
 * Every scene that states a FACT references a `sourceId` from evidence/sources.json.
 * The EvidenceZoom component will refuse to show it unless that source is verified.
 *
 * Captions are timed relative to the start of their scene (seconds).
 * This same script is the basis for the voiceover (narration field) and the
 * YouTube description chapters (see metadata.ts).
 */
import { AccentKey } from "../../lib/theme";
import { Emotion, Action } from "../../components/EmotionFigure";

export type SceneType =
  | "hook"
  | "figure"
  | "evidence"
  | "constellation3d"
  | "wordcards"
  | "outro";

export type Cue = { text: string; from: number; dur: number };

export type Scene = {
  id: string;
  type: SceneType;
  durationSec: number;
  accent: AccentKey;
  sourceId?: string;
  emotion?: Emotion;
  action?: Action;
  title?: string;
  subtitle?: string;
  words?: { word: string; lang: string; meaning: string }[];
  narration: string; // full VO line for this scene
  cues: Cue[]; // on-screen captions
};

export const SCENES: Scene[] = [
  {
    id: "hook",
    type: "hook",
    durationSec: 9,
    accent: "fear",
    emotion: "awe",
    title: "Every Feeling You Can't Name",
    subtitle: "You've had ALL of these.",
    narration:
      "Right now you are feeling something. And there's a decent chance you don't have a word for it. Science says you've felt all of these — you just never got to name them.",
    cues: [
      { text: "Right now, you're feeling something…", from: 0.3, dur: 3 },
      { text: "…and you might not have a word for it.", from: 3.4, dur: 3 },
      { text: "You've felt ALL of these.", from: 6.6, dur: 2.2 },
    ],
  },
  {
    id: "problem",
    type: "figure",
    durationSec: 9,
    accent: "sadness",
    emotion: "sad",
    action: "sit",
    narration:
      "We're taught maybe five feelings as kids: happy, sad, angry, scared, surprised. But the human emotional world is enormous — and when you can't name a feeling, it runs you instead of you running it.",
    cues: [
      { text: "As kids we learn ~5 feelings.", from: 0.4, dur: 3 },
      { text: "Happy. Sad. Angry. Scared. Surprised.", from: 3.4, dur: 3 },
      { text: "The real map is far bigger.", from: 6.6, dur: 2.2 },
    ],
  },
  {
    id: "cowen-evidence",
    type: "evidence",
    durationSec: 11,
    accent: "awe",
    sourceId: "cowen-keltner-2017",
    narration:
      "In 2017, researchers Cowen and Keltner had over eight hundred people rate more than two thousand emotional videos. The result wasn't six basic emotions. It was twenty-seven — blending into each other like colors.",
    cues: [
      { text: "Cowen & Keltner, PNAS 2017.", from: 0.5, dur: 3 },
      { text: "800+ people · 2,185 emotional clips.", from: 3.6, dur: 3.5 },
      { text: "Not 6 emotions — 27.", from: 7.3, dur: 3 },
    ],
  },
  {
    id: "constellation",
    type: "constellation3d",
    durationSec: 10,
    accent: "fear",
    narration:
      "Twenty-seven categories — admiration, awe, nostalgia, craving, awkwardness — and they don't sit in neat boxes. They bridge into one another through smooth gradients. This is the real shape of how you feel.",
    cues: [
      { text: "27 categories, bridged by gradients.", from: 0.6, dur: 3.5 },
      { text: "Awe. Nostalgia. Craving. Awkwardness…", from: 4.2, dur: 3.3 },
      { text: "No neat boxes — a continuous map.", from: 7.6, dur: 2.2 },
    ],
  },
  {
    id: "granularity",
    type: "evidence",
    durationSec: 11,
    accent: "joy",
    sourceId: "barrett-2001",
    narration:
      "Here's why names matter. Lisa Feldman Barrett found that people who finely distinguish their feelings regulate them far better — using about thirty percent more coping strategies than people who just feel 'bad'.",
    cues: [
      { text: "Barrett et al., 2001.", from: 0.5, dur: 2.6 },
      { text: "Name feelings precisely → regulate them better.", from: 3.2, dur: 3.6 },
      { text: "~30% more coping strategies.", from: 7.0, dur: 3 },
    ],
  },
  {
    id: "granularity-health",
    type: "evidence",
    durationSec: 10,
    accent: "anger",
    sourceId: "kashdan-2015",
    narration:
      "And the opposite is costly. Low emotional granularity — only feeling in broad strokes — is linked to heavier drinking under stress, more aggression, more self-harm, and a brain that reacts harder to rejection.",
    cues: [
      { text: "Kashdan, Barrett & McKnight, 2015.", from: 0.5, dur: 3 },
      { text: "Low granularity = worse outcomes.", from: 3.6, dur: 3 },
      { text: "Drinking · aggression · self-harm · rejection.", from: 6.8, dur: 3 },
    ],
  },
  {
    id: "alexithymia",
    type: "evidence",
    durationSec: 10,
    accent: "sadness",
    sourceId: "salminen-1999",
    narration:
      "For some people this is extreme. It's called alexithymia — literally 'no words for feelings'. In a study of over twelve hundred adults, thirteen percent qualified. Men were nearly twice as likely as women.",
    cues: [
      { text: "Alexithymia: 'no words for feelings'.", from: 0.5, dur: 3 },
      { text: "Salminen et al., 1999 — 1,285 adults.", from: 3.6, dur: 3 },
      { text: "13% · men nearly 2× women.", from: 6.8, dur: 3 },
    ],
  },
  {
    id: "kama-muta",
    type: "evidence",
    durationSec: 11,
    accent: "nostalgia",
    sourceId: "zickfeld-2019",
    emotion: "joy",
    narration:
      "Now the feelings you've had but never named. That warm, teary rush when people suddenly come together — a reunion, a wedding, a stranger's kindness. Scientists call it kama muta. Studied across nineteen countries.",
    cues: [
      { text: "That warm, teary 'being moved' feeling…", from: 0.5, dur: 3.2 },
      { text: "It has a name: KAMA MUTA.", from: 3.9, dur: 3 },
      { text: "Zickfeld et al., 2019 · 19 countries.", from: 7.1, dur: 3 },
    ],
  },
  {
    id: "frisson",
    type: "evidence",
    durationSec: 10,
    accent: "fear",
    sourceId: "harrison-loui-2014",
    emotion: "awe",
    narration:
      "The chills down your spine when a song hits just right? That's frisson — and it's not just in your head. It shows up as measurable spikes in your skin and heart rate. People high in openness feel it most.",
    cues: [
      { text: "Chills from music = FRISSON.", from: 0.5, dur: 3 },
      { text: "Harrison & Loui, 2014.", from: 3.6, dur: 2.6 },
      { text: "Measurable in skin & heart rate.", from: 6.4, dur: 3 },
    ],
  },
  {
    id: "awe",
    type: "evidence",
    durationSec: 10,
    accent: "awe",
    sourceId: "keltner-haidt-2003",
    emotion: "awe",
    narration:
      "And that feeling of being tiny in front of something vast — a mountain, the night sky, a huge idea? That's awe. It literally shrinks the self and forces your mind to update how big the world is.",
    cues: [
      { text: "Feeling tiny before something vast = AWE.", from: 0.5, dur: 3.4 },
      { text: "Keltner & Haidt, 2003.", from: 4.1, dur: 2.6 },
      { text: "It shrinks the 'self'.", from: 6.9, dur: 2.6 },
    ],
  },
  {
    id: "untranslatable",
    type: "wordcards",
    durationSec: 12,
    accent: "calm",
    sourceId: "lomas-2016",
    words: [
      { word: "Iktsuarpok", lang: "Inuit", meaning: "the restless urge to keep checking if someone's arriving" },
      { word: "Gigil", lang: "Tagalog", meaning: "the overwhelming urge to squeeze something unbearably cute" },
      { word: "Sisu", lang: "Finnish", meaning: "extraordinary grit when you're already past your limit" },
    ],
    narration:
      "Other languages already named feelings English forgot. A researcher named Tim Lomas catalogued two hundred and sixteen of them — iktsuarpok, gigil, sisu — and the list has grown past a thousand.",
    cues: [
      { text: "Other languages named what English didn't.", from: 0.5, dur: 3 },
      { text: "Lomas, 2016 — 216 'untranslatable' words.", from: 3.6, dur: 3.4 },
      { text: "Now 1,000+ and counting.", from: 9.2, dur: 2.4 },
    ],
  },
  {
    id: "name-it",
    type: "evidence",
    durationSec: 11,
    accent: "joy",
    sourceId: "lieberman-2007",
    emotion: "joy",
    narration:
      "So here's the payoff. When Lieberman's team had people simply label an emotion they saw, the brain's alarm center — the amygdala — went quieter. Naming a feeling really does take its power down. Name it to tame it.",
    cues: [
      { text: "Just naming a feeling calms the brain.", from: 0.5, dur: 3.2 },
      { text: "Lieberman et al., 2007 — amygdala quiets.", from: 3.9, dur: 3.4 },
      { text: "Name it to tame it.", from: 7.5, dur: 3 },
    ],
  },
  {
    id: "outro",
    type: "outro",
    durationSec: 9,
    accent: "awe",
    emotion: "joy",
    narration:
      "You were never 'too emotional' or 'broken'. You were just under-worded. Learn the names, and the feelings stop running you. If this gave something a name, subscribe — the next one names even more.",
    cues: [
      { text: "You weren't broken. You were under-worded.", from: 0.4, dur: 3.4 },
      { text: "Learn the names → take back control.", from: 3.9, dur: 3 },
      { text: "Subscribe for the next one.", from: 7.0, dur: 2 },
    ],
  },
];

export const TOTAL_SEC = SCENES.reduce((a, s) => a + s.durationSec, 0);
