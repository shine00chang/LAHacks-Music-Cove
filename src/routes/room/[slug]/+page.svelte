<script>
  //imports and exports
  import { page } from '$app/stores';
  import Start from '$lib/Start.svelte';
  import E2E from '$lib/e2e.js';
  export let data;
  //start stuff
  const ROOM_NAME = data.room_name;
  let create = $page.url.searchParams.get("create") === "true";
  console.log(ROOM_NAME, create)
  let nickname = "";
  //init E2E class
  let e2e;
  let generate = false;
  $: {
    if (generate) {
      e2e = new E2E(nickname);
      console.log('aaa')
    }
  }
</script>

<h1>Room: {ROOM_NAME}</h1>

<Start bind:nickname={nickname} bind:generate={generate}/>

{#if create}
  <script>
    //generate shared secret
    //
  </script>
{/if}
