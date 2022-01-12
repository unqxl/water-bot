import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import Bot from "../../classes/Bot";
import cases from "../../games/cases";

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
		await message.channel.send("...").then(async (msg) => {
			return await cases(this.client, message, msg, lang);
		});
	}
}
