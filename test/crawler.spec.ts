import { haveChildren, traverse } from '../src/crawler/crawler';
import { FileOutput } from '../src/types/page';

const testPagesDir = 'test/assets/pages';
const testDeepPagesDir = 'test/assets/deep-pages';

describe('Crawler', () => {
  test('Traverse test page dirs', async () => {
    const result = await traverse(testPagesDir, ['svelte'], []);
    expect(result.sort()).toMatchSnapshot('traverse page files');
  });
  test('Traverse test deep pages dir', async () => {
    const result = await traverse(testDeepPagesDir, ['svelte'], []);
    expect(result.sort()).toMatchSnapshot('traverse deep pages files');
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
