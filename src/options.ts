import type { UserOptions, ResolvedOptions } from './types/options';
import { slash } from './utils/convert';

/**
 *
 * @param userOptions
 * @param viteRoot
 * @returns
 */
export async function resolveOptions(userOptions: UserOptions, viteRoot?: string): Promise<ResolvedOptions> {
  const { pagesDir = 'src/pages', exclude = [], syncIndex = true } = userOptions;

  const root = viteRoot || slash(process.cwd());

  const extensions = userOptions.extensions || ['svelte'];

  const extensionsRE = new RegExp(`\\.(${extensions.join('|')})$`);

  const resolvedOptions: ResolvedOptions = {
    pagesDir,
    root,
    extensions,
    exclude,
    syncIndex,
    extensionsRE,
  };

  return resolvedOptions;
}
