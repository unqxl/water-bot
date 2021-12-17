import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { Categories } from "../../structures/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";
import random from "random";

export default class CaptchaCommand extends Command {
	constructor(client: Goose) {
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

		const text = lang.GAMES.CAPTCHA.TEXT.replace(
			"{reward}",
			this.client.functions.sp(reward)
		);
		const embed = this.client.functions.buildEmbed(
			message,
			"BLURPLE",
			bold(text),
			false,
			true
		);
		embed.setImage(image);

		const msg = await message.channel.send({
			embeds: [embed],
		});

		const collector = await msg.channel.awaitMessages({
			filter: (msg) => msg.author.id === message.author.id,
			max: 1,
			time: 15000,
		});

		const content = collector.first().content;
		if (!content) {
			const text = lang.GAMES.CAPTCHA.TIMEOUT;
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
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
				"BLURPLE",
				bold(text),
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		} else {
			this.client.economy.balance.add(
				reward,
				message.author.id,
				message.guild.id
			);

			const text = lang.GAMES.CAPTCHA.CORRECT_ANSWER.replace(
				"{coins}",
				this.client.functions.sp(reward)
			);
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				"✅",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}
	}
}
