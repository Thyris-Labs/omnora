type AxisValue = number | string;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Returns whether the user agent reports a reduced-motion preference.
 */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Scales a CSS length-like value by a factor.
 *
 * @param value - A number in pixels or a CSS value such as `1rem`, `20%`, or `var(--space)`.
 * @param factor - The multiplier applied to the value.
 */
export function scaleCssValue(value: AxisValue, factor: number) {
  if (typeof value === "number") {
    return `${value * factor}px`;
  }

  const trimmedValue = value.trim();
  const match = trimmedValue.match(/^(-?\d*\.?\d+)([a-z%]*)$/i);

  if (match) {
    const [, numericValue, unit] = match;
    return `${Number(numericValue) * factor}${unit}`;
  }

  return `calc(${trimmedValue} * ${factor})`;
}

/**
 * Joins CSS values while stripping empty and `none` entries.
 *
 * @param values - Candidate CSS values to merge into one declaration value.
 */
export function joinCssValues(values: Array<string>) {
  const nextValue = values.filter((value) => value && value !== "none").join(" ");
  return nextValue || "none";
}

/**
 * Linearly interpolates between two numeric values.
 *
 * @param a - The starting value returned when `t` is `0`.
 * @param b - The ending value returned when `t` is `1`.
 * @param t - The interpolation progress, usually between `0` and `1`.
 */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
