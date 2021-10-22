import { resolve } from 'path';
import { resolveOptions } from '../src/options';

describe('Options', () => {
  test('resolve', async () => {
    const options = await resolveOptions({
      pagesDir: 'test/assets/pages',
    });
    expect(options).toStrictEqual({
      exclude: [],
      extensions: ['svelte'],
      extensionsRE: /\.(svelte)$/,
      pagesDir: 'test/assets/pages',
      root: resolve(),
      syncIndex: true,
    });
  });
});
