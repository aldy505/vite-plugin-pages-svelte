import type { Plugin } from 'vite';
import { Route, ResolvedOptions, UserOptions, ResolvedPages } from './types';
import { generateRoutes, generateClientCode } from './generate';
import { debug } from './utils';
import { resolveOptions } from './options';
import { MODULE_IDS, MODULE_ID_VIRTUAL } from './constants';
import { resolvePages } from './pages';
import { handleHMR } from './hmr';

function pagesPlugin(userOptions: UserOptions = {}): Plugin {
  let generatedRoutes: Route | null = null;
  let options: ResolvedOptions;
  let pages: ResolvedPages;

  return {
    name: 'vite-plugin-pages-svelte',
    enforce: 'pre',
    async configResolved({ root }) {
      options = resolveOptions(userOptions, root);
      pages = await resolvePages(options);
      debug.options(options);
      debug.pages(pages);
    },
    configureServer(server) {
      handleHMR(server, pages, options, () => {
        generatedRoutes = null;
      });
    },
    resolveId(id) {
      return MODULE_IDS.includes(id) || MODULE_IDS.some((i) => id.startsWith(i)) ? MODULE_ID_VIRTUAL : null;
    },
    load(id) {
      if (id !== MODULE_ID_VIRTUAL) return;

      if (!generatedRoutes) {
        generatedRoutes = generateRoutes(pages);
      }

      const clientCode = generateClientCode(generatedRoutes, options);
      debug.gen('client code: %O', clientCode);

      return clientCode;
    },
    transform(_code, id) {
      if (!/svelte&type=route/.test(id)) return;
      return {
        code: 'export default {};',
        map: null,
      };
    },
    generateBundle(_options, bundle) {
      bundle;
    },
  };
}

export * from './types';
export { generateRoutes };
export default pagesPlugin;
