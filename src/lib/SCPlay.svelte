<script>
  let soundcloud_iframe;
  export let play_next;
  export let current_soundcloud_url;
  /*
  import { onMount } from "svelte";
  onMount(function() {
    console.log("RELOAD", current_soundcloud_url)
    let sc_widget = SC.Widget(soundcloud_iframe);
    sc_widget.bind(SC.Widget.Events.FINISH, () => {
      console.log("SONG FINISHED!")
      //signal next song in queue
      play_next();
    });
  });
  */
  setInterval(function() {
    console.log("RELOAD", current_soundcloud_url)
    let sc_widget = SC.Widget(soundcloud_iframe);
    sc_widget.getDuration(function (duration) {
      sc_widget.getPosition(function (position) {
        console.log(duration, position)
        if (duration-position < 2000) {
          play_next();
        }
      });
    });
  }, 2000);
</script>

<div class="widget">
  <iframe bind:this={soundcloud_iframe} id="sc-iframe" title="soundcloud" scrolling="no" frameborder="no" allow="autoplay" src={"https://w.soundcloud.com/player/?url="+encodeURIComponent(current_soundcloud_url)+"&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"}></iframe>
  {#if current_soundcloud_url.length == 0}
    <p>Nothing to play! Click the cog and go to queue to add a song to the queue.</p>
  {/if}
</div>
