import Event from "../../types/Event/Event";
import Bot from "../../classes/Bot";
import { Interaction } from "discord.js";

export default class InteractionCreateEvent extends Event {
	constructor() {
		super("interactionCreate");
	}

	async run(client: Bot, interaction: Interaction) {
		if (!interaction.inGuild()) return;
		if (!interaction.isCommand()) return;

		const lang = await client.functions.getLanguageFile(
			interaction.guild.id
		);

		const command = client.slashCommands.get(interaction.commandName);
		if (!command)
			return client.logger.warn(
				`Command with name "${interaction.commandName}" isn't found!`,
				"interactionCreate"
			);

		if (command.validate) {
			const { ok, error } = await command.validate(interaction, lang);
			if (!ok) return interaction.reply(error);
		}

		await command.run(interaction, lang);
	}
}
