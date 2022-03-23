import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class SkipCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "skip",

			description: {
				en: "Skips Current Song!",
				ru: "Пропускает Текующую Песню!",
			},

			category: Categories.MUSIC,
			usage: "<prefix>skip",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const { djRoles } = this.client.configurations.get(message.guild.id);
		if (djRoles.length) {
			const { status, message: error } = await this.client.DJSystem.check(
				message
			);
			if (!status) {
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					error,
					false,
					"❌",
					true
				);

				return {
					ok: false,
					error: {
						embeds: [embed.embed.toJSON()],
					},
				};
			}
		}

		const [error, voice_error] = await Promise.all([
			lang.ERRORS.NOT_JOINED_VOICE,
			lang.ERRORS.JOIN_BOT_VOICE,
		]);

		if (!message.member.voice.channel) {
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				error,
				false,
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed.embed.toJSON()],
				},
			};
		}

		if (
			message.guild.me.voice.channel &&
			message.member.voice.channel &&
			message.member.voice.channel !== message.guild.me.voice.channel
		) {
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				voice_error,
				false,
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed.embed.toJSON()],
				},
			};
		}

		const queue = this.client.music.getQueue(message);
		if (!queue) {
			const text = lang.ERRORS.QUEUE_EMPTY;
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
					embeds: [embed.embed.toJSON()],
				},
			};
		}

		if (!queue.playing) {
			const text = lang.ERRORS.PAUSED;
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
					embeds: [embed.embed.toJSON()],
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
		const queue = this.client.music.getQueue(message);
		queue.skip();

		const text = lang.MUSIC.SKIPPED;
		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			"✅",
			true
		);

		return message.channel.send({
			embeds: [embed.embed.toJSON()],
		});
	}
}
