import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Embed } from "discord.js";
import { request } from "undici";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class MDNCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "mdn",

			description: {
				en: "Gives You information about your query from MDN!",
				ru: "Предоставляем вам информацию по поводу вашего запроса с MDN!",
			},

			category: Categories.OTHER,
			usage: "<prefix>mdn <query>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const query = args[0];
		if (!query) {
			const text = lang.ERRORS.ARGS_MISSING("mdn");
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
					embeds: [embed],
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
		const url = "https://mdn.gideonbot.com/embed?q=";
		const query = args[0];

		const data = await (await request(`${url}${query}`)).body.json();
		if (data.code && data.code === 404) {
			const text = lang.ERRORS.NOT_FOUND("MDN");
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

		const embed = new Embed(data);

		return message.channel.send({
			embeds: [embed],
		});
	}
}
