/**
 * Load the channel fonts via @remotion/google-fonts (bundled at render time,
 * so CI needs no network). Import this once from Root.
 */
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";

loadCaveat();
loadNunito("normal", { weights: ["400", "700", "800", "900"], subsets: ["latin"] });
