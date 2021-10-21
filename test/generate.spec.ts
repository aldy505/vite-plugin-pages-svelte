import { generateRoutes, generateClientCode } from '../src/generate';
import { resolvePages } from '../src/pages';
import { resolveOptions } from '../src/options';

describe('Generate', () => {
  test('Routes Sync', async () => {
    const options = await resolveOptions({
      pagesDir: 'test/assets/pages',
    });
    const pages = await resolvePages(options);
    const routes = generateRoutes(pages);
    const code = generateClientCode(routes);

    expect(routes).toMatchSnapshot('routes sync');
    expect(code).toMatchSnapshot('client code sync');
  });
});
