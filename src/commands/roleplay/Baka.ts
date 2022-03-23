import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class BakaCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "baka",

			description: {
				en: "Allows You to hate someone!",
				ru: "Позволяет вам возненавидеть кого-то",
			},

			category: Categories.ROLEPLAY,
			usage: "<prefix>baka <target>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const member = message.mentions.members.first();
		if (!member) {
			const text = lang.ERRORS.ARGS_MISSING("baka");
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
		const member = message.mentions.members.first();
		const { url } = await this.client.nekos.sfw.baka();

		const text = `${lang.ROLEPLAY.ACTIONS.BAKA(
			message.author.toString(),
			member.toString()
		)}\n${lang.ROLEPLAY.OTHER.CLICK_IF_NOT(url)}`;

		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			"💢",
			true
		);
		embed.embed.setImage(url);

		return message.channel.send({
			embeds: [embed.json],
		});
	}
}
