import Bot from "classes/Bot";
import Event from "../../types/Event/Event";
import deployCommands from "../../deploy-commands";

export default class ReadyEvent extends Event {
	constructor() {
		super("ready");
	}

	async run(client: Bot) {
		if (!client.application.owner) await client.application.fetch();

		await client.web.start();
		await deployCommands(client);

		console.log(`${client.user.username} logged in!`);
	}
}
