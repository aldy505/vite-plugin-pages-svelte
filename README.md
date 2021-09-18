# vite-plugin-pages

[![npm](https://img.shields.io/npm/v/vite-plugin-pages-svelte?style=flat-square) ![npm bundle size](https://img.shields.io/bundlephobia/min/vite-plugin-pages-svelte?style=flat-square) ![npm](https://img.shields.io/npm/dm/vite-plugin-pages-svelte?style=flat-square)](https://www.npmjs.com/package/vite-plugin-pages-svelte) [![Codecov](https://img.shields.io/codecov/c/github/aldy505/vite-plugin-pages-svelte?style=flat-square)](https://codecov.io/gh/aldy505/vite-plugin-pages-svelte) [![GitHub branch checks state](https://img.shields.io/github/checks-status/aldy505/vite-plugin-pages-svelte/master?style=flat-square)](https://github.com/aldy505/vite-plugin-pages-svelte/actions) [![CodeFactor](https://www.codefactor.io/repository/github/aldy505/vite-plugin-pages-svelte/badge)](https://www.codefactor.io/repository/github/aldy505/vite-plugin-pages-svelte) [![GitHub](https://img.shields.io/github/license/aldy505/vite-plugin-pages-svelte?style=flat-square)](https://github.com/aldy505/vite-plugin-pages-svelte/blob/master/LICENSE)

> File system based routing for Svelte applications using
> [Vite](https://github.com/vitejs/vite)

**⚠ Expect a lot of breaking changes, until at least 0.5.x**

## Getting Started

### svelte

Install:

```bash
$ npm install -D vite-plugin-pages-svelte
$ npm install svelte-spa-router
```

Add to your `vite.config.js`:

```js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import pages from 'vite-plugin-pages-svelte';

export default defineConfig({
  plugins: [svelte(), pages()],
});
```

## Overview

By default a page is a Svelte component exported from a `.svelte` file in the
`src/pages` directory.

You can access the generated routes by importing the `virtual:generated-pages-svelte`
module in your application.

### svelte

```html
<script>
  import Router from 'svelte-spa-router';
  import routes from 'virtual:generated-pages-svelte';
</script>

<Router {routes} />
```

**Type**

```ts
// vite-env.d.ts
/// <reference types="vite-plugin-pages-svelte/client" />
```

## Configuration

To use custom configuration, pass your options to Pages when instantiating the
plugin:

```js
// vite.config.js
import pages from 'vite-plugin-pages-svelte';

export default {
  plugins: [
    pages({
      pagesDir: 'src/views',
    }),
  ],
};
```

### pagesDir

- **Type:** `string | (string | PageDirOptions)[]`
- **Default:** `'src/pages'`

Relative path to the pages directory. Supports globs.

Can be:

- single path: routes point to `/`
- array of paths: all routes in the paths point to `/`
- array of `PageDirOptions`, Check below 👇

Specifying a glob or an array of `PageDirOptions` allow you to use multiple
pages folder, and specify the base route to append to the path and the route
name.

**Example:**

```bash
# folder structure
src/
  ├── features/
  │  └── dashboard/
  │     ├── code/
  │     ├── components/
  │     └── pages/
  ├── admin/
  │   ├── code/
  │   ├── components/
  │   └── pages/
  └── pages/
```

```js
// vite.config.js
export default {
  plugins: [
    Pages({
      pagesDir: [
        { dir: 'src/pages', baseRoute: '' },
        { dir: 'src/features/**/pages', baseRoute: 'features' },
        { dir: 'src/admin/pages', baseRoute: 'admin' },
      ],
    }),
  ],
};
```

### extensions

- **Type:** `string[]`
- **Default:**
  - `['svelte']`

An array of valid file extensions for pages.

### exclude

- **Type:** `string[]`
- **Default:** `[]`

An array of glob patterns to exclude matches.

```bash
# folder structure
src/pages/
  ├── users/
  │  ├── components
  │  │  └── form.svelte
  │  ├── [id].svelte
  │  └── index.svelte
  └── home.svelte
```

```js
// vite.config.js
export default {
  plugins: [
    Pages({
      exclude: ['**/components/*.svelte'],
    }),
  ],
};
```

### importMode

- **Type:** `'sync' | 'async' | (filepath: string) => 'sync' | 'async')`
- **Default:**
  - Top level index file: `'sync'`, can turn off by option `syncIndex`.
  - `async` by default

Import mode can be set to either `async`, `sync`, or a function which returns
one of those values.

To get more fine-grained control over which routes are loaded sync/async, you
can use a function to resolve the value based on the route path. For example:

```js
// vite.config.js
export default {
  plugins: [
    Pages({
      importMode(path) {
        // Load about page synchronously, all other pages are async.
        return path.includes('about') ? 'sync' : 'async';
      },
    }),
  ],
};
```

### replaceSquareBrackets (broken)

- **Type:** `boolean`
- **Default:** `false`

Check: [#16](https://github.com/hannoeru/vite-plugin-pages/issues/16)

Replace '[]' to '\_' in bundle filename

### extendRoute (also broken)

- **Type:**
  `(route: Route, parent: Route | undefined) => Route | void | Promise<Route | void>`

A function that takes a route and optionally returns a modified route. This is
useful for augmenting your routes with extra data (e.g. route metadata).

```js
// vite.config.js
export default {
  // ...
  plugins: [
    Pages({
      extendRoute(route, parent) {
        if (route.path === '/') {
          // Index is unauthenticated.
          return route;
        }

        // Augment the route with meta that indicates that the route requires authentication.
        return {
          ...route,
          meta: { auth: true },
        };
      },
    }),
  ],
};
```

### onRoutesGenerated (broken)

- **Type:** `(routes: Route[]) => Route[] | void | Promise<Route[] | void>`

A function that takes a generated routes and optionally returns a modified
generated routes.

### onClientGenerated (dude why do u have so many broken codes)

- **Type:** `(clientCode: string) => string | void | Promise<string | void>`

A function that takes a generated client code and optionally returns a modified
generated client code.

## File System Routing

Inspired by the routing from
[NuxtJS](https://nuxtjs.org/guides/features/file-system-routing) 💚

For more advanced use cases, you can tailor Pages to fit the needs of your app
through [configuration](#configuration).

- [Basic Routing](#basic-routing)
- [Index Routes](#index-routes)
- [Dynamic Routes](#dynamic-routes)
- [Nested Routes](#nested-routes)
- [Catch-all Routes](#catch-all-routes)

### Basic Routing

Pages will automatically map files from your pages directory to a route with the
same name:

- `src/pages/users.svelte` -> `/users`
- `src/pages/users/profile.svelte` -> `/users/profile`
- `src/pages/settings.svelte` -> `/settings`

### Index Routes

Files with the name `index` are treated as the index page of a route:

- `src/pages/index.svelte` -> `/`
- `src/pages/users/index.svelte` -> `/users`

### Dynamic Routes

Dynamic routes are denoted using square brackets. Both directories and pages can
be dynamic:

- `src/pages/users/[id].svelte` -> `/users/:id` (`/users/one`)
- `src/pages/[user]/settings.svelte` -> `/:user/settings` (`/one/settings`)

Any dynamic parameters will be passed to the page as props. For example, given
the file `src/pages/users/[id].svelte`, the route `/users/abc` will be passed the
following props:

```json
{ "id": "abc" }
```

### Nested Routes

We can make use of svelte Routers child routes to create nested layouts. The parent
component can be defined by giving it the same name as the directory that
contains your child routes.

For example, this directory structure:

```
src/pages/
  ├── users/
  │  ├── [id].svelte
  │  └── index.svelte
  └── users.svelte
```

will result in this routes configuration:

```
{
  '/users': wrap({ asyncComponent: () => import('/src/pages/users.svelte')})
  '/users/:id': wrap({ asyncComponent: () => import('/src/pages/users/[id].svelte')})
}
```

### Catch-all Routes

Catch-all routes are denoted with square brackets containing an ellipsis:

- `src/pages/[...all].svelte` -> `/*` (`/non-existent-page`)

The text after the ellipsis will be used both to name the route, and as the name
of the prop in which the route parameters are passed.

## License

MIT License © 2021 [hannoeru](https://github.com/hannoeru)
