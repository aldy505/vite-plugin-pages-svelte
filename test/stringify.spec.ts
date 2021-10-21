import { stringifyRoutes } from '../src/stringify';
import { PreRoute } from '../src/types/route';

describe('Stringify routes', () => {
  test('Should stringify', () => {
    const route: PreRoute[] = [
      { name: 'index', path: '/home/foo/bar/index.svelte' },
      {
        name: 'about',
        path: '/home/foo/bar/about',
        children: [
          { name: 'index', path: '/home/foo/bar/about/index.svelte' },
          { name: 'contact', path: '/home/foo/bar/about/contact.svelte' },
        ],
      },
    ];
    const result = stringifyRoutes(route);
    expect(result).toMatchSnapshot('stringify route');
  });
});
