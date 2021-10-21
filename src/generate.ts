import type { PreRoute } from './types/route';
import type { FileOutput } from './types/page';
import { isDynamicRoute, isCatchAllRoute } from './utils/validate';
import { stringifyRoutes } from './stringify';
import { haveChildren } from './crawler/crawler';
import { extname } from 'path';

export function generateRoutes(pages: FileOutput[]): PreRoute[] {
  const routes: PreRoute[] = [];

  for (let i = 0; i < pages.length; i++) {
    const node = pages[i].path.split('/')[pages[i].path.split('/').length - 1];
    const isDynamic = isDynamicRoute(node);
    const isCatchAll = isCatchAllRoute(node);
    const fileExt = extname(node);
    const normalizedName = isDynamic
      ? node
          .replace(/^\[(\.{3})?/, '')
          .replace(/\]$/, '')
          .replace(fileExt, '')
      : node.replace(fileExt, '');
    const normalizedPath = normalizedName.toLowerCase();
    let name: string;
    if (normalizedPath === 'index') {
      name = 'index';
    } else {
      if (isCatchAll) {
        name = '/*';
      } else if (isDynamic) {
        name = `/:${normalizedName}`;
      } else {
        name = `/${normalizedPath}`;
      }
    }

    if (!haveChildren(pages[i])) {
      routes.push({
        name,
        path: pages[i].path,
      });
      continue;
    }

    routes.push({
      name,
      children: generateRoutes(pages[i].children as FileOutput[]),
    });
  }

  return routes;
}

export function generateClientCode(routes: PreRoute[]): string {
  const { imports, stringRoutes } = stringifyRoutes(routes);

  return (
    `${imports.join(';\n')}${imports.length > 1 ? ';' : ''}\n\n` +
    `const routes = ${stringRoutes};\n\n` +
    `export default routes;`
  );
}
