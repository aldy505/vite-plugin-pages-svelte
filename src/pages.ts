import type { ResolvedOptions } from './types/options';
import type { FileOutput } from './types/page';
import { resolve } from 'path';
import { getPageFiles } from './files';
import { toArray, slash } from './utils/convert';

export async function resolvePages(options: ResolvedOptions): Promise<FileOutput[]> {
  const dirs = toArray(options.pagesDir);

  const pages: FileOutput[] = [];

  const pageDirFiles = dirs.map(async (pageDir) => {
    const pagePath = slash(resolve(options.root, pageDir));
    return {
      pageDir,
      files: await getPageFiles(pagePath, options),
    };
  });

  for await (const pageDir of pageDirFiles) {
    for (const file of pageDir.files) {
      pages.push(file);
    }
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
  pages = pages.filter((o) => o.path !== oldPage.path);
}
