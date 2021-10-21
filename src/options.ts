import type { UserOptions, ResolvedOptions } from './types/options';
import type { PageDirOptions } from './types/page';
import { getPageDirs } from './files';
import { slash } from './utils/convert';

/**
 *
 * @param pagesDir
 * @param root
 * @param exclude
 * @returns
 */
async function resolvePageDirs(pagesDir: string, root: string, exclude: string[]): Promise<PageDirOptions[]> {
  return await getPageDirs({ baseRoute: '', dir: pagesDir }, root, exclude);
}

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

  const resolvedPagesDir = await resolvePageDirs(slash(pagesDir), root, exclude);

  const resolvedOptions: ResolvedOptions = {
    pagesDir: resolvedPagesDir[0].dir,
    root,
    extensions,
    exclude,
    syncIndex,
    extensionsRE,
  };

  return resolvedOptions;
}
