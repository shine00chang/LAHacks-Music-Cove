<script>
  //imports and exports
  import { page } from "$app/stores";
  import Start from "$lib/Start.svelte";
  import SCPlay from "$lib/SCPlay.svelte";
  import E2E from "$lib/e2e.js";
  export let data;
  //start stuff
  const ROOM_NAME = data.room_name;
  const SHARED_HASH = $page.url.searchParams.get("shared_hash");
  let create = $page.url.searchParams.get("create") === "true";
  console.log(ROOM_NAME, create);
  let nickname = "";
  //init E2E class
  let in_room = false;
  let e2e;
  $: {
    if (e2e) {
      if (e2e.keys.shared) {
        in_room = true;
      }
    }
  }
  let generate = false;
  $: {
    if (generate) {
      e2e = new E2E(nickname);
      console.log("Init E2E");
      if (create) {
        e2e.send_create_req(ROOM_NAME);
      } else {
        e2e.send_join_req(ROOM_NAME, SHARED_HASH);
      }
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
  <SCPlay current_soundcloud_url="https://soundcloud.com/7opi5oei5fbj/summer-slack"/>
{:else if generate}
  <!--Show them waiting for approval-->
  <h2>Waiting for Approval...</h2>
{/if}
