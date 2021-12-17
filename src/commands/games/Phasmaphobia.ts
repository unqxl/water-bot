import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import Goose from "../../classes/Goose";
import phasmophobia from "../../games/phasmophobia";

export default class PhasmaphobiaCommand extends Command {
	constructor(client: Goose) {
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
		await message.channel.send("...").then(async (msg) => {
			return await phasmophobia(message, msg, lang);
		});
	}
}
