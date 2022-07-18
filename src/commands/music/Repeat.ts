import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
} from "discord.js";
import { LanguageService } from "../../services/Language";
import { ValidateReturn } from "../../types/Command/BaseSlashCommand";
import { SubCommand } from "../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class RepeatCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "music",

			name: "repeat",
			description: "Enables/Changes Repeat Mode.",
			descriptionLocalizations: {
				ru: "Включает/Изменяет режим повтора.",
			},

			options: [
				{
					type: ApplicationCommandOptionType.Number,
					name: "mode",
					description: "Repeat Mode.",
					descriptionLocalizations: {
						ru: "Режим повтора.",
					},
					required: true,

					choices: [
						{
							name: "off",
							nameLocalizations: {
								"en-US": "Disable",
								ru: "Отключить",
							},
							value: 0,
						},
						{
							name: "song",
							nameLocalizations: {
								"en-US": "Song",
								ru: "Песня",
							},
							value: 1,
						},
						{
							name: "queue",
							nameLocalizations: {
								"en-US": "Queue",
								ru: "Очередь",
							},
							value: 2,
						},
					],
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

		return {
			ok: true,
		};
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const mode_num = command.options.getNumber("mode", true);
		const queue = this.client.music.getQueue(command.guild);
		const { MUSIC_COMMANDS } = await lang.all();

		var mode = null;
		mode = queue.setRepeatMode(mode_num);
		mode = mode
			? mode === 2
				? MUSIC_COMMANDS.REPEAT.QUEUE_MODE
				: MUSIC_COMMANDS.REPEAT.SONG_MODE
			: MUSIC_COMMANDS.REPEAT.DISABLED;

		const text = await lang.get(
			"MUSIC_COMMANDS:REPEAT:TEXT",
			mode,
			command.user.toString()
		);

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setDescription(`✅ | ${bold(text)}`);
		embed.setTimestamp();

		return command.reply({
			embeds: [embed],
		});
	}
}
