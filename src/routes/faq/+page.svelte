<script>
    import {
        Navbar,
        NavBrand,
        NavLi,
        NavUl,
        NavHamburger,
    } from "flowbite-svelte";

    import {
        Footer,
        FooterCopyright,
        FooterLinkGroup,
        FooterLink,
    } from "flowbite-svelte";
    import { DarkMode } from "flowbite-svelte";
</script>

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
            href="https://github.com/PaddingProductions/LAHacks-Music-Cove"
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
<div style="font-family: Lilita One" class="text-center text-blue-600 dark:text-white"> 
<div style="font-size: 10rem">FAQ</div>
<div class="text-5xl">How old is Shine Chang?</div>
<div class="text-3xl">
    Shine Chang is an itty bitty boy from the lands of America who loves to code
    and play badminton. He is about ten years old and loves everyone.
</div>
<br>
<div class="text-5xl">How old is Taisei?</div>
<div class="text-3xl">
  Taisei is a seasoned full-stack developer who works at Tinovation and is very smart.
</div>
</div> 

<Footer>
    <FooterCopyright href="/" by="MusicCove™" year={2023} />
    <FooterLinkGroup
        ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0"
    >
        <FooterLink href="/">About</FooterLink>
        <FooterLink href="/">Privacy Policy</FooterLink>
        <FooterLink href="/">Licensing</FooterLink>
        <FooterLink href="/">Contact</FooterLink>
    </FooterLinkGroup>
</Footer>

<style>
    h1 {
        font-family: "Lilita One";
        color: azure;
        font-size: 175px;
        height: 250px;
        text-align: center;
    }
    h2 {
        font-family: "Lilita One";
        color: azure;
        text-align: center;
        font-size: 60px;
    }
    p {
        font-family: "Alegreya", serif;
        color: azure;
        text-align: center;
        font-size: 20px;
    }
</style>
