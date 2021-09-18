import { resolveImportMode, pathToName } from './utils';
import { ResolvedOptions, Route } from './types';

const componentRE = /"(.+).svelte"/g;
const hasFunctionRE = /"(?:props|beforeEnter)":("(.*?)")/g;

const multilineCommentsRE = /\/\*(.|[\r\n])*?\*\//gm;
const singlelineCommentsRE = /\/\/.*/g;

function replaceFunction(_: any, value: any) {
  if (value instanceof Function || typeof value === 'function') {
    const fnBody = value
      .toString()
      .replace(multilineCommentsRE, '')
      .replace(singlelineCommentsRE, '')
      .replace(/(\t|\n|\r|\s)/g, '');

    // ES6 Arrow Function
    if (fnBody.length < 8 || fnBody.substring(0, 8) !== 'function') return `_NuFrRa_${fnBody}`;

    return fnBody;
  }

  return value;
}

/**
 * Creates a stringified Svelte SPA Router route definition.
 */
export function stringifyRoutes(
  preparedRoutes: Route,
  options: ResolvedOptions,
): { imports: string[]; stringRoutes: string } {
  const imports: string[] = [];
  let stringRoutes = '{';
  const routesValues = Object.entries(preparedRoutes);

  for (const route of routesValues) {
    const [path, filePath] = route;
    const mode = resolveImportMode(filePath as string, options);
    if (mode === 'sync') {
      const importName = pathToName(filePath as string);
      const importStr = `import ${importName} from '${filePath}'`;
      if (!imports.includes(importStr)) {
        imports.push(importStr);
      }
      stringRoutes += `"${path}": ${importName},`;
    } else {
      stringRoutes += `"${path}": wrap({ asyncComponent: () => import('${filePath}') }),`;
    }
  }

  stringRoutes += '}';

  return {
    imports,
    stringRoutes,
  };
}
