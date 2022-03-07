import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import Bot from "../../classes/Bot";

export default class WorkCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "work",

			description: {
				en: "Get Your Work Reward!",
				ru: "Получите свою Награду за Работу!",
			},

			category: Categories.ECONOMY,
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const work = await this.client.economy.rewards.work(
			message.guild.id,
			message.author.id
		);

		if ("status" in work) {
			const locale = await this.client.database.getSetting(
				message.guild.id,
				"locale"
			);

			const collectAt = new Date(work.data);
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
				embeds: [embed],
			});
		}

		const text = lang.ECONOMY.WORK_REWARD(work.amount);
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
