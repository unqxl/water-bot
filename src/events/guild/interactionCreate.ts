import { Interaction } from "discord.js";
import { RunFunction } from "../../interfaces/Event";

export const name: string = "interactionCreate";

export const run: RunFunction = async (client, interaction: Interaction) => {
	if (!interaction.inGuild()) return;
	if (!interaction.isCommand()) return;

	const lang = await client.functions.getLanguageFile(interaction.guild);

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
};
