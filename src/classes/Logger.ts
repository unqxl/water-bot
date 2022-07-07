import chalk from "chalk";

export = class Logger {
	get time() {
		return new Date().toLocaleString();
	}

	log(message) {
		const time = chalk.magenta(this.time);
		const text = chalk.cyan(message);

		return console.log(`[${time}] | ${text}`);
	}

	warn(message) {
		const time = chalk.magenta(this.time);
		const text = chalk.yellow(message);

		return console.log(`[${time}] | ${text}`);
	}

	error(message) {
		const time = chalk.magenta(this.time);
		const text = chalk.red(message);

		return console.log(`[${time}] | ${text}`);
	}
};
