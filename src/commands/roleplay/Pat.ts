import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class PatCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "pat",

			description: {
				en: "Allows You to pat someone!",
				ru: "Позволяет вам погладить кого-то",
			},

			category: Categories.ROLEPLAY,
			usage: "<prefix>pat <target>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const member = message.mentions.members.first();
		if (!member) {
			const text = lang.ERRORS.ARGS_MISSING.replace("{cmd_name}", "poke");

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
		const { url } = await this.client.nekos.sfw.poke();

		const text = `${lang.ROLEPLAY.ACTIONS.PAT(
			message.author.toString(),
			member.toString()
		)}\n${lang.ROLEPLAY.OTHER.CLICK_IF_NOT(url)}`;

		const embed = this.client.functions.buildEmbed(
			message,
			"BLURPLE",
			text,
			"🥰"
		);
		embed.setImage(url);

		return message.channel.send({
			embeds: [embed],
		});
	}
}
