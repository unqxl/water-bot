import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import Bot from "../../classes/Bot";

export default class DailyCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "daily",

			description: {
				en: "Get Your Daily Reward!",
				ru: "Получите свою Ежедневную Награду!",
			},

			category: Categories.ECONOMY,
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const daily = await this.client.economy.rewards.daily(
			message.guild.id,
			message.author.id
		);

		if ("status" in daily) {
			const locale = await this.client.database.getSetting(
				message.guild.id,
				"locale"
			);

			const collectAt = new Date(daily.data);
			const text = lang.ECONOMY.TIME_ERROR(
				collectAt.toLocaleString(locale),
				collectAt
			);

			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed.json],
			});
		}

		const text = lang.ECONOMY.DAILY_REWARD(daily.amount);
		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			"✅",
			true
		);

		return message.channel.send({
			embeds: [embed.json],
		});
	}
}
