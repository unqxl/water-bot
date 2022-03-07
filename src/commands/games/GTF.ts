import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { request } from "undici";
import Bot from "../../classes/Bot";
import random from "random";

export default class GuessTheFlagCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "guesstheflag",
			aliases: ["gtf"],

			description: {
				en: "Try to Guess the Flag to earn money!",
				ru: "Попробуйте угадать флаг, чтобы заработать деньги!",
			},

			category: Categories.GAMES,
			usage: "<prefix>guesstheflag",
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const reward = random.int(100, 190);
		const locale = await this.client.database.getSetting(
			message.guild.id,
			"locale"
		);
		const { Data, flag } = await (
			await request("https://api.dagpi.xyz/data/flag", {
				headers: {
					authorization: this.client.config.keys.dagpi_key,
				},
				method: "GET",
			})
		).body.json();

		var common_name = Data.name.common;
		var official_name = Data.name.official;
		var russian_name = Data.translations.rus.common;
		var languages = Object.values(Data.languages);

		const text = lang.GAMES.GUESS_THE_FLAG.DESCRIPTION(reward.toString());
		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			lang.GAMES.GUESS_THE_FLAG.FOOTER,
			false,
			true
		);
		embed.setImage(flag);

		const answer = await this.client.functions.promptMessage(message, {
			embeds: [embed],
		});

		if (!answer) {
			const text = lang.GAMES.GUESS_THE_FLAG.DEFEAT(
				locale === "en-US" ? common_name : Data.translations.rus.common,
				locale === "en-US"
					? official_name
					: Data.translations.rus.official,
				Data.currency.join(", "),
				languages.join(", ")
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

		if (
			// English
			answer === common_name ||
			answer === official_name ||
			answer === common_name.toLowerCase() ||
			answer === official_name.toLowerCase() ||
			(locale === "ru-RU" && answer === russian_name) ||
			(locale === "ru-RU" && answer === russian_name.toLowerCase())
		) {
			this.client.economy.balance.add(
				message.guild.id,
				message.author.id,
				reward
			);

			const text = lang.GAMES.GUESS_THE_FLAG.DEFEAT(
				locale === "en-US" ? common_name : Data.translations.rus.common,
				locale === "en-US"
					? official_name
					: Data.translations.rus.official,
				Data.currency.join(", "),
				languages.join(", ")
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
		} else {
			const text = lang.GAMES.GUESS_THE_FLAG.DEFEAT(
				locale === "en-US" ? common_name : Data.translations.rus.common,
				locale === "en-US"
					? official_name
					: Data.translations.rus.official,
				Data.currency.join(", "),
				languages.join(", ")
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
	}
}
