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
		const daily = this.client.economy.rewards.daily(
			message.author.id,
			message.guild.id
		);
		if (!daily.status) {
			const FormattedTime = `${daily.value.days}:${daily.value.hours}:${daily.value.minutes}:${daily.value.seconds}`;
			const text = lang.ECONOMY.TIME_ERROR(FormattedTime);
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		const text = lang.ECONOMY.DAILY_REWARD(
			this.client.functions.sp(daily.reward)
		);
		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			"✅",
			true
		);

		return message.channel.send({
			embeds: [embed],
		});
	}
}
