// Helper to sanitize anime.js config and safely merge animations
import type { AnimationConfig, AnimationName } from '../types';

const VALID_TOP_LEVEL_KEYS = new Set([
  'targets','duration','delay','loop','direction','ease','keyframes','autoplay','playbackEase','onBegin','onUpdate','onComplete','onScroll','loopDelay','alternate'
]);

const VALID_PROP_KEYS = new Set([
  // transforms
  'translateX','translateY','translateZ','scale','scaleX','scaleY','rotate','rotateX','rotateY','skewX','skewY',
  // opacity and colors
  'opacity','color','backgroundColor',
  // others commonly used
  'transformOrigin'
]);

const isObject = (v: any) => v && typeof v === 'object' && !Array.isArray(v);

// Normalize easing key name to anime v4 "ease"
const normalizeEase = (obj: any) => {
  if (!obj) return obj;
  if ('easing' in obj && !('ease' in obj)) {
    obj.ease = obj.easing;
    delete obj.easing;
  }
  return obj;
};

// Convert value array [from,to,...] into keyframe objects if needed
const valueArrayToKeyframes = (arr: any[]): any[] => {
  if (arr.length === 0) return arr;
  // If already array of objects with {to,...}, keep
  if (arr.every(item => isObject(item) && 'to' in item)) return arr;
  // Otherwise map values to { to: value }
  return arr.map(v => ({ to: v }));
};

// Merge two animatable property entries into a valid keyframes array
const mergePropEntries = (a: any, b: any) => {
  // If both arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    const aKF = valueArrayToKeyframes(a);
    const bKF = valueArrayToKeyframes(b);
    return [...aKF, ...bKF];
  }
  // If one array one object
  if (Array.isArray(a) && isObject(b)) {
    return [...valueArrayToKeyframes(a), b];
  }
  if (isObject(a) && Array.isArray(b)) {
    return [a, ...valueArrayToKeyframes(b)];
  }
  // If both objects
  if (isObject(a) && isObject(b)) {
    return [a, b];
  }
  // Fallback to value array
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

  // If conflicting/multiple props indicate sequence, wrap into keyframes
  if (out.keyframes === undefined) {
    // Detect if any prop is array of objects (tween param keyframes)
    const needsKF = Object.keys(out).some(k => VALID_PROP_KEYS.has(k) && Array.isArray(out[k]) && out[k].some((it: any) => isObject(it)));
    if (needsKF) {
      const kf: any[] = [{}];
      for (const key of Object.keys(out)) {
        if (VALID_PROP_KEYS.has(key)) {
          const val = out[key];
          delete out[key];
          // Push as separate keyframes preserving arrays
          if (Array.isArray(val)) {
            val.forEach((step: any) => {
              if (isObject(step)) kf.push({ [key]: step.to ?? step.to === 0 ? step.to : step, ...normalizeEase(step) });
              else kf.push({ [key]: step });
            });
          } else {
            kf.push({ [key]: val });
          }
        }
      }
      if (kf.length > 1) out.keyframes = kf;
    }
  }

  return out;
};

// Merge multiple animation names into a single config safely
export const buildMergedAnimationConfig = (
  names: AnimationName[] | AnimationName,
  base: Partial<AnimationConfig> = {}
): any => {
  const list = Array.isArray(names) ? names : [names];
  // Caller will expand presets into props and defaults; here we just sanitize at the end
  return sanitizeAnimeConfig(base);
};
