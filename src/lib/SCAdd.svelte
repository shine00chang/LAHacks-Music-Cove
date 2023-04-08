<script>
  async function get_song_info(url) {
    let resp = await fetch("https://soundcloud.com/oembed?format=json&url="+encodeURIComponent(url));
    resp = await resp.json();
    return {
      title: resp.title,
      author: resp.author_name,
      description: resp.description
    }
  }
</script>

<div class="widget">
  <!--placeholder-->
</div>
