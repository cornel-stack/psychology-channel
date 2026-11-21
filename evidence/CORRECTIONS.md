# Accuracy corrections log

This channel does not compromise on accuracy. After the first draft, every claim was re-verified against the primary source. These errors were found and fixed:

| # | Was | Now | Why |
|---|-----|-----|-----|
| 1 | "Barrett (2001) found people used 30% more strategies" | The ~30% figure is attributed to **Kashdan, Barrett & McKnight (2015)** (`kashdan-2015-strategies`), which is where that exact phrasing appears. Barrett (2001) is cited for the real finding: differentiation predicts regulation, *especially at higher intensity*. | The "30%" sentence is not in the 2001 paper; it is the 2015 review's summary. |
| 2 | Zickfeld kama muta: "3,543 participants" | **3,542 participants** | The paper states 3542. |
| 3 | Chills physiology + Openness attributed to Harrison & Loui (2014) | Physiology → **Grewe et al. (2009)** (`grewe-2009`); Openness link → **Colver & El-Alayli (2016)** (`colver-2016`). Harrison & Loui is a review/model, not the source of those data. | Correct attribution of empirical findings. |
| 4 | "Awe shrinks the self (small self)" attributed to Keltner & Haidt (2003) | **Piff et al. (2015)** (`piff-2015`) for the small self + prosociality. Keltner & Haidt (2003) is cited only for its actual contribution: vastness + need for accommodation. | The "small self" construct and experiments are Piff et al. |
| 5 | Lomas (2016): "systematic search" | "**quasi-systematic** search" | The paper describes its method as quasi-systematic. |

## How accuracy is enforced now
- Each source stores the **exact verbatim `quote`** that supports its claim.
- `scripts/fetch-evidence.ts` locates that quote's pixel rectangle (PDF via `pdftotext -bbox`; web via DOM geometry) and records a `locator`.
- The video zooms to that `locator` and highlights the sentence — so on-screen zooms always land on the real supporting text, not a guessed spot.
- `scripts/verify-evidence.ts` refuses to mark a source verified unless the URL/DOI resolves, the screenshot hash matches, **and** a locator exists.
- Paywalled sources (Salminen, Lomas, Colver, Piff) are shown as honest **citation cards** (quote + full citation + DOI), never as fabricated screenshots.
- Folklore (e.g. "sonder") is explicitly flagged in the video as art, not science.
