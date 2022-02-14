import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";
import Phasmophobia from "../../games/phasmophobia";

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
		return await message.channel.send("...").then(async (msg: Message) => {
			return await Phasmophobia(message, msg, lang);
		});
	}
}
