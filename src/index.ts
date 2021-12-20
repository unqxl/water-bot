import "module-alias/register";
import "dotenv/config";

import P from "bluebird";
import Goose from "./classes/Goose";

P.Promise.config({
	longStackTraces: true,
});

const client = new Goose();
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
