import { ChatInputCommandInteraction, EmbedBuilder, time } from "discord.js";
import { LanguageService } from "../../services/Language";
import { GuildService } from "../../services/Guild";
import { SubCommand } from "../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class WorkCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "economy",

			name: "work",
			description: "Gives work reward.",
			descriptionLocalizations: {
				ru: "Выдаёт награду за работу.",
			},
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const work = await this.client.economy.rewards.work(
			command.guildId,
			command.user.id
		);

		if ("status" in work) {
			const service = new GuildService(this.client);
			const locale = service.getSetting(command.guildId, "locale");

			const collectAt = new Date(work.data);
			const collectAtFormat = time(collectAt, "R");
			const text = await lang.get(
				"ERRORS:TIME_ERROR",
				collectAt.toLocaleString(locale),
				collectAtFormat
			);

			const color = this.client.functions.color("Red");
			const author = this.client.functions.author(command.member);
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

		const sp = (num: string | number) => this.client.functions.sp(num);
		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const text = await lang.get(
			"ECONOMY_COMMANDS:WORK:TEXT",
			sp(work.amount)
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
