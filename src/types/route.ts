import type { Route as SvelteRoute } from 'svelte-router-spa/types/components/router';

export type Route = SvelteRoute;

export interface PreRoute {
  name: string;
  path: string;
  children?: PreRoute[];
}
