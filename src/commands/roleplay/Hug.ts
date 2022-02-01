import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class HugCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "hug",

			description: {
				en: "Allows You to hug someone!",
				ru: "Позволяет вам обнять кого-то",
			},

			category: Categories.ROLEPLAY,
			usage: "<prefix>hug <target>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const member = message.mentions.members.first();
		if (!member) {
			const text = lang.ERRORS.ARGS_MISSING.replace("{cmd_name}", "hug");

			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
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
		const member = message.mentions.members.first();
		const { url } = await this.client.nekos.sfw.hug();

		const text = `${lang.ROLEPLAY.ACTIONS.HUG(
			message.author.toString(),
			member.toString()
		)}\n${lang.ROLEPLAY.OTHER.CLICK_IF_NOT(url)}`;

		const embed = this.client.functions.buildEmbed(
			message,
			"BLURPLE",
			text,
			"😍"
		);
		embed.setImage(url);

		return message.channel.send({
			embeds: [embed],
		});
	}
}
