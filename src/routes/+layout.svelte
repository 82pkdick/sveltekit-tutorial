<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { page, navigating, updated } from "$app/state";

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

  {#if navigating.to}
    <span class="navigating">navigating to {navigating.to.url.pathname}</span>
  {/if}

  <a
    href="/expected"
    aria-current={page.url.pathname === "/expected" ? true : false}
    >expected error</a
  >
  <a
    href="/unexpected"
    aria-current={page.url.pathname === "/unexpected" ? true : false}
    >unexpected error</a
  >
</nav>

{@render children?.()}

{#if updated.current}
  <div class="toast">
    <p>
      A new version of the app is available

      <button onclick={() => location.reload()}> reload the page </button>
    </p>
  </div>
{/if}

<style lang="scss">
  a[aria-current="true"] {
    color: maroon;
  }

  .navigating {
    color: dodgerblue;
  }
</style>
