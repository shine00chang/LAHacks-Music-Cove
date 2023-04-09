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
        src="https://media.discordapp.net/attachments/1088612557008420864/1094405030683082812/bettericon.png?width=428&height=412"
        class="mr-3 h-6 sm:h-9"
        alt="M Logo"
      />
      <span style="font-family: Lilita One" class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
        MusicCove
      </span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
      <NavLi style="font-family: Lilita One" href="/" active={true}>Home</NavLi>
      <NavLi style="font-family: Lilita One" href="/faq">FAQ</NavLi>
      <NavLi style="font-family: Lilita One" href="/contact">Contact</NavLi>
    </NavUl>
  </Navbar>
<svelte:head>
    <title>MusicCove</title>
    <link href="/front.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css?family=Lilita+One" rel="stylesheet"/>
    <meta http-equiv="Onion-Location" content="http://eecflincupi352qlelnar7ahghmhrmiqil4p5cwjwimidsrwqxtlhbyd.onion">
</svelte:head>

<div id="bg" class="scroll">
    <h1>MusicCove</h1>

    <form>
        <input id="room-name" type="text" placeholder="Room name..." />
        <button on:click={create_room} style="color: azure">Create</button>
    </form>
</div>
<div id="what-is">
    <h2 id="q1">What is MusicCove?</h2>
    <p>
        MusicCove is ultra private, ultra secure and ultra easy to use.
        Using our homegrown end to end encryption (e2e) protocol, people can hang out in virtual rooms and just hang out - chatting and playing games or music - all while knowing that their privacy is protected.
        Unlike other sites, MusicCove's e2e protocol makes it so no one, except those in the room with you, can decrypt your messages. Not even the server!
        And since's this is all open source, and has a TOR instance, users can easily further secure their privacy by using the TOR site or running their own backend server.
        While the protocol is original, we obviously used an audited cryptography library for the cryptography primitives.
        Even better, the interface and protocol is made so, you, the user, don't need to have any technical knowledge, while still remaining completely private and secure.
    </p>
</div>

<style>
    input {
        border-radius: 25px;
        border: 2px solid rgb(0, 125, 153);
        padding: 20px; 
        width: 200px;
        height: 15px; 
    }
    p {
        font-family: 'Alegreya', serif;
        color: azure;
        text-align: center;
        font-size: 20px;
    }
    h2 {
        font-family: "Lilita One";
        color: azure;
        text-align: center;
        font-size: 75px;
    }
    button {
        background-color: #4CAF50; /* Green */
        border-radius: 25px;
        border: 2px;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
    }
    div#bg {
        background-image: url("https://wallpaperaccess.com/full/1261201.jpg");
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;
    }
    
    h1 {
        font-family: "Lilita One";
        color: azure;
        font-size: 175px;
        height: 250px;
        align-self: center;
    }
    
    div.scroll {
        background-color: #fed9ff;
        width: 500px;
        height: 150px;
        overflow-x: hidden;
        overflow-y: auto;
        text-align: center;
        padding: 20px;
    }
    #what-is {
        padding: 0 5vw 5vh 5vw;
        padding-bottom: 5vh;
        background: rgb(0, 0, 0);
        background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 1) 0%,
            rgba(1, 80, 123, 1) 100%
        );
    }
</style>
