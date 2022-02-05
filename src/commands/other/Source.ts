import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class SourceCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "source",
			aliases: ["src"],

			description: {
				en: "Displays link to source code of the bot!",
				ru: "Выводит ссылку на исходный код бота!",
			},

			category: Categories.OTHER,
			usage: "<prefix>source",
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const text = lang.OTHER.SOURCE.TEXT(this.client.config.bot.github_link);
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
}
