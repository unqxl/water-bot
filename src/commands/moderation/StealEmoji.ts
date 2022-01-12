import { Message, Util } from "discord.js";
import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { parse } from "twemoji-parser";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class StealEmojiCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "stealemoji",

			description: {
				en: "Allows you to copy an emoji from another server to yours.",
				ru: "Позволяет скопировать эмодзи с другого сервера на ваш.",
			},

			category: Categories.MODERATION,
			usage: "<prefix>stealemoji <emoji>",

			memberPermissions: ["MANAGE_GUILD"],
			botPermissions: ["MANAGE_EMOJIS_AND_STICKERS"],
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const emoji = args[0];
		const name = args[1];

		if (!emoji) {
			const text = lang.ERRORS.ARGS_MISSING.replace(
				"{cmd_name}",
				"stealemoji"
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

		if (!name) {
			const text = lang.ERRORS.ARGS_MISSING.replace(
				"{cmd_name}",
				"stealemoji"
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
		var discordEmojiURL = "https://cdn.discordapp.com/emojis";

		const emoji = args[0];
		const name = args[1];

		if (emoji.startsWith(discordEmojiURL)) {
			await message.guild?.emojis.create(emoji, name);

			const text = lang.MODERATION.EMOJI_CREATED(name);
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				"✅",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		const customEmoji = Util.parseEmoji(emoji);
		if (customEmoji?.id) {
			const emojiURL = `${discordEmojiURL}/${customEmoji.id}.${
				customEmoji.animated ? "gif" : "png"
			}`;

			const msg = await this.createEmoji(message, emojiURL, name, lang);
			if (msg) {
				const embed = this.client.functions.buildEmbed(
					message,
					"BLURPLE",
					bold(msg),
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed],
				});
			}

			const text = lang.MODERATION.EMOJI_CREATED(name);
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				"✅",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		const foundEmoji = parse(emoji, { assetType: "png" });
		if (!foundEmoji[0]) {
			const text = lang.ERRORS.VALID_EMOJI;
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		const text = lang.ERRORS.NORMAL_EMOJI;
		const embed = this.client.functions.buildEmbed(
			message,
			"BLURPLE",
			bold(text),
			"❌",
			true
		);

		return message.channel.send({
			embeds: [embed],
		});
	}

	async createEmoji(
		message: Message,
		url: string,
		name: string,
		lang: typeof import("@locales/English").default
	) {
		try {
			await message.guild?.emojis.create(url, name);
		} catch (error) {
			if (
				String(error).includes(
					"DiscordAPIError: Maximum number of emojis reached"
				)
			) {
				return lang.ERRORS.EMOJIS_LIMIT;
			}
		}
	}
}
