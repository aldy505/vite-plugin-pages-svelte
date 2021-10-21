import { pathToName } from './utils/convert';
import { PreRoute } from './types/route';
import { haveChildren } from './crawler/crawler';

interface StringifyOutput {
  imports: string[];
  stringRoutes: string;
}

/**
 * Creates a stringified Svelte SPA Router route definition.
 */
export function stringifyRoutes(preparedRoutes: PreRoute[]): StringifyOutput {
  const imports: string[] = [];
  let stringRoutes = '[';

  for (const route of preparedRoutes) {
    const importName = pathToName(route.path);
    const importStr = `import ${importName} from '${route.path}'`;
    if (!imports.includes(importStr)) {
      imports.push(importStr);
    }
    stringRoutes += compileRouteItem(route);
  }

  stringRoutes += ']';

  return {
    imports,
    stringRoutes,
  };
}

function compileRouteItem(route: PreRoute): string {
  let out = '{';
  if (haveChildren(route)) {
    out += `name: "${route.name}", nestedRoutes: ${route.children?.map((o) => compileRouteItem(o)).join('')}`;
  } else {
    const importName = pathToName(route.path);
    out += `name: "${route.name}", component: ${importName},`;
  }
  out += '},';
  return out;
}
