/**
 * État partagé DOM ↔ canvas, muté chaque frame — même convention impérative
 * que useDragRail/CustomCursor : aucun re-render React sur le chemin chaud.
 */
export interface ChoreoTargets {
  /**
   * pos[0] : côté et amplitude en fraction du centre de marge (-1..1) —
   * la colonne de lecture occupe le centre de l'écran, le diorama danse autour.
   * pos[1]/pos[2] : offsets monde classiques.
   */
  pos: [number, number, number];
  rotY: number;
  scale: number;
  /** 0..1 — assombrit lumières/écrans (chapitre contact) */
  dim: number;
  /** [moniteur, données] — 0..1 */
  emphasis: [number, number];
}

export interface ChoreoState extends ChoreoTargets {
  /** position normalisée du pointeur (-1..1), tier full uniquement */
  pointer: { x: number; y: number };
}

/** Doit correspondre au zoom de la caméra orthographique du Canvas. */
export const CAMERA_ZOOM = 92;

/** Une keyframe par section : #top, #a-propos, #projets, #stack, #contact */
export const KEYFRAMES: ChoreoTargets[] = [
  { pos: [1, -0.2, 0], rotY: -0.5, scale: 1.05, dim: 0, emphasis: [0.7, 0.5] },
  { pos: [-1, 0, 0], rotY: 0.7, scale: 0.95, dim: 0.05, emphasis: [1, 0.3] },
  { pos: [1, 0.2, 0], rotY: 1.3, scale: 0.85, dim: 0.1, emphasis: [0.2, 1] },
  { pos: [-1, 0, 0], rotY: -0.8, scale: 1.0, dim: 0.05, emphasis: [1, 1] },
  { pos: [0.85, -0.3, 0], rotY: 2.3, scale: 1.2, dim: 0.45, emphasis: [0.2, 0.4] },
];

export function createChoreoState(): ChoreoState {
  const first = KEYFRAMES[0];
  return {
    pos: [...first.pos],
    rotY: first.rotY,
    scale: first.scale,
    dim: first.dim,
    emphasis: [...first.emphasis],
    pointer: { x: 0, y: 0 },
  };
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
};
