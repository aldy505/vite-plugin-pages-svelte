import { slash } from '../src/utils/convert';
import { getPageFiles, getPageDirs, fromSinglePage } from '../src/files';
import type { ResolvedOptions } from '../src/types/options';

const testPagesDir = 'test/assets/pages';
const testDeepPagesDir = 'test/assets/deep-pages';

describe('Files', () => {
  test('getPageFiles', async () => {
    const options: ResolvedOptions = {
      pagesDir: '.',
      extensions: ['svelte'],
      exclude: ['.git', 'node_modules'],
      root: process.cwd(),
      extensionsRE: /svelte/,
      syncIndex: true,
    };
    const files = await getPageFiles(testPagesDir, options);
    expect(files.sort()).toMatchSnapshot('page files');
  });

  test('getPageDirs', async () => {
    const pageDirOptions = {
      dir: slash(testDeepPagesDir),
      baseRoute: '',
    };
    const options: ResolvedOptions = {
      pagesDir: '.',
      extensions: ['svelte'],
      exclude: ['.git', 'node_modules'],
      root: process.cwd(),
      extensionsRE: /svelte/,
      syncIndex: true,
    };
    const dirs = await getPageDirs(pageDirOptions, options.root, options.exclude);
    expect(dirs.sort()).toMatchSnapshot('glob dirs');
  });

  test('fromSinglePage - return empty', () => {
    const options: ResolvedOptions = {
      pagesDir: '.',
      extensions: ['svelte'],
      exclude: ['.git', 'node_modules'],
      root: process.cwd(),
      extensionsRE: /svelte/,
      syncIndex: true,
    };

    const result = fromSinglePage('/foo/bar.vue', options);
    expect(result).toStrictEqual({ path: '' });
  });

  test('fromSinglePage - return complete', () => {
    const options: ResolvedOptions = {
      pagesDir: '.',
      extensions: ['svelte'],
      exclude: ['.git', 'node_modules'],
      root: process.cwd(),
      extensionsRE: /svelte/,
      syncIndex: true,
    };

    const result = fromSinglePage('/foo/bar.svelte', options);
    expect(result).toStrictEqual({ path: '/foo/bar.svelte' });
  });
});
