// Types for the animation library
export interface AnimationConfig {
  animation?: string | string[];
  duration?: number;
  delay?: number;
  loop?: number;
  scrollThreshold?: number;
}

export interface ScrollConfig {
  enabled: boolean;
  threshold?: number | string;
  repeat?: boolean;
}

export interface UseAnimationProps extends AnimationConfig {
  childAnimations?: AnimationTarget[];
  parentId?: string;
  animateOnLoad?: boolean;
  animateOnScroll?: boolean | ScrollConfig;
}

export interface AnimationTarget extends AnimationConfig {
  id: string;
  parentId?: string;
  animateOnScroll?: boolean | ScrollConfig;
}
