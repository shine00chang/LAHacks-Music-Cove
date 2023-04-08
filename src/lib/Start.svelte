<script>
  let nickname = "";
  let generated = false;
  //gen private key
  function gen_priv() {
    //
    generated = true;
  }
</script>

<div id="start-modal">
  <div>
    <span arial-label="Close">x</span>
    <input bind:value={nickname} placeholder="Nickname here..."/>
    <h2>Generate New Private Key</h2>
    {#if generated}
      <span id="priv-key"></span><button>Copy</button>
    {:else}
      <button on:click={gen_priv}>Generate</button>
    {/if}
  </div>
</div>
