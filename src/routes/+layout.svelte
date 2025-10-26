<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { page } from "$app/state";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<nav>
  <a href="/" aria-current={page.url.pathname === "/" ? true : false}> home </a>

  <a href="/about" aria-current={page.url.pathname === "/about" ? true : false}>
    about
  </a>

  <a href="/the-good-place" aria-current={page.url.pathname === "/the-good-place" ? true : false}>the good place</a>

  <a href="/the-bad-place" aria-current={page.url.pathname === "/the-bad-place" ? true : false}>the good place</a>
</nav>

{@render children?.()}

<style lang="scss">
  a[aria-current="true"] {
    color: maroon;
  }
</style>
