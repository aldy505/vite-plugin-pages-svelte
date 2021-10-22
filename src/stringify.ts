import type { FileOutput } from './types/page';
import type { PreRoute } from './types/route';
import { pathToName } from './utils/convert';
import { haveChildren } from './crawler/crawler';
import { sortRoute } from './utils/route';

// This is not on the types/ directory because this should only
// be used in this file only.
interface StringifyOutput {
  imports: string[];
  stringRoutes: string;
}

interface RouteItem {
  out: string;
  imp: string[];
}

/**
 * Creates a stringified Svelte SPA Router route definition.
 * @param {PreRoute[]} preparedRoutes
 * @returns {StringifyOutput}
 */
export function stringifyRoutes(preparedRoutes: PreRoute[]): StringifyOutput {
  const imports: string[] = [];
  let stringRoutes = '[';

  for (const route of preparedRoutes) {
    const { out, imp } = compileRouteItem(route);
    stringRoutes += out;
    imports.push(...imp);
  }

  stringRoutes += ']';

  return {
    imports,
    stringRoutes,
  };
}

/**
 * Separate function from the stringifyRoute because I'll need it to run
 * recursively.
 * @param {PreRoute} route A single PreRoute object
 * @returns {String} To be used by stringifyRoute function
 */
function compileRouteItem(route: PreRoute): RouteItem {
  let out = '{ ';
  const imp: string[] = [];

  if (haveChildren(route as FileOutput)) {
    const children = route.children?.sort(sortRoute).map((o) => compileRouteItem(o)) as RouteItem[];
    const nestedRoutes: string[] = [...children.map((o) => o.out.replace('name: "/",', 'name: "index",'))];

    out += `name: "${route.name}", nestedRoutes: [${nestedRoutes.join(',')}]\n`;
    const imps = children?.map((o) => o.imp).flat() as string[];
    imp.push(...imps);
  } else {
    const importName = pathToName(route.path as string);
    const importStr = `import ${importName} from "${route.path}"`;
    if (!imp.includes(importStr)) {
      imp.push(importStr);
    }
    out += `name: "${route.name}", component: ${importName}\n`;
  }
  out += '},\n';

  return {
    out,
    imp,
  };
}
