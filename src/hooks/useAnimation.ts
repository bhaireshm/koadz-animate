import { animate, createScope } from 'animejs';
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

  // Initialize scope on mount
  useEffect(() => {
    if (ref.current) {
      scope.current = createScope({ root: ref.current });
    }

    return () => {
      // Cleanup all instances and observers
      instances.current.forEach(instance => {
        if (instance.remove) instance.remove();
      });
      scrollObservers.current.forEach(observer => {
        if (observer.remove) observer.remove();
      });
      if (scope.current?.revert) {
        scope.current.revert();
      }
    };
  }, []);

  // Helper to get element by ID
  const getElementById = (id: string, parentId?: string): HTMLElement | null => {
    const parent = parentId ? 
      ref.current?.querySelector(`#${parentId}`) as HTMLElement || ref.current :
      ref.current;
    
    return parent?.querySelector(`#${id}`) as HTMLElement || null;
  };

  // Core animation function
  const animateElement = (
    element: HTMLElement,
    config: AnimationConfig = {},
    id?: string
  ): AnimeInstance => {
    const animationName = config.animation || animation;
    let animeConfig: any = {
      targets: element,
      duration: config.duration || duration,
      delay: config.delay || delay,
      loop: config.loop || loop,
      ease: config.ease || 'easeOutQuad',
    };

    // Apply animation presets
    if (animationName) {
      if (Array.isArray(animationName)) {
        // Merge multiple animations
        animationName.forEach(name => {
          const merged = mergeAnimationConfig(name as AnimationName, config);
          animeConfig = { ...animeConfig, ...merged };
        });
      } else {
        const merged = mergeAnimationConfig(animationName as AnimationName, config);
        animeConfig = { ...animeConfig, ...merged };
      }
    }

    // Remove non-anime properties
    delete animeConfig.animation;
    
    const instance = animate(animeConfig) as AnimeInstance;
    
    if (id) {
      instances.current.set(id, instance);
    }
    
    return instance;
  };

  // Animate by element ID
  const animateById = (id: string, parentId?: string, config: AnimationConfig = {}): void => {
    const element = getElementById(id, parentId);
    if (element) {
      animateElement(element, config, id);
    }
  };

  // Setup scroll animation for element
  const setupScrollAnimation = (
    element: HTMLElement,
    scrollConfig: ScrollConfig | boolean,
    animConfig: AnimationConfig,
    id?: string
  ) => {
    if (typeof scrollConfig === 'boolean' && !scrollConfig) return;
    
    const config = typeof scrollConfig === 'boolean' ? { enabled: true } : scrollConfig;
    
    if (!config.enabled) return;

    // Use anime.js onScroll method
    const scrollInstance = animate({
      targets: element,
      duration: 0, // No initial animation
      onScroll: {
        threshold: config.threshold || 0.3,
        container: config.container,
        axis: config.axis || 'y',
        begin: () => {
          if (!animated || config.repeat) {
            animateElement(element, animConfig, id);
            if (!config.repeat) setAnimated(true);
          }
        }
      }
    });

    if (id) {
      scrollObservers.current.set(`${id}_scroll`, scrollInstance);
    }
  };

  // Main play function
  const play = (): void => {
    if (!ref.current) return;
    
    // Animate main element
    if (animation) {
      animateElement(ref.current, {
        animation,
        duration,
        delay,
        loop
      }, 'main');
    }
    
    // Handle child animations
    childAnimations.forEach((childConfig, index) => {
      const childElement = getElementById(childConfig.id, childConfig.parentId);
      if (childElement) {
        // Setup scroll animation if needed
        if (childConfig.animateOnScroll) {
          setupScrollAnimation(
            childElement,
            childConfig.animateOnScroll,
            childConfig,
            childConfig.id
          );
        } else {
          // Animate immediately
          animateElement(childElement, childConfig, childConfig.id);
        }
      }
    });
    
    setAnimated(true);
  };

  // Update configuration for specific elements
  const updateConfig = (
    newConfig: UpdateAnimationConfig,
    targetId?: string,
    targetParentId?: string
  ): void => {
    if (targetId) {
      const element = getElementById(targetId, targetParentId);
      if (element) {
        // Remove existing instance
        const existingInstance = instances.current.get(targetId);
        if (existingInstance?.remove) {
          existingInstance.remove();
        }
        
        // Create new animation with updated config
        animateElement(element, newConfig, targetId);
      }
    } else if (ref.current) {
      // Update main element
      const existingInstance = instances.current.get('main');
      if (existingInstance?.remove) {
        existingInstance.remove();
      }
      
      animateElement(ref.current, {
        animation,
        duration,
        delay,
        loop,
        ...newConfig
      }, 'main');
    }
  };

  // Setup effects
  useEffect(() => {
    if (animateOnLoad && ref.current) {
      play();
    }

    // Setup main element scroll animation
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