<script lang="ts">
  import { page } from "$app/state";
  import { emojis } from "./emojis.js";
  import type { Emoji } from "./emojis.js";

  const emojisObj: Emoji = emojis;
</script>

<h1>{page.status} : {page.error?.message}</h1>
<span style="font-size: 10em;">
  {emojisObj[page.status] ?? emojis[500]}
</span>
