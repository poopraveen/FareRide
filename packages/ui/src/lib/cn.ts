import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** tailwind-merge has to know the custom shadow names, or it drops one of two shadow classes. */
const merge = extendTailwindMerge({
  extend: { classGroups: { shadow: [{ shadow: ['card', 'overlay'] }] } },
});

/** Joins class names and lets later Tailwind classes override earlier ones. */
export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs));
}
