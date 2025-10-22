// Helper to check if an element is in viewport
export const isElementInViewport = (el: HTMLElement, threshold: number = 0) => {
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  // Calculate the visible percentage
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
  const visibleArea = Math.max(0, visibleHeight) * Math.max(0, visibleWidth);
  const totalArea = rect.height * rect.width;
  const visiblePercentage = totalArea > 0 ? visibleArea / totalArea : 0;

  return visiblePercentage >= threshold;
};

// Helper to debounce scroll events
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Helper to get element by ID with optional parent
export const getElementByIdWithParent = (
  id: string, 
  parentElement?: HTMLElement | null,
  parentId?: string
): HTMLElement | null => {
  const parent = parentId && parentElement ? 
    parentElement.querySelector(`#${parentId}`) as HTMLElement || parentElement :
    parentElement || document;
  
  return parent.querySelector(`#${id}`) as HTMLElement || null;
};

// Helper to generate unique IDs
export const generateUniqueId = (prefix: string = 'koadz'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper to check if element has animation running
export const hasActiveAnimation = (element: HTMLElement): boolean => {
  const computedStyle = getComputedStyle(element);
  return computedStyle.animationName !== 'none' || 
         computedStyle.transitionProperty !== 'none';
};

// Helper to normalize scroll threshold values
export const normalizeScrollThreshold = (threshold: number | string): number => {
  if (typeof threshold === 'string') {
    if (threshold.includes('%')) {
      return parseFloat(threshold) / 100;
    }
    if (threshold.includes('px')) {
      return parseFloat(threshold) / window.innerHeight;
    }
    return parseFloat(threshold);
  }
  return Math.max(0, Math.min(1, threshold));
};

// Helper to validate animation configuration
export const validateAnimationConfig = (config: any): boolean => {
  if (!config || typeof config !== 'object') return false;
  
  // Check for required properties
  if (config.duration !== undefined && (typeof config.duration !== 'number' || config.duration < 0)) {
    console.warn('Animation duration must be a positive number');
    return false;
  }
  
  if (config.delay !== undefined && (typeof config.delay !== 'number' || config.delay < 0)) {
    console.warn('Animation delay must be a positive number');
    return false;
  }
  
  return true;
};