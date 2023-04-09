{#if show}
<div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="modal-overlay" data-close on:click={overlay_click} transition:fade={{duration: 150}}>
    <div class="modal-container">
      <div class="grid-container">
        <div class="game left"> 
          <img class="flappy-bird" src="https://psmag.com/.image/c_limit%2Ccs_srgb%2Cq_auto:good%2Cw_660/MTI3NTgyMjIwOTYwNjM1MzU4/flappy-bird.webp" alt="flup brb">
          <button type="button" class="btn btn-success overlay-btn">Play</button>
          <h1 class="title text">Flappy Bird</h1>
        </div>
        <div class="game"><p class="text">Game 2 Option Here</p></div>
      </div>
    </div>
  </div>
</div>
{/if}

<script>
import { fade } from 'svelte/transition';

function overlay_click(e) {
    if ('close' in e.target.dataset)
        show = false;
}

export let show = false;
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