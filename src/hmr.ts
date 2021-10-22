import type { ViteDevServer } from 'vite';
import type { ResolvedOptions } from './types/options';
import type { FileOutput } from './types/page';
import { isTarget } from './utils/validate';
import { slash } from './utils/convert';
import { getPagesVirtualModule, debug } from './utils/vite';
import { resolvePages } from './pages';

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
      const p = await resolvePages(options);
      pages.length = 0;
      pages.push(...p);
      debug.hmr('add', p);
      fullReload();
    }
  });
  watcher.on('unlink', async (file) => {
    const path = slash(file);
    if (isTarget(path, options)) {
      const p = await resolvePages(options);
      pages.length = 0;
      pages.push(...p);
      debug.hmr('remove', p);
      fullReload();
    }
  });
}
