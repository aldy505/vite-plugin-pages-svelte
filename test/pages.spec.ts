import type { ResolvedOptions } from '../src/types/options';
import type { FileOutput } from '../src/types/page';
import { addPage, removePage, resolvePages } from '../src/pages';
import { resolve } from 'path';

const currentPath = resolve();

describe('Pages', () => {
  test('resolvePages', async () => {
    const options: ResolvedOptions = {
      pagesDir: 'test/assets/pages',
      extensions: ['svelte'],
      exclude: ['.git', 'node_modules'],
      root: process.cwd(),
      extensionsRE: /svelte/,
      syncIndex: true,
    };

    const result = await resolvePages(options);
    expect(result).toStrictEqual([
      {
        path: `${currentPath}/test/assets/pages/about.svelte`,
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
        path: `${currentPath}/test/assets/pages/index.svelte`,
      },
      {
        path: `${currentPath}/test/assets/pages/[userId].svelte`,
      },
      {
        path: `${currentPath}/test/assets/pages/components.svelte`,
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
        path: `${currentPath}/test/assets/pages/[...all].svelte`,
      },
      {
        children: [
          {
            path: `${currentPath}/test/assets/pages/__test__/index.svelte`,
          },
        ],
        path: `${currentPath}/test/assets/pages/__test__`,
      },
    ]);
  });

  test('addPage', () => {
    const pages: FileOutput[] = [{ path: '/foo' }, { path: '/bar' }];
    addPage(pages, { path: '/baz' });
    expect(pages).toStrictEqual([{ path: '/foo' }, { path: '/bar' }, { path: '/baz' }]);
  });

  test('removePage', () => {
    const pages: FileOutput[] = [{ path: '/foo' }, { path: '/bar' }];
    removePage(pages, { path: '/foo' });
    expect(pages).toStrictEqual([{ path: '/bar' }]);
  });
});
