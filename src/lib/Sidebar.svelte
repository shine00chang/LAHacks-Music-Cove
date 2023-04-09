<script>
  import { fly } from 'svelte/transition';
  import GameModal from './GameModal.svelte';
  import QueueModal from './QueueModal.svelte';

  export let nickname;
  export let emit;

  export let current_queue;

  export let show = false;
  let game_modal_show = false;
  let member_modal_show = false;
  let queue_modal_show = false;

</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<GameModal bind:show_modal={game_modal_show} nickname={nickname} emit={emit}/>
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
        <button on:click={() => {queue_modal_show = true; show = false;}} style="color: white">
          <p style="color: #fff; bottom-margin: 20px">Access Queue</p>
        </button>
      </li>
    </ul>
  </nav>
{/if}

<QueueModal bind:show={queue_modal_show} bind:current_queue {emit} {nickname} />
		
<style>
nav {
  position: fixed; 
  z-index: 100;
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

span svg {
  fill: #3b5998;
  height: 1em;
  vertical-align: bottom; /* ADDED */
}
</style>
