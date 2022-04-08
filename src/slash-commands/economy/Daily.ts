import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
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
		lang: typeof import("@locales/English").default
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
			const text = lang.ECONOMY.TIME_ERROR(
				collectAt.toLocaleString(locale),
				collectAt
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

		const text = lang.ECONOMY.DAILY_REWARD(daily.amount);
		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
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
