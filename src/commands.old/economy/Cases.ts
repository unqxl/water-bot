import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";
import Cases from "../../games/cases";

export default class CasesCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "cases",

			description: {
				en: "Open Case to Get Something!",
				ru: "Откройте Кейс, чтобы что-то выйграть!",
			},

			category: Categories.ECONOMY,
			usage: "<prefix>cases",
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		return await message.channel.send("...").then(async (msg: Message) => {
			return await Cases(this.client, message, msg, lang);
		});
	}
}
