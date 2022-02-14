import { bold, hyperlink } from "@discordjs/builders";
import { Util } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";
import random from "random";

export default class GuessTheLogoCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "guessthelogo",
			aliases: ["gtl"],

			description: {
				en: "Try to Guess the Logo to earn money!",
				ru: "Попробуйте угадать Логотип, чтобы заработать деньги!",
			},

			category: Categories.GAMES,
			usage: "<prefix>guessthelogo",
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const reward = random.int(100, 190);
		const data = await this.client.dagpi.logo();

		const text = lang.GAMES.GUESS_THE_LOGO.DESCRIPTION(
			reward.toString(),
			data.clue || "-",
			Util.escapeMarkdown(data.hint)
		);

		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			lang.GAMES.GUESS_THE_LOGO.FOOTER,
			false,
			true
		);
		embed.setImage(data.question);

		const answer = await this.client.functions.promptMessage(
			message,
			{
				embeds: [embed],
			},
			35000
		);

		if (!answer) {
			const text = lang.GAMES.GUESS_THE_LOGO.TIMEOUT(
				data.brand,
				hyperlink("Click", encodeURI(data.wiki_url))
			);

			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
				"❌",
				true
			);
			embed.setImage(data.answer);

			return message.channel.send({
				embeds: [embed],
			});
		}

		if (answer === data.brand || answer === data.brand.toLowerCase()) {
			this.client.economy.balance.add(
				reward,
				message.author.id,
				message.guild.id
			);

			const text = lang.GAMES.GUESS_THE_LOGO.WIN(
				data.brand,
				hyperlink("Click", encodeURI(data.wiki_url))
			);

			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✅",
				true
			);
			embed.setImage(data.answer);

			return message.channel.send({
				embeds: [embed],
			});
		} else {
			const text = lang.GAMES.GUESS_THE_LOGO.DEFEAT(
				data.brand,
				hyperlink("Click", encodeURI(data.wiki_url))
			);

			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
				"❌",
				true
			);
			embed.setImage(data.answer);

			return message.channel.send({
				embeds: [embed],
			});
		}
	}
}
