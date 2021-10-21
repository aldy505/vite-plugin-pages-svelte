import type { Route } from '../types/route';

export const routeBlockCache = new Map<string, Record<string, any>>();

export function findRouteByFilename(routes: Route, filename: string): Route | null {
  const routeEntries = Object.entries(routes);
  let result = null;
  for (const route of routeEntries) {
    if (typeof route[1] === 'string' && filename.endsWith(route[1])) result = { [route[0]]: route[1] };

    if (result) return result;
  }
  return null;
}
