// placeholder for constants
export const ANIMATION_PRESETS = ['fadeIn', 'fadeUp', 'slideUp', 'zoomIn', 'bounce', 'rotateRight'];

import type { AnimationConfig, AnimationConfigs, AnimationName } from "../types";

// Default configuration map for each animation type
export const animationDefaults: AnimationConfigs = {
  // Fade animations
  fadeIn: { duration: 300 },
  fadeUp: { duration: 400 },
  fadeDown: { duration: 400 },
  fadeLeft: { duration: 400 },
  fadeRight: { duration: 400 },

  // Scale animations
  scaleX: { duration: 300 },
  scaleY: { duration: 300 },

  // Skew animations
  skewUp: { duration: 300 },
  skewDown: { duration: 300 },

  // Rotate animations
  rotateLeft: { duration: 400 },
  rotateRight: { duration: 400 },

  // Slide animations
  slideLeft: { duration: 300 },
  slideRight: { duration: 300 },
  slideUp: { duration: 300 },
  slideDown: { duration: 300 },

  // Special animations
  bounce: {
    duration: 750,
    direction: "normal",
  },
  pulse: {
    duration: 500,
    direction: "alternate",
  },
  shake: {
    duration: 500,
    direction: "normal",
  },
  swing: {
    duration: 600,
    direction: "alternate",
  },
  tada: {
    duration: 800,
    direction: "normal",
  },

  // Flip animations
  flipX: { duration: 600 },
  flipY: { duration: 600 },
  flipInX: { duration: 600 },
  flipInY: { duration: 600 },
  flipOutX: { duration: 600 },
  flipOutY: { duration: 600 },

  // Zoom animations
  zoomIn: { duration: 300 },
  zoomOut: { duration: 300 },
  zoomInUp: { duration: 400 },
  zoomInDown: { duration: 400 },
  zoomInLeft: { duration: 400 },
  zoomInRight: { duration: 400 },
  zoomOutUp: { duration: 400 },
  zoomOutDown: { duration: 400 },
  zoomOutLeft: { duration: 400 },
  zoomOutRight: { duration: 400 },

  // Elastic animations
  elastic: { duration: 800 },
  elasticIn: { duration: 600 },
  elasticOut: { duration: 600 },

  // Attention-seeking animations
  flash: { duration: 500 },
  headShake: { duration: 600 },
  heartBeat: { duration: 800 },
  jello: { duration: 600 },
  rubberBand: { duration: 800 },
  wobble: { duration: 800 },
};

