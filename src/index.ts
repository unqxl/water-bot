// import "dotenv/config";
// if (process.env.DEVELOPMENT) {
// 	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// }

import "module-alias/register";

import Bot from "./classes/Bot";
import P from "bluebird";

P.Promise.config({
	longStackTraces: true,
});

const client = new Bot();
client.start();

client.on("ready", () => {
	process.on("unhandledRejection", (error: Error) =>
		client.functions.sendLog(error, "error")
	);

	process.on("uncaughtExceptionMonitor", (error) =>
		client.functions.sendLog(error, "error")
	);

	process.on("warning", (warning) =>
		client.functions.sendLog(warning, "warning")
	);
});

export = client;
