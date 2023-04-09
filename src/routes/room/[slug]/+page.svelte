<script>
  //imports and exports
  import Navbar from "$lib/Navbar.svelte";
  import Sidebar from "$lib/Sidebar.svelte";
  let open = false;

  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Start from "$lib/Start.svelte";
  import Approve from "$lib/Approve.svelte";
  import SCPlay from "$lib/SCPlay.svelte";
  import Chat from "$lib/Chat.svelte";
  import io from "socket.io-client";
  import nacl from "tweetnacl";

  export let data;

  // Fetch query params
  const WS_URL = "ws://localhost:8080";
  const ROOM_NAME = data.room_name;
  const SHARED_HASH = $page.url.searchParams.get("shared_hash");
  const create = $page.url.searchParams.get("create") === "true";
  console.log(ROOM_NAME, create);

  let share_room_url;
  $: {
    if (share_room_url) {
      alert(`Share the url "${share_room_url}"`);
    }
  }

  function utoh(u) {
    let hex = "";
    u.forEach((i) => (hex += i.toString(16).padStart(2, "0")));
    return hex;
  }

  function htou(h) {
    const u = new Uint8Array(h.length / 2);
    for (let i = 0; i < h.length; i += 2)
      u[i / 2] = parseInt(h.slice(i, i + 2), 16);
    return u;
  }

  function otou(o) {
    return new TextEncoder().encode(JSON.stringify(o));
  }

  function utoo(u) {
    return JSON.parse(new TextDecoder("utf-8").decode(u));
  }

  function gen_nonce() {
    return nacl.randomBytes(24);
  }

  // Binded Vars
  let socket = io(WS_URL);
  let nickname = "";
  let requests = [];
  let waiting = false;
  let nick_table = {};
  const keys = { shared: undefined, box: {}, sign: {} };

  {
    const boxK = nacl.box.keyPair();
    keys.box.pub = utoh(boxK.publicKey);
    keys.box.pri = utoh(boxK.secretKey);

    const signK = nacl.sign.keyPair();
    keys.sign.pub = utoh(signK.publicKey);
    keys.sign.pri = utoh(signK.secretKey);
  }

  const send_create_req = () => {
    waiting = true;
    console.log("'Create Room' Request sent");

    // Send request
    const msg = { hdr: { rid: ROOM_NAME } };
    socket.emit("room-create-req", msg);

    // Callbacks
    const timeout = setTimeout(() => {
      console.log("timed out");
      alert("time out");
      socket.off("room-create-rsp");
    }, 10000);

    socket.once("room-create-rsp", async (msg) => {
      if (!msg.hdr.approved) return console.error("room creation rejected");

      //generate 32 bytes shared key for secret key encryption
      keys.shared = utoh(nacl.randomBytes(32));
      keys.hashed_shared = utoh(new Uint8Array(await crypto.subtle.digest("SHA-256", htou(keys.shared).buffer)));
      share_room_url = `${$page.url.origin}/room/${ROOM_NAME}?shared_hash=${keys.hashed_shared}`;
      console.log(share_room_url)
      console.log("room created");
      nick_table[keys.sign.pub] = nickname;
      on_sock_start();
      clearTimeout(timeout);
    });
  };

  const send_join_req = (hash) => {
    waiting = true;
    console.log("'Join Room' Request sent");

    // Send Box key, rid, nick
    const msg = {
      hdr: {
        rid: ROOM_NAME,
        boxK: keys.box.pub,
        signK: keys.sign.pub,
        nick: nickname,
      },
    };
    socket.emit("room-join-req", msg);
    const timeout = setTimeout(() => {
      console.log("timed out");
      alert("timed out");
      socket.off("room-join-rsp");
    }, 10000);
    socket.once("room-join-rsp", async (msg) => {
      console.log("join response: ", msg);
      if (!msg.hdr.approved) return console.error("request rejected");

      // NaCl decrypt.
      const peer_boxK = msg.hdr.boxK;
      const nonce = msg.hdr.nonce;
      const box = msg.data;
      const plain = nacl.box.open(
        htou(box),
        htou(nonce),
        htou(peer_boxK),
        htou(keys.box.pri)
      );
      const data = utoo(plain);
      nick_table = data.nick_table;
      let shared_secret_hash = utoh(new Uint8Array(await crypto.subtle.digest("SHA-256", htou(data.shared_secret).buffer)));
      if (shared_secret_hash !== SHARED_HASH) return console.error("SECRET KEY HASHES DO NOT MATCH");
      keys.shared = data.shared_secret;
      keys.hashed_shared = shared_secret_hash;
      console.log("shared key: ", keys.shared);

      on_sock_start();
      clearTimeout(timeout);
    });
  };

  const send = (hdr, data) => {
    if (keys.shared === undefined)
      return console.error("Shared key not set, cannot ecrypt.");

    const plain = otou(data);
    const signed = nacl.sign(plain, htou(keys.sign.pri));
    const nonce = utoh(nacl.randomBytes(24));
    const secbox = nacl.secretbox(signed, htou(nonce), htou(keys.shared));
    hdr.signK = keys.sign.pub;
    hdr.nonce = nonce;
    hdr.rid = ROOM_NAME;
    const msg = {
      hdr: hdr,
      data: utoh(secbox),
    };
    console.log("emitting message: ", msg);
    socket.emit("msg", msg);
  };

  const onMsg = (msg) => {
    const signK = msg.hdr.signK;
    const nonce = msg.hdr.nonce;
    const author = nick_table[signK];

    // NaCl decryption & signature verification
    const enc = htou(msg.data);
    const signed = nacl.secretbox.open(enc, htou(nonce), htou(keys.shared));
    const plain = nacl.sign.open(signed, htou(signK));
    const data = utoo(plain);
    if (data === null) return console.error("signature validation failed!");

    const event = new CustomEvent(data.event, {
      detail: {
        hdr: msg.hdr,
        data: data,
      },
    });
    console.log("received message, emitting event: ", event);
    document.dispatchEvent(event);
  };

  const on_sock_start = () => {
    socket.on("msg", onMsg);
    socket.on("room-join-req", (msg) => {
      console.log("room-join-req received", msg);

      // Extract Peer Info
      const nick = msg.hdr.nick;
      const peer_boxK = msg.hdr.boxK;
      const peer_signK = msg.hdr.signK;

      if (requests.find((item) => item.public_key === peer_boxK))
        return console.log("Request already pending");

      // Construct approval CB
      const cb = (approved) => {
        //remove from requests once approved/declined
        requests = requests.filter((item) => item.public_key !== peer_boxK);
        // If rejected, send plain header
        if (!approved)
          return socket.emit("room-join-rsp", {
            hdr: { rid: ROOM_NAME, approved: false },
          });

        // Add to table.
        nick_table[peer_signK] = nick;

        // Send table & key
        const nonce = utoh(gen_nonce());
        const hdr = {
          rid: ROOM_NAME,
          approved: true,
          boxK: keys.box.pub,
          nonce: nonce,
        };
        const data = { nick_table: nick_table, shared_secret: keys.shared };

        const msg = {
          hdr: hdr,
          data: utoh(
            nacl.box(
              otou(data),
              htou(nonce),
              htou(peer_boxK),
              htou(keys.box.pri)
            )
          ),
        };
        console.log("room-join-rsp: ", msg);
        socket.emit("room-join-rsp", msg);
      };
      // Store Info:CB pair into list
      requests = [
        ...requests,
        { nick: nick, public_key: peer_boxK, approve_callback: cb },
      ];
    });
  };

  let next_song;
  $: {
    //
  }
