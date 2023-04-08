import express from "express";
import dotenv from "dotenv"
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.get('/foo', (req, res) => {
	console.log("'/foo' requested.");
	return res.send({hey: "I just met you"});
});

app.listen(PORT, () => {
	console.log("Listening on port: ", PORT);
});
