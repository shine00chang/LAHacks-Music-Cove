<script>
  import { fly } from 'svelte/transition';
  import GameModal from './GameModal.svelte';
  import QueueModal from './QueueModal.svelte';


  export let show = false;
  let game_modal_show = false;
  let member_modal_show = false;
  let queue_modal_show = false;

</script>

{#if show}
  <nav class="navbar-dark bg-dark" transition:fly={{x: 250, opacity: 1}}>
    <ul class="links-list">
      <li>
        <button on:click={() => {member_modal_show = true; show = false;}}>
          <p style="color: #fff;">View Members</p>
        </button>
      </li>
      <li>
        <button on:click={() => {game_modal_show = true; show = false;}}>
          <p style="color: #fff; bottom-margin: 20px">Games Menu</p>
        </button>
      </li>
      <li>
        <button on:click={() => {queue_modal_show = true; show = false;}}>
          <p style="color: #fff;">Access Queue</p>
        </button>
      </li>
    </ul>
  </nav>
{/if}

<GameModal bind:show={game_modal_show} />
<QueueModal bind:show={queue_modal_show} />
		
<style>
nav {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  padding: 2rem 1rem 0.6rem;
  border-left: 1px solid #aaa;
  overflow-y: auto;
	width: 10rem;
}

.links-list {
  margin-bottom: 20px;
}

.bg-dark {
  margin-bottom: 10px;
  display: inline
}

button {
  padding: 0;
  border: none;
  background: none;
}
</style>