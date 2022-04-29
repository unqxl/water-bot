import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { bold, inlineCode } from "@discordjs/builders";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import Bot from "../../classes/Bot";

export default class WarnsCommand extends Command {
	constructor(client: Bot) {
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

		// @ts-expect-error
		const warns = await this.client.moderation.warns.all(member);
		if (!warns.length) {
			const text = lang.ERRORS.NO_WARNS(member.toString());
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
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]);

		// @ts-expect-error
		const warns = await this.client.moderation.allWarns(member);

		let text = "";
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
			"Blurple",
			text,
			false,
			false,
			true
		);
		return message.channel.send({
			embeds: [embed.data.toJSON()],
		});
	}
}
