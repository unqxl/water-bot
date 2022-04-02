import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
} from "discord.js";
import { ValidateReturn } from "../../types/Command/BaseSlashCommand";
import { SubCommand } from "../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class VolumeCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "music",
			name: "volume",
			description: "Displays/Changes Music Volume!",
			options: [
				{
					type: ApplicationCommandOptionType.Number,
					name: "volume",
					description: "New Music Volume",
					required: false,
				},
			],
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
		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);

		const volume = command.options.getNumber("volume", false);
		const queue = this.client.music.getQueue(command.guild);

		if (!volume) {
			const text = lang.MUSIC.VOLUME_NOW(queue.volume);
			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`🔊 | ${bold(text)}`);
			embed.setTimestamp();
		}

		const new_volume = queue.setVolume(volume);
		const text = lang.MUSIC.VOLUME_SETTED(new_volume);
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
