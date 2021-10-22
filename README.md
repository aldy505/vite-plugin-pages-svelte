# vite-plugin-pages

[![npm](https://img.shields.io/npm/v/vite-plugin-pages-svelte?style=flat-square) ![npm bundle size](https://img.shields.io/bundlephobia/min/vite-plugin-pages-svelte?style=flat-square) ![npm](https://img.shields.io/npm/dm/vite-plugin-pages-svelte?style=flat-square)](https://www.npmjs.com/package/vite-plugin-pages-svelte) [![Codecov](https://img.shields.io/codecov/c/github/aldy505/vite-plugin-pages-svelte?style=flat-square)](https://codecov.io/gh/aldy505/vite-plugin-pages-svelte) [![GitHub branch checks state](https://img.shields.io/github/checks-status/aldy505/vite-plugin-pages-svelte/master?style=flat-square)](https://github.com/aldy505/vite-plugin-pages-svelte/actions) [![CodeFactor](https://www.codefactor.io/repository/github/aldy505/vite-plugin-pages-svelte/badge)](https://www.codefactor.io/repository/github/aldy505/vite-plugin-pages-svelte) [![GitHub](https://img.shields.io/github/license/aldy505/vite-plugin-pages-svelte?style=flat-square)](https://github.com/aldy505/vite-plugin-pages-svelte/blob/master/LICENSE)

> File system based routing for Svelte applications using
> [Vite](https://github.com/vitejs/vite)

This is a kind of fork of [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages) for Vue, but if I was about to add a Svelte implementation to it, I will break a lot of things. Hence, it should be a good thing to create a new repository for it.

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

## File System Routing

Inspired by the routing from
[NuxtJS](https://nuxtjs.org/guides/features/file-system-routing) 💚

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

### Catch-all Routes

Catch-all routes are denoted with square brackets containing an ellipsis:

- `src/pages/[...all].svelte` -> `/*` (`/non-existent-page`)

The text after the ellipsis will be used both to name the route, and as the name
of the prop in which the route parameters are passed.

## Configuration

To use custom configuration, pass your options to Pages when instantiating the
plugin:

```js
// vite.config.js
import pages from 'vite-plugin-pages-svelte';

export default {
  plugins: [
    pages({
      // Defaults to src/pages
      pagesDir: 'src/views',
    }),
  ],
};
```

### pagesDir

- **Type:** `string`
- **Default:** `'src/pages'`

Relative path to the pages directory. DOES NOT supports globs.

Can be:

- single path: routes point to `/`

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
      exclude: ['.js'],
    }),
  ],
};
```

## License

MIT License © 2021 [hannoeru](https://github.com/hannoeru)
