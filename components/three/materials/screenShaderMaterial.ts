import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Le seul shader GLSL custom du projet : un écran CRT stylisé —
 * lignes de « code » pseudo-aléatoires qui se tapent, scanlines,
 * curseur clignotant, vignette. Fait écho au boot terminal du Loader.
 */
export const ScreenShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#e8b84b"),
    uBg: new THREE.Color("#101319"),
    uIntensity: 1,
  },
  /* glsl vertex */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl fragment */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uBg;
    uniform float uIntensity;
    varying vec2 vUv;

    void main() {
      // fond de l'écran, léger dégradé vertical
      vec3 col = mix(uBg * 0.55, uBg, vUv.y);

      // scanlines
      float scan = 0.5 + 0.5 * sin(vUv.y * 220.0 + uTime * 2.4);
      col += uColor * 0.05 * scan;

      // lignes de "code" : blocs horizontaux pseudo-aléatoires qui se tapent
      float row = floor(vUv.y * 13.0);
      float rowRand = fract(sin(row * 12.9898) * 43758.5453);
      float lineLen = 0.18 + 0.62 * fract(rowRand * 7.31);
      float typing = 0.75 + 0.25 * sin(uTime * 0.6 + row * 1.7);
      float typed = step(vUv.x, lineLen * typing);
      float inRow = step(0.28, fract(vUv.y * 13.0)) * step(fract(vUv.y * 13.0), 0.62);
      float margin = step(0.07, vUv.x) * step(vUv.x, 0.93)
                   * step(0.10, vUv.y) * step(vUv.y, 0.90);
      col += uColor * typed * inRow * margin * 0.85 * uIntensity;

      // curseur clignotant en bas à gauche
      float cursor = step(0.07, vUv.x) * step(vUv.x, 0.115)
                   * step(0.12, vUv.y) * step(vUv.y, 0.175);
      col += uColor * cursor * step(0.5, fract(uTime * 1.1)) * 1.6 * uIntensity;

      // vignette d'écran bombé
      float vig = smoothstep(0.85, 0.45, length(vUv - 0.5));
      col *= 0.5 + 0.5 * vig;

      gl_FragColor = vec4(col, 1.0);
      #include <colorspace_fragment>
    }
  `,
);

export type ScreenShaderMaterialImpl = THREE.ShaderMaterial & {
  uTime: number;
  uColor: THREE.Color;
  uBg: THREE.Color;
  uIntensity: number;
};

declare module "@react-three/fiber" {
  interface ThreeElements {
    screenShaderMaterial: ThreeElement<typeof ScreenShaderMaterial>;
  }
}

extend({ ScreenShaderMaterial });
