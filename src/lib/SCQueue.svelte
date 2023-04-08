<script>
  export let queue;
</script>

<div class="widget">
  {#each queue as q_item}
    <div class="sc-queue-item">
      <h2><a href={q_item.url} target="_blank">{q_item.song_info.title}</a></h2>
    </div>
  {/each}
</div>
