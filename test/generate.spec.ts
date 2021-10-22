import { resolve } from 'path';
import { generateRoutes, generateClientCode } from '../src/generate';
import { resolvePages } from '../src/pages';
import { sortRoute } from '../src/utils/route';
import { resolveOptions } from '../src/options';
import type { PreRoute } from '../src/types/route';

const currentPath = resolve();
const currentPathNormalized = currentPath.replace(/[/-]/g, '_');

describe('Generate', () => {
  test('Routes Sync', async () => {
    const options = await resolveOptions({
      pagesDir: 'test/assets/pages',
    });
    const pages = await resolvePages(options);
    const routes = generateRoutes(pages);
    const code = generateClientCode(routes);

    expect(routes.sort(sortRoute)).toMatchObject<PreRoute[]>([
      {
        children: [
          {
            name: '/',
            path: `${currentPath}/test/assets/pages/about/index.svelte`,
          },
        ],
        name: '/about',
      },
      {
        name: '/',
        path: `${currentPath}/test/assets/pages/index.svelte`,
      },
      {
        name: '/components',
        path: `${currentPath}/test/assets/pages/components.svelte`,
      },
      {
        children: [
          {
            children: [
              {
                name: '/',
                path: `${currentPath}/test/assets/pages/blog/today/index.svelte`,
              },
            ],
            name: '/today',
          },
          {
            name: '/',
            path: `${currentPath}/test/assets/pages/blog/index.svelte`,
          },
          {
            name: '/:id',
            path: `${currentPath}/test/assets/pages/blog/[id].svelte`,
          },
        ],
        name: '/blog',
      },
      {
        name: '/:userId',
        path: `${currentPath}/test/assets/pages/[userId].svelte`,
      },
      {
        children: [
          {
            name: '/current',
            path: `${currentPath}/test/assets/pages/[sensor]/current.svelte`,
          },
          {
            name: '/*',
            path: `${currentPath}/test/assets/pages/[sensor]/[...all].svelte`,
          },
        ],
        name: '/:sensor',
      },
      {
        name: '/*',
        path: `${currentPath}/test/assets/pages/[...all].svelte`,
      },
      {
        children: [
          {
            name: '/',
            path: `${currentPath}/test/assets/pages/__test__/index.svelte`,
          },
        ],
        name: '/__test__',
      },
    ]);

    expect(code)
      .toStrictEqual(`import ${currentPathNormalized}_test_assets_pages_blog_today_index_svelte from "${currentPath}/test/assets/pages/blog/today/index.svelte";
import ${currentPathNormalized}_test_assets_pages_blog_index_svelte from "${currentPath}/test/assets/pages/blog/index.svelte";
import ${currentPathNormalized}_test_assets_pages_blog_$id$_svelte from "${currentPath}/test/assets/pages/blog/[id].svelte";
import ${currentPathNormalized}_test_assets_pages_components_svelte from "${currentPath}/test/assets/pages/components.svelte";
import ${currentPathNormalized}_test_assets_pages_index_svelte from "${currentPath}/test/assets/pages/index.svelte";
import ${currentPathNormalized}_test_assets_pages_about_index_svelte from "${currentPath}/test/assets/pages/about/index.svelte";
import ${currentPathNormalized}_test_assets_pages_$userId$_svelte from "${currentPath}/test/assets/pages/[userId].svelte";
import ${currentPathNormalized}_test_assets_pages_$sensor$_current_svelte from "${currentPath}/test/assets/pages/[sensor]/current.svelte";
import ${currentPathNormalized}_test_assets_pages_$sensor$_$___all$_svelte from "${currentPath}/test/assets/pages/[sensor]/[...all].svelte";
import ${currentPathNormalized}_test_assets_pages_$___all$_svelte from "${currentPath}/test/assets/pages/[...all].svelte";
import ${currentPathNormalized}_test_assets_pages___test___index_svelte from "${currentPath}/test/assets/pages/__test__/index.svelte";

const routes = [{ name: "/blog", nestedRoutes: [{ name: "/today", nestedRoutes: [{ name: "index", component: ${currentPathNormalized}_test_assets_pages_blog_today_index_svelte
},
]
},
,{ name: "index", component: ${currentPathNormalized}_test_assets_pages_blog_index_svelte
},
,{ name: "/:id", component: ${currentPathNormalized}_test_assets_pages_blog_$id$_svelte
},
]
},
{ name: "/components", component: ${currentPathNormalized}_test_assets_pages_components_svelte
},
{ name: "/", component: ${currentPathNormalized}_test_assets_pages_index_svelte
},
{ name: "/about", nestedRoutes: [{ name: "index", component: ${currentPathNormalized}_test_assets_pages_about_index_svelte
},
]
},
{ name: "/:userId", component: ${currentPathNormalized}_test_assets_pages_$userId$_svelte
},
{ name: "/:sensor", nestedRoutes: [{ name: "/current", component: ${currentPathNormalized}_test_assets_pages_$sensor$_current_svelte
},
,{ name: "/*", component: ${currentPathNormalized}_test_assets_pages_$sensor$_$___all$_svelte
},
]
},
{ name: "/*", component: ${currentPathNormalized}_test_assets_pages_$___all$_svelte
},
{ name: "/__test__", nestedRoutes: [{ name: "index", component: ${currentPathNormalized}_test_assets_pages___test___index_svelte
},
]
},
];

export default routes;`);
  });
});
