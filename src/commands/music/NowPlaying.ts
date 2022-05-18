import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
	Util,
} from "discord.js";
import { bold, hyperlink } from "@discordjs/builders";
import { LanguageService } from "../../services/Language";
import { ValidateReturn } from "../../types/Command/BaseSlashCommand";
import { SubCommand } from "../../types/Command/SubCommand";
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
		lang: LanguageService
	): Promise<ValidateReturn> {
		const color = this.client.functions.color("Red");
		const author = this.client.functions.author(command.member);

		const voiceCheck = this.client.functions.voiceCheck(
			command.guild.members.me,
			command.member as GuildMember
		);
		if (!voiceCheck) {
			if (voiceCheck.code === 1) {
				const text = await lang.get("ERRORS:JOIN_VOICE");
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
				const text = await lang.get("ERRORS:JOIN_BOT_VOICE");
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
				const text = await lang.get("ERRORS:QUEUE_IS_EMPTY");
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
		lang: LanguageService
	) {
		const queue = this.client.music.getQueue(command.guild);
		const song = queue.songs[0];
		const name = Util.escapeMarkdown(song.name);
		const { NOWPLAYING } = await (await lang.all()).MUSIC_COMMANDS;

		const text = [
			`${bold(NOWPLAYING.TITLE)}`,
			"",
			`› ${bold(NOWPLAYING.NAME)}: ${bold(hyperlink(name, song.url))}`,
			`› ${bold(NOWPLAYING.DURATION)}: ${bold(song.formattedDuration)}`,
			`› ${bold(NOWPLAYING.REQUESTEDBY)}: ${bold(song.user.toString())}`,
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
