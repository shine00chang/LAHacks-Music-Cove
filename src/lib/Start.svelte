<script>
  export let nickname = "";
  export let generate = false;
  $: {
    console.log('e')
    nickname = nickname.trim();
    if (nickname.length !== 0) {
      can_continue = true;
    } else {
      can_continue = false;
    }
  }
  let can_continue = false;
  function close() {
    document.getElementById("start-modal").style.display = "none";
    console.log(nickname);
    generate = true;
  }
</script>

<div id="start-modal">
  <div>
    <h2>Set Nickname</h2>
    <input bind:value={nickname} placeholder="Nickname here..."/>
    {#if can_continue}
      <button on:click={close}>Continue</button>
    {/if}
  </div>
</div>

<style>
</style>
