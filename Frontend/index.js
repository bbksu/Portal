import express, { response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const currentFile = fileURLToPath(import.meta.url);
const directoryOfFile = path.dirname(currentFile);
const publicFolder = path.join(directoryOfFile, "public");

app.use(express.static(publicFolder));

// serve index.html file when on the root directory
app.get("/", (request, response) => {
	response.sendFile(path.join(publicFolder, "index.html"));
});

// serve profile.html  when on the profile directory
app.get("/profile", (request, response) => {
	response.sendFile(path.join(publicFolder, "profile.html"));
});

const isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
	const PORT = process.env.PORT || 10000;

	app.listen(PORT, () => {
		console.log(`Frontend running on port ${PORT}`);
	});
} else {
	// Only execute when in development

	// Certificates for enabling https on the frontend
	const secure_options = {
		key: fs.readFileSync("./certs/server.key"),
		cert: fs.readFileSync("./certs/server.crt"),
	};

	const SECUREPORT = process.env.PORT || 443;
	const HOSTNAME = "localhost";
	const httpServer = https.createServer(secure_options, app);
	httpServer.listen(SECUREPORT, HOSTNAME, () => {
		console.log(
			`Frontend running on https://${httpServer.address().address}:${httpServer.address().port}`,
		);
	});
}
