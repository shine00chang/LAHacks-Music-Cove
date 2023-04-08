<script>
  export let current_soundcloud_url;
</script>

<div>
  {#if current_soundcloud_url.length !== 0}
    <iframe scrolling="no" frameborder="no" allow="autoplay" src={"https://w.soundcloud.com/player/?url="+encodeURIComponent(current_soundcloud_url)+"&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"}></iframe>
  {/if}
</div>
