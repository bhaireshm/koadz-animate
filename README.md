# Koadz Platform Animation Library

A powerful and flexible animation library for React applications, built on animejs v4.2.2 with enhanced scroll detection, comprehensive TypeScript support, and expanded animation presets.

## Features

- **Type-Safe**: Built with TypeScript for reliable autocompletion and error checking with full animejs v4.2.2 type definitions.
- **Native Scroll Detection**: Uses animejs v4.2.2's built-in onScroll event for performant scroll-based animations.
- **Expanded Animation Presets**: Over 40 predefined animations including flip, zoom, elastic, and attention-seeking effects.
- **Independent Child Animations**: Child elements can have their own scroll triggers and configurations.
- **Flexible Animation Control**: Supports single, multiple, and sequential animations with advanced scroll options.
- **Enhanced Scroll Configuration**: Custom containers, thresholds, axis detection, and repeat options.
- **Easy Integration**: Simple to integrate into existing React projects.

## Installation

```bash
npm install @koadz/animate
```

## Usage

### Basic Animation on Load

The component now defaults to rendering a `<div>` element. When using the `Animate` component with the `animation` prop, any custom animation props are internally used but filtered out so that React warnings about unknown attributes are avoided.

```tsx
<Animate animation="fadeIn" duration={500} delay={200}>
  <h2>Hello World</h2>
  <p>This content will fade in on load.</p>
</Animate>
```

### Multiple Animations

You can pass an array of animations to have multiple effects applied simultaneously.

```tsx
<Animate animation={["fadeIn", "slideUp"]} duration={800}>
  <p>This element fades in and slides up simultaneously.</p>
</Animate>
```

### Child Animations

The `childAnimations` prop allows you to define animations for nested elements.

> Note: that the custom prop is filtered from the DOM while the hook uses it to control child elements. Make sure the IDs in your DOM match those provided in `childAnimations`.

```tsx
<Animate
  animation="fadeIn"
  childAnimations={[
    { id: "title", animation: "slideDown", delay: 300 },
    { id: "subtitle", animation: "fadeLeft", delay: 600 },
  ]}
>
  <div>
    <h2 id="title">Animated Title</h2>
    <p id="subtitle">This subtitle animates separately</p>
    <div>The parent container just fades in.</div>
  </div>
</Animate>
```

### Animate on Scroll

#### Basic Scroll Animation

Set the `animateOnScroll` prop to trigger the animation once the element is scrolled into view. The `scrollThreshold` determines when the animation starts.

```tsx
<Animate animation="fadeUp" animateOnScroll scrollThreshold={0.3}>
  <h2>I appear when scrolled into view!</h2>
</Animate>
```

#### Advanced Scroll Configuration

Use the enhanced scroll configuration object for more control over scroll behavior:

```tsx
<Animate 
  animation="slideUp" 
  animateOnScroll={{
    enabled: true,
    threshold: 0.5,
    repeat: true,
  }}
>
  <div>Advanced scroll animation with custom container and repeat</div>
</Animate>
```

#### Independent Child Scroll Animations

Child animations can have their own scroll triggers, independent of the parent:

```tsx
<Animate
  animation="fadeIn"
  animateOnScroll={{ enabled: true, threshold: 0.2 }}
  childAnimations={[
    { 
      id: "title", 
      animation: "slideDown", 
      animateOnScroll: { enabled: true, threshold: 0.4, repeat: true }
    },
    { 
      id: "subtitle", 
      animation: "fadeLeft", 
      animateOnScroll: { enabled: true, threshold: 0.6 }
    },
  ]}
>
  <div>
    <h2 id="title">Title with independent scroll trigger</h2>
    <p id="subtitle">Subtitle with different scroll settings</p>
    <div>Parent container fades in first</div>
  </div>
</Animate>
```

### Using the Animation Hook Directly

The `useAnimation` hook allows you to control animations imperatively. Use it to update animation configurations or to trigger animations on user interaction.

```tsx
function UsingHook() {
  const { ref, play, updateConfig } = useAnimation({
    animation: "bounce",
    duration: 1000,
  });


  return (
    <div>
      <div ref={ref} onClick={() => play()}>
        Click me to bounce!
      </div>
      <br />
      <button onClick={() => updateConfig({ duration: 5000, animation: "rotateRight" })}>
        Make animation slower and rotate right
      </button>
    </div>
  );
}
```

### Animation Presets

The library includes over 40 predefined animation presets organized by category:

#### Fade Animations
- `fadeIn`, `fadeUp`, `fadeDown`, `fadeLeft`, `fadeRight`

#### Scale Animations  
- `scaleX`, `scaleY`

