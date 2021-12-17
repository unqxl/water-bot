import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { Categories } from "../../structures/Command/BaseCommand";
import Goose from "../../classes/Goose";
import cases from "../../games/cases";

export default class CasesCommand extends Command {
	constructor(client: Goose) {
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
