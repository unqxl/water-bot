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
		const work = this.client.economy.rewards.work(
			message.author.id,
			message.guild.id
		);

		if (!work.status) {
			const FormattedTime = `${work.value.days}:${work.value.hours}:${work.value.minutes}:${work.value.seconds}`;
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

		const text = lang.ECONOMY.WORK_REWARD(
			this.client.functions.sp(work.pretty as number)
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
