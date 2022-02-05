import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import Bot from "../../classes/Bot";
import phasmophobia from "../../games/phasmophobia";

export default class PhasmaphobiaCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "phasmophobia",

			description: {
				en: "Solve the Ghost from Phasmophobia to Earn Coins!",
				ru: "Разгадайте призрака из Phasmophobia для Заработка Денег!",
			},

			category: Categories.GAMES,
			usage: "<prefix>phasmophobia",
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const msg = await message.channel.send("...");
		return await phasmophobia(message, msg, lang);
	}
}
