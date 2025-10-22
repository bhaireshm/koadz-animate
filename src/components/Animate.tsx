import anime from 'animejs';
import { useEffect, useRef, useState } from 'react';
import type { AnimationConfig, UseAnimationProps, AnimationTarget, ScrollConfig } from '../types';
import { isElementInViewport } from '../utils/helpers';
import React from 'react';

interface AnimateProps extends UseAnimationProps, React.HTMLAttributes<HTMLDivElement> {}

export const Animate: React.FC<AnimateProps> = ({
  animation,
  animateOnScroll,
  animateOnLoad = true,
  childAnimations = [],
  duration,
  delay,
  loop,
  scrollThreshold,
  style,
  className,
  children,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  // Helper to play animation
  const playAnimation = () => {
    if (!containerRef.current) return;
    anime({
      targets: containerRef.current,
      ...getAnimationConfig(animation, duration, delay, loop),
    });
  };

  // On load animation
  useEffect(() => {
    if (animateOnLoad) {
      playAnimation();
      setAnimated(true);
    }
  }, [animateOnLoad]);

  // Scroll animation
  useEffect(() => {
    if (!animateOnScroll) return;
    if (!containerRef.current) return;

    const handler = () => {
      if (containerRef.current && isElementInViewport(containerRef.current, scrollThreshold ?? 0)) {
        if (!animated) {
          playAnimation();
          setAnimated(true);
        }
      }
    };

    window.addEventListener('scroll', handler);

    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, [animateOnScroll, animated, scrollThreshold]);

  // TODO: Handle childAnimations individually with separate triggers

  return (
    <div ref={containerRef} className={className} style={style} {...rest}>
      {children}
    </div>
  );
};

// Helper function for generating animejs options
const getAnimationConfig = (
  animation: string | string[] | undefined,
  duration?: number,
  delay?: number,
  loop?: number
): anime.AnimeParams => {
  const baseConfig: anime.AnimeParams = {
    duration: duration ?? 1000,
    delay: delay ?? 0,
    loop: loop ?? 0,
    easing: 'easeOutQuad',
  };

  if (!animation) return baseConfig;

  if (typeof animation === 'string') {
    return {
      ...baseConfig,
      ...getPresetAnimation(animation),
    };
  } else if (Array.isArray(animation)) {
    const merged = animation.reduce((acc, anim) => {
      return {
        ...acc,
        ...getPresetAnimation(anim),
      };
    }, baseConfig);
    return merged;
  }

  return baseConfig;
};

// Basic presets map
const getPresetAnimation = (animation: string): anime.AnimeParams => {
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
