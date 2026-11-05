import express, { response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
	path: "./.env",
});

const app = express();
const SECUREPORT = process.env.SECURE_SERVER_PORT || 8443;
const HOSTNAME = "localhost";
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

// Certificates for enabling https on the frontend
const secure_options = {
	key: fs.readFileSync("./certs/server.key"),
	cert: fs.readFileSync("./certs/server.crt"),
};

const httpServer = https.createServer(secure_options, app);
httpServer.listen(SECUREPORT, HOSTNAME, () => {
	console.log(`Frontend running on https://${httpServer.address().address}:${httpServer.address().port}`)
})
