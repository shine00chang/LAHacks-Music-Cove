<script>
  export let nickname = "";
  export let onsubmit;
  $: {
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
	onsubmit();
  }
</script>
  <div id="start-modal" class="gradient_background">
    <div>
      <h2 class="key-title">Set Nickname</h2>
      <input class="nickname_input" bind:value={nickname} placeholder="Nickname here..."/>
      {#if can_continue}
        <div>
        <button type="button" class="btn btn-primary" style="margin-top: 100px;" on:click={close}>Continue</button>
      </div>
      {/if}
    </div>
  </div>

<style>
    * {
      font-family: 'Lilita One', cursive;
      text-align: center;
    }
    .key-title {
      text-align: center;
      color: #ededed;
      font-size: 60px;
      }

    .nickname_input {
      text-align: center;
    }

      .gradient_background {
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
        height: 100vh;
        margin: 20;
      }

      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

</style>
