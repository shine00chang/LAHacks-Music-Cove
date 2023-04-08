<script>
  import { page } from '$app/stores';
  import Start from '$lib/Start.svelte';
  export let data;
  const ROOM_NAME = data.room_name;
  let create = $page.url.searchParams.get("create") === "true";
  console.log(ROOM_NAME, create)
  let nickname = "";
  let generate = false;
</script>

<h1>Room: {ROOM_NAME}</h1>

<Start bind:nickname={nickname} bind:generate={generate}/>

{#if create}
  <script>
    //generate shared secret
    //
  </script>
{/if}
