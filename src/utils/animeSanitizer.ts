// Helper to sanitize anime.js config and safely merge animations
import type { AnimationConfig, AnimationName } from '../types';

const VALID_TOP_LEVEL_KEYS = new Set([
  'targets','duration','delay','loop','direction','ease','keyframes','autoplay','playbackEase','onBegin','onUpdate','onComplete','onScroll','loopDelay','alternate'
]);

const VALID_PROP_KEYS = new Set([
  'translateX','translateY','translateZ','scale','scaleX','scaleY','rotate','rotateX','rotateY','skewX','skewY',
  'opacity','color','backgroundColor','transformOrigin'
]);

const isObject = (v: any) => v && typeof v === 'object' && !Array.isArray(v);

// Normalize easing key name to anime v4 "ease"
const normalizeEase = (obj: any) => {
  if (!obj) return obj;
  if (isObject(obj)) {
    if ('easing' in obj && !('ease' in obj)) {
      (obj as any).ease = (obj as any).easing;
      delete (obj as any).easing;
    }
    return obj;
  }
  return obj;
};

// Convert value array [from,to,...] into keyframe objects if needed
const valueArrayToKeyframes = (arr: any[]): any[] => {
  if (arr.length === 0) return arr;
  if (arr.every(item => isObject(item) && 'to' in item)) return arr;
  return arr.map(v => ({ to: v }));
};

// Merge two animatable property entries into a valid keyframes array
const mergePropEntries = (a: any, b: any) => {
  if (Array.isArray(a) && Array.isArray(b)) {
    const aKF = valueArrayToKeyframes(a);
    const bKF = valueArrayToKeyframes(b);
    return [...aKF, ...bKF];
  }
  if (Array.isArray(a) && isObject(b)) {
    return [...valueArrayToKeyframes(a), b];
  }
  if (isObject(a) && Array.isArray(b)) {
    return [a, ...valueArrayToKeyframes(b)];
  }
  if (isObject(a) && isObject(b)) {
    return [a, b];
  }
  return valueArrayToKeyframes([a, b]);
};

// Build a sanitized anime config from potentially mixed input
export const sanitizeAnimeConfig = (input: any): any => {
  if (!input || typeof input !== 'object') return {};
  const out: any = {};

  // Top-level primitives
  for (const key of Object.keys(input)) {
    const val = (input as any)[key];
    if (val == null) continue;
    if (VALID_TOP_LEVEL_KEYS.has(key)) {
      out[key] = key === 'onScroll' ? val : normalizeEase(val);
    }
  }

  // Animatable props
  for (const key of Object.keys(input)) {
    const val = (input as any)[key];
    if (val == null) continue;
    if (VALID_PROP_KEYS.has(key)) {
      if (out[key] === undefined) out[key] = val;
      else out[key] = mergePropEntries(out[key], val);
    }
  }

  // If any animatable prop is array of objects, don't force building keyframes at top-level
  // Anime v4 accepts per-prop tween-parameter arrays; only construct keyframes if explicitly provided

  return out;
};
