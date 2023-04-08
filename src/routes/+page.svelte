<script>
  function create_room() {
    window.location = "/room/"+document.getElementById("room-name").value+"?create=true";
  }
</script>

<h1>MusicCove</h1>

<form>
  <h2>Create Room</h2>
  <input id="room-name" type="text" placeholder="Room name..."/>
  <button on:click={create_room}>Create</button>
</form>
