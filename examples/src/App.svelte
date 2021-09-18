<script>
  import Router from 'svelte-spa-router';
  import routes from 'virtual:generated-pages-svelte';
  console.log(routes)
</script>

<h2><strong>This text is from the entry point</strong></h2>
<Router {routes} />