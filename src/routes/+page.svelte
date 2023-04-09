<script>
    import Faq from "./faq.svelte";
    import Contact from "./contact.svelte";

    import {
        Navbar,
        NavBrand,
        NavLi,
        NavUl,
        NavHamburger,
    } from "flowbite-svelte";

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
        <span
            class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
        >
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
        <button on:click={create_room} id="button" style="color: azure"
            >Create</button
        >
    </form>
</div>
<h3 id="q1">What is MusicCove?</h3>
<p>
    MusicCove is a communication website designed for music lovers to connect
    and share their passion for music. Users can create profiles, join groups,
    and participate in discussions on various topics related to music. The site
    also provides a platform for musicians to showcase their talent and connect
    with fans. With MusicCove, users can discover new music, share their
    favorite songs and albums, and connect with like-minded individuals from
    around the world. Whether you're a musician, a music enthusiast, or simply
    someone who loves to connect with others through music, MusicCove is the
    perfect platform to share your passion and connect with others who share
    your interests.
</p>

<style>
    p {
        font-family: 'Alegreya', serif;
        color: azure;
        background: rgb(0, 0, 0);
        background: linear-gradient(
            0deg,
            rgba(1, 79, 125, 1) 100% rgba(0, 0, 0, 1) 0%
        );
        text-align: center;
        font-size: 20px;
    }
    h3 {
        font-family: 'Alegreya', serif;
        color: azure;
        background: rgb(0, 0, 0);
        background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 1) 0%,
            rgba(1, 70, 112, 1) 100%
        );
        text-align: center;
        font-size: 100px;
    }
    button {
        font-family: "Verdana";
    }
    div#bg {
        background-image: url("https://wallpaperaccess.com/full/1261201.jpg");
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;
    }
    
    h1 {
        font-family: 'Alegreya', serif;
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
