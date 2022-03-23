import Event from "../../types/Event/Event";
import Bot from "../../classes/Bot";
import { ChatInputCommandInteraction, Interaction } from "discord.js";

export default class InteractionCreateEvent extends Event {
	constructor() {
		super("interactionCreate");
	}

	async run(client: Bot, interaction: Interaction) {
		if (!interaction.inGuild()) return;
		if (!interaction.isChatInputCommand()) return;

		const lang = await client.functions.getLanguageFile(
			interaction.guild.id
		);

		await client.application?.commands
			.fetch(interaction.commandId)
			.catch(() => null);

		const command = client.slashCommands.get(
			this.getCommandName(interaction)
		);
		if (!command) return console.log(1);

		if (command.validate) {
			const { ok, error } = await command.validate(interaction, lang);
			if (!ok) return interaction.reply(error);
		}

		return await command.run(interaction, lang);
	}

	getCommandName(interaction: ChatInputCommandInteraction) {
		let command: string;

		const commandName = interaction.commandName;
		const group = interaction.options.getSubcommandGroup(false);
		const subCommand = interaction.options.getSubcommand(false);

		if (subCommand) {
			if (group) {
				command = `${commandName}-${group}-${subCommand}`;
			} else {
				command = `${commandName}-${subCommand}`;
			}
		} else {
			command = commandName;
		}

		return command;
	}
}