#### Skew Animations
- `skewUp`, `skewDown`

#### Rotate Animations
- `rotateLeft`, `rotateRight`

#### Slide Animations
- `slideLeft`, `slideRight`, `slideUp`, `slideDown`

#### Bounce & Pulse
- `bounce`, `pulse`, `shake`, `swing`, `tada`

#### Flip Animations
- `flipX`, `flipY`, `flipInX`, `flipInY`, `flipOutX`, `flipOutY`

#### Zoom Animations
- `zoomIn`, `zoomOut`, `zoomInUp`, `zoomInDown`, `zoomInLeft`, `zoomInRight`
- `zoomOutUp`, `zoomOutDown`, `zoomOutLeft`, `zoomOutRight`

#### Elastic Animations
- `elastic`, `elasticIn`, `elasticOut`

#### Attention-Seeking Animations
- `flash`, `headShake`, `heartBeat`, `jello`, `rubberBand`, `wobble`

```tsx
// Examples of new animation presets
<Animate animation="flipInX" duration={800}>
  <div>Flips in along X-axis</div>
</Animate>


<Animate animation="zoomInUp" delay={200}>
  <div>Zooms in from below</div>
</Animate>


<Animate animation="elasticOut" duration={1200}>
  <div>Elastic bounce effect</div>
</Animate>


<Animate animation="heartBeat" loop={3}>
  <div>Attention-seeking heartbeat</div>
</Animate>
```

## API Reference

### ScrollConfig Interface

```typescript
interface ScrollConfig {
  enabled: boolean;           // Enable/disable scroll animation
  threshold?: number | string; // When to trigger (0-1 or pixel value)
  repeat?: boolean;          // Repeat animation on scroll
  // can use other configs if required
}
```

### UseAnimationProps Interface

```typescript
interface UseAnimationProps extends AnimationConfig {
  childAnimations?: AnimationTarget[];
  parentId?: string;
  animateOnLoad?: boolean;
  animateOnScroll?: boolean | ScrollConfig;
}
```

### AnimationTarget Interface

```typescript
interface AnimationTarget extends AnimationConfig {
  id: string;
  parentId?: string;
  animateOnScroll?: boolean | ScrollConfig;
}
```

## Advanced Examples

### Complex Scroll Scenarios

```tsx
// Horizontal scroll animation
<Animate 
  animation="slideLeft"
  animateOnScroll={{
    enabled: true,
    threshold: 0.3,
  }}
>
  <div>Triggers on horizontal scroll</div>
</Animate>


// Multiple animations with different scroll triggers
<Animate
  animation={["fadeIn", "scaleX"]}
  animateOnScroll={{ enabled: true, threshold: 0.1 }}
  childAnimations={[
    {
      id: "card-1",
      animation: "zoomInLeft",
      animateOnScroll: { enabled: true, threshold: 0.3, repeat: true }
    },
    {
      id: "card-2", 
      animation: "flipInY",
      animateOnScroll: { enabled: true, threshold: 0.5 }
    }
  ]}
>
  <div>
    <div id="card-1">Card 1 - zooms from left with repeat</div>
    <div id="card-2">Card 2 - flips in along Y-axis</div>
  </div>
</Animate>
```

## Performance Considerations

### ScrollObserver vs IntersectionObserver

The library now uses animejs v4.2.2's native ScrollObserver which provides:

- **Better Performance**: Native implementation optimized for animations
- **More Accurate Triggering**: Precise scroll position detection
- **Enhanced Features**: Support for custom containers, axis detection, and repeat options
- **Memory Efficiency**: Automatic cleanup and disposal of observers

### Best Practices

1. **Use Specific Containers**: When possible, specify scroll containers to limit observation scope
2. **Optimize Thresholds**: Use appropriate threshold values to avoid excessive triggering
3. **Limit Repeat Animations**: Use `repeat: true` judiciously for performance
4. **Batch Child Animations**: Group related child animations for better coordination

## TypeScript Support

The library provides comprehensive TypeScript support with:

- Full animejs v4.2.2 type definitions
- Enhanced IDE autocompletion for all animation properties
- Type-safe animation configuration
- Proper typing for scroll configuration options
- Complete interface definitions for all props and return types

```typescript
import { AnimationConfig, ScrollConfig, UseAnimationProps } from '@koadz/animate';


// Fully typed animation configuration
const config: AnimationConfig = {
  animation: "fadeIn",
  duration: 1000,
  delay: 200
};


// Typed scroll configuration
const scrollConfig: ScrollConfig = {
  enabled: true,
  threshold: 0.3,
  repeat: false
};
```
