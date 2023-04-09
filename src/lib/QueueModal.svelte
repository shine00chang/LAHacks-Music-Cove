{#if show}
<div>
  <div class="modal-overlay" data-close on:click={overlay_click} transition:fade={{duration: 150}}>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">

      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-x-lg" viewBox="0 0 16 16" on:click={() => show = false}>
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
      </svg>

    <div class="ml-auto order-0">
        <a class="navbar-brand mr-auto" href="#">Queue</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
            <span class="navbar-toggler-icon"></span>
        </button>
    </div>
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

      <div class= "right-container"style="float:right; margin-right: 20px; justify-content: right">
                <span style="float:left; margin-left: 20px; margin-top: 10px"><strong>Add New Song: </strong></span>
                <span style="float:right; margin-right: 20px; margin-top: 10px">
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-plus-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                  </button>
                </span>

                <form action="#" method="GET">
                  <textarea rows="5" cols="50" name="text" placeholder="Enter Soundcloud URL"></textarea>
                  <br/>
                  <input type="submit" value="Add New Song"/>
                </form>
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
  width: 100%;
  height: 100%
}
.modal-container {
  position: relative;
  background-color: #ffffff;
  width: 100%;
  max-height: 60vh;
  margin: 1rem auto 0.2rem;
  box-shadow: 0 3px 10px #555;
  overflow-x: hidden;
  margin-top: 5%;
}

.queue-container {
  width: 100%;
  height: 90%;
  padding: 5px;
  background-color: #2d2d2d;
  color: #ffffff;
  overflow-x: hidden;
  align-content: center;
}
main {
  padding: 0.5rem;
}

.right-container {
  border-radius: 25px;
  background: #484947;
  width: 23%;
  height: 85vh;
  margin-top: 10px;
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