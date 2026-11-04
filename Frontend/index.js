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
const PORT = 8080;
const SECUREPORT = process.env.SECURE_SERVER_PORT || 8443;
const HOSTNAME = "localhost";
const currentFile = fileURLToPath(import.meta.url);
const directoryOfFile = path.dirname(currentFile);
const publicFolder = path.join(directoryOfFile, "public");

console.log(currentFile);
console.log(directoryOfFile);
console.log(publicFolder);


app.use(express.static(publicFolder));

app.get("/", (request, response) => {
	response.sendFile(path.join(publicFolder, "index.html"));
});

app.get("/profile", (request, response) => {
	response.sendFile(path.join(publicFolder, "profile.html"));
});
// const server = app.listen(PORT, HOSTNAME, () => {
// 	console.log(
// 		`Server running on https://${server.address().address}:${server.address().port}`,
// 	);
// });

const secure_options = {
	key: fs.readFileSync("../certs/server.key"),
	cert: fs.readFileSync("../certs/server.crt"),
};

const httpServer = https.createServer(secure_options, app);
httpServer.listen(SECUREPORT, HOSTNAME, () => {
	console.log(`Frontend running on https://${httpServer.address().address}:${httpServer.address().port}`)
})
