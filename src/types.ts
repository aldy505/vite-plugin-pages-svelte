import type { WrappedComponent } from 'svelte-spa-router';

export type ImportMode = 'sync' | 'async';
export type ImportModeResolveFn = (filepath: string) => ImportMode;

export interface Route {
  [name: string]: string | ((options: WrapOptions) => WrappedComponent);
}

export interface PreRoute {
  path: string;
  component: string | ((options: WrapOptions) => WrappedComponent);
}

interface WrapOptions {
  asyncComponent: () => Promise<string>;
}

export interface PageDirOptions {
  dir: string;
  baseRoute: string;
}

/**
 * Plugin options.
 */
interface Options {
  /**
   * Relative path to the directory to search for page components.
   * @default 'src/pages'
   */
  pagesDir: string | (string | PageDirOptions)[];
  /**
   * Valid file extensions for page components.
   * @default ['svelte']
   */
  extensions: string[];
  /**
   * List of path globs to exclude when resolving pages.
   */
  exclude: string[];
  /**
   * Import routes directly or as async components
   * @default 'async'
   */
  importMode: ImportMode | ImportModeResolveFn;
  /**
   * Sync load top level index file
   * @default true
   */
  syncIndex: boolean;
  /**
   * Extend route records
   */
  extendRoute?: (route: Route, parent: Route | undefined) => Route | void;
  /**
   * Custom generated routes
   */
  onRoutesGenerated?: (routes: Route) => Route | void | Promise<Route | void>;
  /**
   * Custom generated client code
   */
  onClientGenerated?: (clientCode: string) => string | void | Promise<string | void>;
}

export type UserOptions = Partial<Options>;

export interface ResolvedPage {
  dir: string;
  route: string;
  extension: string;
  filepath: string;
  component: string;
}

export type ResolvedPages = Map<string, ResolvedPage>;

export interface ResolvedOptions extends Options {
  /**
   * Resolves to the `root` value from Vite config.
   * @default config.root
   */
  root: string;
  /**
   * RegExp to match extensions
   */
  extensionsRE: RegExp;
  pagesDir: PageDirOptions[];
}
