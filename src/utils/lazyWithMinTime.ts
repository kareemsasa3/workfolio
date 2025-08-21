import { lazy, ComponentType, LazyExoticComponent } from "react";

/**
 * A utility that wraps React.lazy to ensure a component is displayed
 * for a minimum amount of time, preventing jarring loading flashes.
 *
 * @param factory A function that calls a dynamic import e.g., () => import('./MyComponent')
 * @param minDisplayTime The minimum time in milliseconds to show the fallback loader. Defaults to 500ms.
 * @returns A lazy-loaded component.
 */
export const lazyWithMinTime = (
  factory: () => Promise<{ default: ComponentType<any> }>,
  minDisplayTime: number = 500
): LazyExoticComponent<ComponentType<any>> => {
  return lazy(() =>
    Promise.all([
      factory(),
      new Promise((resolve) => setTimeout(resolve, minDisplayTime)),
    ]).then(([moduleExports]) => moduleExports)
  );
};
