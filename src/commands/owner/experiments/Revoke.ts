import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	bold,
	ApplicationCommandOptionType,
} from "discord.js";
import { LanguageService } from "../../../services/Language";
import { ValidateReturn } from "../../../types/Command/BaseSlashCommand";
import { SubCommand } from "../../../types/Command/SubCommand";
import Experiments from "../../../assets/experiments.json";
import Experiment from "../../../classes/Experiment";
import Bot from "../../../classes/Bot";

export default class RevokeCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			groupName: "experiments",
			commandName: "owner",

			name: "revoke",
			description: "Disables a experiment for a guild.",
			descriptionLocalizations: {
				ru: "Отключает эксперимент для сервера.",
			},

			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "id",
					description: "Guild ID to revoke the experiment from.",
					descriptionLocalizations: {
						ru: "ID сервера для отключения эксперимента.",
					},
					required: true,
				},
				{
					type: ApplicationCommandOptionType.Number,
					name: "experiment",
					description: "Experiment ID to revoke.",
					descriptionLocalizations: {
						ru: "ID Эксперимента для отключения.",
					},
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
		const id = command.options.getString("id");
		const experiment = command.options.getNumber("experiment");

		const data = Experiments.find((x) => x.id === experiment);
		const text = await lang.get(
			"OWNER_COMMANDS:EXPERIMENTS:REVOKED",
			data.name,
			id
		);

		const guild = await this.client.guilds.cache.get(id);
		if (!guild) {
			const color = this.client.functions.color("Red");
			const author = this.client.functions.author(command.member);

			const text = await lang.get("ERRORS:NO_GUILD", id);
			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`❌ | ${bold(text)}`);
			embed.setTimestamp();

			return command.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}

		const system = new Experiment();
		const result = system.revoke(id, experiment);
		if (!result) {
			const color = this.client.functions.color("Red");
			const author = this.client.functions.author(command.member);
			const text = await lang.get(
				"ERRORS:EXPERIMENT_NOT_FOUND",
				data.name,
				id
			);

			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`❌ | ${bold(text)}`);
			embed.setTimestamp();

			return command.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setDescription(`✅ | ${bold(text)}`);
		embed.setTimestamp();

		return command.reply({
			embeds: [embed],
			ephemeral: true,
		});
	}
}
