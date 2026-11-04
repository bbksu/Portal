import dotenv from "dotenv";
import express, { response } from "express";
import cors from "cors";
import { mongoConnect } from "./config/database.js";
import parser from "cookie-parser";
import fs from "fs";
import https from "https";
import { serverRoutes } from "./routes/serverRoutes.js";

// load environment variables from env file
dotenv.config({
	path: "./.env",
});

const secure_options = {
	key: fs.readFileSync("../certs/server.key"),
	cert: fs.readFileSync("../certs/server.crt"),
};

const app = express();
const HOSTNAME = "localhost";
const SECUREPORT = process.env.SERVER_PORT_SECURE || 3000


// logging //remove
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
	next();
});

app.use(express.json());

app.use(
	cors({
		origin: [`https://${HOSTNAME}:443`, `https://${HOSTNAME}`],
		methods: ["GET", "POST", "PATCH"],
		credentials: true,
	}),
);

app.use(parser());

// server route decleration
app.use(serverRoutes)

async function runServer() {
	try {
		
		// const server = app.listen(PORT, hostname, () => {
		// 	onServerListening(server);
		// });
		const httpServer = https.createServer(secure_options, app);
		httpServer.listen(SECUREPORT, HOSTNAME, () => {
			onServerListening(httpServer);
		});
		mongoConnect();
	} catch (error) {
		ConnectionError(error);
	}
}

function onServerListening(server) {
	var address = server.address().address;
	var port = server.address().port;
	console.log(`Server listening on "${address}:${port}"`);
}

function ConnectionError(error) {
	console.log(`Connection failed with ${error}`);
}

runServer();
