<script>
  let sc_q_url = "";
  $: {
    //remove query params
    sc_q_url = sc_q_url.split("?")[0].toLowerCase().trim();
  }
  async function get_song_info(url) {
    let resp = await fetch("https://soundcloud.com/oembed?format=json&url="+encodeURIComponent(url));
    resp = await resp.json();
    return {
      title: resp.title,
      author: resp.author_name,
      description: resp.description
    }
  }
  let error = false;
  async function add_song_to_queue() {
    if (!sc_q_url.startsWith("https://soundcloud.com")) {
      error = "Invalid soundcloud url! It must start with https://soundcloud.com";
      return;
    }
    let song_info = await get_song_info(sc_q_url);
    //todo: send e2e message adding to queue
  }
</script>

<div class="widget">
  <!--placeholder-->
  <form>
    {#if error}
      <p class="error">{error}</p>
    {/if}
    <input bind:value={sc_q_url} placeholder="Soundcloud url of song..."/>
    <button on:click={add_song_to_queue}>Add Song to Queue</button>
  </form>
</div>
