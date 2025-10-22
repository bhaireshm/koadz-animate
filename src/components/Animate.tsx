import { animate, createScope } from 'animejs';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import type { 
  AnimationConfig, 
  UseAnimationProps, 
  AnimationTarget, 
  ScrollConfig,
  AnimationName
} from '../types';
import { mergeAnimationConfig } from '../utils/constants';
import { useAnimation } from '../hooks/useAnimation';

// Filter out custom props from DOM attributes
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
  
  // Initialize scope and cleanup
  useEffect(() => {
    if (containerRef.current) {
      scope.current = createScope({ root: containerRef.current });
    }

    return () => {
      // Cleanup scroll observers
      scrollObservers.current.forEach(observer => {
        if (observer.remove) observer.remove();
      });
      scrollObservers.current.clear();
      
      // Cleanup scope
      if (scope.current?.revert) {
        scope.current.revert();
      }
    };
  }, []);

  // Helper to get element by ID
  const getElementById = (id: string, parentId?: string): HTMLElement | null => {
    const parent = parentId ? 
      containerRef.current?.querySelector(`#${parentId}`) as HTMLElement || containerRef.current :
      containerRef.current;
    
    return parent?.querySelector(`#${id}`) as HTMLElement || null;
  };

  // Core animation function
  const animateElement = (
    element: HTMLElement,
    config: AnimationConfig = {}
  ) => {
    const animationName = config.animation || animation;
    let animeConfig: any = {
      targets: element,
      duration: config.duration || duration || 1000,
      delay: config.delay || delay || 0,
      loop: config.loop || loop || 0,
      direction: config.direction || direction || 'normal',
      ease: config.ease || ease || 'easeOutQuad',
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
    
    return animate(animeConfig);
  };

  // Setup scroll animation for element
  const setupScrollAnimation = (
    element: HTMLElement,
    scrollConfig: ScrollConfig | boolean,
    animConfig: AnimationConfig,
    id?: string
  ) => {
    if (typeof scrollConfig === 'boolean' && !scrollConfig) return;
    
    const config = typeof scrollConfig === 'boolean' ? { 
      enabled: true, 
      threshold: scrollThreshold || 0.3 
    } : { 
      threshold: scrollThreshold || 0.3, 
      ...scrollConfig 
    };
    
    if (!config.enabled) return;

    // Use anime.js onScroll method
    const scrollInstance = animate({
      targets: element,
      duration: 0, // No initial animation
      onScroll: {
        threshold: config.threshold,
        container: config.container,
        axis: config.axis || 'y',
        begin: () => {
          if (!animated || config.repeat) {
            animateElement(element, animConfig);
            if (!config.repeat) setAnimated(true);
          }
        }
      }
    });

    if (id) {
      scrollObservers.current.set(`${id}_scroll`, scrollInstance);
    }
  };

  // Main animation trigger
  const playAnimation = () => {
    if (!containerRef.current) return;
    
    // Animate main container
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
    
    // Handle child animations
    childAnimations.forEach((childConfig) => {
      const childElement = getElementById(childConfig.id, childConfig.parentId);
      if (childElement) {
        if (childConfig.animateOnScroll) {
          // Setup scroll animation for child
          setupScrollAnimation(
            childElement,
            childConfig.animateOnScroll,
            childConfig,
            childConfig.id
          );
        } else {
          // Animate child immediately
          setTimeout(() => {
            animateElement(childElement, childConfig);
          }, childConfig.delay || 0);
        }
      }
    });
    
    setAnimated(true);
  };

  // On load animation
  useEffect(() => {
    if (animateOnLoad && containerRef.current) {
      playAnimation();
    }
  }, [animateOnLoad]);

  // Setup main element scroll animation
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

  // Filter out custom props to avoid React warnings
  const domProps = filterDOMProps(rest);

  return (
    <div ref={containerRef} {...domProps}>
      {children}
    </div>
  );
};