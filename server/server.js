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
		origin: CLIENT_URL,
		methods: ["GET", "POST"]
	}
});

app.get('/foo', (req, res) => {
	console.log("'/foo' requested.");
	return res.send({hey: "I just met you"});
});

server.listen(PORT, () => {
	console.log("Listening on port: ", PORT);
});
