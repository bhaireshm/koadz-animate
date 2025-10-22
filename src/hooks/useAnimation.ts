import anime from 'animejs';
import { useEffect, useRef, useState } from 'react';
import type { AnimationConfig, UseAnimationProps } from '../types';

export function useAnimation({
  animation,
  duration = 1000,
  delay = 0,
  loop = 0,
  animateOnLoad = true,
  animateOnScroll = false,
}: UseAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  const play = () => {
    if (!ref.current) return;
    anime({
      targets: ref.current,
      duration,
      delay,
      loop,
      easing: 'easeOutQuad',
      ...getAnimationConfig(animation),
    });
    setAnimated(true);
  };

  useEffect(() => {
    if (animateOnLoad) {
      play();
    }

    if (animateOnScroll && ref.current) {
      const handler = () => {
        const element = ref.current;
        if (!element) return;
        if (isElementInViewport(element, 0)) {
          play();
          setAnimated(true);
        }
      };

      window.addEventListener('scroll', handler);

      return () => {
        window.removeEventListener('scroll', handler);
      };
    }
  }, [animateOnLoad, animateOnScroll]);

  const getAnimationConfig = (animation: string | string[] | undefined) => {
    if (!animation) return {};
    if (typeof animation === 'string') {
      return getPresetAnimation(animation);
    }
    if (Array.isArray(animation)) {
      return animation.reduce((acc, anim) => ({ ...acc, ...getPresetAnimation(anim) }), {});
    }
    return {};
  };

  const getPresetAnimation = (animation: string) => {
    switch (animation) {
      case 'fadeIn':
        return { opacity: [0, 1] };
      case 'fadeUp':
        return { opacity: [0, 1], translateY: [20, 0] };
      case 'slideUp':
        return { translateY: [50, 0], opacity: [0, 1] };
      case 'zoomIn':
        return { scale: [0, 1], opacity: [0, 1] };
      case 'bounce':
        return { translateY: [0, -30, 0], opacity: [1, 1] };
      case 'rotateRight':
        return { rotate: [0, 360] };
      default:
        return {};
    }
  };

  return { ref, play, updateConfig: () => {} };
}
