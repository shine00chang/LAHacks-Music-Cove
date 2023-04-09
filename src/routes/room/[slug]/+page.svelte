<svelte:head>
  <script src="/../../static/sc_api.js"/>
  <script src="/../../static/blackbeard.js"/>
</svelte:head>

<script>
  //imports and exports
  import Navbar from "$lib/Navbar.svelte";
  import Sidebar from "$lib/Sidebar.svelte";
  let open = false;

  import { page } from "$app/stores";
  import Start from "$lib/Start.svelte";
  import Approve from "$lib/Approve.svelte";
  import io from "socket.io-client";
  import nacl from "tweetnacl";

  export let data;

  // Fetch query params 
  const WS_URL = "ws://localhost:8080";
  const ROOM_NAME 	= data.room_name;
  const SHARED_HASH = $page.url.searchParams.get("shared_hash");
  const create 		= $page.url.searchParams.get("create") === "true";
  console.log(ROOM_NAME, create);

	function utoh (u) {	
		let hex = "";
		u.forEach(i => hex += i.toString(16).padStart(2, '0'));
		return hex;
	}

	function htou (h) {
		const u = new Uint8Array (h.length/2);
		for (let i=0; i<h.length; i+=2) 
			u[i/2] = parseInt( h.slice(i, i+2), 16 );
		return u;
	}

	function otou (o) {
		return new TextEncoder().encode( JSON.stringify(o) );
	}

	function gen_nonce() {
		return nacl.randomBytes(24);
	}

  // Binded Vars
  let socket = io(WS_URL);
  let nickname = "";
  let requests = [];
  let generate = false;
  let nick_table = {};
  const keys = { shared: undefined, box: {}, sign: {} };

  {
	const boxK  = nacl.box.keyPair();
	keys.box.pub 	= utoh( boxK.publicKey ); 
	keys.box.pri 	= utoh( boxK.secretKey ); 

	const signK = nacl.sign.keyPair();
	keys.sign.pub 	= utoh( signK.publicKey ); 
	keys.sign.pri 	= utoh( signK.secretKey ); 
  }

  const send_create_req = () => {
	console.log("'Create Room' Request sent");
	//generate 32 bytes shared key for secret key encryption
	keys.shared = utoh(nacl.randomBytes(32))	
	  
	// Send request
	const msg = { hdr: {rid: ROOM_NAME} };
	socket.emit("room-create-req", msg);	

	// Callbacks
	const timeout = setTimeout( () => {
		console.log("timed out");
		alert("time out");
		socket.off("room-create-rsp");
	}, 10000);

	socket.once("room-create-rsp", msg => {
		if (!msg.hdr.approved) 
			return console.error('room creation rejected');

		console.log("room created");
		nick_table[keys.sign.pub] = nickname;
		on_sock_start();	
		clearTimeout(timeout);
	});
  };
	
  const send_join_req = (hash) => {
		console.log("'Join Room' Request sent");	
		
		// Send Box key, rid, nick 
		const msg = {
			hdr: { 
				rid: ROOM_NAME, 
				boxK: keys.box.pub,
				signK: keys.sign.pub,
				nick: nickname,
			}
		};
		socket.emit("room-join-req", msg);
		const timeout = setTimeout(() => {
			console.log("timed out");
			alert("timed out");
			socket.off("room-join-rsp");
		}, 10000);
		socket.once("room-join-rsp", msg => {
			console.log("join response: ", msg);
			if (!msg.hdr.approved) 
				return console.error("request rejected");
			
			// NaCl decrypt.
			const peer_boxK = msg.hdr.boxK;
			const nonce 	= msg.hdr.nonce;
			const box 		= msg.data;
			const plain 	= nacl.box.open(htou(box), htou(nonce), htou(peer_boxK), htou(keys.box.pri));
			const data = JSON.parse( new TextDecoder().decode( plain ) )
			nick_table = data.nick_table;
			keys.shared = data.shared_secret;
			console.log("shared key: ", keys.shared);	

			on_sock_start();
			clearTimeout(timeout);
		});
  };
	
  const send = (hdr, data) => {
		console.log("sending", {hdr: hdr, data: data});
		if (socket === undefined) return console.error("Not connected");
		// TODO: Secret Box, set hdr 
	}

	// Sets '.on()' callback for socket
  const on = (event, callback) => {
		if (socket === undefined) return console.error("Not connected");
		socket.on(event, callback);
	}

	// Sets '.once()' callback for socket
  const once = (event, callback) => {
		if (socket === undefined) return console.error("Not connected");
		socket.once(event, callback);
	}

  const on_sock_start = () => {
	socket.on('room-join-req', msg => {
		console.log("room-join-req received", msg);

		// Extract Peer Info
		const nick 		 = msg.hdr.nick;
		const peer_boxK  = msg.hdr.boxK;
		const peer_signK = msg.hdr.signK;

		if (requests.find(item => item.public_key === peer_boxK)) 
			return console.log("Request already pending");

		// Construct approval CB
		const cb = approved => {
			//remove from requests once approved/declined
			requests = requests.filter(item => item.public_key !== peer_boxK);
			// If rejected, send plain header
			if (!approved) 
				return socket.emit('room-join-rsp', {hdr: {rid: ROOM_NAME, approved: false}});	

			// Add to table.
			nick_table[peer_signK] = nick;

			// Send table & key
			const nonce = utoh( gen_nonce() );
			const hdr	= { rid: ROOM_NAME, approved: true, boxK: keys.box.pub, nonce: nonce };
			const data 	= { nick_table: nick_table, shared_secret: keys.shared };
			
			const msg = {
				hdr: hdr,
				data: utoh( nacl.box( otou(data), htou(nonce), htou(peer_boxK), htou(keys.box.pri) ) )
			}
			console.log("room-join-rsp: ", msg);
			socket.emit('room-join-rsp', msg);
		}
		// Store Info:CB pair into list
		requests = [...requests, {nick: nick, public_key: peer_boxK, approve_callback: cb}];
	});
  }
</script>

<!--Modal thing that gets nickname and indicates when E2E should be init'd-->
<Start bind:nickname onsubmit={ create ? () => send_create_req(ROOM_NAME) : () => send_join_req(ROOM_NAME, SHARED_HASH) } />
{#if keys.shared !== undefined}
  <!--If user has the secret key, show them all the components -->
  <Navbar room_name={ROOM_NAME} bind:sidebar_open={open}/>
  <Sidebar bind:show={open} />

	<Approve requests={requests}/>
	<button on:click={() => console.log(nick_table)}>Dump Table</button> 
{:else if generate }
  <!--Show them waiting for approval-->
  <h1>Room: {ROOM_NAME}</h1>
  <h2>Waiting for Approval...</h2>
{/if}
