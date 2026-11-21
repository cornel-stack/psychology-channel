# Evidence (Rule #1)

This folder is the single source of truth for every factual claim shown on screen.

## The rule
A claim is only shown in a video if its source in `sources.json` is `verified: true`. Verification means **all** of:
1. the citation **URL resolves** (and the DOI, if present),
2. a **screenshot exists** in `images/<id>.png`,
3. that screenshot's **sha256 matches** the hash recorded in `sources.json`.

If any check fails, the video renders an explicit *"evidence pending verification"* card instead of the claim. We never present an unverified claim as fact.

## Workflow
```bash
npm run fetch-evidence        # capture screenshots of every source (Playwright)
npm run fetch-evidence -- cowen-keltner-2017   # just one
npm run verify-evidence       # check + record hashes + flip `verified`
npm run verify-evidence -- --strict   # also fail if any image is missing
```

## Capturing by hand
Some publishers block headless browsers. If `fetch-evidence` fails for a source, open its `url`, screenshot the page (PNG), and save it as `images/<id>.png`. Then run `verify-evidence` — a hand-placed file is treated identically.

## Zooming
Each source has a `zoom: { x, y, scale }` (x/y are 0–1 fractions of the image). That's the focal point the video animates into — set it to the exact line/figure that states the claim.

## Honesty note
`folkloreDoNotCiteAsScience` in `sources.json` lists popular-but-unscientific terms (e.g. "sonder") so they're never presented as research.
