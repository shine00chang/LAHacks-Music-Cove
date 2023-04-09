{#if show}
<div>
  <div class="modal-overlay" data-close on:click={overlay_click} transition:fade={{duration: 150}}>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <h2 style="color:#fff; font-size: 30px">Queue</h2>
    </nav>

    <div class="queue-container">

      <div style="float:left; width: 70%; margin-right: 5%">
          <div style="overflow-x: hidden">
              {#each current_queue as song}
                  <div class="queue-element" style="margin-right: 0px;">
                    <span style="float:left; margin-left: 30px; margin-top: 10px">{song}</span> 
                    <span style="float:right; margin-right: 30px; margin-top: 10px">
                      <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-dash-circle" viewBox="0 0 16 16" on:click = {() => removeSong(song)}>
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                          <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                        </svg>
                      </button>
                    </span>
                  </div>
              {/each}
          </div>
      </div>

      <div style="float:right">
          <div class="queue-element">
                <span style="float:left; margin-left: 20px; margin-top: 10px"><strong>Add New Song: </strong></span>
                <span style="float:center; margin-left: 10px; margin-right: 10px; margin-top: 10px" on:submit={() => addSong("huh")}></span>
                <span style="float:right; margin-right: 20px; margin-top: 10px">
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-plus-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                  </button>
                </span>
          </div>
      </div>
  </div>
  </div>
</div>
{/if}

<script>
import { fade } from 'svelte/transition';

export let current_queue;

function overlay_click(e) {
    if ('close' in e.target.dataset)
        show = false;
}

function removeSong(title) {
  const x = current_queue.splice(current_queue.indexOf(title), 1);
  current_queue = current_queue;
}

function addSong(title) {

}

export let show = false;
</script>

<style>
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-x: hidden;
}
.modal-container {
  position: relative;
  background-color: #ffffff;
  width: 90vw;
  margin: 1rem auto 0.2rem;
  box-shadow: 0 3px 10px #555;
  overflow-x: hidden;
}

.queue-container {
  width: 90%;
  height: 60vh;
  padding: 5px;
  background-color: #2d2d2d;
  color: #ffffff;
  overflow-x: hidden
}
main {
  padding: 0.5rem;
}

.queue-element {
  border-radius: 25px;
  background: #484947;
  margin: 10px;
  width: 100%;
  height: 40px;
  align-items: center;
  overflow-x: hidden
}
</style>