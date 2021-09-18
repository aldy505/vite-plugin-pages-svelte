import { generateRoutes, generateClientCode } from '../src/generate';
import { resolvePages } from '../src/pages';
import { resolveOptions } from '../src/options';

const asyncOpts = resolveOptions({
  pagesDir: 'test/assets/pages',
  importMode: 'async',
});

const syncOpts = resolveOptions({
  pagesDir: 'test/assets/pages',
  importMode: 'sync',
});

describe('Generate', () => {
  test('Routes Async', async () => {
    const pages = await resolvePages(asyncOpts);
    const routes = generateRoutes(pages);
    const code = generateClientCode(routes, asyncOpts);

    expect(routes).toMatchSnapshot('routes async');
    expect(code).toMatchSnapshot('client code async');
  });
  test('Routes Sync', async () => {
    const pages = await resolvePages(syncOpts);
    const routes = generateRoutes(pages);
    const code = generateClientCode(routes, syncOpts);

    expect(routes).toMatchSnapshot('routes sync');
    expect(code).toMatchSnapshot('client code sync');
  });
});
