import { resolveOptions } from '../src/options';

describe('Options', () => {
  test('resolve', async () => {
    const options = await resolveOptions({
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
