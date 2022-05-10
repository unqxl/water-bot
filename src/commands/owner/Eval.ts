import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	codeBlock,
} from "discord.js";
import { LanguageService } from "../../services/Language";
import { ValidateReturn } from "../../types/Command/BaseSlashCommand";
import { SubCommand } from "../../types/Command/SubCommand";
import Bot from "../../classes/Bot";

export default class EvalCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "owner",
			name: "eval",
			description: "Executes code",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "code",
					description: "Code to execute",
					required: true,
				},
				{
					type: ApplicationCommandOptionType.Boolean,
					name: "ephemeral",
					description: "Show message to all or not",
					required: false,
				},
			],
		});
	}

	async validate(
		interaction: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	): Promise<ValidateReturn> {
		if (!this.client.owners.includes(interaction.user.id)) {
			return {
				ok: false,
				error: {
					content: "⛔",
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
		const ephemeral = command.options.getBoolean("ephemeral");
		const code = command.options.getString("code");

		let evaluated;
		try {
			evaluated = await eval(code);
		} catch (error) {
			evaluated = error.message;
		}

		if (typeof evaluated !== "string") {
			evaluated = JSON.stringify(evaluated);
		} else {
			evaluated = evaluated.replace(/\n/g, "\n\t");
			evaluated = evaluated.replace(this.client.toJSON, "❌");
		}

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);

		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setDescription(codeBlock("js", evaluated));
		embed.setTimestamp();

		return command.reply({
			ephemeral,
			embeds: [embed],
		});
	}
}
