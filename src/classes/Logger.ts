import chalk from "chalk";

export = class Logger {
	get time() {
		return new Date().toLocaleString("ru");
	}

	log(message, tag) {
		return console.log(`[${this.time} | ${tag}] ${chalk.green(message)}`);
	}

	warn(message, tag) {
		return console.log(
			`[${this.time} | ${tag}] ${chalk.yellowBright(message)}`
		);
	}

	error(message, tag) {
		return console.log(`[${this.time} | ${tag}] ${chalk.red(message)}`);
	}
};
