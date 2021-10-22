import { resolve } from 'path';
import { haveChildren, traverse } from '../src/crawler/crawler';
import { FileOutput } from '../src/types/page';

const testPagesDir = 'test/assets/pages';
const testDeepPagesDir = 'test/assets/deep-pages';

const currentPath = resolve();

describe('Crawler', () => {
  test('Traverse test page dirs', async () => {
    const result = await traverse(testPagesDir, ['svelte'], []);
    expect(result.sort((a, b) => (a.path < b.path ? 1 : -1))).toStrictEqual([
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
    ]);
  });

  test('Traverse test deep pages dir', async () => {
    const result = await traverse(testDeepPagesDir, ['svelte'], []);
    expect(result.sort((a, b) => (a.path < b.path ? 1 : -1))).toStrictEqual([
      {
        children: [
          {
            children: [
              {
                path: `${currentPath}/test/assets/deep-pages/foo/pages/index.svelte`,
              },
            ],
            path: `${currentPath}/test/assets/deep-pages/foo/pages`,
          },
        ],
        path: `${currentPath}/test/assets/deep-pages/foo`,
      },
      {
        children: [
          {
            children: [
              {
                path: `${currentPath}/test/assets/deep-pages/bar/pages/index.svelte`,
              },
            ],
            path: `${currentPath}/test/assets/deep-pages/bar/pages`,
          },
        ],
        path: `${currentPath}/test/assets/deep-pages/bar`,
      },
    ]);
  });

  test('Have children - Should return true', () => {
    const files: FileOutput = {
      path: '/',
      children: [{ path: '/about' }],
    };
    const result = haveChildren(files);
    expect(result).toBe(true);
  });

  test('Have children - Should return false', () => {
    const files: FileOutput = {
      path: '/',
    };
    const result = haveChildren(files);
    expect(result).toBe(false);
  });
});
