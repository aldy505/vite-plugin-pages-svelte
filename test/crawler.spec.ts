import { haveChildren, traverse } from '../src/crawler/crawler';
import { FileOutput } from '../src/types/page';

const testPagesDir = 'test/assets/pages';
const testDeepPagesDir = 'test/assets/deep-pages';

describe('Traverse test page dirs', () => {
  test('Page files', async () => {
    const result = await traverse(testPagesDir, ['svelte'], []);
    expect(result.sort()).toMatchSnapshot('traverse page files');
  });
});

describe('Traverse test deep pages dir', () => {
  test('Deep pages files', async () => {
    const result = await traverse(testDeepPagesDir, ['svelte'], []);
    expect(result.sort()).toMatchSnapshot('traverse deep pages files');
  });
});

describe('Have children', () => {
  test('Should return true', () => {
    const files: FileOutput = {
      path: '/',
      children: [{ path: '/about' }],
    };
    const result = haveChildren(files);
    expect(result).toBe(true);
  });
  test('Should return false', () => {
    const files: FileOutput = {
      path: '/',
    };
    const result = haveChildren(files);
    expect(result).toBe(false);
  });
});
