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

const app = express();
const PORT = process.env.PORT || 8443;
const HOSTNAME = "localhost";

const isProduction = process.env.NODE_ENV === "production";

// Middleware
// allow the backend to parse json
app.use(express.json());

// Allow the backend to send and use cookies
app.use(parser());

// Cors configurations
// allow the backend to accept and send requests to frontend domains

const frontendHostUrl = "https://portal-backend-xof0.onrender.com";
var origin = [`https://${HOSTNAME}:443`, `https://${HOSTNAME}`, frontendHostUrl]

app.use(
	cors({
		origin: origin,
		methods: ["GET", "POST", "PATCH"],
		credentials: true,
	}),
);

// server route decleration
app.use(serverRoutes);

async function runServer() {
    try {
        mongoConnect();
		if (isProduction) {
			app.listen(PORT, () => {
				console.log(`Backend running on port ${PORT}`);
			});
		} else {
			// Certificates to allow the backend to use https when dealing with requests and responses
			const secure_options = {
				key: fs.readFileSync("./certs/server.key"),
				cert: fs.readFileSync("./certs/server.crt"),
			};
			const httpServer = https.createServer(secure_options, app);
			httpServer.listen(PORT, HOSTNAME, () => {
				onServerListening(httpServer);
			});			
		}
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
