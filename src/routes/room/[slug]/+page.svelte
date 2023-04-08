<script>
  //imports and exports
  import { page } from '$app/stores';
  import Start from '$lib/Start.svelte';
  import E2E from '$lib/e2e.js';
  export let data;
  //start stuff
  const ROOM_NAME = data.room_name;
  const SHARED_HASH = $page.url.searchParams.get("shared_hash");
  let create = $page.url.searchParams.get("create") === "true";
  console.log(ROOM_NAME, create)
  let nickname = "";
  //init E2E class
  let e2e;
  let generate = false;
  $: {
    if (generate) {
      e2e = new E2E(nickname);
      console.log('Init E2E')
      if (create) {
        e2e.send_create_req(ROOM_NAME);
      } else {
        e2e.send_join_req(ROOM_NAME, SHARED_HASH);
      }
    }
  }
</script>

<h1>Room: {ROOM_NAME}</h1>

<!--Modal thing that gets nickname and indicates when E2E should be init'd-->
<Start bind:nickname={nickname} bind:generate={generate}/>
