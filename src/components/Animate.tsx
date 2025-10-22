import { animate, createScope } from 'animejs';
import React, { useEffect, useRef, useState } from 'react';
import type { 
  AnimationConfig, 
  UseAnimationProps, 
  ScrollConfig,
  AnimationName
} from '../types';
import { mergeAnimationConfig } from '../utils/constants';
import { sanitizeAnimeConfig } from '../utils/animeSanitizer';

const filterDOMProps = (props: any) => {
  const {
    animation,
    animateOnScroll,
    animateOnLoad,
    childAnimations,
    duration,
    delay,
    loop,
    scrollThreshold,
    parentId,
    direction,
    ease,
    ...domProps
  } = props;
  return domProps;
};

interface AnimateProps extends UseAnimationProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'ref'> {}

export const Animate: React.FC<AnimateProps> = ({
  animation,
  animateOnScroll = false,
  animateOnLoad = true,
  childAnimations = [],
  duration,
  delay,
  loop,
  scrollThreshold,
  direction,
  ease,
  children,
  ...rest
}) => {
  const scope = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const scrollObservers = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (containerRef.current) {
      scope.current = createScope({ root: containerRef.current });
    }
    return () => {
      scrollObservers.current.forEach(o => o?.remove?.());
      scrollObservers.current.clear();
      scope.current?.revert?.();
    };
  }, []);

  const getElementById = (id: string, parentId?: string): HTMLElement | null => {
    const parent = parentId ? 
      (containerRef.current?.querySelector(`#${parentId}`) as HTMLElement) || containerRef.current :
      containerRef.current;
    return (parent?.querySelector(`#${id}`) as HTMLElement) || null;
  };

  const animateElement = (
    element: HTMLElement,
    config: AnimationConfig = {}
  ) => {
    const animationName = config.animation || animation;
    let animeConfig: any = {
      targets: element,
      duration: config.duration ?? duration ?? 1000,
      delay: config.delay ?? delay ?? 0,
      loop: config.loop ?? loop ?? 0,
      direction: config.direction ?? direction ?? 'normal',
      ease: config.ease ?? ease ?? 'easeOutQuad',
    };

    if (animationName) {
      if (Array.isArray(animationName)) {
        animationName.forEach(name => {
          const merged = mergeAnimationConfig(name as AnimationName, config);
          animeConfig = { ...animeConfig, ...merged };
        });
      } else {
        const merged = mergeAnimationConfig(animationName as AnimationName, config);
        animeConfig = { ...animeConfig, ...merged };
      }
    }

    delete animeConfig.animation;

    const safeConfig = sanitizeAnimeConfig(animeConfig);

    return animate(safeConfig as any);
  };

  const setupScrollAnimation = (
    element: HTMLElement,
    scrollConfig: ScrollConfig | boolean,
    animConfig: AnimationConfig,
    id?: string
  ) => {
    if (typeof scrollConfig === 'boolean' && !scrollConfig) return;
    const config = typeof scrollConfig === 'boolean' ? { enabled: true } : scrollConfig;
    if (!config.enabled) return;

    const observerConfig = sanitizeAnimeConfig({
      targets: element,
      onScroll: {
        threshold: config.threshold ?? scrollThreshold ?? 0.3,
        container: config.container,
        axis: config.axis ?? 'y',
        begin: () => {
          if (!animated || config.repeat) {
            animateElement(element, animConfig);
            if (!config.repeat) setAnimated(true);
          }
        }
      }
    });

    const scrollInstance = animate(observerConfig as any);
    if (id) scrollObservers.current.set(`${id}_scroll`, scrollInstance);
  };

  const playAnimation = () => {
    if (!containerRef.current) return;

    if (animation) {
      animateElement(containerRef.current, {
        animation,
        duration,
        delay,
        loop,
        direction,
        ease
      });
    }

    childAnimations.forEach((childConfig) => {
      const childElement = getElementById(childConfig.id, childConfig.parentId);
      if (childElement) {
        if (childConfig.animateOnScroll) {
          setupScrollAnimation(childElement, childConfig.animateOnScroll, childConfig, childConfig.id);
        } else {
          animateElement(childElement, childConfig);
        }
      }
    });

    setAnimated(true);
  };

  useEffect(() => {
    if (animateOnLoad && containerRef.current) playAnimation();
  }, [animateOnLoad]);

  useEffect(() => {
    if (animateOnScroll && containerRef.current) {
      setupScrollAnimation(
        containerRef.current,
        animateOnScroll,
        { animation, duration, delay, loop, direction, ease },
        'main'
      );
    }
  }, [animateOnScroll]);

  const domProps = filterDOMProps(rest);

  return (
    <div ref={containerRef} {...domProps}>
      {children}
    </div>
  );
};
