import type { PreRoute } from '../src/types/route';
import { stringifyRoutes } from '../src/stringify';

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
    expect(result).toStrictEqual({
      imports: [
        'import _home_foo_bar_index_svelte from "/home/foo/bar/index.svelte"',
        'import _home_foo_bar_about_index_svelte from "/home/foo/bar/about/index.svelte"',
        'import _home_foo_bar_about_contact_svelte from "/home/foo/bar/about/contact.svelte"',
      ],
      stringRoutes: `[{ name: "index", component: _home_foo_bar_index_svelte
},
{ name: "about", nestedRoutes: [{ name: "index", component: _home_foo_bar_about_index_svelte
},
,{ name: "contact", component: _home_foo_bar_about_contact_svelte
},
]
},
]`,
    });
  });
});
