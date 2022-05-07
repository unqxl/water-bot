import { ChatInputCommandInteraction, EmbedBuilder, time } from "discord.js";
import { LanguageService } from "../../services/Language";
import { GuildService } from "../../services/Guild";
import { SubCommand } from "../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class WeeklyCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "economy",
			name: "weekly",
			description: "Adds Weekly Amount to Your Balance!",
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const weekly = await this.client.economy.rewards.weekly(
			command.guildId,
			command.user.id
		);

		if ("status" in weekly) {
			const service = new GuildService(this.client);
			const locale = service.getSetting(command.guildId, "locale");

			const collectAt = new Date(weekly.data);
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
			"ECONOMY_COMMANDS:WEEKLY:TEXT",
			sp(weekly.amount)
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
