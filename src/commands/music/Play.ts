import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { TextChannel } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class PlayCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "play",

			description: {
				en: "Plays Song from YouTube/Spotify/SoundCloud!",
				ru: "Проигрывает песню с YouTube/Spotify/SoundCloud!",
			},

			category: Categories.MUSIC,
			usage: "<prefix>play <song>",
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

		const song = args.join(" ");
		if (!song) {
			const text = lang.ERRORS.ARGS_MISSING("play");
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
		const song = args.join(" ");
		return this.client.music.play(message.member.voice.channel, song, {
			skip: false,
			member: message.member,
			textChannel: message.channel as TextChannel,
			message: message,
		});
	}
}
