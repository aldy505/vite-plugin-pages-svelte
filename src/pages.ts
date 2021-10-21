import type { ResolvedOptions } from './types/options';
import type { FileOutput } from './types/page';
import { resolve } from 'path';
import { getPageFiles } from './files';
import { slash } from './utils/convert';

export async function resolvePages(options: ResolvedOptions): Promise<FileOutput[]> {
  const pages: FileOutput[] = [];

  const pageDirFiles = {
    pageDir: options.pagesDir,
    files: await getPageFiles(slash(resolve(options.root, options.pagesDir)), options),
  };

  for (const file of pageDirFiles.files) {
    pages.push(file);
  }

  const routes: string[] = [];

  for (const page of pages.values()) {
    if (!routes.includes(page.path)) routes.push(page.path);
    else throw new Error(`[vite-plugin-pages] duplicate route in ${page.path}`);
  }

  return pages;
}

export function addPage(pages: FileOutput[], newPage: FileOutput): void {
  pages.push(newPage);
}

export function removePage(pages: FileOutput[], oldPage: FileOutput): void {
  const find = pages.findIndex((o) => o.path === oldPage.path);
  pages.splice(find, 1);
}
