<script>
    import Faq from "./faq.svelte";
    import Contact from "./contact.svelte";
  function create_room() {
    window.location = "/room/"+document.getElementById("room-name").value+"?create=true";
  }
  export let menu;
</script>
<body>
<ul id="menu">
	<li><a href="/" on:click|preventDefault={() => (menu = 1)}>FAQ</a></li> |
	<li><a href="/" on:click|preventDefault={() => (menu = 2)}>Contact</a></li>
</ul>
{#if menu === 1}
<Faq/>
{:else if menu === 2}
<Contact />
{:else}

{/if}
<h1>MusicCove</h1>

<form>
  <h2>Create Room</h2>
  <input id="room-name" type="text" placeholder="Room name..."/>
  <button on:click={create_room}>Create</button>
</form>
</body>
<style>
    body{
		background: rgb(2,0,36);
		background: linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(9,102,121,1) 15%, rgba(0,212,255,1) 100%);
    }
    ul#menu li{
		display : inline;
	}
    h1 {
        background-color: rgba(0, 0, 0, 0.8);
        font: "Comic Sans";
        height: 80px;
        align-self: center;
    }
</style>