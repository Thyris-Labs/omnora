import { cubicOut } from "svelte/easing";
import type { EasingFunction } from "svelte/transition";
import type { TransitionConfig } from "svelte/transition";

import { joinCssValues, lerp, prefersReducedMotion, scaleCssValue } from "./helpers.ts";

type AxisValue = number | string;

export type PresenceParams = {
  delay?: number;
  duration?: number;
  easing?: EasingFunction;
  x?: AxisValue;
  y?: AxisValue;
  opacity?: number;
  blur?: AxisValue;
  scale?: number;
  respectReducedMotion?: boolean;
};

export function presence(node: Element, params: PresenceParams = {}): TransitionConfig {
  const style = getComputedStyle(node);
  const baseTransform = style.transform;
  const baseFilter = style.filter;

  const {
    delay = 0,
    duration = 180,
    easing = cubicOut,
    x = 0,
    y = 0,
    scale = 1,
    opacity = 0,
    blur = 0,
    respectReducedMotion = true,
  } = params;

  const reducedMotion = respectReducedMotion && prefersReducedMotion();

  if (reducedMotion) {
    return {
      delay: 0,
      duration: 0,
      easing,
      css: () =>
        `opacity: 1; transform: ${joinCssValues([baseTransform])}; filter: ${joinCssValues([baseFilter])};`,
    };
  }

  return {
    delay,
    duration,
    easing,
    css: (t, u) => {
      const translateX = scaleCssValue(x, u);
      const translateY = scaleCssValue(y, u);
      const currentBlur = scaleCssValue(blur, u);
      const nextOpacity = lerp(opacity, 1, t);
      const nextScale = lerp(scale, 1, t);

      return `
				opacity: ${nextOpacity};
				transform: ${joinCssValues([baseTransform, `translate3d(${translateX}, ${translateY}, 0)`, `scale(${nextScale})`])};
				filter: ${joinCssValues([baseFilter, `blur(${currentBlur})`])};
			`;
    },
  };
}