</script>

<svelte:head>
  <script src="./../../sc_api.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</svelte:head>

<!--Modal thing that gets nickname and indicates when E2E should be init'd-->


<!--This code is kinda repeated in around 20 lines from now, sorry! but itt was for good reason -taisei -->
{#if keys.shared !== undefined}
    <!--If user has the secret key, show them all the components -->
    <Navbar room_name={ROOM_NAME} bind:sidebar_open={open} />
    <Sidebar bind:show={open} />
{/if}

<div class="main">
  <Start
    bind:nickname
    onsubmit={create
      ? () => send_create_req(ROOM_NAME)
      : () => send_join_req(ROOM_NAME, SHARED_HASH)}
  />
  {#if keys.shared !== undefined}
    <!--If user has the secret key, show them all the components -->
    <div id="grid-container">
      <div id="chat-container" class="grid-item">
        <Chat {nickname} emit={send} />
      </div>
      <div id="approve-container" class="grid-item">
        <Approve {requests} />
        <button on:click={() => console.log(nick_table)}>Dump Table</button>
      </div>
      <div id="sc-play-container" class="grid-item">
        <SCPlay current_soundcloud_url="https://soundcloud.com/7opi5oei5fbj/summer-slack" bind:value={next_song}/>
      </div>
    </div>
  {:else if waiting}
    <!--Show them waiting for approval-->
      <h1>Room: {ROOM_NAME}</h1>
      <h2>Waiting for Approval...</h2>
  {/if}
</div>

<style>
  .main {
    padding: 6px;
  }
  #grid-container {
    display: grid;
    grid-template-columns: auto auto auto;
    padding: 5px;
  }
  @media screen and (max-width: 1000px) {
    #grid-container {
      grid-template-columns: auto auto;
    }
    #sc-play-container {
      grid-column-start: 1;
      grid-column-end: 2;
    }
  }
</style>
