import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	codeBlock,
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
	bold,
	ModalSubmitInteraction,
	InteractionType,
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
			description: "Executes code.",
			descriptionLocalizations: {
				ru: "Выполняет код.",
			},
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
		const row = new ActionRowBuilder<TextInputBuilder>();
		row.addComponents([
			new TextInputBuilder()
				.setCustomId("code")
				.setLabel("Code to Execute")
				.setMinLength(0)
				.setMaxLength(4000)
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true),
		]);

		const modal = new ModalBuilder();
		modal.setTitle("Eval Command | Code");
		modal.setCustomId("eval_code_submission");
		modal.addComponents([row]);

		await command.showModal(modal);

		this.client.on("interactionCreate", async (interaction) => {
			if (interaction.type !== InteractionType.ModalSubmit) return;

			const code = interaction.fields.getTextInputValue("code");

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

			interaction.reply({
				embeds: [embed],
			});

			return;
		});
	}
}
