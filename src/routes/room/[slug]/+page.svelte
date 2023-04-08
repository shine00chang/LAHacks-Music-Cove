<script>
  //imports and exports
  import { page } from "$app/stores";
  import Start from "$lib/Start.svelte";
  import E2E from "$lib/e2e.js";
  export let data;

  // Fetch query params 
  const ROOM_NAME 	= data.room_name;
  const SHARED_HASH = $page.url.searchParams.get("shared_hash");
  const create 		= $page.url.searchParams.get("create") === "true";
  console.log(ROOM_NAME, create);

  // Binded Vars
  let nickname = "";
  
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

<svelte:head>
  <link href="../../rooms.css" rel="stylesheet" />
</svelte:head>

<h1>Room: {ROOM_NAME}</h1>

<!--Modal thing that gets nickname and indicates when E2E should be init'd-->
<Start bind:nickname bind:generate />

{#if in_room}
  <!--If user has the secret key, show them all the components -->
  <h2>YOU IN DA ROOM</h2>
{:else if generate }
  <!--Show them waiting for approval-->
  <h2>Waiting for Approval...</h2>
{/if}
