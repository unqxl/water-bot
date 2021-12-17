import {
	Categories,
	ValidateReturn,
} from "../../types/Command/BaseCommand";
import { Message, Util } from "discord.js";
import { Command } from "../../types/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class QueueCommand extends Command {
	constructor(client: Goose) {
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
		const [error, voice_error] = await Promise.all([
			lang.ERRORS.NOT_JOINED_VOICE,
			lang.ERRORS.JOIN_BOT_VOICE,
		]);

		if (!message.member.voice.channel) {
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(error),
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

		if (
			message.guild.me.voice.channel &&
			message.member.voice.channel &&
			message.member.voice.channel !== message.guild.me.voice.channel
		) {
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(voice_error),
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

		const queue = this.client.music.getQueue(message);
		if (!queue || !queue.songs.length) {
			const text = lang.ERRORS.QUEUE_EMPTY;
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
		const queue = this.client.music.getQueue(message);
		const description = lang.MUSIC.QUEUE;
		const songs = queue.songs
			.map((song, i) => {
				const title = Util.escapeMarkdown(song.name);

				return `[${bold(i.toString())}]: ${bold(title)} [${bold(
					song.formattedDuration
				)} | ${song.user}]`;
			})
			.slice(0, 20)
			.join("\n");

		const text = `${bold(description)}:\n\n${songs}`;
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
