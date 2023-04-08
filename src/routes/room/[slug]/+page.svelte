<script>
  //imports and exports
  import { page } from "$app/stores";
  import Start from "$lib/Start.svelte";
  import SCPlay from "$lib/SCPlay.svelte";
  import E2E from "$lib/e2e.js";
  export let data;

  // Fetch query params 
  const ROOM_NAME 	= data.room_name;
  const SHARED_HASH = $page.url.searchParams.get("shared_hash");
  const create 		= $page.url.searchParams.get("create") === "true";
  console.log(ROOM_NAME, create);

  // Binded Vars
  let nickname = "";
  //init E2E class
  let e2e;
  let generate = false;
  let in_room = false;
  $: {
    if (generate) {
      e2e = new E2E(nickname);
      if (create) 
		e2e.send_create_req(ROOM_NAME, () => in_room = true ) 
      else
		e2e.send_join_req(ROOM_NAME, SHARED_HASH, () => in_room = true); 
    }
  }
</script>

<h1>Room: {ROOM_NAME}</h1>

<!--Modal thing that gets nickname and indicates when E2E should be init'd-->
<Start bind:nickname bind:generate />
