import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
	TextChannel,
} from "discord.js";
import { LanguageService } from "../../services/Language";
import { ValidateReturn } from "../../types/Command/BaseSlashCommand";
import { SubCommand } from "../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class PlayCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "music",

			name: "play",
			description: "Plays Song from YouTube/Spotify.",
			descriptionLocalizations: {
				ru: "Проигрывает песню из YouTube/Spotify.",
			},

			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "song",
					description: "Song name or URL.",
					descriptionLocalizations: {
						ru: "Название или ссылка на песню.",
					},
					required: true,
				},
			],
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

		if (voiceCheck.status === false) {
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
		}

		return {
			ok: true,
		};
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const song = command.options.getString("song", true);

		await command.reply({ content: "..." });
		this.client.music.play(command.member.voice.channel, song, {
			skip: false,
			member: command.member as GuildMember,
			textChannel: command.channel as TextChannel,
		});

		const msg = await command.fetchReply();
		await this.client.wait(2000);
		msg.delete();
	}
}
