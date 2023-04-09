<svelte:head>
  <script src="./../../sc_api.js"/>
</svelte:head>

<script>
  //imports and exports
  import Navbar from "$lib/Navbar.svelte";
  import Sidebar from "$lib/Sidebar.svelte";
  let open = false;

  import { page } from '$app/stores';
  import Start from '$lib/Start.svelte';
  import E2E from '$lib/e2e.js';
  export let data;

  //start stuff
  const ROOM_NAME = data.room_name;
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

<!--Modal thing that gets nickname and indicates when E2E should be init'd-->
<Start bind:nickname={nickname} bind:generate={generate}/>

{#if in_room}
  <!--If user has the secret key, show them all the components -->
  <Navbar room_name={ROOM_NAME} bind:sidebar_open={open}/>
  <Sidebar bind:show={open} />

{:else if generate}
  <!--Show them waiting for approval-->
  <h1>Room: {ROOM_NAME}</h1>
  <h2>Waiting for Approval...</h2>
{/if}
