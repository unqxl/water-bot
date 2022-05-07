console.clear();

import "dotenv/config";
import Bot from "./classes/Bot";
import P from "bluebird";

process.setMaxListeners(Infinity);
P.Promise.config({
	longStackTraces: true,
});

const client = new Bot();
client.start();

client.on("ready", () => {
	process.on("unhandledRejection", (error: Error) => {
		if ("DEVELOPMENT" in process.env) return console.log(error);
		client.functions.sendLog(error, "error");
	});

	process.on("uncaughtExceptionMonitor", (error) => {
		if ("DEVELOPMENT" in process.env) return console.log(error);
		client.functions.sendLog(error, "error");
	});

	process.on("warning", (warning) => {
		if ("DEVELOPMENT" in process.env) return console.log(warning);
		client.functions.sendLog(warning, "warning");
	});
});

process.on("unhandledRejection", (error: Error) => {
	if ("DEVELOPMENT" in process.env) return console.log(error);
	if (error.message.includes("Headers Timeout Error")) return;
});

process.on("uncaughtExceptionMonitor", (error) => {
	if ("DEVELOPMENT" in process.env) return console.log(error);
	if (error.message.includes("Headers Timeout Error")) return;
});

process.on("warning", (warning) => {
	if ("DEVELOPMENT" in process.env) return console.log(warning);
});

export = client;
