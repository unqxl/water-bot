import {
	ApplicationCommandOptionType,
	bold,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { LanguageService } from "../../services/Language";
import { ValidateReturn } from "../../types/Command/BaseSlashCommand";
import { SlashCommand } from "../../types/Command/SlashCommand";
import { SubCommand } from "../../types/Command/SubCommand";
import Bot from "../../classes/Bot";

export default class ReloadCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "owner",
			name: "reload",
			description: "Reloads Command",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "category",
					description: "Command Category",
					required: true,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "name",
					description: "Command Name",
					required: true,
				},
			],
		});
	}

	async validate(
		interaction: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	): Promise<ValidateReturn> {
		if (!this.client.owners.includes(interaction.user.id)) {
			const color = this.client.functions.color("Red");
			const author = this.client.functions.author(interaction.member);

			const text = await lang.get("ERRORS:NO_ACCESS");
			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`⛔ | ${bold(text)}`);
			embed.setTimestamp();

			return {
				ok: false,
				error: {
					embeds: [embed],
				},
			};
		}

		return {
			ok: true,
		};
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const category = command.options.getString("category");
		const name = command.options.getString("name");
		const patterns = [
			`../${category}/${name.charAt(0).toUpperCase()}${name.slice(1)}.ts`,
			`../${category}/${name.charAt(0).toUpperCase()}${name.slice(1)}.js`,
		];

		for (const pattern of patterns) {
			const file = require.resolve(pattern);
			if (!file) continue;

			for (const cmd_name of this.client.commands.keys()) {
				if (!cmd_name.includes(name)) continue;

				this.client.commands.delete(cmd_name);
			}

			delete require.cache[file];

			const cmd = await this.client.handlers.resolveFile<SlashCommand>(
				file,
				this.client
			);
			await this.client.handlers.validateFile(file, cmd);

			let commandName;
			if (cmd instanceof SubCommand) {
				const groupName = cmd.options.groupName;
				const topLevelName = cmd.options.commandName;
				if (groupName) {
					commandName = `${topLevelName}-${groupName}-${cmd.name}`;
				} else if (topLevelName) {
					commandName = `${topLevelName}-${cmd.name}`;
				}
			} else {
				commandName = cmd.name;
			}

			this.client.commands.set(commandName, cmd);

			const color = this.client.functions.color("Blurple");
			const author = this.client.functions.author(command.member);
			const text = await lang.get(
				"OWNER_COMMANDS:RELOAD:COMMAND_RELOADED",
				name
			);

			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`✅ | ${bold(text)}`);
			embed.setTimestamp();

			return command.reply({
				embeds: [embed],
			});
		}
	}
}
