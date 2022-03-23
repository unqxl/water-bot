import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import Bot from "../../classes/Bot";
import RPS from "../../games/rps";

export default class RPSCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "rps",

			description: {
				en: "Play Rock-Papers-Scissors with Someone!",
				ru: "Поиграйте в Камень-Ножницы-Бумага с кем-то!",
			},

			category: Categories.GAMES,
			usage: "<prefix>rps <opponent>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const opponent = message.mentions.users.first();

		if (!opponent) {
			const text = lang.ERRORS.ARGS_MISSING("rps");
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed.json],
				},
			};
		}

		return {
			ok: true,
		};
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		return await message.channel.send("...").then(async (msg: Message) => {
			return await RPS(msg, message, lang);
		});
	}
}
