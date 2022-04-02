import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
	Util,
} from "discord.js";
import { ValidateReturn } from "../../types/Command/BaseSlashCommand";
import { SubCommand } from "../../types/Command/SubCommand";
import { bold, hyperlink } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class NowPlayingCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "music",
			name: "nowplaying",
			description: "Displays Information of Current Playing Music!",
		});
	}

	async validate(
		command: ChatInputCommandInteraction<"cached">,
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const color = this.client.functions.color("Red");
		const author = this.client.functions.author(command.member);

		const { djRoles } = this.client.configurations.get(command.guild.id);
		if (djRoles.length) {
			const { status, message } = await this.client.DJSystem.check(
				command
			);
			if (!status) {
				const embed = new EmbedBuilder();
				embed.setColor(color);
				embed.setAuthor(author);
				embed.setDescription(`❌ | ${bold(message)}`);
				embed.setTimestamp();

				return {
					ok: false,
					error: {
						embeds: [embed],
					},
				};
			}
		}

		const voiceCheck = this.client.functions.voiceCheck(
			command.guild.me,
			command.member as GuildMember
		);
		if (!voiceCheck) {
			if (voiceCheck.code === 1) {
				const text = lang.ERRORS.NOT_JOINED_VOICE;
				const embed = new EmbedBuilder();
				embed.setColor(color);
				embed.setAuthor(author);
				embed.setDescription(`❌ | ${bold(text)}`);
				embed.setTimestamp();

				return {
					ok: false,
					error: {
						embeds: [embed],
					},
				};
			} else if (voiceCheck.code === 2) {
				const text = lang.ERRORS.JOIN_BOT_VOICE;
				const embed = new EmbedBuilder();
				embed.setColor(color);
				embed.setAuthor(author);
				embed.setDescription(`❌ | ${bold(text)}`);
				embed.setTimestamp();

				return {
					ok: false,
					error: {
						embeds: [embed],
					},
				};
			}

			const queue = this.client.music.getQueue(command.guild);
			if (!queue) {
				const text = lang.ERRORS.QUEUE_EMPTY;
				const embed = new EmbedBuilder();
				embed.setColor(color);
				embed.setAuthor(author);
				embed.setDescription(`❌ | ${bold(text)}`);
				embed.setTimestamp();

				return {
					ok: false,
					error: {
						embeds: [embed],
					},
				};
			}
		}

		return {
			ok: true,
		};
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: typeof import("@locales/English").default
	) {
		const queue = this.client.music.getQueue(command.guild);
		const song = queue.songs[0];
		const name = Util.escapeMarkdown(song.name);
		const NowPlaying = lang.MUSIC.NOW_PLAYING(name);
		const { NAME, DURATION, REQUESTED_BY } = lang.MUSIC.SONG_INFO;

		const text = [
			`${bold(NowPlaying)}`,
			"",
			`› ${bold(NAME)}: ${bold(hyperlink(NAME, song.url))}`,
			`› ${bold(DURATION)}: ${bold(song.formattedDuration)}`,
			`› ${bold(REQUESTED_BY)}: ${bold(song.user.toString())}`,
		].join("\n");

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setDescription(text);
		embed.setTimestamp();

		return command.reply({
			embeds: [embed],
		});
	}
}
