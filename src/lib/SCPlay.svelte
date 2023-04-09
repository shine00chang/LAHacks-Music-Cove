<script>
  let soundcloud_iframe;
  export let current_soundcloud_url;
  export let next_song = false;
  $: {
    if (current_soundcloud_url.length !== 0 && soundcloud_iframe) {
      let sc_widget = SC.Widget(soundcloud_iframe);
      sc_widget.unbind(SC.Widget.Events.FINISH);
      sc_widget.bind(SC.Widget.Events.FINISH, () => {
        //signal next song in queue
        next_song = true;
      });
    }
  }
</script>

<div class="widget">
  {#if current_soundcloud_url.length !== 0}
    <iframe bind:this={soundcloud_iframe} id="sc-iframe" title="soundcloud" scrolling="no" frameborder="no" allow="autoplay" src={"https://w.soundcloud.com/player/?url="+encodeURIComponent(current_soundcloud_url)+"&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"}></iframe>
  {/if}
</div>
