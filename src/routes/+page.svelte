<script>
    import {
        Navbar,
        NavBrand,
        NavLi,
        NavUl,
        NavHamburger,
    } from "flowbite-svelte";
    import { DarkMode } from "flowbite-svelte";
    
    function create_room() {
        window.location =
            "/room/" +
            document.getElementById("room-name").value +
            "?create=true";
    }
</script>


<hr>
/#{$location}
<Navbar let:hidden let:toggle rounded color="form" class="text-2xl">
    <NavBrand href="/">
        <img
            src="https://media.discordapp.net/attachments/1088612557008420864/1094405030683082812/bettericon.png?width=428&height=412"
            class="mr-3 h-6 sm:h-9"
            alt="M Logo"
        />
        <span
            style="font-family: Lilita One"
            class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
        >
            MusicCove
        </span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
        <NavLi
            style="font-family: Lilita One"
            href="/"
            active={true}
            class="text-2xl mr-3 h-6 sm:h-9">Home</NavLi
        >
        <NavLi
            style="font-family: Lilita One"
            href="/faq"
            class="text-2xl mr-3 h-6 sm:h-9">FAQ</NavLi
        >
        <NavLi
            style="font-family: Lilita One"
            href="/contact"
            class="text-2xl mr-3 h-6 sm:h-9">Contact</NavLi
        >
        <NavLi
            style="font-family: Lilita One"
            href="https://github.com/downloadablecontent/LAHacks-Music-Cove"
            class="text-2xl mr-3 h-6 sm:h-2">Github</NavLi
        >
        <DarkMode class="text-2xl mr-3 h-6 sm:h-9">
            <svelte:fragment slot="lightIcon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 32 32"
                    ><path
                        fill="currentColor"
                        d="M13.502 5.414a15.075 15.075 0 0 0 11.594 18.194a11.113 11.113 0 0 1-7.975 3.39c-.138 0-.278.005-.418 0a11.094 11.094 0 0 1-3.2-21.584M14.98 3a1.002 1.002 0 0 0-.175.016a13.096 13.096 0 0 0 1.825 25.981c.164.006.328 0 .49 0a13.072 13.072 0 0 0 10.703-5.555a1.01 1.01 0 0 0-.783-1.565A13.08 13.08 0 0 1 15.89 4.38A1.015 1.015 0 0 0 14.98 3Z"
                    /></svg
                >
            </svelte:fragment>
            <svelte:fragment slot="darkIcon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 32 32"
                    ><path
                        fill="currentColor"
                        d="M16 12.005a4 4 0 1 1-4 4a4.005 4.005 0 0 1 4-4m0-2a6 6 0 1 0 6 6a6 6 0 0 0-6-6ZM5.394 6.813L6.81 5.399l3.505 3.506L8.9 10.319zM2 15.005h5v2H2zm3.394 10.193L8.9 21.692l1.414 1.414l-3.505 3.506zM15 25.005h2v5h-2zm6.687-1.9l1.414-1.414l3.506 3.506l-1.414 1.414zm3.313-8.1h5v2h-5zm-3.313-6.101l3.506-3.506l1.414 1.414l-3.506 3.506zM15 2.005h2v5h-2z"
                    /></svg
                >
            </svelte:fragment>
        </DarkMode>
    </NavUl>
</Navbar>
<svelte:head>
    <title>MusicCove</title>
    <link href="/front.css" rel="stylesheet" />
    <link
        href="https://fonts.googleapis.com/css?family=Lilita+One"
        rel="stylesheet"
    />
    <meta
        http-equiv="Onion-Location"
        content="http://eecflincupi352qlelnar7ahghmhrmiqil4p5cwjwimidsrwqxtlhbyd.onion"
    />
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
        MusicCove is ultra private, ultra secure and ultra easy to use. Using
        our homegrown end to end encryption (e2e) protocol, people can hang out
        in virtual rooms and just hang out - chatting and playing games or music
        - all while knowing that their privacy is protected. Unlike other sites,
        MusicCove's e2e protocol makes it so no one, except those in the room
        with you, can decrypt your messages. Not even the server! And since's
        this is all open source, and has a TOR instance, users can easily
        further secure their privacy by using the TOR site or running their own
        backend server. While the protocol is original, we obviously used an
        audited cryptography library for the cryptography primitives. Even
        better, the interface and protocol is made so, you, the user, don't need
        to have any technical knowledge, while still remaining completely
        private and secure.
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
        font-family: "Alegreya", serif;
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
        background-color: #4caf50; /* Green */
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
        /* override for above 5vh padding bottom, above needed as backup */
        padding-bottom: max(9vh, 35px);
        background: rgb(0, 0, 0);
        background: linear-gradient(0deg, rgb(22, 22, 22) 0%, #024671 100%);
    }
</style>
