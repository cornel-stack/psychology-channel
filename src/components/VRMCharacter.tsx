/**
 * VRM character (Rule #2, PRIMARY signature path for future episodes).
 *
 * Per research: @pixiv/three-vrm (MIT) gives standardized facial EMOTION
 * presets (happy/angry/sad/relaxed/surprised) + retargetable Mixamo body
 * actions (walk/sit/gesture) — the best free, emotion-capable character system.
 *
 * To use:
 *   1. Get a CC/CC0 .vrm model (VRoid Hub) -> public/assets/<model>.vrm
 *   2. (Optional) a .vrma or retargeted Mixamo clip for body motion.
 *   3. Render inside <ThreeCanvas> (see EmotionConstellation3D for the wrapper).
 *
 * Drives expression weights + animation mixer by useCurrentFrame() so the
 * render stays deterministic. Renders nothing if the model is absent.
 */
import React, { useEffect, useRef, useState } from "react";
import { useCurrentFrame, useVideoConfig, delayRender, continueRender, staticFile } from "remotion";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRM, VRMLoaderPlugin, VRMExpressionPresetName } from "@pixiv/three-vrm";
import * as THREE from "three";

type Expr = "neutral" | "happy" | "sad" | "angry" | "relaxed" | "surprised";

const EXPR_MAP: Record<Expr, VRMExpressionPresetName | null> = {
  neutral: null,
  happy: VRMExpressionPresetName.Happy,
  sad: VRMExpressionPresetName.Sad,
  angry: VRMExpressionPresetName.Angry,
  relaxed: VRMExpressionPresetName.Relaxed,
  surprised: VRMExpressionPresetName.Surprised,
};

export const VRMCharacter: React.FC<{
  model: string; // filename under public/assets/, e.g. "guide.vrm"
  expression?: Expr;
  position?: [number, number, number];
}> = ({ model, expression = "neutral", position = [0, -1.2, 0] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [handle] = useState(() => delayRender(`vrm-${model}`));
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));
    loader.load(
      staticFile(`assets/${model}`),
      (gltf) => {
        const v = gltf.userData.vrm as VRM;
        setVrm(v);
        continueRender(handle);
      },
      undefined,
      () => continueRender(handle) // missing/failed model: skip gracefully
    );
  }, [handle, model]);

  useEffect(() => {
    if (!vrm) return;
    const preset = EXPR_MAP[expression];
    vrm.expressionManager?.setValue("neutral", preset ? 0 : 1);
    if (preset) vrm.expressionManager?.setValue(preset, 1);
    vrm.expressionManager?.update();
    vrm.update(frame / fps);
  }, [vrm, expression, frame, fps]);

  if (!vrm) return null;
  return <primitive ref={groupRef} object={vrm.scene} position={position} />;
};
