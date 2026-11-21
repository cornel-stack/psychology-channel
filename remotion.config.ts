import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setConcurrency(2);
// three.js (WebGL) on headless CI has no GPU, so use SwiftShader via ANGLE
// ("swangle") for reliable software rendering. @remotion/three needs no extra
// webpack config in Remotion v4 — <ThreeCanvas> just works.
Config.setChromiumOpenGlRenderer("swangle");
