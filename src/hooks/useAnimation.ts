import { animate, createScope, type Animation as JSAnimation } from 'animejs';
import { useEffect, useRef, useState, RefObject } from 'react';
import type { 
  AnimationConfig, 
  UseAnimationProps, 
  AnimationTarget, 
  ScrollConfig, 
  AnimeInstance,
  UseAnimationReturnType,
  UpdateAnimationConfig,
  AnimationName
} from '../types';
import { mergeAnimationConfig } from '../utils/constants';
import { sanitizeAnimeConfig } from '../utils/animeSanitizer';

export function useAnimation({
  animation,
  duration = 1000,
  delay = 0,
  loop = 0,
  animateOnLoad = true,
  animateOnScroll = false,
  childAnimations = [],
  parentId,
}: UseAnimationProps): UseAnimationReturnType {
  const ref = useRef<HTMLElement>(null);
  const scope = useRef<any>(null);
  const instances = useRef<Map<string, AnimeInstance>>(new Map());
  const [animated, setAnimated] = useState(false);
  const scrollObservers = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (ref.current) {
      scope.current = createScope({ root: ref.current });
    }

    return () => {
      instances.current.forEach(instance => {
        (instance as any)?.remove?.();
      });
      scrollObservers.current.forEach(observer => {
        observer?.remove?.();
      });
      scope.current?.revert?.();
    };
  }, []);

  const getElementById = (id: string, parentId?: string): HTMLElement | null => {
    const parent = parentId ? 
      (ref.current?.querySelector(`#${parentId}`) as HTMLElement) || ref.current :
      ref.current;
    
    return (parent?.querySelector(`#${id}`) as HTMLElement) || null;
  };

  const animateElement = (
    element: HTMLElement,
    config: AnimationConfig = {},
    id?: string
  ): AnimeInstance => {
    const animationName = config.animation || animation;
    let animeConfig: any = {
      targets: element,
      duration: config.duration ?? duration,
      delay: config.delay ?? delay,
      loop: config.loop ?? loop,
      direction: config.direction ?? 'normal',
      ease: config.ease ?? 'easeOutQuad',
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

    const instance = animate(safeConfig as any) as unknown as AnimeInstance;
    if (id) {
      instances.current.set(id, instance);
    }
    return instance;
  };

  const animateById = (id: string, parentId?: string, config: AnimationConfig = {}): void => {
    const element = getElementById(id, parentId);
    if (element) {
      animateElement(element, config, id);
    }
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
        threshold: config.threshold ?? 0.3,
        container: config.container,
        axis: config.axis ?? 'y',
        begin: () => {
          if (!animated || config.repeat) {
            animateElement(element, animConfig, id);
            if (!config.repeat) setAnimated(true);
          }
        }
      }
    });

    const scrollInstance = animate(observerConfig as any);
    if (id) {
      scrollObservers.current.set(`${id}_scroll`, scrollInstance);
    }
  };

  const play = (): void => {
    if (!ref.current) return;

    if (animation) {
      animateElement(ref.current, {
        animation,
        duration,
        delay,
        loop
      }, 'main');
    }

    childAnimations.forEach((childConfig) => {
      const childElement = getElementById(childConfig.id, childConfig.parentId);
      if (childElement) {
        if (childConfig.animateOnScroll) {
          setupScrollAnimation(
            childElement,
            childConfig.animateOnScroll,
            childConfig,
            childConfig.id
          );
        } else {
          animateElement(childElement, childConfig, childConfig.id);
        }
      }
    });

    setAnimated(true);
  };

  const updateConfig = (
    newConfig: UpdateAnimationConfig,
    targetId?: string,
    targetParentId?: string
  ): void => {
    if (targetId) {
      const element = getElementById(targetId, targetParentId);
      if (element) {
        const existingInstance = instances.current.get(targetId);
        (existingInstance as any)?.remove?.();
        animateElement(element, newConfig, targetId);
      }
    } else if (ref.current) {
      const existingInstance = instances.current.get('main');
      (existingInstance as any)?.remove?.();
      animateElement(ref.current, {
        animation,
        duration,
        delay,
        loop,
        ...newConfig
      }, 'main');
    }
  };

  useEffect(() => {
    if (animateOnLoad && ref.current) {
      play();
    }

    if (animateOnScroll && ref.current) {
      setupScrollAnimation(
        ref.current,
        animateOnScroll,
        { animation, duration, delay, loop },
        'main_scroll'
      );
    }
  }, [animateOnLoad, animateOnScroll, animation]);

  return {
    ref,
    play,
    getElementById,
    animateById,
    animateElement,
    updateConfig,
    instances: instances.current,
  };
}
