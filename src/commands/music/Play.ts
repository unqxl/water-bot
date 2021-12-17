import {
	Categories,
	ValidateReturn,
} from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class PlayCommand extends Command {
	constructor(client: Goose) {
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
		const roles = this.client.database.getSetting(message.guild, 'djRoles');
		if(roles.length) {
			const { status, message: error } = await this.client.DJSystem.check(message);
			if(!status) {
				const text = bold(error);
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
		};

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

		const song = args.join(" ");
		if (!song) {
			const text = lang.ERRORS.ARGS_MISSING.replace("{cmd_name}", "play");
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
		const song = args.join(" ");
		return this.client.music.play(message, song);
	}
}
