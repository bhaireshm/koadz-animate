import type { RefObject } from 'react';

// Animation names type based on all presets
export type AnimationName = 
  // Fade animations
  | 'fadeIn' | 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight'
  // Scale animations
  | 'scaleX' | 'scaleY'
  // Skew animations
  | 'skewUp' | 'skewDown'
  // Rotate animations
  | 'rotateLeft' | 'rotateRight'
  // Slide animations
  | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown'
  // Special animations
  | 'bounce' | 'pulse' | 'shake' | 'swing' | 'tada'
  // Flip animations
  | 'flipX' | 'flipY' | 'flipInX' | 'flipInY' | 'flipOutX' | 'flipOutY'
  // Zoom animations
  | 'zoomIn' | 'zoomOut' | 'zoomInUp' | 'zoomInDown' | 'zoomInLeft' | 'zoomInRight'
  | 'zoomOutUp' | 'zoomOutDown' | 'zoomOutLeft' | 'zoomOutRight'
  // Elastic animations
  | 'elastic' | 'elasticIn' | 'elasticOut'
  // Attention-seeking animations
  | 'flash' | 'headShake' | 'heartBeat' | 'jello' | 'rubberBand' | 'wobble';

// Core animation configuration interface
export interface AnimationConfig {
  animation?: AnimationName | AnimationName[];
  duration?: number;
  delay?: number;
  loop?: number | boolean;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternateReverse';
  ease?: string;
  scrollThreshold?: number;
  // Additional anime.js properties
  [key: string]: any;
}

// Update animation configuration (partial)
export interface UpdateAnimationConfig extends Partial<AnimationConfig> {}

// Animation configurations map
export type AnimationConfigs = Record<AnimationName, Partial<AnimationConfig>>;

// Scroll configuration interface
export interface ScrollConfig {
  enabled: boolean;
  threshold?: number | string;
  repeat?: boolean;
  container?: HTMLElement | string;
  axis?: 'x' | 'y' | 'both';
}

// Animation target for child animations
export interface AnimationTarget extends AnimationConfig {
  id: string;
  parentId?: string;
  animateOnScroll?: boolean | ScrollConfig;
}

// Props for useAnimation hook
export interface UseAnimationProps extends AnimationConfig {
  childAnimations?: AnimationTarget[];
  parentId?: string;
  animateOnLoad?: boolean;
  animateOnScroll?: boolean | ScrollConfig;
}

// Anime.js instance type (simplified)
export interface AnimeInstance {
  play: () => void;
  pause: () => void;
  restart: () => void;
  reverse: () => void;
  seek: (time: number) => void;
  remove: () => void;
  progress: number;
  duration: number;
  currentTime: number;
  reverseDirection: boolean;
  paused: boolean;
  began: boolean;
  loopBegan: boolean;
  changeBegan: boolean;
  completed: boolean;
  changeCompleted: boolean;
  reversePlayback: boolean;
  reversed: boolean;
  animatable: any[];
  animatables: any[];
  animations: any[];
}

// Return type for useAnimation hook
export type UseAnimationReturnType = {
  ref: RefObject<HTMLElement | null>;
  play: () => void;
  getElementById: (id: string, parentId?: string) => HTMLElement | null;
  animateById: (id: string, parentId?: string, config?: AnimationConfig) => void;
  animateElement: (
    element: HTMLElement,
    config?: AnimationConfig,
    id?: string,
  ) => AnimeInstance;
  updateConfig: (
    newConfig: UpdateAnimationConfig,
    targetId?: string,
    targetParentId?: string,
  ) => void;
  instances: Map<string, AnimeInstance>;
};