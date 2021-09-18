import { resolveOptions } from '../src/options';

describe('Options', () => {
  test('resolve', () => {
    const options = resolveOptions({
      pagesDir: 'test/assets/pages',
    });
    expect(options).toMatchSnapshot(
      {
        root: expect.any(String),
      },
      'resolved options',
    );
  });
});
