<script>
  export let game = 'flappy';
  let board = [];
  document.addEventListener('score', event => {
    const data = event.detail.data;
    if (data.game != game) {
      console.log("wrong game!");
      return;
    }
    board = [...board, {author: data.author, score: data.score}].sort((a, b) => a.score < b.score ? 1 : -1);
  });
</script>

<div>
  <p class="h6"> Leaderboard: </p> 
  {#each board as entry, i}
    <div><strong>{i+1}</strong> - <em>{entry.author}</em> | {entry.score}</div>
  {/each}
</div>
