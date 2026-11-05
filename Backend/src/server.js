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

// Certificates to allow the backend to use https when dealing with requests and responses
const secure_options = {
	key: fs.readFileSync("./certs/server.key"),
	cert: fs.readFileSync("./certs/server.crt"),
};

const app = express();
const HOSTNAME = "localhost";
const SECUREPORT = process.env.SERVER_PORT_SECURE || 3000


// allow the backend to parse json
app.use(express.json());

// allow the backend to accept and send requests to frontend domains
app.use(
	cors({
		origin: [`https://${HOSTNAME}:443`, `https://${HOSTNAME}`],
		methods: ["GET", "POST", "PATCH"],
		credentials: true,
	}),
);

// Allow the backend to send and use cookies
app.use(parser());

// server route decleration
app.use(serverRoutes)

async function runServer() {
	try {
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
