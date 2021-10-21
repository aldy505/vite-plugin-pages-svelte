import type { ResolvedOptions } from '../src/types/options';
import type { FileOutput } from '../src/types/page';
import { addPage, removePage, resolvePages } from '../src/pages';

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
    expect(result).toMatchSnapshot('resolvePages');
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
