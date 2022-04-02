import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
	TextChannel,
} from "discord.js";
import { ValidateReturn } from "../../types/Command/BaseSlashCommand";
import { SubCommand } from "../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class PlayCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "music",
			name: "play",
			description: "Plays Song from YT/Spotify!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "song",
					description: "Song Name or URL",
					required: true,
				},
			],
		});
	}

	async validate(
		command: ChatInputCommandInteraction<"cached">,
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const { djRoles } = this.client.configurations.get(command.guild.id);
		if (djRoles.length) {
			const { status, message } = await this.client.DJSystem.check(
				command
			);
			if (!status) {
				const color = this.client.functions.color("Red");
				const author = this.client.functions.author(command.member);
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
				const color = this.client.functions.color("Red");
				const author = this.client.functions.author(command.member);
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
				const color = this.client.functions.color("Red");
				const author = this.client.functions.author(command.member);
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
		}

		return {
			ok: true,
		};
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: typeof import("@locales/English").default
	) {
		const song = command.options.getString("song", true);
		return this.client.music.play(command.member.voice.channel, song, {
			skip: false,
			member: command.member as GuildMember,
			textChannel: command.channel as TextChannel,
		});
	}
}