// Map animation names to anime.js properties
export const animePropertiesMap: Record<AnimationName, AnimationConfig> = {
  fadeIn: {
    opacity: [0, 1],
    ease: "inOutQuad",
  },
  fadeUp: {
    opacity: [0, 1],
    translateY: [50, 0],
  },
  fadeDown: {
    opacity: [0, 1],
    translateY: [-50, 0],
  },
  fadeLeft: {
    opacity: [0, 1],
    translateX: [50, 0],
  },
  fadeRight: {
    opacity: [0, 1],
    translateX: [-50, 0],
  },
  scaleX: {
    scaleX: [0, 1],
  },
  scaleY: {
    scaleY: [0, 1],
  },
  skewUp: {
    skewY: [10, 0],
  },
  skewDown: {
    skewY: [-10, 0],
  },
  rotateLeft: {
    rotate: ["10deg", "0deg"],
  },
  rotateRight: {
    rotate: ["-10deg", "0deg"],
  },
  slideLeft: {
    translateX: ["-100%", 0],
  },
  slideRight: {
    translateX: ["100%", 0],
  },
  slideUp: {
    translateY: ["100%", 0],
  },
  slideDown: {
    translateY: ["-100%", 0],
  },
  bounce: {
    translateY: [
      { to: -15, duration: 150, ease: "outQuad" },
      { to: 0, duration: 150, ease: "inQuad" },
      { to: -7, duration: 150, ease: "outQuad" },
      { to: 0, duration: 150, ease: "inQuad" },
      { to: -3, duration: 150, ease: "outQuad" },
      { to: 0, duration: 150, ease: "inQuad" },
    ],
    ease: "linear",
  },
  pulse: {
    scale: [1, 1.1, 1],
    ease: "inOutSine",
  },
  shake: {
    translateX: [
      { to: -10, duration: 100, ease: "inOutSine" },
      { to: 10, duration: 100, ease: "inOutSine" },
      { to: -8, duration: 100, ease: "inOutSine" },
      { to: 8, duration: 100, ease: "inOutSine" },
      { to: -5, duration: 100, ease: "inOutSine" },
      { to: 0, duration: 100, ease: "inOutSine" },
    ],
    ease: "linear",
  },
  swing: {
    rotate: [
      { to: "15deg", duration: 200, ease: "inOutSine" },
      { to: "-10deg", duration: 200, ease: "inOutSine" },
      { to: "5deg", duration: 200, ease: "inOutSine" },
      { to: "0deg", duration: 200, ease: "inOutSine" },
    ],
    transformOrigin: ["top center"],
    ease: "linear",
  },
  tada: {
    scale: [
      { to: 0.9, duration: 100, ease: "outSine" },
      { to: 1.1, duration: 300, ease: "outQuad" },
      { to: 1, duration: 300, ease: "outQuad" },
    ],
    rotate: [
      { to: "-3deg", duration: 100, ease: "inOutSine" },
      { to: "3deg", duration: 100, ease: "inOutSine" },
      { to: "-3deg", duration: 100, ease: "inOutSine" },
      { to: "3deg", duration: 100, ease: "inOutSine" },
      { to: "-3deg", duration: 100, ease: "inOutSine" },
      { to: "3deg", duration: 100, ease: "inOutSine" },
      { to: "0deg", duration: 100, ease: "inOutSine" },
    ],
    ease: "linear",
  },

  // Flip animations
  flipX: {
    rotateX: [0, 180],
    ease: "inOutQuad",
  },
  flipY: {
    rotateY: [0, 180],
    ease: "inOutQuad",
  },
  flipInX: {
    rotateX: [-90, 0],
    opacity: [0, 1],
    ease: "outQuad",
  },
  flipInY: {
    rotateY: [-90, 0],
    opacity: [0, 1],
    ease: "outQuad",
  },
  flipOutX: {
    rotateX: [0, 90],
    opacity: [1, 0],
    ease: "inQuad",
  },
  flipOutY: {
    rotateY: [0, 90],
    opacity: [1, 0],
    ease: "inQuad",
  },

  // Zoom animations
  zoomIn: {
    scale: [0, 1],
    opacity: [0, 1],
    ease: "outQuad",
  },
  zoomOut: {
    scale: [1, 0],
    opacity: [1, 0],
    ease: "inQuad",
  },
  zoomInUp: {
    scale: [0, 1],
    opacity: [0, 1],
    translateY: [50, 0],
    ease: "outQuad",
  },
  zoomInDown: {
    scale: [0, 1],
    opacity: [0, 1],
    translateY: [-50, 0],
    ease: "outQuad",
  },
  zoomInLeft: {
    scale: [0, 1],
    opacity: [0, 1],
    translateX: [50, 0],
    ease: "outQuad",
  },
  zoomInRight: {
    scale: [0, 1],
    opacity: [0, 1],
    translateX: [-50, 0],
    ease: "outQuad",
  },
  zoomOutUp: {
    scale: [1, 0],
    opacity: [1, 0],
    translateY: [0, -50],
    ease: "inQuad",
  },
  zoomOutDown: {
    scale: [1, 0],
    opacity: [1, 0],
    translateY: [0, 50],
    ease: "inQuad",
  },
  zoomOutLeft: {
    scale: [1, 0],
    opacity: [1, 0],
    translateX: [0, -50],
    ease: "inQuad",
  },
  zoomOutRight: {
    scale: [1, 0],
    opacity: [1, 0],
    translateX: [0, 50],
    ease: "inQuad",
  },

  // Elastic animations
  elastic: {
    scale: [
      { to: 1.25, duration: 200, ease: "outQuad" },
      { to: 0.75, duration: 200, ease: "outQuad" },
      { to: 1.15, duration: 200, ease: "outQuad" },
      { to: 1, duration: 200, ease: "outQuad" },
    ],
    ease: "linear",
  },
  elasticIn: {
    scale: [0, 1],
    ease: "outQuad",
  },
  elasticOut: {
    scale: [1, 0],
    ease: "inQuad",
  },

  // Attention-seeking animations
  flash: {
    opacity: [
      { to: 0, duration: 125, ease: "inOutSine" },
      { to: 1, duration: 125, ease: "inOutSine" },
      { to: 0, duration: 125, ease: "inOutSine" },
      { to: 1, duration: 125, ease: "inOutSine" },
    ],
    ease: "linear",
  },
  headShake: {
    translateX: [
      { to: -6, duration: 100, ease: "inOutSine" },
      { to: 5, duration: 100, ease: "inOutSine" },
      { to: -3, duration: 100, ease: "inOutSine" },
      { to: 2, duration: 100, ease: "inOutSine" },
      { to: 0, duration: 200, ease: "inOutSine" },
    ],
    rotate: [
      { to: "-9deg", duration: 100, ease: "inOutSine" },
      { to: "7deg", duration: 100, ease: "inOutSine" },
      { to: "-5deg", duration: 100, ease: "inOutSine" },
      { to: "3deg", duration: 100, ease: "inOutSine" },
      { to: "0deg", duration: 200, ease: "inOutSine" },
    ],
    ease: "linear",
  },
  heartBeat: {
    scale: [
      { to: 1.3, duration: 140, ease: "outSine" },
      { to: 1, duration: 140, ease: "inSine" },
      { to: 1.3, duration: 140, ease: "outSine" },
      { to: 1, duration: 380, ease: "inSine" },
    ],
    ease: "linear",
  },
  jello: {
    skewX: [
      { to: "-12.5deg", duration: 111, ease: "inOutSine" },
      { to: "6.25deg", duration: 111, ease: "inOutSine" },
      { to: "-3.125deg", duration: 111, ease: "inOutSine" },
      { to: "1.5625deg", duration: 111, ease: "inOutSine" },
      { to: "-0.78125deg", duration: 111, ease: "inOutSine" },
      { to: "0deg", duration: 45, ease: "inOutSine" },
    ],
    skewY: [
      { to: "-12.5deg", duration: 111, ease: "inOutSine" },
      { to: "6.25deg", duration: 111, ease: "inOutSine" },
      { to: "-3.125deg", duration: 111, ease: "inOutSine" },
      { to: "1.5625deg", duration: 111, ease: "inOutSine" },
      { to: "-0.78125deg", duration: 111, ease: "inOutSine" },
      { to: "0deg", duration: 45, ease: "inOutSine" },
    ],
    ease: "linear",
  },
  rubberBand: {
    scaleX: [
      { to: 1.25, duration: 100, ease: "outSine" },
      { to: 0.75, duration: 100, ease: "inSine" },
      { to: 1.15, duration: 100, ease: "outSine" },
      { to: 0.95, duration: 100, ease: "inSine" },
      { to: 1.05, duration: 100, ease: "outSine" },
      { to: 1, duration: 300, ease: "inSine" },
    ],
    scaleY: [
      { to: 0.75, duration: 100, ease: "outSine" },
      { to: 1.25, duration: 100, ease: "inSine" },
      { to: 0.85, duration: 100, ease: "outSine" },
      { to: 1.05, duration: 100, ease: "inSine" },
      { to: 0.95, duration: 100, ease: "outSine" },
      { to: 1, duration: 300, ease: "inSine" },
    ],
    ease: "linear",
  },
  wobble: {
    translateX: [
      { to: -25, duration: 150, ease: "inOutSine" },
      { to: 20, duration: 150, ease: "inOutSine" },
      { to: -15, duration: 150, ease: "inOutSine" },
      { to: 10, duration: 150, ease: "inOutSine" },
      { to: -5, duration: 150, ease: "inOutSine" },
      { to: 0, duration: 50, ease: "inOutSine" },
    ],
    rotate: [
      { to: "-5deg", duration: 150, ease: "inOutSine" },
      { to: "3deg", duration: 150, ease: "inOutSine" },
      { to: "-3deg", duration: 150, ease: "inOutSine" },
      { to: "2deg", duration: 150, ease: "inOutSine" },
      { to: "-1deg", duration: 150, ease: "inOutSine" },
      { to: "0deg", duration: 50, ease: "inOutSine" },
    ],
    ease: "linear",
  },
};