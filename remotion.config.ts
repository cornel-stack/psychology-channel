import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setConcurrency(2);
// three.js (WebGL) on headless CI has no GPU → SwiftShader via ANGLE.
Config.setChromiumOpenGlRenderer("swangle");
