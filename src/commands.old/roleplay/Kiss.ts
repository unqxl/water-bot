import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class KissCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "kiss",

			description: {
				en: "Allows You to kiss someone!",
				ru: "Позволяет вам поцеловать кого-то",
			},

			category: Categories.ROLEPLAY,
			usage: "<prefix>kiss <target>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const member = message.mentions.members.first();
		if (!member) {
			const text = lang.ERRORS.ARGS_MISSING("kiss");
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
					embeds: [embed.data.toJSON()],
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
		const { url } = await this.client.nekos.sfw.kiss();

		const text = `${lang.ROLEPLAY.ACTIONS.KISS(
			message.author.toString(),
			member.toString()
		)}\n${lang.ROLEPLAY.OTHER.CLICK_IF_NOT(url)}`;

		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			"😘",
			true
		);
		embed.data.setImage(url);

		return message.channel.send({
			embeds: [embed.data.toJSON()],
		});
	}
}
