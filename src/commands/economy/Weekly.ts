import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import Bot from "../../classes/Bot";

export default class WeeklyCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "weekly",

			description: {
				en: "Get Your Weekly Reward!",
				ru: "Получите свою Еженедельную Награду!",
			},

			category: Categories.ECONOMY,
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const weekly = await this.client.economy.rewards.weekly(
			message.guild.id,
			message.author.id
		);

		if ("status" in weekly) {
			const locale = await this.client.database.getSetting(
				message.guild.id,
				"locale"
			);

			const collectAt = new Date(weekly.data);
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
				embeds: [embed.toJSON()],
			});
		}

		const text = lang.ECONOMY.WEEKLY_REWARD(weekly.amount);
		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			"✅",
			true
		);

		return message.channel.send({
			embeds: [embed.toJSON()],
		});
	}
}
