console.clear();
import "dotenv/config";
import P from "bluebird";
process.setMaxListeners(Infinity);
P.Promise.config({
	longStackTraces: true,
});

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import Bot from "./classes/Bot";
const client = new Bot();
client.start();

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
			console.log(error);

			if (sentryEnabled) {
				Sentry.captureException(error);
			}

			return;
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

export = client;
