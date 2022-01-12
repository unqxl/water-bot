import { ApplicationCommandData } from "discord.js";
import Bot from "./classes/Bot";

export = async (client: Bot) => {
	if (!client.slashCommands.size)
		return client.logger.warn(
			"No Slash Commands Found!",
			"deploy-commands"
		);
	const commands = client.slashCommands.map((x) => x.options);

	try {
		client.application.commands.set(commands as ApplicationCommandData[]);
		client.logger.log("Slash Commands Deployed!", "deploy-commands");
	} catch (error) {
		console.log(error);

		client.logger.error("Cannot Deploy Slash Commands!", "deploy-commands");
		client.functions.sendLog(
			new Error("Cannot create Slash Commands!"),
			"error"
		);
	}
};
