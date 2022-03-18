import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Util } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class QueueCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "queue",
			aliases: ["songs"],

			description: {
				en: "Displays Server Music Queue!",
				ru: "Показывает Очередь Песен Сервера!",
			},

			category: Categories.MUSIC,
			usage: "<prefix>queue",
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
						embeds: [embed.toJSON()],
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
					embeds: [embed.toJSON()],
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
					embeds: [embed.toJSON()],
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
					embeds: [embed.toJSON()],
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
		const description = lang.MUSIC.QUEUE;
		const songs = queue.songs
			.map((song, i) => {
				const title = Util.escapeMarkdown(song.name);

				return `[${bold((i + 1).toString())}]: ${bold(title)} [${bold(
					song.formattedDuration
				)} | ${song.user}]`;
			})
			.slice(0, 20)
			.join("\n");

		const text = `${bold(description)}:\n\n${songs}`;
		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			false,
			true
		);

		return message.channel.send({
			embeds: [embed.toJSON()],
		});
	}
}
