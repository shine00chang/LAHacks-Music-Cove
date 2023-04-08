<script>
    import Faq from "./faq.svelte";
    import Contact from "./contact.svelte";

    function create_room() {
        window.location =
            "/room/" +
            document.getElementById("room-name").value +
            "?create=true";
    }
    export let menu;
</script>

<svelte:head>
    <link href="/front.css" rel="stylesheet" />
</svelte:head>

<div id="bg" class="scroll">
    <ul id="menu">
        <li><a href="/" on:click|preventDefault={() => (menu = 1)}>FAQ</a></li>
        |
        <li>
            <a href="/" on:click|preventDefault={() => (menu = 2)}>Contact</a>
        </li>
    </ul>
    {#if menu === 1}
        <Faq />
    {:else if menu === 2}
        <Contact />
    {:else}{/if}
    <h1>MusicCove</h1>

    <form>
        <h2>Create Room</h2>
        <input id="room-name" type="text" placeholder="Room name..." />
        <button on:click={create_room}>Create</button>
    </form>
</div>

<style>
    div#bg {
        background-image: url("https://wallpaperaccess.com/full/1261201.jpg");
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;
    }
    ul#menu li {
        display: inline;
        text-align: left;
    }
    h1 {
        font-family: "Verdana";
        color: azure;
        height: 80px;
        align-self: center;
    }
    div.scroll {
        background-color: #fed9ff;
        width: 600px;
        height: 150px;
        overflow-x: hidden;
        overflow-y: auto;
        text-align: center;
        padding: 20px;
    }
    form {
    }
</style>
