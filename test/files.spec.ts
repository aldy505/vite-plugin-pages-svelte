import { resolve } from 'path';
import { slash } from '../src/utils/convert';
import { getPageFiles, getPageDirs, fromSinglePage } from '../src/files';
import type { ResolvedOptions } from '../src/types/options';

const testPagesDir = 'test/assets/pages';
const testDeepPagesDir = 'test/assets/deep-pages';

const currentPath = resolve();

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
    const expectedResult = [
      {
        path: `${currentPath}/test/assets/pages/index.svelte`,
      },
      {
        path: `${currentPath}/test/assets/pages/components.svelte`,
      },
      {
        children: [
          {
            path: `${currentPath}/test/assets/pages/blog/index.svelte`,
          },
          {
            path: `${currentPath}/test/assets/pages/blog/[id].svelte`,
          },
          {
            children: [
              {
                path: `${currentPath}/test/assets/pages/blog/today/index.svelte`,
              },
            ],
            path: `${currentPath}/test/assets/pages/blog/today`,
          },
        ],
        path: `${currentPath}/test/assets/pages/blog`,
      },
      {
        children: [
          {
            path: `${currentPath}/test/assets/pages/about/index.svelte`,
          },
        ],
        path: `${currentPath}/test/assets/pages/about`,
      },
      {
        children: [
          {
            path: `${currentPath}/test/assets/pages/__test__/index.svelte`,
          },
        ],
        path: `${currentPath}/test/assets/pages/__test__`,
      },
      {
        path: `${currentPath}/test/assets/pages/[userId].svelte`,
      },
      {
        children: [
          {
            path: `${currentPath}/test/assets/pages/[sensor]/current.svelte`,
          },
          {
            path: `${currentPath}/test/assets/pages/[sensor]/[...all].svelte`,
          },
        ],
        path: `${currentPath}/test/assets/pages/[sensor]`,
      },

      {
        path: `${currentPath}/test/assets/pages/[...all].svelte`,
      },
    ];

    expectedResult.forEach((i) => expect(files).toContainEqual(i));
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

    const expectedResult = [
      {
        baseRoute: '',
        dir: 'foo',
      },
      {
        baseRoute: '',
        dir: 'bar',
      },
    ];

    expectedResult.forEach((i) => expect(dirs).toContainEqual(i));
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
