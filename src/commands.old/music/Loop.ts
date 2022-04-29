import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class LoopCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "loop",
			aliases: ["repeat"],

			description: {
				en: "Changes Music Repeat Mode!",
				ru: "Меняет Режим Повторения Песни!",
			},

			category: Categories.MUSIC,
			usage: "<prefix>loop <song|queue|off>",
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
				const text = bold(error);
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
					embeds: [embed.data.toJSON()],
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
					embeds: [embed.data.toJSON()],
				},
			};
		}

		const queue = this.client.music.getQueue(message);
		if (!queue || !queue.songs.length) {
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
		const queue = this.client.music.getQueue(message);
		let mode = null;

		const [mode_off, mode_song, mode_queue] = await Promise.all([
			lang.MUSIC.LOOP_MODES.OFF,
			lang.MUSIC.LOOP_MODES.SONG,
			lang.MUSIC.LOOP_MODES.QUEUE,
		]);

		switch (args[0]) {
			case "off": {
				mode = 0;
				break;
			}

			case "song": {
				mode = 1;
				break;
			}

			case "queue": {
				mode = 2;
				break;
			}

			default: {
				mode = queue.repeatMode === 1 ? 0 : 1;
				break;
			}
		}

		mode = queue.setRepeatMode(mode);
		mode = mode ? (mode === 2 ? mode_queue : mode_song) : mode_off;

		const text = lang.MUSIC.LOOP_CHANGES(mode);
		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			"✅",
			true
		);

		return message.channel.send({
			embeds: [embed.data.toJSON()],
		});
	}
}
