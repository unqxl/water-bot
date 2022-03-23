import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Util } from "discord.js";
import { Command } from "../../types/Command/Command";
import { parse } from "twemoji-parser";
import { Message } from "discord.js";
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

			memberPermissions: ["ManageGuild"],
			botPermissions: ["ManageEmojisAndStickers"],
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
			const text = lang.ERRORS.ARGS_MISSING("stealemoji");
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

		if (!name) {
			const text = lang.ERRORS.ARGS_MISSING("stealemoji");
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
		var discordEmojiURL = "https://cdn.discordapp.com/emojis";

		const emoji = args[0];
		const name = args[1];

		if (emoji.startsWith(discordEmojiURL)) {
			await message.guild?.emojis.create(emoji, name);

			const text = lang.MODERATION.EMOJI_CREATED(name);
			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✅",
				true
			);

			return message.channel.send({
				embeds: [embed.json],
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
					"Red",
					msg,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed.json],
				});
			}

			const text = lang.MODERATION.EMOJI_CREATED(name);
			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✅",
				true
			);

			return message.channel.send({
				embeds: [embed.json],
			});
		}

		const foundEmoji = parse(emoji, { assetType: "png" });
		if (!foundEmoji[0]) {
			const text = lang.ERRORS.VALID_EMOJI;
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed.json],
			});
		}

		const text = lang.ERRORS.NORMAL_EMOJI;
		const embed = this.client.functions.buildEmbed(
			message,
			"Red",
			text,
			false,
			"❌",
			true
		);

		return message.channel.send({
			embeds: [embed.json],
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
