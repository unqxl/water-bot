import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Util } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class NowPlayingCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "nowplaying",
			aliases: ["np"],

			description: {
				en: "Displays Information about Current Playing Song!",
				ru: "Показывает Информацию о Играющей Песне!",
			},

			category: Categories.MUSIC,
			usage: "<prefix>nowplaying",
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
		const description = lang.MUSIC.NOW_PLAYING(
			Util.escapeMarkdown(queue.songs[0].name!)
		);

		const [songTitle, songURL, songViews, durationText, requestedByText] =
			await Promise.all([
				lang.MUSIC.SONG_INFO.NAME,
				lang.MUSIC.SONG_INFO.URL,
				lang.MUSIC.SONG_INFO.VIEWS,
				lang.MUSIC.SONG_INFO.DURATION,
				lang.MUSIC.SONG_INFO.REQUESTED_BY,
			]);

		const song = queue.songs[0];
		const title = Util.escapeMarkdown(song.name);
		const info = [
			`› ${bold(songTitle)}: ${bold(title)}`,
			`› ${bold(songURL)}: ${bold(`<${song.url}>`)}`,
			`› ${bold(songViews)}: ${bold(
				this.client.functions.sp(song.views)
			)}`,
			`› ${bold(durationText)}: ${bold(song.formattedDuration)}`,
			`› ${bold(requestedByText)}: ${bold(song.user.toString())}`,
		];

		const text = `${bold(description)}:\n${info.join("\n")}`;
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
