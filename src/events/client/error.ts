import chalk from "chalk";
import Bot from "../../classes/Bot";
import Event from "../../types/Event/Event";

export default class ErrorEvent extends Event {
	constructor() {
		super("error");
	}

	async run(client: Bot, msg?: string) {
		const tag = chalk.red("[Client | ERROR]");
		console.log(`${tag} ${msg}`);
	}
}
