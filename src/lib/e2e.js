import io from "socket.io-client";
import nacl from "tweetnacl";


const URL = "ws://localhost:8080";

function utoh (u) {	
	let hex = "";
	u.forEach(i => hex += i.toString(16).padStart(2, '0'));
	return hex;
}

function htou (h) {
	const u = new Uint8Array (h.length/2);
	for (let i=0; i<h.length; i+=2) 
		u[i] = parseInt( h.slice(i*2, i*2+2), 16 );
	return u;
}

function otou (o) {
	return new TextEncoder().encode( JSON.stringify(o) );
}

export default class E2E {
	constructor (nick) {
		const opts 	= {};
		this.socket = io.connect(URL, opts);
		this.nick 	= nick;

		{ // Set Keys	
			this.keys 	= { shared: undefined };
			
			const boxK 	= nacl.box.keyPair();
			this.keys.box.pub 	= utoh( boxK.publicKey ); 
			this.keys.box.pri 	= utoh( boxK.privateKey ); 

			const signK 	= nacl.sign.keyPair();
			this.keys.sign.pub 	= utoh( signK.publicKey ); 
			this.keys.sign.pri 	= utoh( signK.privateKey ); 
		}
	}

	send_create_req (rid) {
		console.log("'Create Room' Request sent");	
		// TODO: Send rid.
		
	};
	
	send_join_req (rid, hash) {
		console.log("'Join Room' Request sent");	
		// TODO: Send Box key, rid, nick 
	};
	
	send (hdr, data) {
		console.log("sending", {hdr: hdr, data: data});
		if (this.socket === undefined) return console.error("Not connected");
		// TODO: Secret Box, set hdr 
	}

	// Sets '.on()' callback for socket
	on (event, callback) {
		if (this.socket === undefined) return console.error("Not connected");
		this.socket.on(event, callback);
	}

	// Sets '.once()' callback for socket
	once (event, callback) {
		if (this.socket === undefined) return console.error("Not connected");
		this.socket.once(event, callback);
	}

	on_join_req (callback) {
		this.socket.on('room-join-req', callback);
	}

	on_join_req_rsp (approved) {
		if (!approved) {
			send()	
		}
	}
}
