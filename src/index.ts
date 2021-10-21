import type { Plugin } from 'vite';
import type { ResolvedOptions, UserOptions } from './types/options';
import type { PreRoute } from './types/route';
import type { FileOutput } from './types/page';
import { generateRoutes, generateClientCode } from './generate';
import { debug } from './utils/vite';
import { resolveOptions } from './options';
import { MODULE_IDS, MODULE_ID_VIRTUAL } from './constants';
import { resolvePages } from './pages';
import { handleHMR } from './hmr';

function pagesPlugin(userOptions: UserOptions = {}): Plugin {
  let generatedRoutes: PreRoute[] | null = null;
  let options: ResolvedOptions;
  let pages: FileOutput[];

  return {
    name: 'vite-plugin-pages-svelte',
    enforce: 'pre',
    async configResolved({ root }) {
      options = await resolveOptions(userOptions, root);
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

      const clientCode = generateClientCode(generatedRoutes);
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

export * from './types/options';
export { generateRoutes };
export default pagesPlugin;
