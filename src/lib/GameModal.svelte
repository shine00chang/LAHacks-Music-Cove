<div>
  {#if show_modal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal-overlay" data-close on:click={overlay_click} transition:fade={{duration: 150}}>
      <div class="modal-container">
        <nav class="navbar navbar-expand-md navbar-dark bg-dark">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="white"
            class="bi bi-x-lg"
            viewBox="0 0 16 16"
            on:click={() => (show_modal = false)}
          >
        </nav>
        <div class="grid-container">
          <div class="game left"> 
            {#if game}
              <FlappyBird nickname={nickname} emit={emit} />
            {:else}
              <img class="flappy-bird" src="https://psmag.com/.image/c_limit%2Ccs_srgb%2Cq_auto:good%2Cw_660/MTI3NTgyMjIwOTYwNjM1MzU4/flappy-bird.webp" alt="flup brb">
              <button type="button" class="btn btn-success overlay-btn" on:click={start_flappy}>Play</button>
              <h1 class="title text">Flappy Bird</h1>
            {/if}
          </div>
          <div class="game">
            <ScoreBoard />
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<script>
import { fade } from 'svelte/transition';
import FlappyBird from '$lib/Games/FlappyBird.svelte';
import ScoreBoard from '$lib/Scoreboard.svelte';

function overlay_click(e) {
    if ('close' in e.target.dataset)
        show_modal = false;
}

const start_flappy = () => {
  game = 'flappy';
}
let game = undefined;
export let show_modal = false;
export let emit = false;
export let nickname = '';
</script>

<style>

* {
  font-family: 'Lilita One', cursive;
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.modal-container {
  position: relative;
  background-color: #ffffff;
  width: 90vw;
  margin: 1rem auto 0.2rem;
  box-shadow: 0 3px 10px #555;
}

.grid-container {
  display: flex;
  background-color: #555;
  justify-content: space-between;
  padding: 20px
}

.game {
  width: 45%;
  height: 60vh;
  padding: 10px;
  background-color: #2d2d2d;
  color: #ffffff;
}

.flappy-bird {
  width: 100%;
  height: 100%;
  opacity: 0.5;
  position: relative
}

.flappy-bird:hover {
  opacity: 0.8;
  transition: 0.5s;
}

  .left .overlay-btn {
    position: absolute;
    bottom: 5.25%; 
     
    background-color: #0c6e18;
    width: 10%;
}

.left .title {
  position: absolute;
  top: 5.25%;
  font-size: 60px;
}

.game .overlay-btn:hover {
  background-color: #085a11;
}

main {
  padding: 0.5rem;
}
</style>
