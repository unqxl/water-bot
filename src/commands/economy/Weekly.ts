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
		const weekly = this.client.economy.rewards.weekly(
			message.author.id,
			message.guild.id
		);

		if (!weekly.status) {
			const FormattedTime = `${weekly.value.days}:${weekly.value.hours}:${weekly.value.minutes}:${weekly.value.seconds}`;
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

		const text = lang.ECONOMY.WEEKLY_REWARD(
			this.client.functions.sp(weekly.reward)
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
