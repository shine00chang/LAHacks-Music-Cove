<script>
    import Faq from "./faq.svelte";
    import Contact from "./contact.svelte";
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'

    function create_room() {
        window.location =
            "/room/" +
            document.getElementById("room-name").value +
            "?create=true";
    }
</script>

<Navbar let:hidden let:toggle rounded color="form">
    <NavBrand href="/">
      <img
        src="https://cdn.discordapp.com/attachments/1088612557008420864/1094393611543662702/image.png"
        class="mr-3 h-6 sm:h-9"
        alt="M Logo"
      />
      <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
        MusicCove
      </span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
      <NavLi href="/" active={true}>Home</NavLi>
      <NavLi href="/faq">FAQ</NavLi>
      <NavLi href="/contact">Contact</NavLi>
    </NavUl>
  </Navbar>
<svelte:head>
    <link href="/front.css" rel="stylesheet" />
</svelte:head>

<div id="bg" class="scroll">
    <h1>MusicCove</h1>

    <form>
        <input id="room-name" type="text" placeholder="Room name..." />
        <button on:click={create_room} style="color: azure">Create</button>
    </form>
</div>

<style>
    div#bg {
        background-image: url("https://wallpaperaccess.com/full/1261201.jpg");
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;
    }
    h1 {
        font-family: "Verdana";
        color: azure;
        font-size: 50px;
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
