import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import Bot from "../../classes/Bot";
import random from "random";

export default class CaptchaCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "captcha",

			description: {
				en: "Solve the Captcha to Earn Coins!",
				ru: "Разгадайте Капчу для Заработка Коинов!",
			},

			category: Categories.GAMES,
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const { image, answer } = await this.client.dagpi.captcha();
		const reward = random.int(10, 150);

		const text = lang.GAMES.CAPTCHA.TEXT(this.client.functions.sp(reward));
		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			false,
			true
		);
		embed.setImage(image);

		const collector = await this.client.functions.promptMessage(
			message,
			{ embeds: [embed] },
			15000
		);

		const content = collector;
		if (!content) {
			const text = lang.GAMES.CAPTCHA.TIMEOUT;
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

		if (content !== answer) {
			const text = lang.GAMES.CAPTCHA.WRONG_ANSWER;
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
		} else {
			this.client.economy.balance.add(
				message.guild.id,
				message.author.id,
				reward
			);

			const text = lang.GAMES.CAPTCHA.CORRECT_ANSWER(
				this.client.functions.sp(reward)
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
}
