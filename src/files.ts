import type { ResolvedOptions } from './types/options';
import type { FileOutput, PageDirOptions } from './types/page';
import { resolve } from 'path';
import { traverse, traverseDir } from './crawler/crawler';
import { containsExtension } from './utils/validate';

function getIgnore(exclude: string[]): string[] {
  return ['node_modules', '.git', '**/__*__/**', ...exclude];
}

/**
 * Resolves the page dirs for its for its given globs
 * @param pageDirOptions
 * @param root
 * @param exclude
 * @returns {Promise<PageDirOptions[]>}
 */
export async function getPageDirs(
  pageDirOptions: PageDirOptions,
  root: string,
  exclude: string[],
): Promise<PageDirOptions[]> {
  const dirs = await traverseDir(resolve(root, pageDirOptions.baseRoute, pageDirOptions.dir), getIgnore(exclude));
  console.log(dirs);
  const pageDirs = dirs.map((dir) => ({
    ...pageDirOptions,
    dir,
  }));

  return pageDirs;
}

/**
 * Resolves the files that are valid pages for the given context.
 * @param path
 * @param options
 * @returns
 */
export async function getPageFiles(path: string, options: ResolvedOptions): Promise<FileOutput[]> {
  const { exclude, extensions } = options;

  const files = await traverse(path, extensions, exclude);

  return files;
}

/**
 * Generate a FileOutput object from the given path and options.
 * @param path
 * @param options
 * @returns
 */
export function fromSinglePage(path: string, options: ResolvedOptions): FileOutput {
  const { exclude, extensions } = options;
  if (exclude.includes(path) && extensions.length > 0 && !containsExtension(path, extensions)) return { path: '' };
  return { path };
}
