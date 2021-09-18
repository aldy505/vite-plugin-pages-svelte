/**
 * https://github.com/brattonross/vite-plugin-voie/blob/main/packages/vite-plugin-voie/src/routes.ts
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file at
 * https://github.com/brattonross/vite-plugin-voie/blob/main/LICENSE
 */

import { parse } from 'path';
import { Route, PreRoute, ResolvedOptions, ResolvedPages } from './types';
import { isDynamicRoute, isCatchAllRoute } from './utils';
import { stringifyRoutes } from './stringify';
import { sortPages } from './pages';

// function prepareRoutes(routes: Route, options: ResolvedOptions, parent?: Route): Route {
//   for (const route of routes) {
//     if (route.name) route.name = route.name.replace(/-index$/, '');

//     if (parent) route.path = route.path.replace(/^\//, '');

//     if (route.children) {
//       delete route.name;
//       route.children = prepareRoutes(route.children, options, route);
//     }

//     Object.assign(route, route.customBlock || {});

//     delete route.customBlock;

//     Object.assign(route, options.extendRoute?.(route, parent) || {});
//   }

//   return routes;
// }

export function generateRoutes(pages: ResolvedPages): Route {
  const routes: Route = {};

  sortPages(pages).forEach((page) => {
    const pathNodes = page.route.split('/');

    const component = `/${page.component}`;
    const route: PreRoute = {
      path: '',
      component,
    };

    for (let i = 0; i < pathNodes.length; i++) {
      const node = pathNodes[i];
      const isDynamic = isDynamicRoute(node);
      const isCatchAll = isCatchAllRoute(node);
      const normalizedName = isDynamic ? node.replace(/^\[(\.{3})?/, '').replace(/\]$/, '') : node;
      const normalizedPath = normalizedName.toLowerCase();

      if (normalizedName.toLowerCase() === 'index' && !route.path) {
        route.path += '/';
      } else if (normalizedName.toLowerCase() !== 'index') {
        if (isCatchAll) {
          route.path += '/*';
        } else if (isDynamic) {
          route.path += `/:${normalizedName}`;
        } else {
          route.path += `/${normalizedPath}`;
        }
      }
    }

    Object.assign(routes, { [route.path]: route.component });
  });

  return routes;
  // const preparedRoutes = prepareRoutes(routes, options);

  // let finalRoutes = preparedRoutes.sort((a, b) => {
  //   if (a.path.includes(':') && b.path.includes(':')) return b.path > a.path ? 1 : -1;
  //   else if (a.path.includes(':') || b.path.includes(':')) return a.path.includes(':') ? 1 : -1;
  //   else return b.path > a.path ? 1 : -1;
  // });

  // // replace duplicated cache all route
  // const allRoute = finalRoutes.find((i) => {
  //   return isCatchAllRoute(parse(i.component).name);
  // });
  // if (allRoute) {
  //   finalRoutes = finalRoutes.filter((i) => !isCatchAllRoute(parse(i.component).name));
  //   finalRoutes.push(allRoute);
  // }

  // return finalRoutes;
}

export function generateClientCode(routes: Route, options: ResolvedOptions): string {
  const { imports, stringRoutes } = stringifyRoutes(routes, options);

  return (
    `import {wrap} from 'svelte-spa-router/wrap';\n` +
    `${imports.join(';\n')}${imports.length > 1 ? ';' : ''}\n\n` +
    `const routes = ${stringRoutes};\n\n` +
    `export default routes;`
  );
}
