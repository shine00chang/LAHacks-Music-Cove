import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const PORT = 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  return res.send({ online: true });
});

io.on('connection', socket => {
	console.log("user connected");
	start_listener(socket);
});

function Room (rid) {
	this.rid = rid;
	this.members = [];
}
const rooms = {};

io.on("connection", (socket) => {
  console.log("user connected");
  start_listener(socket);
  socket.on("disconnect", () => {
    //remove socket from room once it disconnects, delete room if no one connected
    rooms[socket.data.room].members = rooms[socket.data.room].members.filter(
      (s) => s.id !== socket.id
    );
    if (rooms[socket.data.room].members.length === 0) {
      delete rooms[socket.data.room];
    }
  });
});

// create new room instance
const on_room_create_req = (socket, msg) => {
  if (!("rid" in msg.hdr)) return console.error("no roomID specified");
  const rid = msg.hdr.rid;

  if (rid in rooms)
    return socket.emit("room-create-rsp", {
      hdr: { approved: false, err: `room '${rid}' already exists` },
    });
  const room = new Room(rid);
  room.members.push(socket);
  rooms[rid] = room;

  socket.emit("room-create-rsp", { hdr: { approved: true } });
  console.log(`Created room '${rid}'`);
};

// forward request too all in room, map BoxK to socket.
const on_room_join_req = (socket, msg) => {
	console.log("join req received: ", msg);
	if (!('rid' in msg.hdr)) return console.error("no roomID specified");
	const rid 	= msg.hdr.rid;
	const boxK 	= msg.hdr.boxK;
	const room 	= rooms[rid];
	if (!room) return console.error("none such room");

	room.members.forEach( member => {
		console.log("forwarded: ", msg);
		member.emit('room-join-req', msg);
		// Set timeout 
	});
	room.members.push(socket);
}

// Fetches target socket from request map, forwards. 
const on_room_join_rsp = (socket, msg) => {
	console.log("join rsp: ", msg);
	if (!msg.hdr.approved) return console.log("Not approved");

	const room = rooms[msg.hdr.rid];
	if (!room) return console.error("none such room");

	room.members.forEach(member => member.emit('room-join-rsp', msg));	
}

const start_listener = socket => {
	socket.on('room-create-req', msg => on_room_create_req(socket, msg));
	socket.on('room-join-req', 	 msg => on_room_join_req(socket, msg));
	socket.on('room-join-rsp', msg => on_room_join_rsp(socket, msg)); 
	socket.on('msg', msg => {
		console.log("msg rcv: ", msg);
		const room = rooms[msg.hdr.rid];
		if (!room) return console.error("none such room");
		room.members.forEach(member => member.emit('msg', msg));
	});
}


server.listen(PORT, () => {
  console.log("Listening on port: ", PORT);
});
