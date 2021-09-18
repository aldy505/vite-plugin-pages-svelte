import fs from 'fs';
import { resolve, basename } from 'path';
import Debug from 'debug';
import deepEqual from 'deep-equal';
import { ModuleNode, ViteDevServer } from 'vite';
import { OutputBundle } from 'rollup';
import { toArray, slash } from '@antfu/utils';
import { ResolvedOptions, Route } from './types';
import { MODULE_ID_VIRTUAL } from './constants';
import { ImportMode } from '.';

export { toArray, slash };

export const routeBlockCache = new Map<string, Record<string, any>>();

export function extensionsToGlob(extensions: string[]): string {
  return extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0] || '';
}

function isPagesDir(path: string, options: ResolvedOptions) {
  for (const page of options.pagesDir) {
    const dirPath = slash(resolve(options.root, page.dir));
    if (path.startsWith(dirPath)) return true;
  }
  return false;
}

export function isTarget(path: string, options: ResolvedOptions): boolean {
  return isPagesDir(path, options) && options.extensionsRE.test(path);
}

export const debug = {
  hmr: Debug('vite-plugin-pages-svelte:hmr'),
  parser: Debug('vite-plugin-pages-svelte:parser'),
  gen: Debug('vite-plugin-pages-svelte:gen'),
  options: Debug('vite-plugin-pages-svelte:options'),
  cache: Debug('vite-plugin-pages-svelte:cache'),
  pages: Debug('vite-plugin-pages-svelte:pages'),
};

const dynamicRouteRE = /^\[.+\]$/;
export const nuxtDynamicRouteRE = /^_[\s\S]*$/;

export function isDynamicRoute(routePath: string): boolean {
  return dynamicRouteRE.test(routePath);
}

export function isCatchAllRoute(routePath: string): boolean {
  return /^\[\.{3}all\]/.test(routePath);
}

export function resolveImportMode(filepath: string, options: ResolvedOptions): ImportMode {
  const mode = options.importMode;
  if (typeof mode === 'function') return mode(filepath);

  for (const pageDir of options.pagesDir) {
    if (options.syncIndex && pageDir.baseRoute === '' && filepath === `/${pageDir.dir}/index.svelte`) return 'sync';
  }
  return mode;
}

export function pathToName(filepath: string): string {
  return filepath.replace(/[_.\-\\/]/g, '_').replace(/[[:\]()]/g, '$');
}

export function findRouteByFilename(routes: Route, filename: string): Route | null {
  const routeEntries = Object.entries(routes);
  let result = null;
  for (const route of routeEntries) {
    if (typeof route[1] === 'string' && filename.endsWith(route[1])) result = { [route[0]]: route[1] };

    if (result) return result;
  }
  return null;
}

export function getPagesVirtualModule(server: ViteDevServer): ModuleNode | null {
  const { moduleGraph } = server;
  const module = moduleGraph.getModuleById(MODULE_ID_VIRTUAL);
  if (module) {
    moduleGraph.invalidateModule(module);
    return module;
  }
  return null;
}

export function replaceSquareBrackets(bundle: OutputBundle): void {
  const files = Object.keys(bundle).map((i) => basename(i));
  for (const chunk of Object.values(bundle)) {
    chunk.fileName = chunk.fileName.replace(/(\[|\])/g, '_');
    if (chunk.type === 'chunk') {
      for (const file of files) chunk.code = chunk.code.replace(file, file.replace(/(\[|\])/g, '_'));
    }
  }
}
