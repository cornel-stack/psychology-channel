/**
 * Channel visual identity. The "napkin / white canvas" aesthetic (Rule #6):
 * warm off-white paper, ink-dark hand-drawn strokes, a few accent colors
 * borrowed from the emotion families in Cowen & Keltner (2017).
 */
export const theme = {
  paper: "#fbf7ef", // warm napkin white
  paperShadow: "#efe7d6",
  ink: "#2a2a33", // hand-drawn stroke
  inkSoft: "#5a5a68",
  accents: {
    sadness: "#4a78b5",
    joy: "#f2b100",
    fear: "#7a5bb0",
    anger: "#d1495b",
    awe: "#2a9d8f",
    calm: "#88b0a4",
    nostalgia: "#c98a5e",
  },
  fontTitle: "Caveat", // handwritten (loaded via @remotion/google-fonts)
  fontBody: "Nunito",
  fps: 30,
  width: 1920,
  height: 1080,
} as const;

export type AccentKey = keyof typeof theme.accents;
