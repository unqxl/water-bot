import { ChatInputCommandInteraction, EmbedBuilder, time } from "discord.js";
import { LanguageService } from "../../services/Language";
import { SubCommand } from "../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class DailyCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "economy",
			name: "daily",
			description: "Adds Daily Amount to Your Balance!",
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const daily = await this.client.economy.rewards.daily(
			command.guildId,
			command.user.id
		);

		if ("status" in daily) {
			const locale = await this.client.database.getSetting(
				command.guildId,
				"locale"
			);

			const collectAt = new Date(daily.data);
			const collectAtFormat = time(Math.ceil(daily.data / 1000), "R");
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
			"ECONOMY_COMMANDS:DAILY:TEXT",
			sp(daily.amount)
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
