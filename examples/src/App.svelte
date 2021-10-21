<script lang="ts">
  import { Router } from 'svelte-router-spa';
  // import Contact from './pages/contact.svelte';
  // import Index from './pages/index.svelte';
  // import ProjectIndex from './pages/[projects]/index.svelte'
  // import ProjectSlug from './pages/[projects]/[slug].svelte'
  // const routes = [
  //   {
  //     name: '/',
  //     component: Index,
  //   },
  //   {
  //     name: '/contact',
  //     component: Contact
  //   },
  //   {
  //     name: '/projects',
  //     nestedRoutes: [
  //       {
  //         name: 'index',
  //         component: ProjectIndex,
  //       },
  //       {
  //         name: '/:slug',
  //         component: ProjectSlug
  //       },
  //     ]
  //   }
  // ]
  import routes from 'virtual:generated-pages-svelte';
</script>

<h2><strong>This text is from the entry point</strong></h2>
<Router {routes} />