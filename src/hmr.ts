import type { ViteDevServer } from 'vite';
import type { ResolvedOptions } from './types/options';
import type { FileOutput } from './types/page';
import { isTarget } from './utils/validate';
import { slash } from './utils/convert';
import { getPagesVirtualModule, debug } from './utils/vite';
import { addPage, removePage } from './pages';
import { fromSinglePage } from './files';

export function handleHMR(
  server: ViteDevServer,
  pages: FileOutput[],
  options: ResolvedOptions,
  clearRoutes: () => void,
): void {
  const { ws, watcher } = server;

  function fullReload() {
    // invalidate module
    getPagesVirtualModule(server);
    clearRoutes();
    ws.send({
      type: 'full-reload',
    });
  }

  watcher.on('add', async (file) => {
    const path = slash(file);
    if (isTarget(path, options)) {
      const pageFile = fromSinglePage(path, options);
      addPage(pages, pageFile);
      debug.hmr('add', path);
      fullReload();
    }
  });
  watcher.on('unlink', (file) => {
    const path = slash(file);
    if (isTarget(path, options)) {
      const pageFile = fromSinglePage(path, options);
      removePage(pages, pageFile);
      debug.hmr('remove', path);
      fullReload();
    }
  });
}
