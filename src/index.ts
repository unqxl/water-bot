console.clear();

import "dotenv/config";
import P from "bluebird";
process.setMaxListeners(Infinity);
P.Promise.config({
	longStackTraces: true,
});

import { Client } from "discord-rpc";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import Bot from "./classes/Bot";
const client = new Bot();
client.start();

const rpc = new Client({
	transport: "ipc",
});

rpc.login({
	clientId: "959749615236812832",
});

const sentryEnabled = client.config.sentry.enabled;
if (sentryEnabled) {
	Sentry.init({
		dsn: client.config.sentry.dsn,
		tracesSampleRate: 1.0,
	});
}

const reasons_to_ignore = [
	"Interaction has already been acknowledged.",
	"Headers Timeout Error",
	"buffer.Blob is an experimental feature. This feature could change at any time",
];

process.on("unhandledRejection", (error: Error) => {
	if (reasons_to_ignore.includes(error.message)) return;
	else {
		if ("DEVELOPMENT" in process.env) {
			return console.log(error);
		}

		if (sentryEnabled) {
			return Sentry.captureException(error);
		}
	}
});

process.on("uncaughtExceptionMonitor", (error) => {
	if (reasons_to_ignore.includes(error.message)) return;
	else {
		if ("DEVELOPMENT" in process.env) {
			return console.log(error);
		}

		if (sentryEnabled) {
			return Sentry.captureException(error);
		}
	}
});

process.on("warning", (warning) => {
	if ("DEVELOPMENT" in process.env) {
		return console.log(warning);
	}

	if (sentryEnabled) {
		return Sentry.captureException(warning);
	}
});

rpc.on("ready", () => {
	client.once("ready", () => {
		// Every hour
		setInterval(() => {
			rpc.setActivity({
				details: `Helping ${client.guilds.cache.size} servers...`,
				state: "Music, Economy, and more!",
				instance: false,
				largeImageKey: "logo",
				buttons: [
					{
						label: "Source Code",
						url: client.config.bot.github_link,
					},
					{
						label: "Support Server",
						url: client.config.bot.support_server,
					},
				],
			});
		}, 3600000);
	});
});

export = client;
