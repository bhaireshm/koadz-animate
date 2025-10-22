import { anime } from 'animejs';
import { useEffect, useRef, useState } from 'react';
import type { AnimationConfig, UseAnimationProps } from '../types';
import { isElementInViewport } from '../utils/helpers';
import { animePropertiesMap, animationDefaults } from '../utils/constants';

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
      ...getAnimationConfig(animation, duration, delay, loop),
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

  const getAnimationConfig = (
    animation: string | string[] | undefined,
    duration?: number,
    delay?: number,
    loop?: number
  ) => {
    if (!animation) return {};

    const baseConfig: AnimationConfig = {
      duration: duration ?? 1000,
      delay: delay ?? 0,
      loop: loop ?? 0,
      easing: 'easeOutQuad',
    };

    if (typeof animation === 'string') {
      return {
        ...baseConfig,
        ...animationDefaults[animation],
        ...animePropertiesMap[animation],
      };
    } else if (Array.isArray(animation)) {
      // Merge every animation config
      const merged = animation.reduce((acc, anim) => {
        return {
          ...acc,
          ...animationDefaults[anim],
          ...animePropertiesMap[anim],
        };
      }, baseConfig);
      return merged;
    }

    return baseConfig;
  };

  return { ref, play, updateConfig: () => {} };
}
