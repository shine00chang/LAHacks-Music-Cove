<script>
	//imports and exports
	import Navbar from "$lib/Navbar.svelte";
	import Sidebar from "$lib/Sidebar.svelte";
	import { Alert } from "flowbite-svelte";
	let open = false;
	let alert_type = 0;
	import { onMount } from "svelte";
	import { page } from "$app/stores";
  import GameModal from "$lib/GameModal.svelte";
	import Start from "$lib/Start.svelte";
	import Approve from "$lib/Approve.svelte";
	import SCPlay from "$lib/SCPlay.svelte";
	import Chat from "$lib/Chat.svelte";
  import ScoreBoard from "$lib/ScoreBoard.svelte";

	import io from "socket.io-client";
	import nacl from "tweetnacl";

	export let data;

	// Fetch query params
	const WS_URL = "ws://localhost:8080";
	const ROOM_NAME = data.room_name;
	const SHARED_HASH = $page.url.searchParams.get("shared_hash");
	const create = $page.url.searchParams.get("create") === "true";
	console.log(ROOM_NAME, create);

  let share_alert_ran = false;

	let share_room_url;
	$: {
		if (share_room_url && create && !share_alert_ran) {
			alert_type = "share-alert";
      share_alert_ran = true;
      setTimeout(() => {
        alert_type = 0;
      }, 2000);
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
	let nick_table = {};
	let nickname = "";
	let requests = [];
  
  let waiting = false;
	const keys = { shared: undefined, box: {}, sign: {} };

	{ // Set Keys
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
			alert_type = "time-out";
			socket.off("room-create-rsp");
		}, 10000);

		socket.once("room-create-rsp", async (msg) => {
			if (!msg.hdr.approved)
				return console.error("room creation rejected");

			//generate 32 bytes shared key for secret key encryption
			keys.shared = utoh(nacl.randomBytes(32));
			keys.hashed_shared = utoh(
				new Uint8Array(
					await crypto.subtle.digest(
						"SHA-256",
						htou(keys.shared).buffer
					)
				)
			);
			share_room_url = `${$page.url.origin}/room/${ROOM_NAME}?shared_hash=${keys.hashed_shared}`;
			console.log(share_room_url);
			console.log("room created");
			nick_table[keys.sign.pub] = nickname;
			console.log("abc");
			waiting = false;
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
			alert_type = "time-out";
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
			let shared_secret_hash = utoh(
				new Uint8Array(
					await crypto.subtle.digest(
						"SHA-256",
						htou(data.shared_secret).buffer
					)
				)
			);
			if (shared_secret_hash !== SHARED_HASH)
				return console.error("SECRET KEY HASHES DO NOT MATCH");
			keys.shared = data.shared_secret;
			keys.hashed_shared = shared_secret_hash;
			share_room_url = `${$page.url.origin}/room/${ROOM_NAME}?shared_hash=${keys.hashed_shared}`;
			console.log("shared key: ", keys.shared);
			waiting = false;
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
				requests = requests.filter(
					(item) => item.public_key !== peer_boxK
				);
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
				const data = {
					nick_table: nick_table,
					shared_secret: keys.shared,
				};

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

	let song_queue = [];

	onMount(() => {
		document.addEventListener("song-add", (event) => {
			let data = event.detail.data;
			//add to queue
			song_queue.push({
				author: data.author,
				url: data.url,
				title: data.title,
			});
			song_queue = [...song_queue];
		});

		document.addEventListener("song-remove", (event) => {
			let song_url = event.detail.data?.url?.toLowerCase().trim();
			if (!song_url) {
				return;
			}
			let removed = false;
			//only remove one song with the url in queue - not all songs with that url
			song_queue = song_queue.filter((item) => {
				let condition = item.url.toLowerCase().trim() === song_url;
				if (condition && !removed) {
					removed = true;
					return false;
				}
				return true;
			});
			song_queue = [...song_queue];
		});
	});

	let current_soundcloud_url =
		"https://soundcloud.com/7opi5oei5fbj/summer-slack";

	let next_song;
	$: {
    if (next_song) {
      song_queue.shift();
      current_soundcloud_url = song_queue[0]?.url;
      if (!current_soundcloud_url) {
        current_soundcloud_url = "";
      }
      console.log(current_soundcloud_url)
    }
	}
</script>

<svelte:head>
	<script src={`${$page.url.origin}/sc_api.js`}></script>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
		integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
		crossorigin="anonymous"
	/>
</svelte:head>

<!--Modal thing that gets nickname and indicates when E2E should be init'd-->

<!--This code is kinda repeated in around 20 lines from now, sorry! but itt was for good reason -taisei -->
{#if keys.shared !== undefined}
	<!--If user has the secret key, show them all the components -->
	<Navbar
		room_name={ROOM_NAME}
		bind:share_room_url
		bind:sidebar_open={open}
	/>
	<Sidebar
		bind:show={open}
		{nickname}
		emit={send}
		current_queue={song_queue}
	/>
{/if}
{#if alert_type == "share-alert"}
	<Alert>
		<span slot="icon"
			><svg
				aria-hidden="true"
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
					clip-rule="evenodd"
				/></svg
			>
		</span>
		<span class="font-medium">Info alert!</span> Share the url {share_room_url}
	</Alert>
{:else if alert_type == "time-out"}
	<Alert color="red">
		<span slot="icon"
			><svg
				aria-hidden="true"
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
					clip-rule="evenodd"
				/></svg
			>
		</span>
		<span class="font-medium">Alert!</span> Connection timed out
	</Alert>
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
      <div id="approve-container" class="grid-item">
				<Approve {requests} />
				<SCPlay {current_soundcloud_url} bind:value={next_song} />
				<button on:click={() => console.log(nick_table)}>Dump Table</button>
      </div>

      <div id="chat-container" class="grid-item">
				<Chat {nickname} emit={send} />
			</div>

			<div id="game-container" class="grid-item">
        <GameModal nickname={nickname} emit={send}/>
        <ScoreBoard />
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
    height: 100%;
    overflow: hidden;
        
  }

  #grid-container {
	height: 100vh;
	background-color: #2d2d2d;
  }
  #chat-container {
	height: 90%;
	width: 90%;
	border-radius: 20px;
	background-color: #4f4f4f;
	margin: 5px;
	margin-top: 5px;
	margin-bottom: 15px;
  }

  #approve-container {
	height: 44%;
	width: 90%;
	border-radius: 20px;
	background-color: #4f4f4f;
	margin: 5px;
	margin-top: 5px;
	margin-bottom: 15px
  }

  #sc-play-container {
	height: 44%;
	width: 90%;
	border-radius: 20px;
	background-color: #4f4f4f;
	margin: 5px;
	margin-top: 5px;
	margin-bottom: 15px
  }

	#grid-container {
		display: grid;
		grid-template-columns: 20% auto 30%;
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
