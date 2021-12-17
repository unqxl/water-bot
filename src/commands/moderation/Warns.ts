import {
	Categories,
	ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { bold, inlineCode } from "@discordjs/builders";
import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import Goose from "../../classes/Goose";

export default class WarnsCommand extends Command {
	constructor(client: Goose) {
		super(client, {
			name: "warns",

			description: {
				en: "Shows Member Warns!",
				ru: "Выводит Предупреждения Пользователя!",
			},

			category: Categories.MODERATION,
			usage: "<prefix>warns [member]",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.member;

		const warns = await this.client.moderation.allWarns(member);
		if (!warns.length) {
			const text = lang.ERRORS.NO_WARNS.replace(
				"{member}",
				member.toString()
			);
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
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]);

		const warns = await this.client.moderation.allWarns(member);

		var text = "";
		warns.forEach(async (warn, i) => {
			const id = warn.id;
			const moderator = message.guild.members.cache.get(warn.moderatorID);
			const channel = message.guild.channels.cache.get(warn.channelID);
			const reason = warn.reason;

			text += `[${bold(channel.toString())}] ${reason} [${inlineCode(
				`#${id}`
			)} | ${bold(moderator.toString())}]\n`;
		});

		const embed = this.client.functions.buildEmbed(
			message,
			"BLURPLE",
			text,
			false,
			true
		);

		return message.channel.send({
			embeds: [embed],
		});
	}
}
